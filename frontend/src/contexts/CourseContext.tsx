import React, { createContext, useContext, useState, useEffect } from 'react';
import { Course, CourseStatus } from '../types';

interface CourseContextType {
  courses: Course[];
  addCourse: (course: Omit<Course, 'id' | 'currentEnrollment' | 'createdAt' | 'updatedAt'>) => void;
  updateCourse: (id: string, course: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  getCourseById: (id: string) => Course | undefined;
  toggleCourseStatus: (id: string) => void;
  updateEnrollmentCount: (courseId: string, increment: boolean) => void;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

// Initialize courses from localStorage
const initializeCourses = () => {
  const savedCourses = localStorage.getItem('courses');
  if (savedCourses) {
    // Deep clone the saved courses when retrieving from localStorage
    return JSON.parse(savedCourses).map((course: Course) => ({
      ...JSON.parse(JSON.stringify(course))
    }));
  }

  // Default courses if none exist
  const defaultCourses: Omit<Course, 'id' | 'currentEnrollment' | 'createdAt' | 'updatedAt'>[] = [
    {
      code: "AGR101",
      title: "Sustainable Farming Practices",
      description: "Learn the fundamentals of sustainable agriculture, including crop rotation, natural pest control, and organic farming methods.",
      department: "Agriculture",
      instructor: "Dr. Sarah Green",
      duration: 12,
      schedule: "Monday, Wednesday 9:00 AM - 11:00 AM",
      enrollmentLimit: 25,
      units: 3,
      fee: 5500,
      startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      status: "active"
    },
    {
      code: "LVS201",
      title: "Livestock Management",
      description: "Comprehensive course on animal husbandry, health management, and sustainable livestock practices.",
      department: "Animal Science",
      instructor: "Prof. James Miller",
      duration: 16,
      schedule: "Tuesday, Thursday 10:00 AM - 12:00 PM",
      enrollmentLimit: 20,
      units: 4,
      fee: 6000,
      startDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
      status: "active"
    },
    {
      code: "HYD301",
      title: "Advanced Hydroponics",
      description: "Master modern hydroponic systems, nutrient management, and controlled environment agriculture.",
      department: "Horticulture",
      instructor: "Dr. Emily Chen",
      duration: 10,
      schedule: "Wednesday, Friday 2:00 PM - 4:00 PM",
      enrollmentLimit: 15,
      units: 3,
      fee: 7000,
      startDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
      status: "active"
    },
    {
      code: "AGT401",
      title: "Agricultural Technology",
      description: "Explore modern farming technologies including IoT sensors, automation systems, and precision agriculture.",
      department: "AgTech",
      instructor: "Prof. Michael Torres",
      duration: 14,
      schedule: "Monday, Thursday 1:00 PM - 3:00 PM",
      enrollmentLimit: 20,
      units: 4,
      fee: 7500,
      startDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString(),
      status: "active"
    },
    {
      code: "SOM201",
      title: "Soil Management",
      description: "Study soil composition, fertility management, and conservation techniques for optimal crop production.",
      department: "Agriculture",
      instructor: "Dr. Robert Brown",
      duration: 12,
      schedule: "Tuesday, Friday 11:00 AM - 1:00 PM",
      enrollmentLimit: 25,
      units: 3,
      fee: 5000,
      startDate: new Date(Date.now() + 42 * 24 * 60 * 60 * 1000).toISOString(),
      status: "active"
    },
    {
      code: "PRM301",
      title: "Permaculture Design",
      description: "Learn to design sustainable agricultural ecosystems that mimic natural patterns.",
      department: "Sustainable Agriculture",
      instructor: "Prof. Lisa Wong",
      duration: 16,
      schedule: "Monday, Wednesday 3:00 PM - 5:00 PM",
      enrollmentLimit: 20,
      units: 4,
      fee: 6500,
      startDate: new Date(Date.now() + 49 * 24 * 60 * 60 * 1000).toISOString(),
      status: "active"
    },
    {
      code: "AQA201",
      title: "Aquaculture Systems",
      description: "Comprehensive study of fish farming, aquaponic systems, and sustainable water management.",
      department: "Aquaculture",
      instructor: "Dr. John Martinez",
      duration: 14,
      schedule: "Thursday, Friday 9:00 AM - 11:00 AM",
      enrollmentLimit: 18,
      units: 3,
      fee: 6800,
      startDate: new Date(Date.now() + 56 * 24 * 60 * 60 * 1000).toISOString(),
      status: "active"
    },
    {
      code: "BUS301",
      title: "Farm Business Management",
      description: "Learn financial planning, marketing strategies, and business operations for agricultural enterprises.",
      department: "Agricultural Business",
      instructor: "Prof. Amanda Clark",
      duration: 12,
      schedule: "Tuesday, Thursday 2:00 PM - 4:00 PM",
      enrollmentLimit: 30,
      units: 3,
      fee: 5800,
      startDate: new Date(Date.now() + 63 * 24 * 60 * 60 * 1000).toISOString(),
      status: "active"
    },
    {
      code: "ORG401",
      title: "Organic Certification",
      description: "Understanding organic standards, certification processes, and compliance requirements.",
      department: "Certification",
      instructor: "Dr. William Parker",
      duration: 8,
      schedule: "Wednesday, Friday 10:00 AM - 12:00 PM",
      enrollmentLimit: 25,
      units: 2,
      fee: 4500,
      startDate: new Date(Date.now() + 70 * 24 * 60 * 60 * 1000).toISOString(),
      status: "active"
    },
    {
      code: "RNE301",
      title: "Renewable Energy in Agriculture",
      description: "Explore solar, wind, and biogas energy solutions for sustainable farm operations.",
      department: "Agricultural Engineering",
      instructor: "Prof. David Kim",
      duration: 10,
      schedule: "Monday, Thursday 11:00 AM - 1:00 PM",
      enrollmentLimit: 20,
      units: 3,
      fee: 6200,
      startDate: new Date(Date.now() + 77 * 24 * 60 * 60 * 1000).toISOString(),
      status: "active"
    },
    {
      code: "WTR201",
      title: "Water Resource Management",
      description: "Study irrigation systems, water conservation, and sustainable water use in agriculture.",
      department: "Agriculture",
      instructor: "Dr. Rachel Waters",
      duration: 12,
      schedule: "Tuesday, Friday 1:00 PM - 3:00 PM",
      enrollmentLimit: 25,
      units: 3,
      fee: 5500,
      startDate: new Date(Date.now() + 84 * 24 * 60 * 60 * 1000).toISOString(),
      status: "active"
    },
    {
      code: "MKT401",
      title: "Agricultural Marketing",
      description: "Learn modern marketing strategies, digital presence, and direct-to-consumer sales for farm products.",
      department: "Agricultural Business",
      instructor: "Prof. Thomas Anderson",
      duration: 10,
      schedule: "Wednesday, Thursday 3:00 PM - 5:00 PM",
      enrollmentLimit: 30,
      units: 3,
      fee: 5800,
      startDate: new Date(Date.now() + 91 * 24 * 60 * 60 * 1000).toISOString(),
      status: "active"
    }
  ];

  // Create courses with all required fields
  const initializedCourses = defaultCourses.map(course => ({
    ...course,
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    currentEnrollment: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }));

  // Save to localStorage
  localStorage.setItem('courses', JSON.stringify(initializedCourses));
  return initializedCourses;
};

export const CourseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>(initializeCourses);

  // Persist courses to localStorage
  useEffect(() => {
    localStorage.setItem('courses', JSON.stringify(courses));
  }, [courses]);

  const addCourse = (courseData: Omit<Course, 'id' | 'currentEnrollment' | 'createdAt' | 'updatedAt'>) => {
    const newCourse: Course = {
      ...JSON.parse(JSON.stringify(courseData)), // Deep clone the course data
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      currentEnrollment: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setCourses(prevCourses => [...prevCourses.map(course => ({ ...course })), newCourse]);
  };

  const updateCourse = (id: string, courseData: Partial<Course>) => {
    setCourses(prevCourses => {
      return prevCourses.map(course => {
        if (course.id !== id) {
          return { ...course }; // Create a new reference for each course
        }
        
        // For the course being updated, create a completely new object
        const updatedCourse = {
          ...course,                     // Start with existing course data
          ...JSON.parse(JSON.stringify(courseData)), // Deep clone the updates
          id: course.id,                 // Preserve original ID
          currentEnrollment: course.currentEnrollment,  // Preserve enrollment
          createdAt: course.createdAt,   // Preserve creation date
          updatedAt: new Date().toISOString(), // Update timestamp
        };
        
        return updatedCourse;
      });
    });
  };

  const deleteCourse = (id: string) => {
    setCourses(prevCourses => prevCourses.filter(course => course.id !== id));
  };

  const getCourseById = (id: string) => {
    return courses.find(course => course.id === id);
  };

  const toggleCourseStatus = (id: string) => {
    setCourses(prevCourses => {
      const courseIndex = prevCourses.findIndex(c => c.id === id);
      if (courseIndex === -1) return prevCourses;

      const updatedCourses = [...prevCourses];
      const oldCourse = prevCourses[courseIndex];
      
      updatedCourses[courseIndex] = {
        ...oldCourse,
        status: oldCourse.status === 'active' ? 'inactive' : 'active',
        updatedAt: new Date().toISOString(),
      };

      return updatedCourses;
    });
  };

  const updateEnrollmentCount = (courseId: string, increment: boolean) => {
    setCourses(prevCourses => {
      return prevCourses.map(course => {
        // Only update the specific course's enrollment count
        if (course.id !== courseId) {
          return course; // Return the original course object for other courses
        }
        
        // Calculate new enrollment count
        const newEnrollment = increment 
          ? Math.min(course.currentEnrollment + 1, course.enrollmentLimit)
          : Math.max(course.currentEnrollment - 1, 0);
        
        // Only update if the enrollment count actually changes
        if (newEnrollment === course.currentEnrollment) {
          return course;
        }
        
        // Return updated course with new enrollment count
        return {
          ...course,
          currentEnrollment: newEnrollment,
          updatedAt: new Date().toISOString(),
        };
      });
    });
  };

  return (
    <CourseContext.Provider
      value={{
        courses,
        addCourse,
        updateCourse,
        deleteCourse,
        getCourseById,
        toggleCourseStatus,
        updateEnrollmentCount,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};

export const useCourses = () => {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error('useCourses must be used within a CourseProvider');
  }
  return context;
}; 