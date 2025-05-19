import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Chip,
  Tooltip,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Block as BlockIcon,
  CheckCircle as ActiveIcon,
} from '@mui/icons-material';
import { useCourses } from '../../contexts/CourseContext';
import { usePreEnrollment } from '../../contexts/PreEnrollmentContext';
import { Course, CourseStatus } from '../../types';

interface CourseFormData {
  code: string;
  title: string;
  description: string;
  department?: string;
  instructor?: string;
  duration: number;
  schedule?: string;
  enrollmentLimit: number;
  units?: number;
  fee: number;
  startDate: string;
}

const initialFormData: CourseFormData = {
  code: '',
  title: '',
  description: '',
  department: '',
  instructor: '',
  duration: 8,
  schedule: '',
  enrollmentLimit: 30,
  units: 3,
  fee: 5000,
  startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
};

const CourseManagement = () => {
  const { courses, addCourse, updateCourse, deleteCourse, toggleCourseStatus } = useCourses();
  const { requests } = usePreEnrollment();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | CourseStatus>('all');
  const [formData, setFormData] = useState<CourseFormData>(initialFormData);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
  const [enrolledStudentsDialog, setEnrolledStudentsDialog] = useState<{
    open: boolean;
    courseId: string | null;
  }>({ open: false, courseId: null });

  // Get unique departments for filter
  const departments = Array.from(new Set(courses.map(course => course.department).filter(Boolean)));

  // Filter courses based on search and filters
  const filteredCourses = courses.filter(course => {
    const matchesSearch = 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = 
      departmentFilter === 'all' || course.department === departmentFilter;
    
    const matchesStatus = 
      statusFilter === 'all' || course.status === statusFilter;

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const handleSubmit = () => {
    if (editingCourse) {
      // When editing, create a specific update object with only the changed fields
      const updatedCourse = {
        code: formData.code,
        title: formData.title,
        description: formData.description,
        department: formData.department,
        instructor: formData.instructor,
        duration: formData.duration,
        schedule: formData.schedule,
        enrollmentLimit: formData.enrollmentLimit,
        units: formData.units,
        fee: formData.fee,
        startDate: formData.startDate
      };

      // Only update the specific course by its ID
      updateCourse(editingCourse.id, {
        ...updatedCourse,
        status: editingCourse.status // Preserve the current status
      });
    } else {
      // When adding a new course
      addCourse({
        ...formData,
        status: 'active'
      });
    }
    handleClose();
  };

  const handleClose = () => {
    setDialogOpen(false);
    setEditingCourse(null);
    setFormData(initialFormData);
  };

  const handleEdit = (course: Course) => {
    // Store the course being edited
    setEditingCourse(course);
    
    // Set form data with exact values from the course
    setFormData({
      code: course.code,
      title: course.title,
      description: course.description,
      department: course.department || '',
      instructor: course.instructor || '',
      duration: course.duration,
      schedule: course.schedule || '',
      enrollmentLimit: course.enrollmentLimit,
      units: course.units || 3,
      fee: course.fee,
      startDate: course.startDate
    });
    setDialogOpen(true);
  };

  const getEnrolledStudents = (courseId: string) => {
    return requests.filter(
      request => request.courseId === courseId && request.status === 'approved'
    );
  };

  const getPendingStudents = (courseId: string) => {
    return requests.filter(
      request => request.courseId === courseId && request.status === 'pending'
    );
  };

  const handleDeleteClick = (course: Course) => {
    setCourseToDelete(course);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (courseToDelete) {
      deleteCourse(courseToDelete.id);
      setDeleteDialogOpen(false);
      setCourseToDelete(null);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Course Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialogOpen(true)}
        >
          Add New Course
        </Button>
      </Box>

      {/* Search and Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
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
          <Grid item xs={12} md={4}>
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
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | CourseStatus)}
                label="Status"
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Course List */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Instructor</TableCell>
              <TableCell>Enrollment</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCourses.map((course) => (
              <TableRow key={course.id}>
                <TableCell>{course.code}</TableCell>
                <TableCell>{course.title}</TableCell>
                <TableCell>{course.department}</TableCell>
                <TableCell>{course.instructor}</TableCell>
                <TableCell>
                  {course.currentEnrollment}/{course.enrollmentLimit}
                </TableCell>
                <TableCell>
                  <Chip
                    label={course.status}
                    color={course.status === 'active' ? 'success' : 'default'}
                  />
                </TableCell>
                <TableCell>
                  <Tooltip title="View Enrolled Students">
                    <IconButton
                      onClick={() =>
                        setEnrolledStudentsDialog({ open: true, courseId: course.id })
                      }
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit Course">
                    <IconButton onClick={() => handleEdit(course)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={course.status === 'active' ? 'Deactivate' : 'Activate'}>
                    <IconButton onClick={() => toggleCourseStatus(course.id)}>
                      {course.status === 'active' ? <BlockIcon /> : <ActiveIcon />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Course">
                    <IconButton 
                      onClick={() => handleDeleteClick(course)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Course Dialog */}
      <Dialog open={dialogOpen} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingCourse ? 'Edit Course' : 'Add New Course'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Course Code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Course Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                multiline
                rows={3}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Instructor"
                value={formData.instructor}
                onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Duration (weeks)"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Schedule"
                value={formData.schedule}
                onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Enrollment Limit"
                value={formData.enrollmentLimit}
                onChange={(e) =>
                  setFormData({ ...formData, enrollmentLimit: parseInt(e.target.value) })
                }
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Units"
                value={formData.units}
                onChange={(e) =>
                  setFormData({ ...formData, units: parseInt(e.target.value) })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Course Fee"
                value={formData.fee}
                onChange={(e) => setFormData({ ...formData, fee: parseFloat(e.target.value) })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Start Date"
                value={formData.startDate.split('T')[0]}
                onChange={(e) => setFormData({ ...formData, startDate: new Date(e.target.value).toISOString() })}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingCourse ? 'Update Course' : 'Add Course'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Enrolled Students Dialog */}
      <Dialog
        open={enrolledStudentsDialog.open}
        onClose={() => setEnrolledStudentsDialog({ open: false, courseId: null })}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Enrolled Students
          {enrolledStudentsDialog.courseId && (
            <Typography variant="subtitle2" color="textSecondary">
              {courses.find(c => c.id === enrolledStudentsDialog.courseId)?.title}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent>
          <Typography variant="h6" gutterBottom>
            Approved Enrollments
          </Typography>
          <List>
            {enrolledStudentsDialog.courseId &&
              getEnrolledStudents(enrolledStudentsDialog.courseId).map((student) => (
                <ListItem key={student.id}>
                  <ListItemText
                    primary={student.name}
                    secondary={`Email: ${student.email} | Phone: ${student.phone}`}
                  />
                </ListItem>
              ))}
          </List>

          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Pending Enrollments
          </Typography>
          <List>
            {enrolledStudentsDialog.courseId &&
              getPendingStudents(enrolledStudentsDialog.courseId).map((student) => (
                <ListItem key={student.id}>
                  <ListItemText
                    primary={student.name}
                    secondary={`Email: ${student.email} | Phone: ${student.phone}`}
                  />
                </ListItem>
              ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEnrolledStudentsDialog({ open: false, courseId: null })}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirm Delete Course</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the course "{courseToDelete?.title}"? This action cannot be undone.
          </Typography>
          {courseToDelete && courseToDelete.currentEnrollment > 0 && (
            <Typography color="error" sx={{ mt: 2 }}>
              Warning: This course has {courseToDelete.currentEnrollment} enrolled students.
              Deleting it will remove all enrollment records.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete Course
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CourseManagement; 