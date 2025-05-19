import React, { useState, useRef, useMemo } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Input,
  Tooltip,
  Paper,
  Divider,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { usePreEnrollment } from '../../contexts/PreEnrollmentContext';
import { useCourses } from '../../contexts/CourseContext';

interface EnrollmentFormData {
  firstName: string;
  lastName: string;
  suffix: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  guardianName: string;
  guardianPhone: string;
  educationalAttainment: string;
  currentSchool?: string;
  documents: {
    [key: string]: File | null;
  };
}

const initialFormData: EnrollmentFormData = {
  firstName: '',
  lastName: '',
  suffix: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  address: '',
  guardianName: '',
  guardianPhone: '',
  educationalAttainment: '',
  currentSchool: '',
  documents: {
    birthCertificate: null,
    proofOfResidency: null,
    guardianId: null,
    schoolRecords: null,
    immunizationRecords: null,
    medicalForm: null,
    applicationForm: null,
  },
};

const courseRequirements = [
  {
    id: 'birthCertificate',
    title: "Birth Certificate",
    description: "To verify age and identity",
    required: false,
    acceptedFormats: ".pdf,.jpg,.jpeg,.png"
  },
  {
    id: 'proofOfResidency',
    title: "Proof of Residency",
    description: "Utility bill, lease agreement, or similar document",
    required: false,
    acceptedFormats: ".pdf,.jpg,.jpeg,.png"
  },
  {
    id: 'guardianId',
    title: "Parent/Guardian ID",
    description: "Valid government-issued ID of parent or guardian",
    required: false,
    acceptedFormats: ".pdf,.jpg,.jpeg,.png"
  },
  {
    id: 'schoolRecords',
    title: "Previous School Records",
    description: "Report cards or transfer credentials (if transferring)",
    required: false,
    acceptedFormats: ".pdf,.doc,.docx"
  },
  {
    id: 'immunizationRecords',
    title: "Immunization Records",
    description: "Complete vaccination/immunization history",
    required: false,
    acceptedFormats: ".pdf,.jpg,.jpeg,.png"
  },
  {
    id: 'medicalForm',
    title: "Medical/Health Form",
    description: "Recent medical examination results",
    required: false,
    acceptedFormats: ".pdf"
  },
  {
    id: 'applicationForm',
    title: "Completed Application Forms",
    description: "All enrollment forms must be filled out completely",
    required: false,
    acceptedFormats: ".pdf,.doc,.docx"
  }
];

const educationLevels = [
  'Elementary',
  'Junior High School',
  'Senior High School',
  'Vocational/Technical',
  'Some College',
  'College Graduate',
  'Post Graduate',
  'Others'
];

