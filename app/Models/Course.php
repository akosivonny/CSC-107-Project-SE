<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Course extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'duration_weeks',
        'fee',
        'capacity',
        'start_date',
        'is_active'
    ];

    protected $casts = [
        'start_date' => 'date',
        'is_active' => 'boolean',
        'fee' => 'decimal:2'
    ];

    public function preEnrollments()
    {
        return $this->hasMany(PreEnrollment::class);
    }

    public function students()
    {
        return $this->belongsToMany(Student::class, 'pre_enrollments');
    }
}
