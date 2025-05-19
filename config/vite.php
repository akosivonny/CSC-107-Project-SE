<?php

return [
    'paths' => [
        'build' => 'build',
        'manifest' => public_path('build/.vite/manifest.json'),
    ],
    'dev_server' => [
        'url' => env('VITE_DEV_SERVER_URL', 'http://localhost:5174'),
        'ping_timeout' => 1,
    ],
]; 