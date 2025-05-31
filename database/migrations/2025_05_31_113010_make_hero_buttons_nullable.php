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
        Schema::table('heroes', function (Blueprint $table) {
            $table->string('button2_text')->nullable()->change();
            $table->string('button2_href')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('heroes', function (Blueprint $table) {
            $table->string('button2_text')->nullable(false)->change();
            $table->string('button2_href')->nullable(false)->change();
        });
    }
};
