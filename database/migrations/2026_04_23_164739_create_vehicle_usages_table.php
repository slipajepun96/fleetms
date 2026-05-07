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
        Schema::create('vehicle_usages', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->timestamps();
            $table->foreignUuid('user_uuid');
            $table->foreignUuid('vehicle_uuid');
            $table->string('start_date');
            $table->string('end_date')->nullable();
            $table->string('actual_start_datetime')->nullable();
            $table->string('actual_end_datetime')->nullable();
            $table->string('destination');
            $table->string('purpose');
            $table->string('status')->default('active');
            $table->string('application_status')->default('pending');
            $table->foreignUuid('approver_uuid')->nullable();
            $table->string('approver_status_datetime')->nullable();
            $table->string('start_odometer')->nullable();
            $table->string('end_odometer')->nullable();
            $table->json('fuel_purchase')->nullable();
            $table->string('notes_on_return')->nullable();
            $table->string('return_datetime')->nullable();
            $table->foreignUuid('return_user_uuid')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicle_usages');
    }
};
