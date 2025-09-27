import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profileImage?: string;
}

export interface DisasterModule {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  phases: {
    before: {
      title: string;
      contentFocus: string;
      format: string;
      checklist: {
        id: string;
        item: string;
        completed: boolean;
      }[];
    };
    during: {
      title: string;
      contentFocus: string;
      format: string;
      steps: {
        id: string;
        step: string;
        description: string;
        animation?: string;
        location?: string;
      }[];
    };
    after: {
      title: string;
      contentFocus: string;
      format: string;
      qaItems: {
        id: string;
        question: string;
        answer: string;
        category: string;
      }[];
    };
  };
  quiz: {
    questions: {
      id: string;
      question: string;
      options: string[];
      correctAnswer: number;
      phase: 'before' | 'during' | 'after';
    }[];
  };
  drillScenarios: {
    id: string;
    scenario: string;
    location: string;
    phase: 'before' | 'during' | 'after';
    choices: {
      text: string;
      correct: boolean;
      feedback: string;
    }[];
  }[];
}

export interface StudentProgress {
  moduleId: string;
  completed: boolean;
  score: number;
  lastAccessed: string;
  timeSpent: number; // in minutes
}

const dummyUsers = [
  {
    id: 'student-1',
    name: 'Alex Johnson',
    email: 'alex.johnson@university.edu',
    role: 'student' as UserRole,
    profileImage: '/api/placeholder/100/100'
  },
  {
    id: 'student-2',
    name: 'Sarah Davis',
    email: 'sarah.davis@university.edu',
    role: 'student' as UserRole,
    profileImage: '/api/placeholder/100/100'
  },
  {
    id: 'admin-1',
    name: 'Dr. Michael Chen',
    email: 'michael.chen@university.edu',
    role: 'admin' as UserRole,
    profileImage: '/api/placeholder/100/100'
  }
];

const dummyStudentProgress: StudentProgress[] = [
  {
    moduleId: 'earthquake',
    completed: true,
    score: 95,
    lastAccessed: '2024-01-15',
    timeSpent: 45
  },
  {
    moduleId: 'fire',
    completed: true,
    score: 88,
    lastAccessed: '2024-01-12',
    timeSpent: 38
  },
  {
    moduleId: 'flood',
    completed: false,
    score: 0,
    lastAccessed: '2024-01-10',
    timeSpent: 15
  }
];

