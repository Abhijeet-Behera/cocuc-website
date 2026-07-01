<?php

function loadEnv(string $path): array
{
    if (!file_exists($path)) {
        throw new RuntimeException("Environment file not found: {$path}");
    }

    $env = [];

    $lines = file(
        $path,
        FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES
    );

    foreach ($lines as $line) {
        $line = trim($line);

        if ($line === '' || str_starts_with($line, '#')) {
            continue;
        }

        $parts = explode('=', $line, 2);

        if (count($parts) !== 2) {
            continue;
        }

        $name = trim($parts[0]);
        $value = trim($parts[1]);

        if ($name === '') {
            continue;
        }

        // Remove matching surrounding quotes.
        if (
            (str_starts_with($value, '"') && str_ends_with($value, '"')) ||
            (str_starts_with($value, "'") && str_ends_with($value, "'"))
        ) {
            $value = substr($value, 1, -1);
        }

        $env[$name] = $value;

        // Make variables available through all common PHP methods.
        putenv("{$name}={$value}");
        $_ENV[$name] = $value;
        $_SERVER[$name] = $value;
    }

    return $env;
}

loadEnv(__DIR__ . '/.env');