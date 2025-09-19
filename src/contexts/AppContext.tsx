import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  role: 'student' | 'admin';
  email: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  preparednessScore: number;
  completedModules: string[];
  quizScores: { [moduleId: string]: number };
}

export interface DisasterModule {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  quiz: {
    questions: {
      id: string;
      question: string;
      options: string[];
      correctAnswer: number;
    }[];
  };
  drillScenarios: {
    id: string;
    scenario: string;
    choices: {
      text: string;
      correct: boolean;
      feedback: string;
    }[];
  }[];
}

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  showLogin: boolean;
  setShowLogin: (show: boolean) => void;
  students: Student[];
  modules: DisasterModule[];
  drillActive: boolean;
  setDrillActive: (active: boolean) => void;
  triggerSOS: () => void;
  updateStudentScore: (studentId: string, moduleId: string, score: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// Dummy data
const dummyStudents: Student[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex@school.edu',
    preparednessScore: 85,
    completedModules: ['earthquake', 'fire'],
    quizScores: { earthquake: 90, fire: 80 }
  },
  {
    id: '2',
    name: 'Sam Davis',
    email: 'sam@school.edu',
    preparednessScore: 72,
    completedModules: ['earthquake'],
    quizScores: { earthquake: 72 }
  },
  {
    id: '3',
    name: 'Jordan Lee',
    email: 'jordan@school.edu',
    preparednessScore: 95,
    completedModules: ['earthquake', 'fire', 'flood'],
    quizScores: { earthquake: 100, fire: 90, flood: 95 }
  }
];

const dummyModules: DisasterModule[] = [
  {
    id: 'earthquake',
    title: 'Earthquake Safety',
    description: 'Learn how to stay safe during earthquakes with Drop, Cover, and Hold On techniques.',
    icon: '🏗️',
    color: 'primary',
    quiz: {
      questions: [
        {
          id: '1',
          question: 'What should you do when the ground starts shaking?',
          options: ['Run outside immediately', 'Drop, Cover, and Hold On', 'Stand in a doorway', 'Hide under stairs'],
          correctAnswer: 1
        },
        {
          id: '2',
          question: 'What is the safest place during an earthquake indoors?',
          options: ['Under a desk or table', 'In a doorway', 'Against an exterior wall', 'In the center of the room'],
          correctAnswer: 0
        }
      ]
    },
    drillScenarios: [
      {
        id: '1',
        scenario: 'You feel the ground shaking while in your classroom. What do you do?',
        choices: [
          {
            text: 'Drop under your desk immediately',
            correct: true,
            feedback: 'Correct! Drop, Cover, and Hold On is the right response.'
          },
          {
            text: 'Run to the exit',
            correct: false,
            feedback: 'Incorrect. Moving during shaking increases injury risk. Drop where you are!'
          }
        ]
      }
    ]
  },
  {
    id: 'fire',
    title: 'Fire Emergency',
    description: 'Master fire safety protocols, evacuation routes, and prevention techniques.',
    icon: '🔥',
    color: 'emergency',
    quiz: {
      questions: [
        {
          id: '1',
          question: 'If you see smoke, what should you do first?',
          options: ['Open windows for ventilation', 'Alert others immediately', 'Try to find the source', 'Call 911 first'],
          correctAnswer: 1
        },
        {
          id: '2',
          question: 'When evacuating during a fire, you should:',
          options: ['Use elevators for speed', 'Stay low to avoid smoke', 'Take personal belongings', 'Go back for others'],
          correctAnswer: 1
        }
      ]
    },
    drillScenarios: [
      {
        id: '1',
        scenario: 'The fire alarm goes off in your building. What is your first action?',
        choices: [
          {
            text: 'Stop what you\'re doing and evacuate via nearest exit',
            correct: true,
            feedback: 'Perfect! Always treat fire alarms seriously and evacuate immediately.'
          },
          {
            text: 'Finish your current task first',
            correct: false,
            feedback: 'Never delay evacuation! Every second counts in fire emergencies.'
          }
        ]
      }
    ]
  },
  {
    id: 'flood',
    title: 'Flood Response',
    description: 'Understand flood risks, evacuation procedures, and water safety measures.',
    icon: '🌊',
    color: 'accent',
    quiz: {
      questions: [
        {
          id: '1',
          question: 'How much water can knock you down?',
          options: ['1 foot', '6 inches', '2 feet', '3 inches'],
          correctAnswer: 1
        },
        {
          id: '2',
          question: 'During a flood warning, you should:',
          options: ['Wait for more information', 'Move to higher ground', 'Stay in basement', 'Drive through flooded roads'],
          correctAnswer: 1
        }
      ]
    },
    drillScenarios: [
      {
        id: '1',
        scenario: 'You receive a flood warning alert. What should you do?',
        choices: [
          {
            text: 'Move to the highest floor available',
            correct: true,
            feedback: 'Excellent! Moving to higher ground is the safest approach.'
          },
          {
            text: 'Stay on the ground floor to monitor the situation',
            correct: false,
            feedback: 'Dangerous! Always move to higher ground when flooding is possible.'
          }
        ]
      }
    ]
  }
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [students] = useState<Student[]>(dummyStudents);
  const [modules] = useState<DisasterModule[]>(dummyModules);
  const [drillActive, setDrillActive] = useState(false);

  const triggerSOS = () => {
    console.log('🚨 SOS TRIGGERED! Emergency alert sent to all administrators.');
    alert('SOS Alert Sent! Emergency services and school administrators have been notified.');
  };

  const updateStudentScore = (studentId: string, moduleId: string, score: number) => {
    console.log(`Student ${studentId} scored ${score} on module ${moduleId}`);
  };

  return (
    <AppContext.Provider value={{
      user,
      setUser,
      showLogin,
      setShowLogin,
      students,
      modules,
      drillActive,
      setDrillActive,
      triggerSOS,
      updateStudentScore
    }}>
      {children}
    </AppContext.Provider>
  );
};