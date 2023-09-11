<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MemoTest extends Model
{
    use HasFactory;
    use HasUuids;

    protected $fillable = [
        'name',
    ];

    public function images(): HasMany {
        return $this->hasMany(MemoTestImage::class, 'memo_test_id');
    }

    public function sessions(): HasMany {
        return $this->hasMany(MemoTestSession::class, 'memo_test_id');
    }
}
