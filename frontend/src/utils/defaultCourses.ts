import { Course } from '../types';

export const defaultCourses: Omit<Course, 'id' | 'currentEnrollment' | 'createdAt' | 'updatedAt'>[] = [
  {
    code: 'AGR101',
    title: 'Sustainable Farming Practices',
    description: 'Learn sustainable farming methods including crop rotation, natural pest control, and soil management techniques.',
    department: 'Agriculture',
    instructor: 'Dr. Sarah Johnson',
    status: 'active',
    duration: 8,
    schedule: 'MWF 9:00 AM - 11:00 AM',
    enrollmentLimit: 30,
    fee: 5000,
    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    units: 3,
    syllabus: `Week 1-2: Introduction to Sustainable Agriculture
Week 3-4: Soil Health and Management
Week 5-6: Natural Pest Control Methods
Week 7-8: Water Conservation and Management`,
  },
  {
    code: 'AGR102',
    title: 'Organic Crop Management',
    description: 'Master organic farming techniques, certification requirements, and market strategies for organic produce.',
    department: 'Agriculture',
    instructor: 'Prof. Michael Chen',
    status: 'active',
    duration: 6,
    schedule: 'TTH 1:00 PM - 3:00 PM',
    enrollmentLimit: 25,
    fee: 4500,
    startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    units: 3,
    syllabus: `Week 1-2: Organic Farming Principles
Week 3-4: Certification Process
Week 5-6: Marketing Organic Produce`,
  },
  {
    code: 'AGR103',
    title: 'Livestock Management',
    description: 'Comprehensive course on livestock care, breeding, health management, and sustainable practices.',
    department: 'Animal Science',
    instructor: 'Dr. Emily Rodriguez',
    status: 'active',
    duration: 10,
    schedule: 'MWF 2:00 PM - 4:00 PM',
    enrollmentLimit: 20,
    fee: 6000,
    startDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    units: 4,
    syllabus: `Week 1-2: Introduction to Animal Husbandry
Week 3-4: Nutrition and Feed Management
Week 5-6: Health and Disease Prevention
Week 7-8: Breeding Programs
Week 9-10: Sustainable Practices`,
  },
  {
    code: 'AGR104',
    title: 'Agricultural Technology',
    description: 'Explore modern farming technologies including IoT, automation, data analytics, and precision agriculture.',
    department: 'Agricultural Technology',
    instructor: 'Prof. James Wilson',
    status: 'active',
    duration: 12,
    schedule: 'TTH 10:00 AM - 12:00 PM',
    enrollmentLimit: 30,
    fee: 7000,
    startDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
    units: 4,
    syllabus: `Week 1-3: Introduction to AgTech
Week 4-6: IoT in Agriculture
Week 7-9: Data Analytics
Week 10-12: Precision Farming`,
  },
  {
    code: 'AGR105',
    title: 'Hydroponics and Vertical Farming',
    description: 'Learn modern soilless growing techniques, vertical farming systems, and urban agriculture methods for maximum yield in minimal space.',
    department: 'Agricultural Innovation',
    instructor: 'Dr. Lisa Chen',
    status: 'active',
    duration: 8,
    schedule: 'TTH 2:00 PM - 4:00 PM',
    enrollmentLimit: 25,
    fee: 5500,
    startDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString(),
    units: 3,
    syllabus: `Week 1-2: Introduction to Hydroponics
Week 3-4: Vertical Farming Systems
Week 5-6: Nutrient Management
Week 7-8: Commercial Applications`,
  },
  {
    code: 'AGR106',
    title: 'Permaculture Design',
    description: 'Master the principles of permaculture design, sustainable ecosystems, and regenerative agriculture practices.',
    department: 'Sustainable Agriculture',
    instructor: 'Prof. David Miller',
    status: 'active',
    duration: 10,
    schedule: 'MWF 1:00 PM - 3:00 PM',
    enrollmentLimit: 30,
    fee: 6000,
    startDate: new Date(Date.now() + 42 * 24 * 60 * 60 * 1000).toISOString(),
    units: 4,
    syllabus: `Week 1-2: Permaculture Principles
Week 3-4: Site Analysis and Design
Week 5-6: Water Management
Week 7-8: Food Forest Design
Week 9-10: Implementation Strategies`,
  },
  {
    code: 'AGR107',
    title: 'Beekeeping and Apiculture',
    description: 'Comprehensive training in beekeeping, honey production, and pollination management for agricultural success.',
    department: 'Animal Science',
    instructor: 'Dr. Sarah Thompson',
    status: 'active',
    duration: 6,
    schedule: 'TTH 9:00 AM - 11:00 AM',
    enrollmentLimit: 20,
    fee: 4800,
    startDate: new Date(Date.now() + 49 * 24 * 60 * 60 * 1000).toISOString(),
    units: 3,
    syllabus: `Week 1-2: Bee Biology and Behavior
Week 3-4: Hive Management
Week 5-6: Honey Production and Processing`,
  },
  {
    code: 'AGR108',
    title: 'Agricultural Economics',
    description: 'Study of economic principles applied to agriculture, farm management, market analysis, and agricultural policy.',
    department: 'Agricultural Business',
    instructor: 'Prof. Robert Chang',
    status: 'active',
    duration: 12,
    schedule: 'MWF 10:00 AM - 12:00 PM',
    enrollmentLimit: 35,
    fee: 5800,
    startDate: new Date(Date.now() + 56 * 24 * 60 * 60 * 1000).toISOString(),
    units: 4,
    syllabus: `Week 1-3: Basic Economic Principles
Week 4-6: Farm Business Management
Week 7-9: Market Analysis
Week 10-12: Agricultural Policy`,
  },
  {
    code: 'AGR109',
    title: 'Greenhouse Management',
    description: 'Learn to manage greenhouse operations, climate control systems, and year-round crop production techniques.',
    department: 'Horticulture',
    instructor: 'Dr. Maria Garcia',
    status: 'active',
    duration: 8,
    schedule: 'TTH 3:00 PM - 5:00 PM',
    enrollmentLimit: 25,
    fee: 5200,
    startDate: new Date(Date.now() + 63 * 24 * 60 * 60 * 1000).toISOString(),
    units: 3,
    syllabus: `Week 1-2: Greenhouse Structures
Week 3-4: Environmental Control
Week 5-6: Crop Management
Week 7-8: Pest and Disease Control`,
  },
  {
    code: 'AGR110',
    title: 'Soil Science and Conservation',
    description: 'In-depth study of soil properties, fertility management, and conservation practices for sustainable agriculture.',
    department: 'Agriculture',
    instructor: 'Dr. James Wilson',
    status: 'active',
    duration: 10,
    schedule: 'MWF 8:00 AM - 10:00 AM',
    enrollmentLimit: 30,
    fee: 5500,
    startDate: new Date(Date.now() + 70 * 24 * 60 * 60 * 1000).toISOString(),
    units: 4,
    syllabus: `Week 1-2: Soil Formation and Properties
Week 3-4: Soil Chemistry
Week 5-6: Fertility Management
Week 7-8: Erosion Control
Week 9-10: Conservation Practices`,
  },
  {
    code: 'AGR111',
    title: 'Agricultural Water Management',
    description: 'Study of irrigation systems, water conservation techniques, and sustainable water management practices in agriculture.',
    department: 'Agricultural Engineering',
    instructor: 'Prof. Michael Brown',
    status: 'active',
    duration: 8,
    schedule: 'TTH 11:00 AM - 1:00 PM',
    enrollmentLimit: 25,
    fee: 5300,
    startDate: new Date(Date.now() + 77 * 24 * 60 * 60 * 1000).toISOString(),
    units: 3,
    syllabus: `Week 1-2: Irrigation Systems
Week 3-4: Water Quality Management
Week 5-6: Drainage Systems
Week 7-8: Water Conservation`,
  },
  {
    code: 'AGR112',
    title: 'Farm Machinery and Automation',
    description: 'Comprehensive overview of modern farm machinery, automation systems, and precision farming equipment.',
    department: 'Agricultural Engineering',
    instructor: 'Dr. Thomas Anderson',
    status: 'active',
    duration: 10,
    schedule: 'MWF 3:00 PM - 5:00 PM',
    enrollmentLimit: 20,
    fee: 6500,
    startDate: new Date(Date.now() + 84 * 24 * 60 * 60 * 1000).toISOString(),
    units: 4,
    syllabus: `Week 1-2: Tractor Systems
Week 3-4: Planting Equipment
Week 5-6: Harvesting Technology
Week 7-8: Precision Agriculture
Week 9-10: Maintenance and Safety`,
  }
]; 