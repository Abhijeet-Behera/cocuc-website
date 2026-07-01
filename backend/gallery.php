<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

/*
|--------------------------------------------------------------------------
| Load environment variables
|--------------------------------------------------------------------------
*/

$envLoaderPath = __DIR__ . '/env_loader.php';

if (file_exists($envLoaderPath)) {
    require_once $envLoaderPath;

    if (function_exists('loadEnv')) {
        loadEnv(__DIR__ . '/.env');
    }
}

/*
|--------------------------------------------------------------------------
| Configuration
|--------------------------------------------------------------------------
*/

$cacheFile = __DIR__ . '/gallery_cache.json';

/*
 * Cache the gallery response for six hours.
 */
$cacheTime = 3600 * 6;

/*
 * Display a maximum of 10 matching gallery posts.
 */
$maxGalleryPosts = 15;

/*
 * Fetch more posts from Instagram so PHP can find
 * up to 10 posts containing the gallery marker.
 */
$instagramFetchLimit = 200;

$instagramUserId =
    getenv('INSTAGRAM_USER_ID') ?:
    ($_ENV['INSTAGRAM_USER_ID'] ?? '');

$accessToken =
    getenv('INSTAGRAM_ACCESS_TOKEN') ?:
    ($_ENV['INSTAGRAM_ACCESS_TOKEN'] ?? '');

$apiVersion =
    getenv('INSTAGRAM_API_VERSION') ?:
    ($_ENV['INSTAGRAM_API_VERSION'] ?? 'v25.0');

/*
|--------------------------------------------------------------------------
| JSON response helper
|--------------------------------------------------------------------------
*/

function sendJsonResponse(
    array $response,
    int $statusCode = 200
): void {
    http_response_code($statusCode);

    echo json_encode(
        $response,
        JSON_UNESCAPED_SLASHES |
        JSON_UNESCAPED_UNICODE |
        JSON_INVALID_UTF8_SUBSTITUTE
    );

    exit;
}

/*
|--------------------------------------------------------------------------
| Read existing cache
|--------------------------------------------------------------------------
*/

function getGalleryCache(
    string $cacheFile
): ?string {
    if (!is_file($cacheFile)) {
        return null;
    }

    $cachedResponse = @file_get_contents(
        $cacheFile
    );

    if (
        $cachedResponse === false ||
        trim($cachedResponse) === ''
    ) {
        return null;
    }

    $decodedCache = json_decode(
        $cachedResponse,
        true
    );

    if (
        !is_array($decodedCache) ||
        ($decodedCache['status'] ?? '') !== 'success' ||
        !isset($decodedCache['data']) ||
        !is_array($decodedCache['data'])
    ) {
        return null;
    }

    return $cachedResponse;
}

/*
|--------------------------------------------------------------------------
| Serve fresh or expired cache
|--------------------------------------------------------------------------
*/

function serveGalleryCache(
    string $cacheFile,
    int $cacheTime,
    bool $allowExpired = false
): bool {
    if (!is_file($cacheFile)) {
        return false;
    }

    $modifiedTime = @filemtime($cacheFile);

    if ($modifiedTime === false) {
        return false;
    }

    $cacheAge = time() - $modifiedTime;
    $isFresh = $cacheAge < $cacheTime;

    if (!$allowExpired && !$isFresh) {
        return false;
    }

    $cachedResponse = getGalleryCache(
        $cacheFile
    );

    if ($cachedResponse === null) {
        return false;
    }

    header(
        'X-Gallery-Cache: ' .
        ($isFresh ? 'HIT' : 'STALE')
    );

    echo $cachedResponse;

    return true;
}

/*
|--------------------------------------------------------------------------
| Save gallery cache
|--------------------------------------------------------------------------
*/

function saveGalleryCache(
    string $cacheFile,
    string $jsonResponse
): bool {
    $writtenBytes = @file_put_contents(
        $cacheFile,
        $jsonResponse,
        LOCK_EX
    );

    if ($writtenBytes === false) {
        error_log(
            'Unable to write gallery cache: ' .
            $cacheFile
        );

        return false;
    }

    return true;
}

/*
|--------------------------------------------------------------------------
| Return fresh cache first
|--------------------------------------------------------------------------
*/

if (
    serveGalleryCache(
        $cacheFile,
        $cacheTime,
        false
    )
) {
    exit;
}

/*
|--------------------------------------------------------------------------
| Check Instagram configuration
|--------------------------------------------------------------------------
*/

