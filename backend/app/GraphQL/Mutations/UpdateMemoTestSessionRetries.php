<?php declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Enums\MemoTestSessionState;
use App\Models\MemoTestSession;
use Illuminate\Support\Facades\Log;

final class UpdateMemoTestSessionRetries
{
    /**
     * @param null    $_
     * @param array{} $args
     */
    public function __invoke($_, array $args) {
        $id      = data_get($args, 'id');
        $retries = data_get($args, 'retries');

        $session = MemoTestSession::find($id);

        if ($session?->state === MemoTestSessionState::STARTED) {
            $session->retries = $retries;
            $session->save();
        }

        Log::error(json_encode($session));

        return [
            'recordID' => $session?->id,
            'record'   => $session,
        ];
    }
}
