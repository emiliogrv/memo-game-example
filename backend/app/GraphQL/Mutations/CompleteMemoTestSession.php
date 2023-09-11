<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Enums\MemoTestSessionState;
use App\Models\MemoTestSession;

final class CompleteMemoTestSession
{
    /**
     * @param null    $_
     * @param array{} $args
     */
    public function __invoke($_, array $args) {
        $id = data_get($args, 'id');

        $session = MemoTestSession::find($id);

        if ($session) {
            $session->state = MemoTestSessionState::COMPLETED;
            $session->save();
        }

        return [
            'recordID' => $session?->id,
            'record'   => $session,
        ];
    }
}
