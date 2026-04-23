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
        Schema::create('vehicles', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->timestamps();
            $table->string('plateNum');
            $table->string('vehicle_manufacturer');
            $table->string('vehicle_model');
            $table->string('insurance_expiry');
            $table->string('roadtax_expiry');
            
            $table->string('vehicle_type');
            $table->string('designated_person')->nullable();
            $table->string('owner_entity');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicles');
    }
};
