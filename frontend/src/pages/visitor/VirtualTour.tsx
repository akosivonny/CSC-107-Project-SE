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
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { useVirtualEvents, TourSpot } from '../../contexts/VirtualEventContext';

const VirtualTour = () => {
  const { spots } = useVirtualEvents();
  const [selectedSpot, setSelectedSpot] = useState<TourSpot | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSpotClick = (spot: TourSpot) => {
    setSelectedSpot(spot);
    setDialogOpen(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Virtual Farm Tour
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Explore our farm facilities and learn about our sustainable farming practices through this virtual tour.
      </Typography>

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
    </Box>
  );
};

export default VirtualTour; 