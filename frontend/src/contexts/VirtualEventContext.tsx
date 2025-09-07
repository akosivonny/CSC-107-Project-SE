import React, { createContext, useContext, useEffect, useState } from 'react';

export interface TourSpot {
  id: string;
  title: string;
  description: string;
  image: string;
  details: string;
}

const initialTourSpots: TourSpot[] = [
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

interface VirtualEventContextType {
  spots: TourSpot[];
  addSpot: (spot: Omit<TourSpot, 'id'>) => void;
  editSpot: (id: string, updates: Partial<TourSpot>) => void;
  deleteSpot: (id: string) => void;
}

const VirtualEventContext = createContext<VirtualEventContextType | undefined>(undefined);

export const VirtualEventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [spots, setSpots] = useState<TourSpot[]>(() => {
    const stored = localStorage.getItem('virtualTourSpots');
    if (stored) return JSON.parse(stored);
    localStorage.setItem('virtualTourSpots', JSON.stringify(initialTourSpots));
    return initialTourSpots;
  });

  useEffect(() => {
    localStorage.setItem('virtualTourSpots', JSON.stringify(spots));
  }, [spots]);

  const addSpot = (spot: Omit<TourSpot, 'id'>) => {
    const newSpot: TourSpot = { ...spot, id: Date.now().toString() + Math.random().toString(36).substr(2, 9) };
    setSpots(prev => [...prev, newSpot]);
  };

  const editSpot = (id: string, updates: Partial<TourSpot>) => {
    setSpots(prev => prev.map(spot => spot.id === id ? { ...spot, ...updates } : spot));
  };

  const deleteSpot = (id: string) => {
    setSpots(prev => prev.filter(spot => spot.id !== id));
  };

  return (
    <VirtualEventContext.Provider value={{ spots, addSpot, editSpot, deleteSpot }}>
      {children}
    </VirtualEventContext.Provider>
  );
};

export const useVirtualEvents = () => {
  const context = useContext(VirtualEventContext);
  if (!context) throw new Error('useVirtualEvents must be used within a VirtualEventProvider');
  return context;
}; 