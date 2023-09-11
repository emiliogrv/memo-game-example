<?php

namespace Tests\Feature;

// use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RootTest extends TestCase
{
    public function test_the_application_returns_a_not_found_response(): void {
        $response = $this->get('/');

        $response->assertStatus(404);
    }
}
