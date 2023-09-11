<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\MemoTest;

final class CreateMemoTest
{
    /**
     * @param null    $_
     * @param array{} $args
     */
    public function __invoke($_, array $args) {
        $images = data_get($args, 'images.create');

        $test = MemoTest::create($args);
        $test->images()->createMany($images);


        return [
            'recordID' => $test->id,
            'record'   => $test,
        ];
    }
}
