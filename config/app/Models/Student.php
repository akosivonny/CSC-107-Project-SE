<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Student extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'address',
        'date_of_birth',
        'guardian_name',
        'guardian_phone',
        'status'
    ];

    protected $casts = [
        'date_of_birth' => 'date'
    ];

    public function preEnrollments()
    {
        return $this->hasMany(PreEnrollment::class);
    }

    public function courses()
    {
        return $this->belongsToMany(Course::class, 'pre_enrollments');
    }
}
