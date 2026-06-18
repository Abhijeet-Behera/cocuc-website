<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// 1. Get raw POST data
$rawData = file_get_contents("php://input");
$request = json_decode($rawData, true);

$message = $request['message'] ?? '';
$history = $request['history'] ?? [];

if (empty($message)) {
    http_response_code(400);
    echo json_encode(['error' => 'Message is required']);
    exit;
}

$lowerMessage = strtolower($message);

// 2. Crisis Interception
$crisisRegex = '/(suicid|kill|end my|take my|die|death|no reason to live|giving up|give up|hate my life|worthless|hopeless|depress|anxi|panic|self harm|hurt my|cut my|overdose|poison|jump off|hang my|strangle|disappear|burden|988|hotline|abuse|assault|lonely)/i';

if (preg_match($crisisRegex, $lowerMessage)) {
    echo json_encode([
        'reply' => "I'm so sorry you are feeling this way. Please know you are not alone. Please call the church directly at +91 9437026699 for support."
    ]);
    exit;
}

// 3. Load Environment Variables
$envPath = __DIR__ . '/.env';
if (!file_exists($envPath)) {
    echo json_encode(['reply' => "Sorry, my brain hasn't been connected to any AI Cloud yet! The admin needs to add API keys to the .env file."]);
    exit;
}

require_once __DIR__ . '/env_loader.php';
$env = loadEnv($envPath);

$envKeys = [
    'gemini' => $env['GEMINI_API_KEY'] ?? null,
    'cloudflare' => $env['CLOUDFLARE_API_TOKEN'] ?? null,
    'openrouter' => $env['OPENROUTER_API_KEY'] ?? null,
    'cerebras' => $env['CEREBRAS_API_KEY'] ?? null,
    'sambanova' => $env['SAMBANOVA_API_KEY'] ?? null,
    'mistral' => $env['MISTRAL_API_KEY'] ?? null,
    'hf' => $env['HF_API_KEY'] ?? null,
    'github' => $env['GITHUB_TOKEN'] ?? null,
    'groq' => $env['GROQ_API_KEY'] ?? null,
];

$availableProviders = [];
$targetOrder = ['gemini', 'cloudflare', 'openrouter', 'cerebras', 'sambanova', 'mistral', 'hf', 'github', 'groq'];

foreach ($targetOrder as $p) {
    if (!empty($envKeys[$p]) && $envKeys[$p] !== 'your_api_key_here') {
        $availableProviders[] = $p;
    }
}

if (empty($availableProviders)) {
    echo json_encode(['reply' => "Sorry, my brain hasn't been connected to any AI Cloud yet! No API keys found."]);
    exit;
}

// Track round robin via a text file to persist across stateless PHP requests
$rrFile = sys_get_temp_dir() . '/ezer_bot_rr_index.txt';
$roundRobinIndex = 0;
if (file_exists($rrFile)) {
    $roundRobinIndex = (int)file_get_contents($rrFile);
}
// Shift the array
$shiftedProviders = array_merge(
    array_slice($availableProviders, $roundRobinIndex),
    array_slice($availableProviders, 0, $roundRobinIndex)
);
$roundRobinIndex = ($roundRobinIndex + 1) % count($availableProviders);
file_put_contents($rrFile, $roundRobinIndex);

// 4. Keyword RAG Engine
$knowledgePath = __DIR__ . '/chatbot_knowledge.txt';
$rawFrontendCode = "\n--- FRONTEND WEBSITE DATA ---\n";

