import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Chip,
  Box,
  TextField,
  MenuItem,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  CircularProgress,
  Snackbar,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useUsers } from '../../contexts/UserContext';
import { User, UserRole } from '../../types';
import { clearAllStudentData } from '../../utils/clearData';

const UserManagement = () => {
  const { users, updateUser, deleteUser, refreshUsers } = useUsers();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<User>>({});
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  // Auto-refresh on mount and periodically
  useEffect(() => {
    refreshUsers();
    const interval = setInterval(refreshUsers, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, [refreshUsers]);

  // Manual refresh handler
  const handleRefresh = () => {
    setIsRefreshing(true);
    refreshUsers();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  // Filter users based on search term and role
  const filteredUsers = users.filter(user => {
    const matchesSearch = (
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Sort users by join date (most recent first)
  const sortedUsers = [...filteredUsers].sort(
    (a, b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime()
  );

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setEditFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      phone: user.phone,
      address: user.address,
    });
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = () => {
    if (selectedUser && editFormData) {
      updateUser(selectedUser.id, editFormData);
      setAlert({ type: 'success', message: 'User updated successfully' });
      setIsEditDialogOpen(false);
      setTimeout(() => setAlert(null), 3000);
    }
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUser(userId);
      setAlert({ type: 'success', message: 'User deleted successfully' });
      setTimeout(() => setAlert(null), 3000);
    }
  };

  const handleToggleStatus = (user: User) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    updateUser(user.id, { status: newStatus });
    setAlert({ 
      type: 'success', 
      message: `User ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully` 
    });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleClearAllStudentData = () => {
    setConfirmDialogOpen(true);
  };

  const handleConfirmClear = () => {
    const result = clearAllStudentData();
    setConfirmDialogOpen(false);
    
    setSnackbar({
      open: true,
      message: result.message,
      severity: result.success ? 'success' : 'error',
    });

    // Reload the page after successful clearing to refresh the data
    if (result.success) {
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {alert && (
        <Alert 
          severity={alert.type} 
          sx={{ mb: 2 }}
          onClose={() => setAlert(null)}
        >
          {alert.message}
        </Alert>
      )}

      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="div">
            User Management
          </Typography>
          <IconButton 
            onClick={handleRefresh} 
            disabled={isRefreshing}
            title="Refresh user list"
          >
            {isRefreshing ? (
              <CircularProgress size={24} />
            ) : (
              <RefreshIcon />
            )}
          </IconButton>
        </Box>
        
        <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
          <TextField
            label="Search Users"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ minWidth: 200 }}
          />
          <TextField
            select
            label="Filter by Role"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as UserRole | 'all')}
            size="small"
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="all">All Roles</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="student">Student</MenuItem>
            <MenuItem value="visitor">Visitor</MenuItem>
          </TextField>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Join Date</TableCell>
                <TableCell>Last Login</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => (
                  <TableRow 
                    key={user.id}
                    sx={{
                      // Highlight new users (less than 5 minutes old)
                      backgroundColor: (
                        Date.now() - new Date(user.joinDate).getTime() < 5 * 60 * 1000
                          ? 'rgba(76, 175, 80, 0.08)'
                          : 'inherit'
                      )
                    }}
                  >
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip 
                        label={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        color={
                          user.role === 'admin' 
                            ? 'error' 
                            : user.role === 'student' 
                              ? 'primary' 
                              : 'default'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.status}
                        color={user.status === 'active' ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{new Date(user.joinDate).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(user.lastLogin).toLocaleString()}</TableCell>
                    <TableCell align="right">
                      <IconButton 
                        size="small" 
                        onClick={() => handleEditClick(user)}
                        title="Edit user"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        size="small"
                        onClick={() => handleToggleStatus(user)}
                        title={user.status === 'active' ? 'Deactivate user' : 'Activate user'}
                      >
                        {user.status === 'active' ? <BlockIcon /> : <CheckCircleIcon />}
                      </IconButton>
                      <IconButton 
                        size="small"
                        onClick={() => handleDeleteUser(user.id)}
                        title="Delete user"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              {sortedUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Name"
              fullWidth
              value={editFormData.name || ''}
              onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
            />
            <TextField
              label="Email"
              fullWidth
              value={editFormData.email || ''}
              onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
            />
            <TextField
              label="Phone"
              fullWidth
              value={editFormData.phone || ''}
              onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
            />
            <TextField
              label="Address"
              fullWidth
              value={editFormData.address || ''}
              onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
            />
            <TextField
              select
              label="Role"
              fullWidth
              value={editFormData.role || ''}
              onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value as UserRole })}
            >
              <MenuItem value="student">Student</MenuItem>
              <MenuItem value="visitor">Visitor</MenuItem>
            </TextField>
            <TextField
              select
              label="Status"
              fullWidth
              value={editFormData.status || ''}
              onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value as 'active' | 'inactive' })}
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSubmit} variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
        <DialogTitle>Clear All Student Data</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to clear all student data? This action will:
          </Typography>
          <Box component="ul" sx={{ mt: 1 }}>
            <li>Delete all student accounts</li>
            <li>Remove all enrollment records</li>
            <li>Clear all student sessions</li>
          </Box>
          <Typography color="error" sx={{ mt: 2 }}>
            This action cannot be undone!
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmClear} color="error" variant="contained">
            Clear All Data
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
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
    </Container>
  );
};

export default UserManagement; 