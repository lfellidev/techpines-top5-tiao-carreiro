<?php
namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Post;
use App\Models\User;

class PostFactory extends Factory
{
    protected $model = Post::class;

    public function definition()
    {
        return [
            'title' => $this->faker->sentence,
            'views' => $this->faker->numberBetween(0, 10000),
            'youtube_id' => $this->faker->regexify('[A-Za-z0-9_-]{11}'),
            'thumb' => $this->faker->imageUrl(),
            'approved' => false,
            'user_id' => User::factory(),
        ];
    }

    public function approved()
    {
        return $this->state(['approved' => true]);
    }
}