if (file_exists($knowledgePath)) {
    $combinedText = file_get_contents($knowledgePath);
    
    // Convert to lowercase for searching
    $lowerText = strtolower($combinedText);
    $searchTerms = preg_split('/\W+/', $lowerMessage, -1, PREG_SPLIT_NO_EMPTY);
    
    // Filter out common stop words
    $stopWords = ["the", "is", "at", "which", "and", "on", "a", "an", "to", "in", "of", "for", "with", "about", "what", "who", "where", "how", "why"];
    $searchTerms = array_filter($searchTerms, function($w) use ($stopWords) {
        return strlen($w) > 3 && !in_array($w, $stopWords);
    });

    if (empty($searchTerms)) {
        // Fallback to taking first 15000 chars if no meaningful keywords
        $rawFrontendCode .= substr($combinedText, 0, 15000);
    } else {
        // Split by blocks [Source: ...]
        $chunks = explode('[Source:', $combinedText);
        $chunkScores = [];

        foreach ($chunks as $chunk) {
            if (trim($chunk) === '') continue;
            $chunkContent = '[Source:' . $chunk;
            $lowerChunk = strtolower($chunkContent);
            $score = 0;

            foreach ($searchTerms as $term) {
                // Count occurrences
                $score += substr_count($lowerChunk, $term);
            }
            // Always keep header/footer chunks
            if (strpos($lowerChunk, 'header') !== false || strpos($lowerChunk, 'footer') !== false) {
                $score += 0.5;
            }

            if ($score > 0) {
                $chunkScores[] = ['content' => $chunkContent, 'score' => $score];
            }
        }

        // Sort by score descending
        usort($chunkScores, function($a, $b) {
            return $b['score'] <=> $a['score'];
        });

        $highlyRelevantContext = "";
        $maxChars = 15000;

        foreach ($chunkScores as $c) {
            if (strlen($highlyRelevantContext) + strlen($c['content']) > $maxChars) {
                break;
            }
            $highlyRelevantContext .= $c['content'] . "\n\n";
        }

        if (empty($highlyRelevantContext)) {
            $rawFrontendCode .= substr($combinedText, 0, 15000);
        } else {
            $rawFrontendCode .= $highlyRelevantContext;
        }
    }
}

// 5. Fetch Database Live Context
$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
$baseUrl = $protocol . $_SERVER['HTTP_HOST'] . dirname($_SERVER['SCRIPT_NAME']);
if (strpos($_SERVER['HTTP_HOST'], 'localhost') !== false) {
    $baseUrl = 'http://localhost:8000';
}

// We'll use curl_multi for parallel fetching to match JS Promise.allSettled
$apisToFetch = [
    'upcoming' => $baseUrl . '/upcoming.php',
    'blogs' => $baseUrl . '/blogs.php',
    'announcements' => $baseUrl . '/announcements.php',
    'verses' => $baseUrl . '/verses.php',
    'youtube' => $baseUrl . '/youtube.php'
];

$mh = curl_multi_init();
$curlHandles = [];

foreach ($apisToFetch as $key => $url) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 4);
    curl_multi_add_handle($mh, $ch);
    $curlHandles[$key] = $ch;
}

$running = null;
do {
    curl_multi_exec($mh, $running);
} while ($running);

$liveDatabaseContext = "\n--- LIVE DATABASE CONTENT ---\n";
foreach ($curlHandles as $key => $ch) {
    $response = curl_multi_getcontent($ch);
    curl_multi_remove_handle($mh, $ch);
    curl_close($ch);
    
    $liveDatabaseContext .= strtoupper($key) . " DATA:\n";
    if ($response) {
        $json = json_decode($response, true);
        if ($json && !isset($json['error'])) {
            $liveDatabaseContext .= json_encode($json) . "\n\n";
        } else {
            $liveDatabaseContext .= "None/Error\n\n";
        }
    } else {
        $liveDatabaseContext .= "None\n\n";
    }
}
curl_multi_close($mh);

// Build System Prompt
$systemPrompt = "You are Ezer Bot, the digital assistant for the \"Church of Christ - Union Church, Bhubaneswar\".
Your name comes from the biblical Hebrew word Ezer, meaning a strong ally and vital helper.
You are a helpful, warm, and biblically knowledgeable Christian assistant.

