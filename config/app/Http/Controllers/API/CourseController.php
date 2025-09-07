<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CourseController extends Controller
{
    public function index()
    {
        try {
            $courses = Course::with('preEnrollments')->get();
            return response()->json([
                'status' => 'success',
                'data' => $courses
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch courses',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'duration' => 'required|integer|min:1',
            'duration_unit' => 'required|in:days,weeks,months',
            'price' => 'required|numeric|min:0',
            'capacity' => 'required|integer|min:1',
            'start_date' => 'required|date|after:today',
            'status' => 'required|in:active,inactive,full'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $course = Course::create($request->all());
            return response()->json([
                'status' => 'success',
                'message' => 'Course created successfully',
                'data' => $course
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create course',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        try {
            $course = Course::with('preEnrollments')->findOrFail($id);
            return response()->json([
                'status' => 'success',
                'data' => $course
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Course not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'duration' => 'sometimes|required|integer|min:1',
            'duration_unit' => 'sometimes|required|in:days,weeks,months',
            'price' => 'sometimes|required|numeric|min:0',
            'capacity' => 'sometimes|required|integer|min:1',
            'start_date' => 'sometimes|required|date|after:today',
            'status' => 'sometimes|required|in:active,inactive,full'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $course = Course::findOrFail($id);
            $course->update($request->all());

            return response()->json([
                'status' => 'success',
                'message' => 'Course updated successfully',
                'data' => $course
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update course',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $course = Course::findOrFail($id);
            $course->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'Course deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete course',
                'error' => $e->getMessage()
            ], 500);
        }
    }
} 