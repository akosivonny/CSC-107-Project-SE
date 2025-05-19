<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Course;

class CourseSeeder extends Seeder
{
    public function run(): void
    {
        $courses = [
            [
                'name' => 'Basic Agriculture',
                'description' => 'Introduction to basic farming techniques and principles',
                'duration_weeks' => 12,
                'fee' => 5000.00,
                'capacity' => 30,
                'start_date' => '2024-06-01',
                'is_active' => true,
            ],
            [
                'name' => 'Livestock Management',
                'description' => 'Learn about animal husbandry and livestock care',
                'duration_weeks' => 16,
                'fee' => 6500.00,
                'capacity' => 25,
                'start_date' => '2024-06-15',
                'is_active' => true,
            ],
            [
                'name' => 'Organic Farming',
                'description' => 'Sustainable and organic farming practices',
                'duration_weeks' => 8,
                'fee' => 4500.00,
                'capacity' => 35,
                'start_date' => '2024-07-01',
                'is_active' => true,
            ],
        ];

        foreach ($courses as $course) {
            Course::create($course);
        }
    }
} 