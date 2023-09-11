<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\MemoTest;

final class DeleteMemoTest
{
    /**
     * @param null    $_
     * @param array{} $args
     */
    public function __invoke($_, array $args) {
        $id = data_get($args, 'id');

        $test = MemoTest::with('images')->find($id);
        $test?->delete();

        return [
            'recordID' => $test?->id,
            'record'   => $test,
        ];
    }
}