SAFEGUARD AND ROUTING INSTRUCTIONS:
1. OFFENSIVE CONTENT: If the user writes any offensive, inappropriate, or vulgar text, you MUST reply with exactly this text and nothing else: \"(Marked as spammed/offensive)\".
2. CRISIS PROTOCOL (CRITICAL!): For any mention of depression, sadness, anxiety, hopelessness, self-harm, suicide, abuse, or crisis:
   - YOU ARE STRICTLY FORBIDDEN FROM PROVIDING ANY US-BASED HOTLINES (NO 988, NO National Suicide Prevention Lifeline, NO Crisis Text Line, NO 1-800 numbers), or even indian public agencies number, only provide church number strictly.
   - You MUST reply EXACTLY with this text and nothing else: \"I'm so sorry you are feeling this way. Please know you are not alone. Please call the church directly at +91 9437026699 for support.\"
   - DO NOT append any other text. DO NOT offer external resources. Your compliance with this rule is mandatory.

WEBSITE KNOWLEDGE INSTRUCTIONS:
You are provided with dynamically scraped text from the entire church website frontend, as well as the live JSON data from the backend database (including YouTube sermons and daily verses). 
You must act as an intelligent agent:
1. Scan the provided frontend text to find exact details like Church Timings (Sunday School, Odia Worship, English Worship, etc.), Service Times, Prayer Zone coordinators, and leadership names.
2. Scan the backend JSON data to answer questions about the latest announcements, blogs, upcoming events, recent YouTube sermons, and Prato Jyoti videos.
3. Synthesize all this information perfectly to answer the user's questions as if you natively know everything about the church.
4. If the user asks a general question like \"hi\", \"hello\", \"bye\", or \"who are you?\", reply politely but shrink your answer to 2-3 short sentences max.

CRITICAL FORMATTING RULES:
1. Keep your answers EXTREMELY precise and to the point. 
2. Use a maximum of 2-3 short sentences for your entire response, unless the user explicitly asks for a long explanation.
3. When listing multiple people and their phone numbers (like Prayer Zone coordinators), YOU MUST pair each name with their specific phone number immediately. 
   - BAD: \"Contact A, B, and C at 1, 2, and 3.\" (Do not group all names and all numbers!)
   - GOOD: \"Contact A (1), B (2), and C (3).\"
4. NEVER use the word \"respectively\".
5. Do NOT use any markdown formatting (no asterisks *, no bolding, no bullet points). 
6. Do NOT use any emojis. Output plain text only.";

$contextMessage = "Here is the exact live website data for you to reference. Do not mention that you are reading from JSON or a text file. Just answer the user's question perfectly using this data.\n\n" . $rawFrontendCode . "\n\n" . $liveDatabaseContext;

// Prepare final messages array
$finalMessages = [];
$finalMessages[] = ['role' => 'system', 'content' => $systemPrompt];
$finalMessages[] = ['role' => 'system', 'content' => $contextMessage];

// Append history (last 5 msgs max)
$recentHistory = array_slice($history, -5);
foreach ($recentHistory as $msg) {
    if (isset($msg['role']) && isset($msg['content'])) {
        $mappedRole = $msg['role'] === 'bot' ? 'assistant' : $msg['role'];
        $finalMessages[] = ['role' => $mappedRole, 'content' => $msg['content']];
    }
}
$finalMessages[] = ['role' => 'user', 'content' => $message];