if (
    $instagramUserId === '' ||
    $accessToken === ''
) {
    /*
     * Use an older cache if credentials are unavailable.
     */
    if (
        serveGalleryCache(
            $cacheFile,
            $cacheTime,
            true
        )
    ) {
        exit;
    }

    sendJsonResponse(
        [
            "status" => "error",
            "message" =>
                "Instagram API credentials are not configured.",
            "data" => [],
            "lastUpdated" => date("c")
        ],
        500
    );
}

/*
|--------------------------------------------------------------------------
| Build Instagram Graph API request
|--------------------------------------------------------------------------
*/

$fields = implode(',', [
    'id',
    'caption',
    'media_type',
    'media_url',
    'permalink',
    'timestamp',
    'children{media_type,media_url}'
]);

$query = http_build_query([
    'fields' => $fields,
    'limit' => $instagramFetchLimit,
    'access_token' => $accessToken
]);

$url = sprintf(
    'https://graph.facebook.com/%s/%s/media?%s',
    rawurlencode($apiVersion),
    rawurlencode($instagramUserId),
    $query
);

/*
|--------------------------------------------------------------------------
| Check PHP cURL
|--------------------------------------------------------------------------
*/

if (!function_exists('curl_init')) {
    if (
        serveGalleryCache(
            $cacheFile,
            $cacheTime,
            true
        )
    ) {
        exit;
    }

    sendJsonResponse(
        [
            "status" => "error",
            "message" =>
                "PHP cURL is not enabled on the server.",
            "data" => [],
            "lastUpdated" => date("c")
        ],
        500
    );
}

/*
|--------------------------------------------------------------------------
| Fetch Instagram media
|--------------------------------------------------------------------------
*/

header('X-Gallery-Cache: MISS');

$curl = curl_init();

curl_setopt_array($curl, [
    CURLOPT_URL => $url,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CONNECTTIMEOUT => 10,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_SSL_VERIFYPEER => true,
    CURLOPT_SSL_VERIFYHOST => 2,
    CURLOPT_HTTPHEADER => [
        'Accept: application/json'
    ]
]);

$apiResponse = curl_exec($curl);
$curlError = curl_error($curl);

$httpStatus = (int) curl_getinfo(
    $curl,
    CURLINFO_HTTP_CODE
);

curl_close($curl);

/*
|--------------------------------------------------------------------------
| Handle connection failure
|--------------------------------------------------------------------------
*/

if (
    $apiResponse === false ||
    $curlError !== ''
) {
    error_log(
        'Instagram API connection error: ' .
        $curlError
    );

    /*
     * Use the old cache if Meta cannot be reached.
     */
    if (
        serveGalleryCache(
            $cacheFile,
            $cacheTime,
            true
        )
    ) {
        exit;
    }

    sendJsonResponse(
        [
            "status" => "error",
            "message" =>
                "PHP could not connect to Meta.",
            "curlError" => $curlError,
            "httpStatus" => $httpStatus,
            "data" => [],
            "lastUpdated" => date("c")
        ],
        502
    );
}

$instagramData = json_decode(
    $apiResponse,
    true
);

/*
|--------------------------------------------------------------------------
| Handle Meta API error
|--------------------------------------------------------------------------
*/

if (
    !is_array($instagramData) ||
    $httpStatus < 200 ||
    $httpStatus >= 300 ||
    isset($instagramData['error'])
) {
    $instagramError =
        $instagramData['error']['message'] ??
        'Unknown Instagram API error.';

    $instagramErrorCode =
        $instagramData['error']['code'] ??
        'unknown';

    $instagramErrorSubcode =
        $instagramData['error']['error_subcode'] ??
        null;

    error_log(
        'Instagram API error [' .
        $instagramErrorCode .
        ']: ' .
        $instagramError
    );

    /*
     * Continue displaying the previous gallery if the
     * token expires or Meta temporarily fails.
     */
    if (
        serveGalleryCache(
            $cacheFile,
            $cacheTime,
            true
        )
    ) {
        exit;
    }

    sendJsonResponse(
        [
            "status" => "error",
            "message" =>
                "Meta rejected the Instagram API request.",
            "metaError" => $instagramError,
            "metaCode" => $instagramErrorCode,
            "metaSubcode" => $instagramErrorSubcode,
            "httpStatus" => $httpStatus,
            "data" => [],
            "lastUpdated" => date("c")
        ],
        502
    );
}

