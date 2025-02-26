<?php

namespace App\Services;

class YouTubeService
{
    public function getYouTubeInfo($youtube_url)
    {
        if (!function_exists('curl_init')) {
            throw new \Exception('cURL extension is not enabled on this server');
        }

        preg_match('/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i', $youtube_url, $match);
        $youtube_id = $match[1] ?? null;

        if (!$youtube_id) {
            throw new \Exception('Could not extract YouTube ID from URL');
        }

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, "https://www.youtube.com/watch?v={$youtube_id}");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
        curl_setopt($ch, CURLOPT_TIMEOUT, 30);
        curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (compatible; bot)');
        $html = curl_exec($ch);

        if (curl_errno($ch)) {
            $error = curl_error($ch);
            curl_close($ch);
            throw new \Exception("cURL error: {$error}");
        }

        $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($http_code !== 200) {
            throw new \Exception("HTTP request failed with code: {$http_code}");
        }

        if (empty($html)) {
            throw new \Exception('Empty response from YouTube');
        }

        preg_match('/<title>(.*?)<\/title>/', $html, $title_match);
        $title = $title_match[1] ? str_replace(' - YouTube', '', $title_match[1]) : 'Untitled';

        $views = 0;
        if (preg_match('/"viewCount":"(\d+)"/', $html, $views_match)) {
            $views = $views_match[1];
        } elseif (preg_match('/"views":"([\d,]+)"/', $html, $views_match)) {
            $views = str_replace(',', '', $views_match[1]);
        }

        $thumb = "https://img.youtube.com/vi/{$youtube_id}/hqdefault.jpg";

        return [
            'title' => $title,
            'views' => (int)$views,
            'youtube_id' => $youtube_id,
            'thumb' => $thumb
        ];
    }
}