const CourseEnrollment = () => {
  const { user } = useAuth();
  const { requests, submitPreEnrollment, getStudentEnrollmentStatus } = usePreEnrollment();
  const { courses } = useCourses();

  console.log('Current user:', user);
  console.log('All courses:', courses);
  console.log('All requests:', requests);

  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [formData, setFormData] = useState<EnrollmentFormData>(initialFormData);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formErrors, setFormErrors] = useState<Partial<EnrollmentFormData>>({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  const getCourseEnrollmentStatus = (courseId: string) => {
    if (!user?.id) return null;
    
    // First check if the user has any approved enrollments for this course
    const approvedEnrollment = requests.find(
      req => req.studentId === user.id && 
             req.courseId === courseId && 
             req.status === 'approved'
    );
    
    if (approvedEnrollment) {
      return 'approved';
    }
    
    // If not approved, get the most recent status
    return getStudentEnrollmentStatus(user.id, courseId);
  };

  // Get user's pre-enrollment requests
  const userRequests = useMemo(() => {
    if (!user) return [];
    const filteredRequests = requests.filter(req => 
      req.email === user.email && 
      req.studentId === user.id
    );
    console.log('User requests:', filteredRequests);
    return filteredRequests;
  }, [requests, user]);

  // Get enrolled courses IDs
  const enrolledCoursesIds = useMemo(() => {
    if (!user) return new Set<string>();
    const enrolledIds = new Set(
      requests
        .filter(req => 
          req.studentId === user.id && 
          req.status === 'approved'
        )
        .map(req => req.courseId)
    );
    console.log('Enrolled course IDs:', Array.from(enrolledIds));
    return enrolledIds;
  }, [requests, user]);

  // Filter out courses where the student is already enrolled
  const availableCourses = useMemo(() => {
    if (!courses || !user) return [];
    
    const filteredCourses = courses.filter(course => {
      const status = getCourseEnrollmentStatus(course.id);
      const isAvailable = course.status === 'active' && status !== 'approved';

      console.log(`Course ${course.title}:`, {
        status,
        isActive: course.status === 'active',
        isAvailable
      });

      return isAvailable;
    });

    console.log('Filtered available courses:', filteredCourses);
    return filteredCourses;
  }, [courses, user, requests, getCourseEnrollmentStatus]);

  // Calculate current enrollment counts for each course
  const courseEnrollments = useMemo(() => {
    if (!courses) return new Map<string, number>();
    
    const enrollments = new Map<string, number>();
    courses.forEach(course => {
      enrollments.set(course.title, course.currentEnrollment);
    });
    return enrollments;
  }, [courses]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleFileChange = (requirementId: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        documents: {
          ...prev.documents,
          [requirementId]: event.target.files![0]
        }
      }));
    }
  };

  const validateDocuments = () => {
    const errors: { [key: string]: string } = {};
    let isValid = true;

    // Since documents are optional, we only validate the format if a file is uploaded
    courseRequirements.forEach(req => {
      const file = formData.documents[req.id];
      if (file && !req.acceptedFormats.split(',').some(format => 
        file.name.toLowerCase().endsWith(format.toLowerCase().trim())
      )) {
        errors[req.id] = `Invalid file format. Accepted formats: ${req.acceptedFormats}`;
        isValid = false;
      }
    });

    setFormErrors(prev => ({ ...prev, ...errors }));
    return isValid;
  };

  const validateForm = () => {
    const errors: Partial<EnrollmentFormData> & { documents?: { [key: string]: string } } = {};
    let isValid = true;

    if (!formData.firstName) {
      errors.firstName = 'First name is required';
      isValid = false;
    }

    if (!formData.lastName) {
      errors.lastName = 'Last name is required';
      isValid = false;
    }

    if (!formData.email) {
      errors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Invalid email format';
      isValid = false;
    }

    if (!formData.phone) {
      errors.phone = 'Phone number is required';
      isValid = false;
    }

    if (!formData.dateOfBirth) {
      errors.dateOfBirth = 'Date of birth is required';
      isValid = false;
    }

    if (!formData.address) {
      errors.address = 'Address is required';
      isValid = false;
    }

    if (!formData.guardianName) {
      errors.guardianName = 'Guardian name is required';
      isValid = false;
    }

    if (!formData.guardianPhone) {
      errors.guardianPhone = 'Guardian phone is required';
      isValid = false;
    }

    if (!formData.educationalAttainment) {
      errors.educationalAttainment = 'Educational attainment is required';
      isValid = false;
    }

    if (formData.educationalAttainment === 'Others' && !formData.currentSchool) {
      errors.currentSchool = 'Please specify your current school or educational institution';
      isValid = false;
    }

    // Validate documents
    if (!validateDocuments()) {
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const getEnrollButtonProps = (course: typeof courses[0]) => {
    const status = getCourseEnrollmentStatus(course.id);
    const currentEnrollment = course.currentEnrollment;
    
    // First check if user is already enrolled (approved)
    if (status === 'approved') {
      return {
        disabled: true,
        label: 'Already Enrolled',
        tooltip: 'You are currently enrolled in this course',
        color: 'secondary' as const,
        hide: false,
      };
    }
    
    // Then check course capacity
    if (currentEnrollment >= course.enrollmentLimit) {
      return {
        disabled: true,
        label: 'Course Full',
        tooltip: 'This course has reached its maximum capacity',
        color: 'error' as const,
        hide: false,
      };
    }
    
    // Then check pending status
    if (status === 'pending') {
      return {
        disabled: true,
        label: 'Pending Approval',
        tooltip: 'Your enrollment request is being reviewed',
        color: 'warning' as const,
        hide: false,
      };
    }
    
    // Allow enrollment if rejected or no status
    return {
      disabled: false,
      label: 'Enroll',
      tooltip: status === 'rejected' 
        ? 'Your previous request was rejected. You can try again.'
        : 'Click to enroll in this course',
      color: 'primary' as const,
      hide: false,
    };
  };

  const handleEnrollClick = (courseId: string) => {
    const status = getCourseEnrollmentStatus(courseId);
    
    if (status === 'approved') {
      setSnackbar({
        open: true,
        message: 'You are already enrolled in this course.',
        severity: 'warning',
      });
      return;
    }

    if (status === 'pending') {
      setSnackbar({
        open: true,
        message: 'Your enrollment request for this course is still pending.',
        severity: 'warning',
      });
      return;
    }

    setSelectedCourse(courseId);
    
    // Pre-fill the form with user data if available
    if (user) {
      const nameParts = user.name ? user.name.split(' ') : ['', ''];
      setFormData(prev => ({
        ...prev,
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: user.email || '',
      }));
    }
    setDialogOpen(true);
  };

  const handleEnrollSubmit = async () => {
    if (!user || !selectedCourse) {
      setSnackbar({
        open: true,
        message: 'Unable to submit enrollment. Please try again.',
        severity: 'error',
      });
      return;
    }

    if (validateForm()) {
      try {
        const fullName = formData.suffix 
          ? `${formData.firstName} ${formData.lastName}, ${formData.suffix}`
          : `${formData.firstName} ${formData.lastName}`;

        await submitPreEnrollment({
          studentId: user.id,
          courseId: selectedCourse,
          name: fullName,
          email: formData.email,
          phone: formData.phone,
          dateOfBirth: formData.dateOfBirth,
          address: formData.address,
          guardianName: formData.guardianName,
          guardianPhone: formData.guardianPhone,
          educationalAttainment: formData.educationalAttainment === 'Others' 
            ? `Others: ${formData.currentSchool}`
            : formData.educationalAttainment,
          document: formData.documents[courseRequirements[activeStep].id] || undefined,
        });

        setSnackbar({
          open: true,
          message: 'Pre-enrollment request submitted successfully!',
          severity: 'success',
        });

        handleClose();
      } catch (error) {
        setSnackbar({
          open: true,
          message: 'Failed to submit pre-enrollment request. Please try again.',
          severity: 'error',
        });
      }
    }
  };

  const handleClose = () => {
    setDialogOpen(false);
    setFormData(initialFormData);
  };

  if (!user) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" color="text.secondary">
          Please log in to view available courses.
        </Typography>
      </Box>
    );
  }

  if (!courses || courses.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Available Courses
        </Typography>
        <Typography variant="body1" color="text.secondary">
          No courses are available at this time.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Available Courses
      </Typography>
      {availableCourses.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          No available courses for enrollment at this time. You might be enrolled in all current courses.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {availableCourses.map((course) => {
            const buttonProps = getEnrollButtonProps(course);
            
            return (
              <Grid item xs={12} sm={6} md={4} key={course.id}>
                <Card>
                  <CardMedia
                    component="img"
                    height="140"
                    image={`https://source.unsplash.com/800x600/?${encodeURIComponent(course.title.toLowerCase().replace(/\s+/g, '-'))}`}
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
                          Enrollment: {course.currentEnrollment}/{course.enrollmentLimit}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Fee: ${course.fee}
                        </Typography>
                      </Box>

                      {/* Enrollment Status Section */}
                      {getCourseEnrollmentStatus(course.id) && (
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Your Enrollment Status:
                          </Typography>
                          <Chip
                            label={getCourseEnrollmentStatus(course.id)?.toUpperCase()}
                            color={
                              getCourseEnrollmentStatus(course.id) === 'approved'
                                ? 'success'
                                : getCourseEnrollmentStatus(course.id) === 'rejected'
                                ? 'error'
                                : 'warning'
                            }
                            sx={{ 
                              mr: 1,
                              fontWeight: getCourseEnrollmentStatus(course.id) === 'approved' ? 'bold' : 'normal'
                            }}
                          />
                          {getCourseEnrollmentStatus(course.id) === 'approved' && (
                            <Typography variant="body2" color="success.main" sx={{ mt: 1, fontWeight: 'medium' }}>
                              You are currently enrolled and active in this course.
                            </Typography>
                          )}
                          {getCourseEnrollmentStatus(course.id) === 'rejected' && (
                            <Typography variant="body2" color="error.main" sx={{ mt: 1 }}>
                              Your enrollment was not approved. You may apply again.
                            </Typography>
                          )}
                          {getCourseEnrollmentStatus(course.id) === 'pending' && (
                            <Typography variant="body2" color="warning.main" sx={{ mt: 1 }}>
                              Your enrollment request is being reviewed.
                            </Typography>
                          )}
                        </Box>
                      )}

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Schedule: {course.schedule}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Instructor: {course.instructor}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Tooltip title={buttonProps.tooltip}>
                            <span>
                              <Button
                                variant="contained"
                                color={buttonProps.color}
                                disabled={buttonProps.disabled}
                                onClick={() => handleEnrollClick(course.id)}
                              >
                                {buttonProps.label}
                              </Button>
                            </span>
                          </Tooltip>
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Enrollment Form Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)} 
        maxWidth="md" 
        fullWidth
        TransitionProps={{
          onEnter: () => {
            // Check enrollment status when dialog opens
            if (selectedCourse) {
              const status = getCourseEnrollmentStatus(selectedCourse);
              if (status === 'approved' || status === 'pending') {
                setSnackbar({
                  open: true,
                  message: status === 'approved' 
                    ? 'You are already enrolled in this course.' 
                    : 'Your enrollment request for this course is still pending.',
                  severity: 'warning',
                });
                handleClose();
              }
            }
          }
        }}
      >
        <DialogTitle>
          <Typography variant="h6">Student Pre-enrollment Form</Typography>
          <Typography variant="subtitle2" color="text.secondary">
            {courses.find(c => c.id === selectedCourse)?.title}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Stepper activeStep={activeStep} orientation="vertical">
            <Step>
              <StepLabel>Personal Information</StepLabel>
              <StepContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="First Name"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      error={!!formErrors.firstName}
                      helperText={formErrors.firstName}
                      required
                      disabled={!selectedCourse || getCourseEnrollmentStatus(selectedCourse) === 'approved'}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      error={!!formErrors.lastName}
                      helperText={formErrors.lastName}
                      required
                      disabled={!selectedCourse || getCourseEnrollmentStatus(selectedCourse) === 'approved'}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Suffix (Optional)"
                      value={formData.suffix}
                      onChange={(e) => setFormData({ ...formData, suffix: e.target.value })}
                      placeholder="Jr., Sr., III, etc."
                      disabled={!selectedCourse || getCourseEnrollmentStatus(selectedCourse) === 'approved'}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      error={!!formErrors.email}
                      helperText={formErrors.email}
                      required
                      disabled={!selectedCourse || getCourseEnrollmentStatus(selectedCourse) === 'approved'}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      error={!!formErrors.phone}
                      helperText={formErrors.phone}
                      required
                      disabled={!selectedCourse || getCourseEnrollmentStatus(selectedCourse) === 'approved'}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Date of Birth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      error={!!formErrors.dateOfBirth}
                      helperText={formErrors.dateOfBirth}
                      InputLabelProps={{ shrink: true }}
                      required
                      disabled={!selectedCourse || getCourseEnrollmentStatus(selectedCourse) === 'approved'}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      error={!!formErrors.address}
                      helperText={formErrors.address}
                      multiline
                      rows={2}
                      required
                      disabled={!selectedCourse || getCourseEnrollmentStatus(selectedCourse) === 'approved'}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Guardian Name"
                      value={formData.guardianName}
                      onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                      error={!!formErrors.guardianName}
                      helperText={formErrors.guardianName}
                      required
                      disabled={!selectedCourse || getCourseEnrollmentStatus(selectedCourse) === 'approved'}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Guardian Phone"
                      value={formData.guardianPhone}
                      onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
                      error={!!formErrors.guardianPhone}
                      helperText={formErrors.guardianPhone}
                      required
                      disabled={!selectedCourse || getCourseEnrollmentStatus(selectedCourse) === 'approved'}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 3 }}>
                      Educational Background
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required error={!!formErrors.educationalAttainment}>
                      <InputLabel>Educational Attainment</InputLabel>
                      <Select
                        value={formData.educationalAttainment}
                        onChange={(e) => setFormData({ ...formData, educationalAttainment: e.target.value })}
                        label="Educational Attainment"
                        disabled={!selectedCourse || getCourseEnrollmentStatus(selectedCourse) === 'approved'}
                      >
                        <MenuItem value="">
                          <em>Select level</em>
                        </MenuItem>
                        {educationLevels.map((level) => (
                          <MenuItem key={level} value={level}>
                            {level}
                          </MenuItem>
                        ))}
                      </Select>
                      {formErrors.educationalAttainment && (
                        <FormHelperText error>
                          {formErrors.educationalAttainment}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  {formData.educationalAttainment === 'Others' && (
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Specify School/Institution"
                        value={formData.currentSchool}
                        onChange={(e) => setFormData({ ...formData, currentSchool: e.target.value })}
                        error={!!formErrors.currentSchool}
                        helperText={formErrors.currentSchool}
                        required
                        disabled={!selectedCourse || getCourseEnrollmentStatus(selectedCourse) === 'approved'}
                      />
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ mb: 2 }}>
                      <Button
                        variant="contained"
                        onClick={handleNext}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        Continue
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </StepContent>
            </Step>
            <Step>
              <StepLabel>Required Documents</StepLabel>
              <StepContent>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Document Requirements Overview
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    The following documents can be submitted as part of your enrollment application. All documents are optional but recommended for a complete application.
                  </Typography>
                  <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default', border: 1, borderColor: 'divider' }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="primary" gutterBottom>
                          Personal Documents
                        </Typography>
                        <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                          <li>
                            <Typography variant="body2">
                              Birth Certificate
                              <Typography component="span" variant="caption" color="text.secondary">
                                {' '}(for age and identity verification)
                              </Typography>
                            </Typography>
                          </li>
                          <li>
                            <Typography variant="body2">
                              Proof of Residency
                              <Typography component="span" variant="caption" color="text.secondary">
                                {' '}(utility bill or lease agreement)
                              </Typography>
                            </Typography>
                          </li>
                          <li>
                            <Typography variant="body2">
                              Parent/Guardian ID
                              <Typography component="span" variant="caption" color="text.secondary">
                                {' '}(valid government-issued ID)
                              </Typography>
                            </Typography>
                          </li>
                        </ul>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="primary" gutterBottom>
                          Educational & Health Records
                        </Typography>
                        <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                          <li>
                            <Typography variant="body2">
                              Previous School Records
                              <Typography component="span" variant="caption" color="text.secondary">
                                {' '}(report cards or credentials)
                              </Typography>
                            </Typography>
                          </li>
                          <li>
                            <Typography variant="body2">
                              Immunization Records
                              <Typography component="span" variant="caption" color="text.secondary">
                                {' '}(vaccination history)
                              </Typography>
                            </Typography>
                          </li>
                          <li>
                            <Typography variant="body2">
                              Medical/Health Form
                              <Typography component="span" variant="caption" color="text.secondary">
                                {' '}(recent examination results)
                              </Typography>
                            </Typography>
                          </li>
                          <li>
                            <Typography variant="body2">
                              Application Forms
                              <Typography component="span" variant="caption" color="text.secondary">
                                {' '}(completed enrollment forms)
                              </Typography>
                            </Typography>
                          </li>
                        </ul>
                      </Grid>
                    </Grid>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        Accepted file formats: PDF, DOC, DOCX, JPG, PNG (specific formats may vary by document type)
                      </Typography>
                    </Box>
                  </Paper>
                </Box>
                <Divider sx={{ my: 3 }} />
                <Typography variant="h6" color="primary" gutterBottom>
                  Document Upload
                </Typography>
                <Grid container spacing={2}>
                  {courseRequirements.map((req) => (
                    <Grid item xs={12} key={req.id}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          bgcolor: 'background.default',
                          border: 1,
                          borderColor: formErrors.documents?.[req.id] ? 'error.main' : 'divider'
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Typography variant="subtitle1" color="primary">
                            {req.title}
                          </Typography>
                          <Chip
                            label="Optional"
                            size="small"
                            color="default"
                            variant="outlined"
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {req.description}
                        </Typography>
                        <input
                          type="file"
                          id={`file-${req.id}`}
                          style={{ display: 'none' }}
                          onChange={handleFileChange(req.id)}
                          accept={req.acceptedFormats}
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Button
                            variant="outlined"
                            onClick={() => document.getElementById(`file-${req.id}`)?.click()}
                            disabled={!selectedCourse || getCourseEnrollmentStatus(selectedCourse) === 'approved'}
                          >
                            {formData.documents[req.id] ? 'Change File' : 'Upload File'}
                          </Button>
                          {formData.documents[req.id] instanceof File && (
                            <Typography variant="body2" color="text.secondary">
                              Selected: {formData.documents[req.id]?.name || ''}
                            </Typography>
                          )}
                        </Box>
                        {formErrors.documents?.[req.id] && (
                          <Typography variant="caption" color="error">
                            {formErrors.documents[req.id]}
                          </Typography>
                        )}
                      </Paper>
                    </Grid>
                  ))}
                  <Grid item xs={12}>
                    <Box sx={{ mb: 2 }}>
                      <Button
                        onClick={handleBack}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        Back
                      </Button>
                      <Button
                        variant="contained"
                        onClick={handleEnrollSubmit}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        Submit Pre-enrollment
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </StepContent>
            </Step>
          </Stepper>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CourseEnrollment; 