/*
|--------------------------------------------------------------------------
| Convert Instagram posts into gallery items
|--------------------------------------------------------------------------
*/

$layoutTypes = [
    'large',
    'portrait',
    'landscape',
    'square',
    'portrait',
    'landscape',
    'square',
    'portrait',
    'landscape',
    'square'
];

$galleryImages = [];
$layoutIndex = 0;

/*
 * Detect both:
 *
 * ✝
 * ✝️
 *
 * The marker can appear anywhere in the caption.
 */
$galleryMarkerPattern =
    '/\x{271D}(?:\x{FE0E}|\x{FE0F})?/u';

foreach (
    $instagramData['data'] ?? [] as $post
) {
    /*
     * Stop after collecting 10 eligible posts.
     */
    if (
        count($galleryImages) >=
        $maxGalleryPosts
    ) {
        break;
    }

    $mediaType =
        $post['media_type'] ?? '';

    $imageUrl = '';

    /*
     * Normal single-image Instagram post.
     */
    if ($mediaType === 'IMAGE') {
        $imageUrl =
            $post['media_url'] ?? '';
    }

    /*
     * Carousel post:
     * use the first image in the carousel.
     */ elseif (
        $mediaType === 'CAROUSEL_ALBUM'
    ) {
        $children =
            $post['children']['data'] ?? [];

        foreach ($children as $child) {
            if (
                ($child['media_type'] ?? '') ===
                'IMAGE' &&
                !empty($child['media_url'])
            ) {
                $imageUrl =
                    $child['media_url'];

                break;
            }
        }
    }

    /*
     * Exclude videos and Reels.
     */ else {
        continue;
    }

    if ($imageUrl === '') {
        continue;
    }

    $caption = trim(
        (string) ($post['caption'] ?? '')
    );

    /*
     * Include the post when ✝ or ✝️ appears anywhere
     * inside the caption.
     */
    if (
        $caption === '' ||
        !preg_match(
            $galleryMarkerPattern,
            $caption
        )
    ) {
        continue;
    }

    /*
     * Remove the first gallery marker only from the
     * caption displayed on the website.
     */
    $cleanCaption = preg_replace(
        $galleryMarkerPattern,
        '',
        $caption,
        1
    );

    if (!is_string($cleanCaption)) {
        $cleanCaption = $caption;
    }

    /*
     * Remove the final hashtag block from the website
     * caption. Instagram itself remains unchanged.
     */
    $cleanCaption = preg_replace(
        '/\s*(?:#[\p{L}\p{N}_]+\s*)+$/u',
        '',
        $cleanCaption
    );

    $cleanCaption = trim(
        is_string($cleanCaption)
        ? $cleanCaption
        : $caption
    );

    $instagramUrl =
        $post['permalink'] ?? '';

    if ($instagramUrl === '') {
        continue;
    }

    $galleryImages[] = [
        "id" => (string) (
            $post['id'] ?? ''
        ),
        "imageUrl" => $imageUrl,
        "instagramUrl" => $instagramUrl,
        "caption" =>
            $cleanCaption !== ''
            ? $cleanCaption
            : 'Church of Christ, Union Church',
        "type" => $layoutTypes[
            $layoutIndex %
            count($layoutTypes)
        ]
    ];

    $layoutIndex++;
}

/*
|--------------------------------------------------------------------------
| Prepare JSON response
|--------------------------------------------------------------------------
*/

$response = [
    "status" => "success",
    "data" => $galleryImages,
    "count" => count($galleryImages),
    "maximumPosts" => $maxGalleryPosts,
    "lastUpdated" => date("c")
];

$jsonResponse = json_encode(
    $response,
    JSON_UNESCAPED_SLASHES |
    JSON_UNESCAPED_UNICODE |
    JSON_INVALID_UTF8_SUBSTITUTE
);

if ($jsonResponse === false) {
    if (
        serveGalleryCache(
            $cacheFile,
            $cacheTime,
            true
        )
    ) {
        exit;
    }

    sendJsonResponse(
        [
            "status" => "error",
            "message" =>
                "Unable to prepare the gallery response.",
            "data" => [],
            "lastUpdated" => date("c")
        ],
        500
    );
}

/*
|--------------------------------------------------------------------------
| Save successful response to cache
|--------------------------------------------------------------------------
*/

saveGalleryCache(
    $cacheFile,
    $jsonResponse
);

header('X-Gallery-Cache: UPDATED');

echo $jsonResponse;

