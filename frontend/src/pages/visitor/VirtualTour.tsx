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

interface TourSpot {
  id: string;
  title: string;
  description: string;
  image: string;
  details: string;
}

const tourSpots: TourSpot[] = [
  {
    id: '1',
    title: 'Organic Vegetable Garden',
    description: 'Explore our sustainable organic vegetable gardens where we grow seasonal produce.',
    image: 'https://source.unsplash.com/800x600/?organic,garden',
    details: 'Our organic vegetable garden spans over 2 acres and features more than 30 different varieties of vegetables. We use companion planting techniques and natural pest control methods to ensure healthy crop growth.',
  },
  {
    id: '2',
    title: 'Livestock Area',
    description: 'Visit our ethically managed livestock facilities and learn about animal care.',
    image: 'https://source.unsplash.com/800x600/?farm,livestock',
    details: 'Our livestock area houses free-range chickens, grass-fed cattle, and heritage breed pigs. All animals are raised following humane farming practices with plenty of space to roam.',
  },
  {
    id: '3',
    title: 'Greenhouse Complex',
    description: 'Discover our modern greenhouse facilities where we cultivate year-round crops.',
    image: 'https://source.unsplash.com/800x600/?greenhouse',
    details: 'The greenhouse complex uses advanced climate control systems and hydroponics to grow vegetables and herbs throughout the year. We also use it as a nursery for starting new plants.',
  },
  {
    id: '4',
    title: 'Composting Station',
    description: 'Learn about our sustainable waste management and composting practices.',
    image: 'https://source.unsplash.com/800x600/?compost',
    details: 'Our composting station processes farm waste into nutrient-rich soil amendments. We use both traditional composting methods and vermicomposting to create high-quality fertilizer.',
  },
  {
    id: '5',
    title: 'Farm Market',
    description: 'Visit our on-site market where we sell fresh produce and farm products.',
    image: 'https://source.unsplash.com/800x600/?farmers-market',
    details: 'The farm market offers freshly harvested produce, eggs, honey, and other farm products. We also feature products from other local farmers and artisans.',
  },
  {
    id: '6',
    title: 'Educational Center',
    description: 'Explore our educational facilities where we host workshops and training sessions.',
    image: 'https://source.unsplash.com/800x600/?classroom,farm',
    details: 'The educational center includes a classroom, demonstration kitchen, and hands-on learning areas. We offer regular workshops on farming, cooking, and sustainable living.',
  },
];

const VirtualTour = () => {
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
        {tourSpots.map((spot) => (
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