// Admin Virtual Event Management Page
// This page allows admins to view and (in the future) manage all virtual tour spots. It reuses the visitor VirtualTour logic.
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Info as InfoIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useVirtualEvents, TourSpot } from '../../contexts/VirtualEventContext';

const VirtualEvent = () => {
  const { spots, addSpot, editSpot, deleteSpot } = useVirtualEvents();
  const [selectedSpot, setSelectedSpot] = useState<TourSpot | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editSpotState, setEditSpotState] = useState<TourSpot | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [spotToDelete, setSpotToDelete] = useState<TourSpot | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newSpot, setNewSpot] = useState<Omit<TourSpot, 'id'>>({ title: '', description: '', image: '', details: '' });

  const handleSpotClick = (spot: TourSpot) => {
    setSelectedSpot(spot);
    setDialogOpen(true);
  };

  const handleEditClick = (spot: TourSpot) => {
    setEditSpotState(spot);
    setEditDialogOpen(true);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editSpotState) return;
    setEditSpotState({ ...editSpotState, [e.target.name]: e.target.value });
  };

  const handleEditSave = () => {
    if (!editSpotState) return;
    editSpot(editSpotState.id, editSpotState);
    setEditDialogOpen(false);
  };

  const handleDeleteClick = (spot: TourSpot) => {
    setSpotToDelete(spot);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!spotToDelete) return;
    deleteSpot(spotToDelete.id);
    setDeleteDialogOpen(false);
    setSpotToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSpotToDelete(null);
  };

  const handleCreateOpen = () => {
    setNewSpot({ title: '', description: '', image: '', details: '' });
    setCreateDialogOpen(true);
  };

  const handleCreateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewSpot({ ...newSpot, [e.target.name]: e.target.value });
  };

  const handleCreateSave = () => {
    if (!newSpot.title.trim()) return;
    addSpot(newSpot);
    setCreateDialogOpen(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Virtual Event Management
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Manage all virtual tour spots for the farm. (You can now edit, delete, and create spots.)
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button variant="contained" color="primary" onClick={handleCreateOpen}>
          Create New Event
        </Button>
      </Box>

      <Grid container spacing={3}>
        {spots.map((spot) => (
          <Grid item xs={12} sm={6} md={4} key={spot.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="200"
                image={spot.image}
                alt={spot.title}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {spot.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {spot.description}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<InfoIcon />}
                    onClick={() => handleSpotClick(spot)}
                  >
                    Learn More
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<PlayIcon />}
                    onClick={() => handleSpotClick(spot)}
                  >
                    View Tour
                  </Button>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                  <Button size="small" color="primary" startIcon={<EditIcon />} onClick={() => handleEditClick(spot)}>
                    Edit
                  </Button>
                  <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => handleDeleteClick(spot)}>
                    Delete
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Tour Spot Detail Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedSpot && (
          <>
            <DialogTitle>{selectedSpot.title}</DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 2 }}>
                <img
                  src={selectedSpot.image}
                  alt={selectedSpot.title}
                  style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                />
              </Box>
              <Typography variant="body1" paragraph>
                {selectedSpot.details}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                Note: This is a virtual tour preview. For a real visit, please use our booking system.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Edit Spot Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Virtual Event Spot</DialogTitle>
        <DialogContent>
          {editSpotState && (
            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField
                label="Title"
                name="title"
                value={editSpotState.title}
                onChange={handleEditChange}
                fullWidth
              />
              <TextField
                label="Description"
                name="description"
                value={editSpotState.description}
                onChange={handleEditChange}
                fullWidth
                multiline
                minRows={2}
              />
              <TextField
                label="Image URL"
                name="image"
                value={editSpotState.image}
                onChange={handleEditChange}
                fullWidth
              />
              <TextField
                label="Details"
                name="details"
                value={editSpotState.details}
                onChange={handleEditChange}
                fullWidth
                multiline
                minRows={3}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained" color="primary">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete Virtual Event Spot</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this spot?</Typography>
          <Typography variant="subtitle1" color="error" sx={{ mt: 1 }}>
            {spotToDelete?.title}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Create New Event Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Virtual Event Spot</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Title"
              name="title"
              value={newSpot.title}
              onChange={handleCreateChange}
              fullWidth
            />
            <TextField
              label="Description"
              name="description"
              value={newSpot.description}
              onChange={handleCreateChange}
              fullWidth
              multiline
              minRows={2}
            />
            <TextField
              label="Image URL"
              name="image"
              value={newSpot.image}
              onChange={handleCreateChange}
              fullWidth
            />
            <TextField
              label="Details"
              name="details"
              value={newSpot.details}
              onChange={handleCreateChange}
              fullWidth
              multiline
              minRows={3}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateSave} variant="contained" color="primary">Create</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VirtualEvent; 