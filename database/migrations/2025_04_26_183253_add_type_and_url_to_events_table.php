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
        Schema::table('events', function (Blueprint $table) {
            $table->dropColumn('imageSrc'); // On supprime l'ancienne colonne
            $table->string('url')->after('location'); // On ajoute la nouvelle colonne url
            $table->enum('type', ['image', 'video'])->after('url'); // Et le type associé
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropColumn(['url', 'type']); // En rollback, on enlève url et type
            $table->string('imageSrc')->after('location');
        });
    }
};
