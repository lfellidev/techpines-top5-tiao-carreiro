<?php
namespace Tests\Feature;

use App\Models\Post;
use App\Models\User;
use App\Services\YouTubeService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Mockery;
use Tests\TestCase;

class PostControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->youtubeService = Mockery::mock(YouTubeService::class);
        $this->app->instance(YouTubeService::class, $this->youtubeService);
    }

    public function test_post_get_success()
    {
        Post::factory()->count(10)->approved()->create();

        $response = $this->getJson('/api/post/get?limit=5');

        $response->assertStatus(200)
                 ->assertJsonCount(2) // 10 posts dividido em grupos de 5
                 ->assertJsonStructure([['*' => ['id', 'title', 'views', 'youtube_id', 'thumb', 'sequence']]]);
    }

    public function test_post_suggest_success()
    {
        $user = User::factory()->create();
        $token = $user->createToken('test')->plainTextToken;

        $this->youtubeService->shouldReceive('getYouTubeInfo')
                             ->once()
                             ->andReturn([
                                 'title' => 'Test Video',
                                 'views' => 100,
                                 'youtube_id' => 'abc123xyz',
                                 'thumb' => 'http://example.com/thumb.jpg',
                             ]);

        $response = $this->withHeaders(['Authorization' => "Bearer $token"])
                         ->postJson('/api/post/suggest', ['youtube_url' => 'https://youtube.com/watch?v=abc123xyz']);

        $response->assertStatus(201);
        $this->assertDatabaseHas('posts', ['youtube_id' => 'abc123xyz', 'approved' => false]);
    }

    public function test_admin_post_get_success()
    {
        $admin = User::factory()->admin()->create();
        $token = $admin->createToken('test')->plainTextToken;
        Post::factory()->count(5)->create();

        $response = $this->withHeaders(['Authorization' => "Bearer $token"])
                         ->getJson('/api/admin/post/get');

        $response->assertStatus(200)
                 ->assertJsonStructure([['*' => ['id', 'title', 'views', 'youtube_id', 'thumb', 'sequence', 'approved']]]);
    }

    public function test_admin_post_get_unauthorized()
    {
        $user = User::factory()->create(); // Não admin
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeaders(['Authorization' => "Bearer $token"])
                         ->getJson('/api/admin/post/get');

        $response->assertStatus(403);
    }

    public function test_admin_post_update_visibility_success()
    {
        $admin = User::factory()->admin()->create();
        $token = $admin->createToken('test')->plainTextToken;
        $post = Post::factory()->create();

        $response = $this->withHeaders(['Authorization' => "Bearer $token"])
                         ->putJson("/api/admin/post/update/visibility/{$post->id}", ['approved' => true]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('posts', ['id' => $post->id, 'approved' => true]);
    }

    public function test_admin_post_update_url_success()
    {
        $admin = User::factory()->admin()->create();
        $token = $admin->createToken('test')->plainTextToken;
        $post = Post::factory()->create();

        $this->youtubeService->shouldReceive('getYouTubeInfo')
                             ->once()
                             ->andReturn([
                                 'title' => 'Updated Video',
                                 'views' => 200,
                                 'youtube_id' => 'xyz789abc',
                                 'thumb' => 'http://example.com/new_thumb.jpg',
                             ]);

        $response = $this->withHeaders(['Authorization' => "Bearer $token"])
                         ->putJson("/api/admin/post/update/url/{$post->id}", ['youtube_url' => 'https://youtube.com/watch?v=xyz789abc']);

        $response->assertStatus(200);
        $this->assertDatabaseHas('posts', ['id' => $post->id, 'youtube_id' => 'xyz789abc']);
    }

    public function test_admin_post_delete_success()
    {
        $admin = User::factory()->admin()->create();
        $token = $admin->createToken('test')->plainTextToken;
        $post = Post::factory()->create();

        $response = $this->withHeaders(['Authorization' => "Bearer $token"])
                         ->deleteJson("/api/admin/post/delete/{$post->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('posts', ['id' => $post->id]);
    }
}
