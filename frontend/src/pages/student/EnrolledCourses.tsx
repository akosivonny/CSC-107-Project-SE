import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { usePreEnrollment } from '../../contexts/PreEnrollmentContext';
import { useCourses } from '../../contexts/CourseContext';

const EnrolledCourses = () => {
  const { user } = useAuth();
  const { requests } = usePreEnrollment();
  const { courses } = useCourses();

  // Filter only approved enrollment requests for the current user
  const approvedEnrollments = requests.filter(
    req => req.email === user?.email && req.status === 'approved'
  );

  // Get the full course details for approved enrollments
  const enrolledCourses = courses.filter(course => 
    approvedEnrollments.some(enrollment => enrollment.courseId === course.id)
  );

  if (enrolledCourses.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Enrolled Courses
        </Typography>
        <Typography variant="body1" color="text.secondary">
          You are not enrolled in any courses yet.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Enrolled Courses
      </Typography>
      <Grid container spacing={3}>
        {enrolledCourses.map((course) => (
          <Grid item xs={12} sm={6} md={4} key={course.id}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={`https://source.unsplash.com/800x600/?${course.title.toLowerCase().replace(/\s+/g, '-')}`}
                alt={course.title}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {course.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {course.description}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Duration: {course.duration} weeks
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Schedule: {course.schedule}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Instructor: {course.instructor}
                    </Typography>
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    <Chip
                      label="ENROLLED"
                      color="success"
                      sx={{ mr: 1 }}
                    />
                    <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                      You are actively enrolled in this course
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default EnrolledCourses; 