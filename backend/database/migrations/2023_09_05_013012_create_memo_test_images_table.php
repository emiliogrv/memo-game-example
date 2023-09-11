<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void {
        Schema::create('memo_test_images', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('memo_test_id')
                  ->constrained()
                  ->onUpdate('CASCADE')
                  ->onDelete('CASCADE');

            $table->string('url');

            $table->unique(['memo_test_id', 'url']);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {
        Schema::dropIfExists('memo_test_images');
    }
};
