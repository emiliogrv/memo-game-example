<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void {
        Schema::create('memo_test_sessions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('memo_test_id')
                  ->constrained()
                  ->onUpdate('RESTRICT')
                  ->onDelete('RESTRICT');

            $table->unsignedInteger('retries')->default(0);
            $table->unsignedInteger('number_of_pairs');
            $table->enum('state', ['started', 'completed'])->default('started');

            $table->timestamps();
        });

        if (env('DB_CONNECTION') === 'pgsql') {
            Schema::table('memo_test_sessions', function () {
                DB::statement('ALTER TABLE memo_test_sessions ADD CONSTRAINT memo_test_sessions_retries_check CHECK (retries >= 0)');
                DB::statement('ALTER TABLE memo_test_sessions ADD CONSTRAINT memo_test_sessions_number_of_pairs_check CHECK (number_of_pairs >= 0)');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {
        Schema::dropIfExists('memo_test_sessions');

        if (env('DB_CONNECTION') === 'pgsql') {
            Schema::table('your_table', function () {
                DB::statement('ALTER TABLE memo_test_sessions DROP CONSTRAINT memo_test_sessions_retries_check');
                DB::statement('ALTER TABLE memo_test_sessions DROP CONSTRAINT memo_test_sessions_number_of_pairs_check');
            });
        }
    }
};
