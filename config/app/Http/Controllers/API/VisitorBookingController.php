<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Visitor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class VisitorBookingController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'visit_date' => 'required|date|after:today',
            'visit_time' => 'required',
            'group_size' => 'required|integer|min:1|max:50',
            'purpose' => 'required|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $visitor = Visitor::create($request->all());

            return response()->json([
                'status' => 'success',
                'message' => 'Booking created successfully',
                'data' => $visitor
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create booking',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function index()
    {
        try {
            $bookings = Visitor::latest()->get();
            return response()->json([
                'status' => 'success',
                'data' => $bookings
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch bookings',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $booking = Visitor::findOrFail($id);
            return response()->json([
                'status' => 'success',
                'data' => $booking
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Booking not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }
} 