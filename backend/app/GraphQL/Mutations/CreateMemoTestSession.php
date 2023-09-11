<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\MemoTest;

final class CreateMemoTestSession
{
    /**
     * @param null    $_
     * @param array{} $args
     */
    public function __invoke($_, array $args) {
        $testId = data_get($args, 'test.connect');

        $test    = MemoTest::withCount('images')->find($testId);
        $session = $test?->sessions()->create([
            'number_of_pairs' => $test->images_count
        ])->fresh();

        return [
            'recordID' => $session?->id,
            'record'   => $session,
        ];
    }
}
