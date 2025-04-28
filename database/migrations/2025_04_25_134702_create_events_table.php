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
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('date');
            $table->string('location');
            $table->string('imageSrc');
            $table->text('description');
            $table->json('schedule')->nullable();
            $table->json('highlights')->nullable();
            $table->boolean('isActive')->default(true);
            $table->softDeletes();  // Ajoute le support de soft deletes
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
