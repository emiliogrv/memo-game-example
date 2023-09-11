<?php

namespace App\Providers;

use App\Enums\MemoTestSessionState;
use GraphQL\Type\Definition\PhpEnumType;
use Illuminate\Support\ServiceProvider;
use Nuwave\Lighthouse\Exceptions\DefinitionException;
use Nuwave\Lighthouse\Schema\TypeRegistry;

class GraphQLServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap services.
     *
     * @throws DefinitionException
     */
    public function boot(TypeRegistry $typeRegistry): void {
        $typeRegistry->register(new PhpEnumType(MemoTestSessionState::class));
    }
}
