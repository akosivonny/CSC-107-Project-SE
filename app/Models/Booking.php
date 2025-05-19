<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'visitor_id',
        'visit_date',
        'visit_time',
        'number_of_visitors',
        'purpose',
        'status',
        'notes'
    ];

    protected $casts = [
        'visit_date' => 'date',
        'visit_time' => 'datetime:H:i'
    ];

    public function visitor()
    {
        return $this->belongsTo(Visitor::class);
    }
}
