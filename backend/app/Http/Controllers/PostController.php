<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Services\YouTubeService;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class PostController extends Controller implements HasMiddleware
{
    use AuthorizesRequests;

    protected $youTubeService;

    public function __construct(YouTubeService $youTubeService)
    {
        $this->youTubeService = $youTubeService;
    }

    public static function middleware()
    {
        return [
            new Middleware('auth:sanctum', except: ['postGet',])
        ];
    }

	public function postGet(Request $request)
	{
		$limit = $request->input('limit', 5);
		$posts = Post::select('id', 'title', 'views', 'youtube_id', 'thumb')
					 ->where('approved', true)
					 ->orderBy('views', 'desc')
					 ->get()
					 ->map(function ($post, $index) {
						 return [
							 'id' => $post->id,
							 'title' => $post->title,
							 'views' => $post->views,
							 'youtube_id' => $post->youtube_id,
							 'thumb' => $post->thumb,
							 'sequence' => $index + 1,
						 ];
					 });
		$groupedPosts = [];
		$chunkSize = 5;

		for ($i = 0; $i < count($posts); $i += $chunkSize) {
			$groupedPosts[] = array_slice($posts->toArray(), $i, $chunkSize);
		}

		return response()->json($groupedPosts, 200, [], JSON_UNESCAPED_SLASHES);
	}



    public function postSuggest(Request $request)
    {
        $request->validate([
            'youtube_url' => 'required|url'
        ]);

        try {
            $youtubeInfo = $this->youTubeService->getYouTubeInfo($request->youtube_url);

            $post = $request->user()->posts()->create([
                'title' => $youtubeInfo['title'],
                'views' => $youtubeInfo['views'],
                'youtube_id' => $youtubeInfo['youtube_id'],
                'thumb' => $youtubeInfo['thumb'],
                'approved' => false
            ]);

            return response('', 201);
        } catch (\Exception $e) {
            return response('', 400);
        }
    }

		public function postSuggestAdmin(Request $request, Post $post)
    {
			        $this->authorize('adminOnly', $post);
        $request->validate([
            'youtube_url' => 'required|url'
        ]);

        try {
            $youtubeInfo = $this->youTubeService->getYouTubeInfo($request->youtube_url);

            $post = $request->user()->posts()->create([
                'title' => $youtubeInfo['title'],
                'views' => $youtubeInfo['views'],
                'youtube_id' => $youtubeInfo['youtube_id'],
                'thumb' => $youtubeInfo['thumb'],
                'approved' => true
            ]);

            return response('', 201);
        } catch (\Exception $e) {
            return response('', 400);
        }
    }


    public function adminPostUpdateVisibility(Request $request, Post $post)
    {
        $this->authorize('adminOnly', $post);

        $request->validate([
            'approved' => 'required|boolean'
        ]);

        try {
            $post->update([
                'approved' => $request->input('approved')
            ]);

            return response('', 200);
        } catch (\Exception $e) {
            return response('', 400);
        }
    }

	public function adminPostUpdateUrl(Request $request, Post $post)
{

    $this->authorize('adminOnly', $post);

    $request->validate([
        'youtube_url' => 'required|url'
    ]);

    try {
       $youtubeInfo = $this->youTubeService->getYouTubeInfo($request->youtube_url);

        $post->update([
            'title' => $youtubeInfo['title'],
            'views' => $youtubeInfo['views'],
            'youtube_id' => $youtubeInfo['youtube_id'],
            'thumb' => $youtubeInfo['thumb'],
        ]);

        return response('', 200);
    } catch (\Exception $e) {
        return response('', 400);
    }
}


    public function adminPostDelete(Post $post)
    {
        $this->authorize('adminOnly', $post);

        try {
            $post->delete();
            return response('', 200);
        } catch (\Exception $e) {
            return response('', 401);
        }
    }

	public function adminPostGet(Request $request)
	{
		$this->authorize('adminOnly', Post::class);

		$limit = $request->input('limit', 5);
		$posts = Post::select('id', 'title', 'views', 'youtube_id', 'thumb', 'approved')
			->orderBy('views', 'desc')
			->get()
			->map(function ($post, $index) {
				return [
				 	'id' => $post->id,
					'title' => $post->title,
					'views' => $post->views,
					'youtube_id' => $post->youtube_id,
					'thumb' => $post->thumb,
					'sequence' => $index + 1,
					'approved' => $post->approved,
				];
			});
		$groupedPosts = [];
		$chunkSize = 5;

		for ($i = 0; $i < count($posts); $i += $chunkSize) {
			$groupedPosts[] = array_slice($posts->toArray(), $i, $chunkSize);
		}

		return response()->json($groupedPosts, 200, [], JSON_UNESCAPED_SLASHES);
	}
}