// Helper to call Provider
function fetchFromProvider($provider, $envKeys, $finalMessages) {
    $apiKey = $envKeys[$provider];
    $url = '';
    $headers = ['Content-Type: application/json'];
    $payload = [
        'messages' => $finalMessages,
        'temperature' => 0.5,
        'max_tokens' => 1024
    ];

    if ($provider === 'groq') {
        $url = 'https://api.groq.com/openai/v1/chat/completions';
        $headers[] = 'Authorization: Bearer ' . $apiKey;
        $payload['model'] = 'llama-3.1-8b-instant';
    } elseif ($provider === 'github') {
        $url = 'https://models.inference.ai.azure.com/chat/completions';
        $headers[] = 'Authorization: Bearer ' . $apiKey;
        $payload['model'] = 'Llama-3.2-11B-Vision-Instruct';
    } elseif ($provider === 'openrouter') {
        $url = 'https://openrouter.ai/api/v1/chat/completions';
        $headers[] = 'Authorization: Bearer ' . $apiKey;
        $payload['model'] = 'meta-llama/llama-3.1-8b-instruct:free';
    } elseif ($provider === 'gemini') {
        $url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' . $apiKey;
        // Transform payload to Gemini format
        $geminiContents = [];
        $geminiSystem = "";
        foreach ($finalMessages as $m) {
            if ($m['role'] === 'system') {
                $geminiSystem .= $m['content'] . "\n\n";
            } else {
                $role = $m['role'] === 'assistant' ? 'model' : 'user';
                $geminiContents[] = ['role' => $role, 'parts' => [['text' => $m['content']]]];
            }
        }
        $payload = [
            'systemInstruction' => ['parts' => [['text' => $geminiSystem]]],
            'contents' => $geminiContents,
            'generationConfig' => ['temperature' => 0.5, 'maxOutputTokens' => 1024]
        ];
    } elseif ($provider === 'hf') {
        $url = 'https://api-inference.huggingface.co/models/Qwen/Qwen2.5-72B-Instruct/v1/chat/completions';
        $headers[] = 'Authorization: Bearer ' . $apiKey;
        $payload['model'] = 'Qwen/Qwen2.5-72B-Instruct';
    } elseif ($provider === 'cerebras') {
        $url = 'https://api.cerebras.ai/v1/chat/completions';
        $headers[] = 'Authorization: Bearer ' . $apiKey;
        $payload['model'] = 'llama3.1-8b';
    } elseif ($provider === 'sambanova') {
        $url = 'https://api.sambanova.ai/v1/chat/completions';
        $headers[] = 'Authorization: Bearer ' . $apiKey;
        $payload['model'] = 'Meta-Llama-3.1-8B-Instruct';
    } elseif ($provider === 'cloudflare') {
        $accountId = "4f86d63d666497f1f0a1b6cc21da0c58";
        $url = "https://api.cloudflare.com/client/v4/accounts/{$accountId}/ai/run/@cf/meta/llama-3.2-3b-instruct";
        $headers[] = 'Authorization: Bearer ' . $apiKey;
    } elseif ($provider === 'mistral') {
        $url = 'https://api.mistral.ai/v1/chat/completions';
        $headers[] = 'Authorization: Bearer ' . $apiKey;
        $payload['model'] = 'mistral-small-latest';
    }

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 15);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($response === false || $httpCode >= 400) {
        throw new Exception("$provider Error: HTTP $httpCode");
    }

    $data = json_decode($response, true);
    if ($provider === 'gemini') {
        if (isset($data['candidates'][0]['content']['parts'][0]['text'])) {
            return $data['candidates'][0]['content']['parts'][0]['text'];
        }
        throw new Exception("Gemini unexpected response format");
    }

    if ($provider === 'cloudflare') {
        if (isset($data['result']['response'])) {
            return $data['result']['response'];
        }
        throw new Exception("Cloudflare unexpected response format");
    }

    if (isset($data['choices'][0]['message']['content'])) {
        return $data['choices'][0]['message']['content'];
    }

    throw new Exception("Unexpected response format from $provider");
}

// Cycle through APIs
$lastError = "";
foreach ($shiftedProviders as $provider) {
    try {
        $reply = fetchFromProvider($provider, $envKeys, $finalMessages);
        echo json_encode(['reply' => $reply]);
        exit;
    } catch (Exception $e) {
        $lastError = $e->getMessage();
        // continue to next provider
    }
}

// If all fail
http_response_code(500);
echo json_encode([
    'error' => 'All configured AI providers failed.',
    'reply' => 'I apologize, but all of my AI service connections are currently down or overloaded. Please try again in a few moments. ' . $lastError
]);
