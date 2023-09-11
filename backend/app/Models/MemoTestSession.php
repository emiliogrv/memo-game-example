<?php

namespace App\Models;

use App\Enums\MemoTestSessionState;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MemoTestSession extends Model
{
    use HasUuids;

    protected $casts = [
        'state' => MemoTestSessionState::class
    ];

    protected $fillable = [
        'retries',
        'number_of_pairs',
        'state',
    ];

    public function test(): BelongsTo {
        return $this->belongsTo(MemoTest::class, 'memo_test_id');
    }
}
