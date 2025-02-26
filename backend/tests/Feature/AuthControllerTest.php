<?php
namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_signup_success()
    {
        $response = $this->postJson('/api/user/signup', [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
            'is_admin' => true,
        ]);

        $response->assertStatus(201)
                 ->assertJsonStructure(['name', 'token', 'isAdmin']) // Ajustado para a nova estrutura
                 ->assertJson([
                     'name' => 'John Doe',
                     'isAdmin' => true,
                 ]);
        $this->assertDatabaseHas('users', ['email' => 'john@example.com', 'is_admin' => true]);
    }

    public function test_user_signup_validation_fails()
    {
        $response = $this->postJson('/api/user/signup', [
            'name' => '',
            'email' => 'invalid-email',
            'password' => 'short',
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['name', 'email', 'password']);
    }

    public function test_user_login_success()
    {
        $user = User::factory()->create(['password' => bcrypt('password')]);

        $response = $this->postJson('/api/user/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure(['name', 'token', 'isAdmin'])
                 ->assertJson([
                     'name' => $user->name,
                     'isAdmin' => $user->is_admin,
                 ]);
    }

    public function test_user_login_fails_invalid_credentials()
    {
        $user = User::factory()->create(['password' => bcrypt('password')]);

        $response = $this->postJson('/api/user/login', [
            'email' => $user->email,
            'password' => 'wrong-password',
        ]);

        $response->assertStatus(401);
    }

    public function test_user_logout_success()
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-token')->plainTextToken;

        $response = $this->withHeaders(['Authorization' => "Bearer $token"])
                         ->postJson('/api/user/logout');

        $response->assertStatus(200);
        $this->assertEquals(0, $user->tokens()->count());
    }

    public function test_user_logout_unauthenticated()
    {
        $response = $this->postJson('/api/user/logout');

        $response->assertStatus(401);
    }
}
