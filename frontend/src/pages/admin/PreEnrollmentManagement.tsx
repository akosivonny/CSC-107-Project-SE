import React, { useState } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  IconButton,
  Grid,
  Tooltip,
  Alert,
  Snackbar,
  Link,
  Divider,
} from '@mui/material';
import {
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  PersonRemove as UnenrollIcon,
} from '@mui/icons-material';
import { usePreEnrollment } from '../../contexts/PreEnrollmentContext';
import { useCourses } from '../../contexts/CourseContext';

const PreEnrollmentManagement = () => {
  const { requests, updateEnrollmentStatus, deleteEnrollment, unenrollStudent } = usePreEnrollment();
  const { courses } = useCourses();
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [unenrollDialogOpen, setUnenrollDialogOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [documentPreviewOpen, setDocumentPreviewOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning',
  });

  const handleViewDetails = (request: any) => {
    setSelectedRequest(request);
    setDetailsOpen(true);
  };

  const handleApproveClick = (request: any) => {
    setSelectedRequest(request);
    setApproveDialogOpen(true);
  };

  const handleConfirmApprove = async () => {
    if (!selectedRequest) return;

    try {
      await updateEnrollmentStatus(selectedRequest.id, 'approved', feedback);
      setSnackbar({
        open: true,
        message: 'Enrollment request approved successfully',
        severity: 'success',
      });
      setApproveDialogOpen(false);
      setDetailsOpen(false);
      setFeedback('');
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to approve enrollment request',
        severity: 'error',
      });
    }
  };

  const handleReject = (request: any) => {
    setSelectedRequest(request);
    setRejectDialogOpen(true);
  };

  const handleConfirmReject = async () => {
    if (!selectedRequest) return;

    try {
      await updateEnrollmentStatus(selectedRequest.id, 'rejected');
      setSnackbar({
        open: true,
        message: 'Enrollment request rejected',
        severity: 'info',
      });
      setRejectDialogOpen(false);
      setDetailsOpen(false);
      setRejectionReason('');
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to reject enrollment request',
        severity: 'error',
      });
    }
  };

  const handleDelete = (request: any) => {
    setSelectedRequest(request);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedRequest) return;

    try {
      deleteEnrollment(selectedRequest.id);
      setSnackbar({
        open: true,
        message: 'Enrollment record deleted successfully',
        severity: 'success',
      });
      setDeleteDialogOpen(false);
      setDetailsOpen(false);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to delete enrollment record',
        severity: 'error',
      });
    }
  };

  const handleUnenroll = (request: any) => {
    setSelectedRequest(request);
    setUnenrollDialogOpen(true);
  };

  const handleConfirmUnenroll = async () => {
    if (!selectedRequest) return;

    try {
      unenrollStudent(selectedRequest.id);
      setSnackbar({
        open: true,
        message: 'Student unenrolled successfully',
        severity: 'success',
      });
      setUnenrollDialogOpen(false);
      setDetailsOpen(false);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to unenroll student',
        severity: 'error',
      });
    }
  };

  const getStatusChip = (status: string) => {
    const statusConfig = {
      pending: { color: 'warning' as const, label: 'PENDING' },
      approved: { color: 'success' as const, label: 'APPROVED' },
      rejected: { color: 'error' as const, label: 'REJECTED' },
    };
    const defaultStatus = { color: 'default' as const, label: status.toUpperCase() };
    return statusConfig[status as keyof typeof statusConfig] || defaultStatus;
  };

  const handleDownloadDocument = (document: { name: string; url: string }) => {
    // Create a temporary link element
    const link = window.document.createElement('a');
    link.href = document.url;
    link.download = document.name;
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
  };

  const handleViewDocument = (document: { url: string }) => {
    setDocumentPreviewOpen(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Pre-enrollment Management
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student Name</TableCell>
              <TableCell>Course</TableCell>
              <TableCell>Submission Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>{request.name}</TableCell>
                <TableCell>
                  {courses.find(c => c.id === request.courseId)?.title || request.courseId}
                </TableCell>
                <TableCell>
                  {new Date(request.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Chip {...getStatusChip(request.status)} />
                </TableCell>
                <TableCell>
                  <Tooltip title="View Details">
                    <IconButton onClick={() => handleViewDetails(request)} size="small">
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                  {request.status === 'pending' && (
                    <>
                      <Tooltip title="Approve">
                        <IconButton
                          onClick={() => handleApproveClick(request)}
                          color="success"
                          size="small"
                        >
                          <ApproveIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Reject">
                        <IconButton
                          onClick={() => handleReject(request)}
                          color="error"
                          size="small"
                        >
                          <RejectIcon />
                        </IconButton>
                      </Tooltip>
                    </>
                  )}
                  {request.status === 'approved' && (
                    <Tooltip title="Unenroll Student">
                      <IconButton
                        onClick={() => handleUnenroll(request)}
                        color="warning"
                        size="small"
                      >
                        <UnenrollIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title="Delete Record">
                    <IconButton
                      onClick={() => handleDelete(request)}
                      color="error"
                      size="small"
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

      {/* Details Dialog */}
      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography variant="h6">Enrollment Request Details</Typography>
          <Chip 
            {...getStatusChip(selectedRequest?.status || 'pending')} 
            sx={{ mt: 1 }} 
          />
        </DialogTitle>
        <DialogContent>
          {selectedRequest && (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Student Information</Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Full Name</Typography>
                <Typography variant="body1" gutterBottom>{selectedRequest.name}</Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Email</Typography>
                <Typography variant="body1" gutterBottom>{selectedRequest.email}</Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Phone</Typography>
                <Typography variant="body1" gutterBottom>{selectedRequest.phone}</Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Date of Birth</Typography>
                <Typography variant="body1" gutterBottom>
                  {new Date(selectedRequest.dateOfBirth).toLocaleDateString()}
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle2">Address</Typography>
                <Typography variant="body1" gutterBottom>{selectedRequest.address}</Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Guardian Information</Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Guardian Name</Typography>
                <Typography variant="body1" gutterBottom>{selectedRequest.guardianName}</Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Guardian Phone</Typography>
                <Typography variant="body1" gutterBottom>{selectedRequest.guardianPhone}</Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Course Information</Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle2">Selected Course</Typography>
                <Typography variant="body1" gutterBottom>
                  {courses.find(c => c.id === selectedRequest.courseId)?.title || selectedRequest.courseId}
                </Typography>
              </Grid>

              {selectedRequest.document && (
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Documents</Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="subtitle2">
                      Submitted Document: {selectedRequest.document.name}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        startIcon={<VisibilityIcon />}
                        onClick={() => handleViewDocument(selectedRequest.document!)}
                        variant="outlined"
                        size="small"
                      >
                        View
                      </Button>
                      <Button
                        startIcon={<DownloadIcon />}
                        onClick={() => handleDownloadDocument(selectedRequest.document!)}
                        variant="outlined"
                        size="small"
                      >
                        Download
                      </Button>
                    </Box>
                  </Box>
                </Grid>
              )}

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Submission Details</Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Submission Date</Typography>
                <Typography variant="body1" gutterBottom>
                  {new Date(selectedRequest.createdAt).toLocaleString()}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Last Updated</Typography>
                <Typography variant="body1" gutterBottom>
                  {new Date(selectedRequest.updatedAt).toLocaleString()}
                </Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)}>Close</Button>
          {selectedRequest?.status === 'pending' && (
            <>
              <Button
                onClick={() => handleApproveClick(selectedRequest)}
                variant="contained"
                color="success"
              >
                Approve
              </Button>
              <Button
                onClick={() => handleReject(selectedRequest)}
                variant="contained"
                color="error"
              >
                Reject
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onClose={() => setRejectDialogOpen(false)}>
        <DialogTitle>Reject Enrollment Request</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Reason for Rejection"
            fullWidth
            multiline
            rows={4}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmReject} color="error" variant="contained">
            Confirm Reject
          </Button>
        </DialogActions>
      </Dialog>

      {/* Approve Dialog */}
      <Dialog open={approveDialogOpen} onClose={() => setApproveDialogOpen(false)}>
        <DialogTitle>Approve Enrollment Request</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Feedback for Student (Optional)"
            fullWidth
            multiline
            rows={4}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Add any additional information or instructions for the student..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApproveDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmApprove} color="success" variant="contained">
            Approve Enrollment
          </Button>
        </DialogActions>
      </Dialog>

      {/* Document Preview Dialog */}
      <Dialog
        open={documentPreviewOpen}
        onClose={() => setDocumentPreviewOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          Document Preview
          <Typography variant="subtitle2" color="text.secondary">
            {selectedRequest?.document?.name}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ width: '100%', height: '80vh' }}>
            <iframe
              src={selectedRequest?.document?.url}
              style={{ width: '100%', height: '100%', border: 'none' }}
              title="Document Preview"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDocumentPreviewOpen(false)}>Close</Button>
          <Button
            startIcon={<DownloadIcon />}
            onClick={() => handleDownloadDocument(selectedRequest?.document!)}
            variant="contained"
          >
            Download
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Enrollment Record</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this enrollment record? This action cannot be undone.
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            Note: If the student is currently enrolled, this will also remove them from the course.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete Record
          </Button>
        </DialogActions>
      </Dialog>

      {/* Unenroll Confirmation Dialog */}
      <Dialog open={unenrollDialogOpen} onClose={() => setUnenrollDialogOpen(false)}>
        <DialogTitle>Unenroll Student</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to unenroll this student from the course?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            The enrollment record will be marked as rejected, and the student will need to re-enroll to join the course again.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUnenrollDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmUnenroll} color="warning" variant="contained">
            Unenroll Student
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PreEnrollmentManagement; 