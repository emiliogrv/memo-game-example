<?php

namespace Database\Seeders;

use App\Models\MemoTest;
use App\Models\MemoTestImage;
use Illuminate\Database\Seeder;

class MemoTestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void {
        MemoTest::factory()
                ->sequence(
                    ['name' => 'First game'],
                    ['name' => 'Second game'],
                )
                ->count(2)
                ->has(
                    MemoTestImage::factory()
                                 ->sequence(
                                     ['url' => 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/025.png'],
                                     ['url' => 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/026.png'],
                                     ['url' => 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/037.png'],
                                     ['url' => 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/038.png'],
                                     ['url' => 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/052.png'],
                                     ['url' => 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/053.png'],
                                     ['url' => 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/058.png'],
                                     ['url' => 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/059.png'],
                                 )->count(4),
                    'images',
                )
                ->create();
    }
}
