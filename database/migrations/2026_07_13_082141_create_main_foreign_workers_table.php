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
        Schema::create('main_foreign_workers', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->timestamps();
            $table->string('fw_name');
            $table->string('fw_dob');
            $table->string('fw_country');
            $table->string('fw_gender');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('main_foreign_workers');
    }
};
