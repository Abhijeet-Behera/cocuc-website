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

require_once __DIR__ . '/db_config.php';



// Rate Limiting & Spam Protection
$ipAddress = getClientIP();
$stmt = $pdo->prepare("SELECT * FROM chatbot_rate_limits WHERE ip_address = ?");
$stmt->execute([$ipAddress]);
$rateLimit = $stmt->fetch();

$now = new DateTime();
if ($rateLimit) {
    if ($rateLimit['cooldown_until']) {
        $cooldown = new DateTime($rateLimit['cooldown_until']);
        if ($now < $cooldown) {
            http_response_code(429);
            echo json_encode(['reply' => "You are currently on a cooldown to prevent spam. Please try again after " . $cooldown->format('Y-m-d H:i:s T') . "."]);
            exit;
        } else {
            // Cooldown expired
            $stmt = $pdo->prepare("UPDATE chatbot_rate_limits SET cooldown_until = NULL, message_count = 0, first_message_time = NOW() WHERE ip_address = ?");
            $stmt->execute([$ipAddress]);
            $rateLimit['message_count'] = 0;
            $rateLimit['first_message_time'] = $now->format('Y-m-d H:i:s');
        }
    }

    $firstMessageTime = new DateTime($rateLimit['first_message_time']);
    $interval = $now->diff($firstMessageTime);
    $hours = $interval->h + ($interval->days * 24);

    if ($hours >= 1) {
        // Reset after an hour
        $stmt = $pdo->prepare("UPDATE chatbot_rate_limits SET message_count = 1, first_message_time = NOW() WHERE ip_address = ?");
        $stmt->execute([$ipAddress]);
    } else {
        $newCount = $rateLimit['message_count'] + 1;
        if ($newCount > 50) {
            $strikes = $rateLimit['spam_strikes'] + 1;
            $cooldownHours = ($strikes > 1) ? 6 : 3;
            $cooldownUntil = (clone $now)->modify("+$cooldownHours hours")->format('Y-m-d H:i:s');
            
            $stmt = $pdo->prepare("UPDATE chatbot_rate_limits SET message_count = ?, cooldown_until = ?, spam_strikes = ? WHERE ip_address = ?");
            $stmt->execute([$newCount, $cooldownUntil, $strikes, $ipAddress]);
            
            http_response_code(429);
            echo json_encode(['reply' => "You have exceeded the limit of 50 messages per hour. A cooldown of $cooldownHours hours has been applied to prevent spam. Please try again later."]);
            exit;
        } else {
            $stmt = $pdo->prepare("UPDATE chatbot_rate_limits SET message_count = ? WHERE ip_address = ?");
            $stmt->execute([$newCount, $ipAddress]);
        }
    }
} else {
    $stmt = $pdo->prepare("INSERT INTO chatbot_rate_limits (ip_address, message_count, first_message_time) VALUES (?, 1, NOW())");
    $stmt->execute([$ipAddress]);
}

$lowerMessage = strtolower($message);

// 2. Crisis Interception - Refined regex to avoid false positives for religious queries
$crisisRegex = '/\b(suicid[ea]|kill myself|end my life|take my own life|no reason to live|giving up on life|hate my life|overdose|jump off|hang myself|strangle myself)\b/i';

if (preg_match($crisisRegex, $lowerMessage)) {
    echo json_encode([
        'reply' => "I'm so sorry you are feeling this way. Please know you are not alone. Please call the church directly at +91 9437026699 for support."
    ]);
    exit;
}

// 3. Load Environment Variables
$envPath = __DIR__ . '/.env';
if (!file_exists($envPath)) {
    echo json_encode(['reply' => "Sorry, my brain hasn't been connected to any AI Cloud yet!"]);
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
    echo json_encode(['reply' => "Sorry, my brain hasn't been connected to any AI Cloud yet!"]);
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

function fetchLocalApi($url) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 3);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    $res = curl_exec($ch);
    curl_close($ch);
    return $res;
}

// CRITICAL HOSTINGER OPTIMIZATION: Close DB connection BEFORE the slow LLM fetch
// This frees up MySQL max_connections on shared hosting while waiting 5-15s for Gemini
$pdo = null;

// Build System Prompt
$systemPrompt = "You are Ezer Bot, the digital assistant for the \"Church of Christ - Union Church, Bhubaneswar\".
Your name comes from the biblical Hebrew word Ezer, meaning a strong ally and vital helper.
You are a helpful, warm, and biblically knowledgeable Christian assistant.

SAFEGUARD AND ROUTING INSTRUCTIONS:
1. OFFENSIVE CONTENT: If the user writes explicit profanity, hate speech, or explicit sexual content, you MUST reply with exactly this text and nothing else: \"(Marked as spammed/offensive)\". (Do NOT trigger this for general religious questions like 'explain the verse').
2. CRISIS PROTOCOL (CRITICAL!): For any mention of depression, sadness, anxiety, hopelessness, self-harm, suicide, abuse, or crisis:
   - YOU ARE STRICTLY FORBIDDEN FROM PROVIDING ANY US-BASED HOTLINES (NO 988, NO National Suicide Prevention Lifeline, NO Crisis Text Line, NO 1-800 numbers), or even indian public agencies number, only provide church number strictly.
   - You MUST reply EXACTLY with this text and nothing else: \"I'm so sorry you are feeling this way. Please know you are not alone. Please call the church directly at +91 9437026699 for support.\"
   - DO NOT append any other text. DO NOT offer external resources. Your compliance with this rule is mandatory.

CRITICAL FORMATTING RULES:
1. Keep your answers EXTREMELY precise and to the point. 
2. Use a maximum of 2-3 short sentences for your entire response, unless the user explicitly asks for a long explanation.
3. Do NOT use any markdown formatting (no asterisks *, no bolding, no bullet points). 
4. Do NOT use any emojis. Output plain text only.";

// Prepare final messages array
$finalMessages = [];
$finalMessages[] = ['role' => 'system', 'content' => $systemPrompt];

// Append history: ONLY TAKE THE LAST 3 USER/BOT MESSAGES to prevent token overflow/timeout null errors
$recentHistory = array_slice($history, -3);
foreach ($recentHistory as $msg) {
    if (isset($msg['role']) && isset($msg['content'])) {
        $mappedRole = $msg['role'] === 'bot' ? 'assistant' : $msg['role'];
        // Truncate past messages to 400 chars each to aggressively prevent context overflow
        $finalMessages[] = ['role' => $mappedRole, 'content' => substr($msg['content'], 0, 400)];
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
    // Set a slightly higher timeout to accommodate asynchronous-like flow, 
    // avoiding standard 15s timeout nulls for larger models.
    curl_setopt($ch, CURLOPT_TIMEOUT, 20); 
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
    'reply' => 'I apologize, but all of my AI service connections are currently down or overloaded. Please try again in a few moments.'
]);
