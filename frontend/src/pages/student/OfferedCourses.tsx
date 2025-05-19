import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Search as SearchIcon,
  School as SchoolIcon,
  AccessTime as TimeIcon,
  Group as GroupIcon,
  Event as EventIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useCourses } from '../../contexts/CourseContext';
import { usePreEnrollment } from '../../contexts/PreEnrollmentContext';
import { useAuth } from '../../contexts/AuthContext';
import { Course, CourseStatus } from '../../types';

interface EnrollmentFormData {
  studentId: string;
  name: string;
  email: string;
  phone: string;
  courseId: string;
}

const OfferedCourses = () => {
  const { courses } = useCourses();
  const { submitPreEnrollment, getStudentEnrollmentStatus } = usePreEnrollment();
  const { user } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [enrollmentDialog, setEnrollmentDialog] = useState<{
    open: boolean;
    course: Course | null;
  }>({ open: false, course: null });
  const [formData, setFormData] = useState<EnrollmentFormData>({
    studentId: user?.id || '',
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    courseId: '',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  // Get unique departments for filter
  const departments = Array.from(new Set(courses.map(course => course.department).filter(Boolean)));

  // Filter active courses based on search and department
  const filteredCourses = courses.filter(course => {
    const matchesSearch = 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = 
      departmentFilter === 'all' || course.department === departmentFilter;
    
    const isActive = course.status === 'active';

    return matchesSearch && matchesDepartment && isActive;
  });

  const handleEnrollmentSubmit = async () => {
    if (!enrollmentDialog.course) return;

    await submitPreEnrollment({
      ...formData,
      courseId: enrollmentDialog.course.id,
    });

    setEnrollmentDialog({ open: false, course: null });
    setFormData({
      ...formData,
      phone: '',
      courseId: '',
    });
  };

  const getEnrollmentStatus = (courseId: string) => {
    return getStudentEnrollmentStatus(user?.id || '', courseId);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Available Courses
      </Typography>

      {/* Search and Filters */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Search Courses"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Department</InputLabel>
            <Select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              label="Department"
            >
              <MenuItem value="all">All Departments</MenuItem>
              {departments.map((dept) => (
                <MenuItem key={dept} value={dept}>
                  {dept}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Course List */}
      <Grid container spacing={3}>
        {filteredCourses.map((course) => {
          const enrollmentStatus = getEnrollmentStatus(course.id);
          
          return (
            <Grid item xs={12} md={6} lg={4} key={course.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {course.title}
                  </Typography>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    {course.code}
                  </Typography>
                  
                  <Box sx={{ mt: 2, mb: 2 }}>
                    <Typography variant="body2" paragraph>
                      {course.description}
                    </Typography>
                  </Box>

                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PersonIcon fontSize="small" />
                        <Typography variant="body2">
                          Instructor: {course.instructor}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EventIcon fontSize="small" />
                        <Typography variant="body2">
                          Schedule: {course.schedule}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 2 }}>
                    <Chip
                      label={`${course.currentEnrollment}/${course.enrollmentLimit} enrolled`}
                      color={course.currentEnrollment >= course.enrollmentLimit ? 'error' : 'primary'}
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    {enrollmentStatus && (
                      <Chip
                        label={enrollmentStatus}
                        color={
                          enrollmentStatus === 'enrolled'
                            ? 'success'
                            : enrollmentStatus === 'pending'
                            ? 'warning'
                            : 'default'
                        }
                        size="small"
                      />
                    )}
                  </Box>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => setEnrollmentDialog({ open: true, course })}
                    disabled={
                      course.currentEnrollment >= course.enrollmentLimit ||
                      enrollmentStatus === 'enrolled' ||
                      enrollmentStatus === 'pending'
                    }
                  >
                    {enrollmentStatus === 'enrolled'
                      ? 'Already Enrolled'
                      : enrollmentStatus === 'pending'
                      ? 'Enrollment Pending'
                      : 'Enroll Now'}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Enrollment Dialog */}
      <Dialog
        open={enrollmentDialog.open}
        onClose={() => setEnrollmentDialog({ open: false, course: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Pre-Enrollment Form
          {enrollmentDialog.course && (
            <Typography variant="subtitle2" color="textSecondary">
              {enrollmentDialog.course.title} ({enrollmentDialog.course.code})
            </Typography>
          )}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={!!user}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={!!user}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setEnrollmentDialog({ open: false, course: null })}
          >
            Cancel
          </Button>
          <Button
            onClick={handleEnrollmentSubmit}
            variant="contained"
            color="primary"
          >
            Submit Pre-Enrollment
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default OfferedCourses; 