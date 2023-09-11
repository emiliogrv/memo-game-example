<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\MemoTest;
use App\Models\MemoTestImage;

final class UpdateMemoTest
{
    /**
     * @param null    $_
     * @param array{} $args
     */
    public function __invoke($_, array $args) {
        $id           = data_get($args, 'id');
        $imagesCreate = data_get($args, 'images.create', []);
        $imagesUpdate = data_get($args, 'images.update', []);
        $imagesDelete = data_get($args, 'images.delete', []);

        $test = MemoTest::find($id);

        if ($test) {
            $test->fill($args);
            $test->save();

            $test->images()->createMany($imagesCreate);

            if (!empty($imagesUpdate)) {
                $imagesUpdate = collect($imagesUpdate)->keyBy('id');
                $updateIds    = $imagesUpdate->keys();

                $test->images()->whereIn('id', $updateIds)->get()->each(function (MemoTestImage $image) use ($imagesUpdate) {
                    $image->fill($imagesUpdate[$image->id]);
                    $image->save();
                });
            }

            $test->images()->whereIn('id', $imagesDelete)->delete();
        }

        return [
            'recordID' => $test?->id,
            'record'   => $test,
        ];
    }
}