const dummyModules: DisasterModule[] = [
  {
    id: 'earthquake',
    title: 'Earthquake Safety',
    description: 'Learn how to stay safe during earthquakes with Drop, Cover, and Hold On techniques.',
    icon: '🏗️',
    color: 'primary',
    phases: {
      before: {
        title: 'Preparedness',
        contentFocus: 'Home and Campus safety checks, emergency kit contents (for a student\'s personal bag), and family communication plans',
        format: 'Interactive Checklist (Students check off items in their list)',
        checklist: [
          { id: 'kit1', item: 'Emergency water (1 gallon per person per day)', completed: false },
          { id: 'kit2', item: 'Non-perishable food for 3 days', completed: false },
          { id: 'kit3', item: 'First aid kit and medications', completed: false },
          { id: 'kit4', item: 'Flashlight and extra batteries', completed: false },
          { id: 'kit5', item: 'Battery-powered radio', completed: false },
          { id: 'kit6', item: 'Emergency contact information', completed: false },
          { id: 'kit7', item: 'Important documents (copies)', completed: false },
          { id: 'kit8', item: 'Secure heavy furniture and objects', completed: false },
          { id: 'kit9', item: 'Identify safe spots in each room', completed: false },
          { id: 'kit10', item: 'Practice family communication plan', completed: false }
        ]
      },
      during: {
        title: 'Immediate Action',
        contentFocus: 'Specific instructions based on location (e.g., in a classroom, in the library, outdoors). Focus on the "Drop, Cover, Hold On" sequence',
        format: 'Step-by-Step Animated Sequence or Micro-video',
        steps: [
          { id: 'step1', step: 'DROP', description: 'Drop to hands and knees immediately', location: 'anywhere', animation: 'drop-animation' },
          { id: 'step2', step: 'COVER', description: 'Take cover under sturdy desk/table if available', location: 'classroom, library, office', animation: 'cover-animation' },
          { id: 'step3', step: 'HOLD ON', description: 'Hold on to your shelter and protect head/neck', location: 'anywhere', animation: 'hold-animation' },
          { id: 'step4', step: 'PROTECT (if outdoors)', description: 'Cover head and neck with arms, avoid buildings/trees', location: 'outdoors', animation: 'protect-animation' },
          { id: 'step5', step: 'STAY PUT', description: 'Stay in position until shaking stops completely', location: 'anywhere', animation: 'stay-animation' }
        ]
      },
      after: {
        title: 'Post-Event Response',
        contentFocus: 'Safe evacuation procedures, using the Safety Map, first aid basics, and checking for gas leaks/hazards',
        format: 'Short Q&A section with the AI Safety Guide pre-loaded with common post-earthquake questions',
        qaItems: [
          { id: 'qa1', question: 'How do I safely evacuate after an earthquake?', answer: 'Check for injuries first, then carefully evacuate using stairs (never elevators). Watch for aftershocks and falling debris. Use handheld flashlight if needed.', category: 'evacuation' },
          { id: 'qa2', question: 'What hazards should I check for after an earthquake?', answer: 'Check for gas leaks (smell of gas), electrical damage (sparks, exposed wires), structural damage (cracks, tilting), and water line breaks. Turn off utilities if damage is suspected.', category: 'hazards' },
          { id: 'qa3', question: 'How do I use the Safety Map after an earthquake?', answer: 'Open the Safety Map to locate nearest assembly points, medical stations, and safe evacuation routes. Follow marked pathways and avoid damaged areas marked in red.', category: 'navigation' },
          { id: 'qa4', question: 'What basic first aid should I know for earthquake injuries?', answer: 'Control bleeding with direct pressure, stabilize suspected broken bones by immobilizing, treat shock by keeping person warm and calm. Call 911 for serious injuries.', category: 'first-aid' },
          { id: 'qa5', question: 'Should I expect aftershocks?', answer: 'Yes, aftershocks are common and can occur for days or weeks after the main earthquake. Be prepared to Drop, Cover, and Hold On again if you feel more shaking.', category: 'aftershocks' }
        ]
      }
    },
    quiz: {
      questions: [
        {
          id: '1',
          question: 'What should you do when the ground starts shaking?',
          options: ['Run outside immediately', 'Drop, Cover, and Hold On', 'Stand in a doorway', 'Hide under stairs'],
          correctAnswer: 1,
          phase: 'during'
        },
        {
          id: '2',
          question: 'What is the safest place during an earthquake indoors?',
          options: ['Under a desk or table', 'In a doorway', 'Against an exterior wall', 'In the center of the room'],
          correctAnswer: 0,
          phase: 'during'
        },
        {
          id: '3',
          question: 'After an earthquake stops, what should you do first?',
          options: ['Check for injuries and hazards', 'Run outside immediately', 'Use elevators to evacuate', 'Call your family'],
          correctAnswer: 0,
          phase: 'after'
        }
      ]
    },
    drillScenarios: [
      {
        id: '1',
        scenario: 'You feel the ground shaking while in your classroom. What do you do?',
        location: 'classroom',
        phase: 'during',
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
    phases: {
      before: {
        title: 'Preparedness',
        contentFocus: 'Fire prevention, escape route planning, emergency contact information, and fire safety equipment checks',
        format: 'Interactive Checklist (Students check off items in their list)',
        checklist: [
          { id: 'fire1', item: 'Know location of nearest fire exits and alternate routes', completed: false },
          { id: 'fire2', item: 'Check smoke detectors monthly (if applicable)', completed: false },
          { id: 'fire3', item: 'Keep fire extinguisher accessible and serviced', completed: false },
          { id: 'fire4', item: 'Practice family/roommate escape plan', completed: false },
          { id: 'fire5', item: 'Avoid overloading electrical outlets', completed: false },
          { id: 'fire6', item: 'Keep hallways and exits clear', completed: false },
          { id: 'fire7', item: 'Know location of fire alarms and how to activate', completed: false },
          { id: 'fire8', item: 'Store flammable materials safely', completed: false }
        ]
      },
      during: {
        title: 'Immediate Action',
        contentFocus: 'Specific instructions for fire alarm response, evacuation procedures, staying low in smoke (library, dorm, classroom)',
        format: 'Step-by-Step Animated Sequence or Micro-video',
        steps: [
          { id: 'fire-step1', step: 'ALERT', description: 'Sound the alarm if you discover fire', location: 'anywhere', animation: 'alert-animation' },
          { id: 'fire-step2', step: 'EVACUATE', description: 'Leave immediately via nearest safe exit', location: 'dorm, classroom, library', animation: 'evacuate-animation' },
          { id: 'fire-step3', step: 'STAY LOW', description: 'Crawl under smoke to avoid toxic gases', location: 'smoky areas', animation: 'crawl-animation' },
          { id: 'fire-step4', step: 'FEEL DOORS', description: 'Check doors for heat before opening', location: 'hallways', animation: 'door-check-animation' },
          { id: 'fire-step5', step: 'ASSEMBLY POINT', description: 'Go to designated meeting area outside', location: 'outdoors', animation: 'assembly-animation' }
        ]
      },
      after: {
        title: 'Post-Event Response',
        contentFocus: 'Assembly procedures, headcount reporting, first aid for burns/smoke inhalation, and avoiding re-entry',
        format: 'Short Q&A section with the AI Safety Guide pre-loaded with common post-fire questions',
        qaItems: [
          { id: 'fire-qa1', question: 'What should I do at the assembly point?', answer: 'Report to your floor warden or RA for headcount. Stay at the assembly point and do not leave until emergency services give the all-clear.', category: 'assembly' },
          { id: 'fire-qa2', question: 'How do I treat minor burns?', answer: 'Cool burns with running water for 10+ minutes, remove jewelry near burn area, cover with sterile gauze. Seek medical help immediately for severe burns.', category: 'first-aid' },
          { id: 'fire-qa3', question: 'When is it safe to re-enter the building?', answer: 'Only when fire department officials give the official all-clear. Never re-enter based on your own assessment, even if the fire appears out.', category: 'safety' },
          { id: 'fire-qa4', question: 'What if someone has smoke inhalation?', answer: 'Get them to fresh air immediately, loosen tight clothing around neck, monitor breathing closely, call 911 if breathing difficulty persists.', category: 'first-aid' }
        ]
      }
    },
    quiz: {
      questions: [
        {
          id: '1',
          question: 'If you see smoke, what should you do first?',
          options: ['Open windows for ventilation', 'Alert others immediately', 'Try to find the source', 'Call 911 first'],
          correctAnswer: 1,
          phase: 'during'
        },
        {
          id: '2',
          question: 'When evacuating during a fire, you should:',
          options: ['Use elevators for speed', 'Stay low to avoid smoke', 'Take personal belongings', 'Go back for others'],
          correctAnswer: 1,
          phase: 'during'
        },
        {
          id: '3',
          question: 'What is the correct way to use a fire extinguisher?',
          options: ['PASS - Pull, Aim, Squeeze, Sweep', 'STOP - Stop, Think, Operate, Prevent', 'FIRE - Find, Identify, Remove, Escape', 'SAFE - Secure, Alert, Fight, Exit'],
          correctAnswer: 0,
          phase: 'before'
        }
      ]
    },
    drillScenarios: [
      {
        id: '1',
        scenario: 'The fire alarm goes off in your building. What is your first action?',
        location: 'building',
        phase: 'during',
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
    phases: {
      before: {
        title: 'Preparedness',
        contentFocus: 'Emergency supplies, evacuation routes, flood insurance awareness, and communication plans',
        format: 'Interactive Checklist (Students check off items in their list)',
        checklist: [
          { id: 'flood1', item: 'Emergency water and food (3-day supply)', completed: false },
          { id: 'flood2', item: 'Battery-powered radio and flashlights', completed: false },
          { id: 'flood3', item: 'First aid kit and medications', completed: false },
          { id: 'flood4', item: 'Important documents in waterproof container', completed: false },
          { id: 'flood5', item: 'Know evacuation routes and higher ground locations', completed: false },
          { id: 'flood6', item: 'Emergency contact list', completed: false },
          { id: 'flood7', item: 'Sign up for emergency alerts', completed: false },
          { id: 'flood8', item: 'Monitor weather alerts and warnings', completed: false }
        ]
      },
      during: {
        title: 'Immediate Action',
        contentFocus: 'Specific instructions for moving to higher ground, avoiding flooded roads, never walking/driving through water',
        format: 'Step-by-Step Animated Sequence or Micro-video',
        steps: [
          { id: 'flood-step1', step: 'GET TO HIGH GROUND', description: 'Move to highest floor or elevated area immediately', location: 'anywhere', animation: 'high-ground-animation' },
          { id: 'flood-step2', step: 'AVOID WATER', description: 'Never walk through flowing water over 6 inches deep', location: 'outdoors', animation: 'avoid-water-animation' },
          { id: 'flood-step3', step: 'TURN AROUND', description: 'If driving, turn around - don\'t drown in flooded roads', location: 'vehicle', animation: 'turn-around-animation' },
          { id: 'flood-step4', step: 'CALL FOR HELP', description: 'Call 911 if trapped, signal from rooftop if possible', location: 'trapped', animation: 'signal-help-animation' },
          { id: 'flood-step5', step: 'STAY PUT', description: 'Wait for rescue if water surrounds your location', location: 'trapped', animation: 'wait-rescue-animation' }
        ]
      },
      after: {
        title: 'Post-Event Response',
        contentFocus: 'Water safety checks, avoiding flood water contamination, structural damage assessment, and health precautions',
        format: 'Short Q&A section with the AI Safety Guide pre-loaded with common post-flood questions',
        qaItems: [
          { id: 'flood-qa1', question: 'Is it safe to walk through flood water after flooding?', answer: 'No. Flood water can contain sewage, chemicals, debris, and electrical hazards. It may also be much deeper than it appears and have strong currents.', category: 'safety' },
          { id: 'flood-qa2', question: 'How do I check my home/dorm for damage?', answer: 'Wait for authorities to declare area safe. Check for structural damage, gas leaks, and electrical hazards before entering. Document damage with photos.', category: 'damage-assessment' },
          { id: 'flood-qa3', question: 'What health precautions should I take?', answer: 'Avoid contact with flood water, wash hands frequently with soap, throw out contaminated food, get medical attention for any wounds exposed to flood water.', category: 'health' },
          { id: 'flood-qa4', question: 'When can I return to my normal routine?', answer: 'Only after local authorities declare the area safe and utilities have been inspected and restored by professionals. Follow official guidance.', category: 'recovery' }
        ]
      }
    },
    quiz: {
      questions: [
        {
          id: '1',
          question: 'How much water can knock you down?',
          options: ['1 foot', '6 inches', '2 feet', '3 inches'],
          correctAnswer: 1,
          phase: 'during'
        },
        {
          id: '2',
          question: 'During a flood warning, you should:',
          options: ['Wait for more information', 'Move to higher ground', 'Stay in basement', 'Drive through flooded roads'],
          correctAnswer: 1,
          phase: 'during'
        },
        {
          id: '3',
          question: 'What should you do if caught in a flash flood while walking?',
          options: ['Move to higher ground immediately', 'Lie flat and crawl', 'Find shelter under bridges', 'Continue walking normally'],
          correctAnswer: 0,
          phase: 'during'
        }
      ]
    },
    drillScenarios: [
      {
        id: '1',
        scenario: 'You receive a flood warning alert. What should you do?',
        location: 'building',
        phase: 'before',
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

interface AppContextType {
  user: User | null;
  modules: DisasterModule[];
  studentProgress: StudentProgress[];
  users: User[];
  setUser: (user: User | null) => void;
  updateProgress: (moduleId: string, score: number) => void;
  getModuleProgress: (moduleId: string) => StudentProgress | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [studentProgress, setStudentProgress] = useState<StudentProgress[]>(dummyStudentProgress);

  const updateProgress = (moduleId: string, score: number) => {
    setStudentProgress(prev => {
      const existing = prev.find(p => p.moduleId === moduleId);
      if (existing) {
        return prev.map(p =>
          p.moduleId === moduleId
            ? { ...p, score, completed: score >= 70, lastAccessed: new Date().toISOString().split('T')[0] }
            : p
        );
      } else {
        return [...prev, {
          moduleId,
          completed: score >= 70,
          score,
          lastAccessed: new Date().toISOString().split('T')[0],
          timeSpent: 0
        }];
      }
    });
  };

  const getModuleProgress = (moduleId: string) => {
    return studentProgress.find(p => p.moduleId === moduleId);
  };

  const value: AppContextType = {
    user,
    modules: dummyModules,
    studentProgress,
    users: dummyUsers,
    setUser,
    updateProgress,
    getModuleProgress
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};