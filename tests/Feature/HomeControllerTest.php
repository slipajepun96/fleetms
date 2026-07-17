<?php

namespace Tests\Feature;

use App\Models\ForeignWorkerPassport;
use App\Models\MainForeignWorker;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HomeControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_saving_a_foreign_worker_creates_a_passport_linked_to_the_new_worker(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post(route('fworker.save'), [
                'fw_name' => 'John Doe',
                'fw_dob' => '1990-01-01',
                'fw_country' => 'Malaysia',
                'fw_gender' => 'male',
            ])
            ->assertRedirect(route('home'));

        $mainWorker = MainForeignWorker::where('fw_name', 'John Doe')->firstOrFail();
        $passport = ForeignWorkerPassport::where('fw_main_uuid', $mainWorker->id)->first();

        $this->assertNotNull($passport);
        $this->assertSame($mainWorker->id, $passport->fw_main_uuid);
    }
}
