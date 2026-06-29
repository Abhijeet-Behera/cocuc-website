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

// Auto-sync frontend knowledge if files were modified via SCP/SSH
require_once __DIR__ . '/sync_knowledge.php';
try {
    syncKnowledgeIfChanged($pdo);
} catch (Exception $e) {
    // Silently continue if sync fails so chat isn't disrupted
}

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

// 4. Keyword RAG Engine (Database)
$searchTerms = preg_split('/\W+/', $lowerMessage, -1, PREG_SPLIT_NO_EMPTY);
$stopWords = ["the", "is", "at", "which", "and", "on", "a", "an", "to", "in", "of", "for", "with", "about", "what", "who", "where", "how", "why", "explain", "tell", "me", "details"];
$searchTerms = array_filter($searchTerms, function($w) use ($stopWords) {
    return strlen($w) > 2 && !in_array($w, $stopWords);
});

$liveDatabaseContext = "";
if (!empty($searchTerms)) {
    // Frontend Knowledge
    // Use FULLTEXT SEARCH for better accuracy and to prevent hallucinations
    $searchString = implode(' ', $searchTerms);
    $stmt = $pdo->prepare("SELECT content, MATCH(content) AGAINST(? IN NATURAL LANGUAGE MODE) as score 
                           FROM frontend_knowledge 
                           WHERE MATCH(content) AGAINST(? IN NATURAL LANGUAGE MODE) 
                           ORDER BY score DESC LIMIT 4");
    $stmt->execute([$searchString, $searchString]);
    
    $results = $stmt->fetchAll();
    if (count($results) > 0) {
        $liveDatabaseContext .= "STATIC WEBSITE KNOWLEDGE (Highly Relevant):\n";
        foreach ($results as $row) {
            $liveDatabaseContext .= "- " . trim($row['content']) . "\n";
        }
        $liveDatabaseContext .= "\n";
    }

    // Verses, Testimonies, YouTube (from Google Sheets / YouTube API via local API)
    $wantsVerses = false;
    $wantsTestimonies = false;
    $wantsYouTube = false;
    foreach ($searchTerms as $term) {
        if (strpos($term, 'vers') !== false || strpos($term, 'memor') !== false || strpos($term, 'scriptur') !== false) $wantsVerses = true;
        if (strpos($term, 'testimon') !== false || strpos($term, 'stor') !== false) $wantsTestimonies = true;
        if (strpos($term, 'youtub') !== false || strpos($term, 'video') !== false || strpos($term, 'sermon') !== false || strpos($term, 'jyoti') !== false || strpos($term, 'santi') !== false || strpos($term, 'barta') !== false) $wantsYouTube = true;
    }

    $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
    $baseUrl = $protocol . $_SERVER['HTTP_HOST'] . dirname($_SERVER['SCRIPT_NAME']);
    if (strpos($_SERVER['HTTP_HOST'], 'localhost') !== false) $baseUrl = 'http://localhost:8000';

    if ($wantsVerses) {
        $stmt = $pdo->prepare("SELECT content FROM chatbot_dynamic_knowledge WHERE knowledge_type = 'verses'");
        $stmt->execute();
        if ($row = $stmt->fetch()) $liveDatabaseContext .= $row['content'] . "\n";
    }

    if ($wantsTestimonies) {
        $stmt = $pdo->prepare("SELECT content FROM chatbot_dynamic_knowledge WHERE knowledge_type = 'testimonies'");
        $stmt->execute();
        if ($row = $stmt->fetch()) $liveDatabaseContext .= $row['content'] . "\n";
    }

    if ($wantsYouTube) {
        $stmt = $pdo->prepare("SELECT content FROM chatbot_dynamic_knowledge WHERE knowledge_type = 'youtube'");
        $stmt->execute();
        if ($row = $stmt->fetch()) $liveDatabaseContext .= $row['content'] . "\n";
    }

    // Blogs
    $blogLikeClauses = [];
    $blogParams = [];
    foreach ($searchTerms as $term) {
        $blogLikeClauses[] = "(title LIKE ? OR content LIKE ?)";
        $blogParams[] = '%' . $term . '%';
        $blogParams[] = '%' . $term . '%';
    }
    $blogWhere = implode(" OR ", $blogLikeClauses);
    $stmt = $pdo->prepare("SELECT title, content FROM blogs WHERE $blogWhere LIMIT 2");
    $stmt->execute($blogParams);
    $blogs = $stmt->fetchAll();
    if ($blogs) {
        $liveDatabaseContext .= "BLOGS:\n";
        foreach ($blogs as $b) {
            $liveDatabaseContext .= "Title: {$b['title']}. Content: " . substr($b['content'], 0, 500) . "...\n";
        }
    }

    // Announcements
    $annLikeClauses = [];
    $annParams = [];
    foreach ($searchTerms as $term) {
        $annLikeClauses[] = "(title LIKE ? OR content LIKE ?)";
        $annParams[] = '%' . $term . '%';
        $annParams[] = '%' . $term . '%';
    }
    $annWhere = implode(" OR ", $annLikeClauses);
    $stmt = $pdo->prepare("SELECT title, content FROM announcements WHERE $annWhere LIMIT 2");
    $stmt->execute($annParams);
    $anns = $stmt->fetchAll();
    if ($anns) {
        $liveDatabaseContext .= "ANNOUNCEMENTS:\n";
        foreach ($anns as $a) {
            $liveDatabaseContext .= "Announcement: {$a['title']} - " . substr($a['content'], 0, 500) . "...\n";
        }
    }

    // Upcoming Events (special_programmes)
    $spLikeClauses = [];
    $spParams = [];
    foreach ($searchTerms as $term) {
        $spLikeClauses[] = "(title LIKE ? OR details LIKE ?)";
        $spParams[] = '%' . $term . '%';
        $spParams[] = '%' . $term . '%';
    }
    $spWhere = implode(" OR ", $spLikeClauses);
    $stmt = $pdo->prepare("SELECT title, details, event_from, event_to FROM special_programmes WHERE $spWhere LIMIT 2");
    $stmt->execute($spParams);
    $events = $stmt->fetchAll();
    if ($events) {
        $liveDatabaseContext .= "UPCOMING EVENTS:\n";
        foreach ($events as $e) {
            $liveDatabaseContext .= "Event: {$e['title']} ({$e['event_from']} to {$e['event_to']}) - " . substr($e['details'], 0, 300) . "...\n";
        }
    }

    // Speaking Arrangements
    $saLikeClauses = [];
    $saParams = [];
    foreach ($searchTerms as $term) {
        $saLikeClauses[] = "(sub_section LIKE ? OR details LIKE ?)";
        $saParams[] = '%' . $term . '%';
        $saParams[] = '%' . $term . '%';
    }
    $saWhere = implode(" OR ", $saLikeClauses);
    $stmt = $pdo->prepare("SELECT sub_section, event_date, details FROM speaking_arrangements WHERE $saWhere LIMIT 2");
    $stmt->execute($saParams);
    $arrangements = $stmt->fetchAll();
    if ($arrangements) {
        $liveDatabaseContext .= "SPEAKING ARRANGEMENTS:\n";
        foreach ($arrangements as $sa) {
            $liveDatabaseContext .= "{$sa['sub_section']} on {$sa['event_date']}: " . substr($sa['details'], 0, 300) . "...\n";
        }
    }
    // Weekly Notices
    $wnLikeClauses = [];
    $wnParams = [];
    foreach ($searchTerms as $term) {
        $wnLikeClauses[] = "(notices_json LIKE ?)";
        $wnParams[] = '%' . $term . '%';
    }
    $wnWhere = implode(" OR ", $wnLikeClauses);
    $stmt = $pdo->prepare("SELECT release_date, notices_json FROM weekly_notices WHERE $wnWhere ORDER BY release_date DESC LIMIT 1");
    $stmt->execute($wnParams);
    $notices = $stmt->fetchAll();
    if ($notices) {
        $liveDatabaseContext .= "WEEKLY NOTICES:\n";
        foreach ($notices as $wn) {
            $liveDatabaseContext .= "Notice on {$wn['release_date']}: " . substr(strip_tags($wn['notices_json']), 0, 300) . "...\n";
        }
    }

    // Broadcasts
    $bcLikeClauses = [];
    $bcParams = [];
    foreach ($searchTerms as $term) {
        $bcLikeClauses[] = "(title LIKE ? OR message LIKE ?)";
        $bcParams[] = '%' . $term . '%';
        $bcParams[] = '%' . $term . '%';
    }
    $bcWhere = implode(" OR ", $bcLikeClauses);
    $stmt = $pdo->prepare("SELECT title, message, created_at FROM broadcasts WHERE $bcWhere ORDER BY created_at DESC LIMIT 2");
    $stmt->execute($bcParams);
    $broadcasts = $stmt->fetchAll();
    if ($broadcasts) {
        $liveDatabaseContext .= "BROADCAST MESSAGES:\n";
        foreach ($broadcasts as $bc) {
            $liveDatabaseContext .= "Broadcast: {$bc['title']} ({$bc['created_at']}) - " . substr($bc['message'], 0, 300) . "...\n";
        }
    }
}

// Fallback to latest standard info if context is empty
if (empty($liveDatabaseContext)) {
    try {
        $stmt = $pdo->prepare("SELECT content FROM chatbot_dynamic_knowledge WHERE knowledge_type = 'verses'");
        $stmt->execute();
        if ($row = $stmt->fetch()) {
            $lines = explode("\n", $row['content']);
            foreach ($lines as $line) {
                if (strpos($line, 'Daily:') !== false) {
                    $liveDatabaseContext .= "Latest Daily Verse: " . str_replace("Daily: ", "", $line) . "\n";
                    break;
                }
            }
        }
    
        $stmt = $pdo->query("SELECT title, content FROM announcements ORDER BY created_at DESC LIMIT 1");
        $a = $stmt->fetch();
        if ($a) {
            $liveDatabaseContext .= "Latest Announcement: {$a['title']} - " . substr($a['content'], 0, 300) . "...\n";
        }
    } catch (Exception $e) {}
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

WEBSITE KNOWLEDGE INSTRUCTIONS:
You are provided with dynamic context below. DO NOT reveal to the user that you are reading from a database, file, or context. Act as if you natively know this information.
1. Scan the provided text to find exact details like Church Timings (Sunday School, Odia Worship, English Worship, etc.), Service Times, Prayer Zone coordinators, and leadership names.
2. Answer questions about the latest announcements, blogs, upcoming events, recent YouTube sermons, and Prato Jyoti videos.
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
6. Do NOT use any emojis. Output plain text only.
7. WEBSITE NAVIGATION STRUCTURE: The website has the following navigation tabs and dropdowns:
- About (History, What We Believe, Supervisory Committee, Leadership Team, Secretary's Corner, Pastor's Note, Celebrations, Service Timing, Contact Us)
- Gallery
- Activities (Satellite Churches, Sunday Worship, Worship Team, Sunday School, C.E Union, Baptism Classes, Women's Fellowship, Youth Fellowship)
- Prayer Wings
- Events (Monthly Programme, Special Announcements, Speaking Engagements, Holy Week, Baptism)
- Blog
Also, the main homepage features: Church Updates, Activity Section, COCUC Prayer zones, Satellite Churches & Mission Fields, Latest Videos, Upcoming Events, Blog, and Share Your Testimony. 
If a user asks where to find a section (like Celebrations or Baptism), YOU MUST accurately tell them exactly which navigation bar tab and dropdown to click based on the map above (e.g. \"This is present at the navigation bar, About tab -> Celebrations\").";


$contextMessage = "Here is the relevant dynamic context:\n" . $liveDatabaseContext;

// Prepare final messages array
$finalMessages = [];
$finalMessages[] = ['role' => 'system', 'content' => $systemPrompt];
$finalMessages[] = ['role' => 'system', 'content' => $contextMessage];

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
