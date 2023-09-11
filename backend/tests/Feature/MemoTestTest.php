<?php

namespace Tests\Feature;

use App\Models\MemoTest;
use Database\Seeders\MemoTestSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MemoTestTest extends TestCase
{
    use RefreshDatabase;

    public function test_memo_tests_query(): void {
        $this->seed([
            MemoTestSeeder::class,
        ]);

        $memoTests = MemoTest::select('id', 'name')->get();

        $response = $this->graphQL(/** @lang GraphQL */ '
            query memoTests($page: Int!) {
                memoTests(page: $page) {
                    data {
                        id
                        name
                    }
                    paginatorInfo {
                        currentPage
                        hasMorePages
                        lastPage
                        total
                    }
                }
            }',
            ['page' => 1],
        );

        $response->assertJson([
            'data' => [
                'memoTests' => [
                    'data'          => $memoTests->toArray(),
                    "paginatorInfo" => [
                        "currentPage"  => 1,
                        "hasMorePages" => false,
                        "lastPage"     => 1,
                        "total"        => 2
                    ],
                ],
            ],
        ]);
    }

    public function test_memo_test_query(): void {
        $this->seed([
            MemoTestSeeder::class,
        ]);

        $memoTest = MemoTest::select('id', 'name')->with(['images:id,memo_test_id,url'])->first();
        $memoTest->images->makeHidden('memo_test_id');

        $response = $this->graphQL(/** @lang GraphQL */ '
            query memoTest($id: ID!) {
                memoTest(id: $id) {
                    id
                    name
                    images {
                        id
                        url
                    }
                }
            }',
            ['id' => $memoTest->id],
        );

        $response->assertJson([
            "data" => [
                "memoTest" => $memoTest->toArray()
            ]
        ]);
    }

    public function test_create_memo_test_mutation(): void {
        $this->seed([
            MemoTestSeeder::class,
        ]);

        $memoTest = MemoTest::select('id', 'name')->with(['images:id,memo_test_id,url'])->first();
        $memoTest->images->makeHidden('memo_test_id');

        $response = $this->graphQL(/** @lang GraphQL */ '
            mutation MyMutation {
                createMemoTest(
                    input: {
                        name: "new memo test created",
                        images: {
                            create: [
                                {url: "https://placehold.co/600x400.png"},
                                {url: "https://placehold.co/600x600.png"},
                            ]
                        }
                    }
                ) {
                    record {
                        id
                        name
                        images {
                            id
                            url
                        }
                    }
                }
            }',
            ['id' => $memoTest->id],
        );

        $response->assertJson([
            "data" => [
                "createMemoTest" => [
                    "record" => [
                        "name"   => "new memo test created",
                        "images" => [
                            [
                                "url" => "https://placehold.co/600x400.png"
                            ],
                            [
                                "url" => "https://placehold.co/600x600.png"
                            ]
                        ]
                    ]
                ]
            ]
        ]);

        $this->assertDatabaseHas('memo_tests', ['name' => 'new memo test created']);
        $this->assertDatabaseHas('memo_test_images', ['url' => 'https://placehold.co/600x600.png']);
    }
}
