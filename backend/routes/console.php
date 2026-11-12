<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Har 15 ya 30 minute mein command chalane ke liye
// Schedule::command('app:cleanup-pending-orders')->everyThirtyMinutes();
Schedule::command('app:cleanup-pending-orders')->everyMinute();