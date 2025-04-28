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
        Schema::table('venues', function (Blueprint $table) {
            // Supprimer la colonne available_services
            $table->dropColumn('available_services');

            // Ajouter la nouvelle colonne availables
            $table->json('availables')->nullable(); // tu peux aussi ajuster le type de données selon tes besoins
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('venues', function (Blueprint $table) {
            // Revenir en arrière, supprimer availables et réajouter available_services
            $table->dropColumn('availables');

            // Ajouter de nouveau la colonne available_services
            $table->json('available_services')->nullable();
        });
    }
};
