<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\PreEnrollment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class PreEnrollmentController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'student_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'course_id' => 'required|exists:courses,id',
            'education_level' => 'required|string|max:100',
            'documents' => 'required|file|mimes:pdf,doc,docx|max:2048',
            'preferred_start_date' => 'required|date|after:today',
            'additional_notes' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $data = $request->except('documents');
            
            if ($request->hasFile('documents')) {
                $file = $request->file('documents');
                $path = $file->store('pre-enrollment-docs', 'public');
                $data['documents'] = $path;
            }

            $preEnrollment = PreEnrollment::create($data);

            return response()->json([
                'status' => 'success',
                'message' => 'Pre-enrollment submitted successfully',
                'data' => $preEnrollment
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to submit pre-enrollment',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function index()
    {
        try {
            $preEnrollments = PreEnrollment::with('course')->latest()->get();
            return response()->json([
                'status' => 'success',
                'data' => $preEnrollments
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch pre-enrollments',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $preEnrollment = PreEnrollment::with('course')->findOrFail($id);
            return response()->json([
                'status' => 'success',
                'data' => $preEnrollment
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Pre-enrollment not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:pending,approved,rejected',
            'admin_notes' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $preEnrollment = PreEnrollment::findOrFail($id);
            $preEnrollment->update($request->all());

            return response()->json([
                'status' => 'success',
                'message' => 'Pre-enrollment status updated successfully',
                'data' => $preEnrollment
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update pre-enrollment status',
                'error' => $e->getMessage()
            ], 500);
        }
    }
} 