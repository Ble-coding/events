<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('contacts', function (Blueprint $table) {
            $table->dropColumn('phone');

            // 2. Ajouter un nouveau champ `phones` (tableau JSON)
            $table->json('phones')->nullable();

            $table->string('text_footer')->nullable();
            $table->string('copyright')->nullable();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('contacts', function (Blueprint $table) {
            $table->string('phone')->nullable();
            $table->dropColumn('phones');
            $table->dropColumn('text_footer');
            $table->dropColumn('copyright');

        });
    }
};
