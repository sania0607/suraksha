import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/FixedAppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Book, 
  Play, 
  Clock, 
  Award,
  CheckCircle,
  Lock,
  Waves,
  Flame,
  Wind,
  Mountain,
  Zap,
  Snowflake
} from 'lucide-react';

interface DisasterModule {
  id: string;
  title: string;
  type: 'earthquake' | 'flood' | 'fire' | 'cyclone' | 'landslide' | 'thunderstorm' | 'heatwave';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in minutes
  lessons: number;
  description: string;
  objectives: string[];
  prerequisites?: string[];
  isUnlocked: boolean;
  progress: number; // percentage
  rating: number;
  enrolledStudents: number;
  icon: React.ComponentType<any>;
  color: string;
  gradientFrom: string;
  gradientTo: string;
}

const MultiDisasterModules = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const navigate = useNavigate();

  const disasterModules: DisasterModule[] = [
    // Core Earthquake Module (from original modules)
    {
      id: 'earthquake-safety',
      title: 'Earthquake Safety & Response',
      type: 'earthquake' as any,
      difficulty: 'beginner',
      duration: 60,
      lessons: 8,
      description: 'Master comprehensive earthquake preparedness, response, and recovery procedures. The foundation of disaster preparedness.',
      objectives: [
        'Understand earthquake science and prediction',
        'Execute Drop, Cover, Hold technique perfectly',
        'Create family emergency earthquake plans',
        'Practice safe evacuation procedures',
        'Learn post-earthquake recovery and assessment'
      ],
      prerequisites: [],
      isUnlocked: true,
      progress: 75,
      rating: 4.9,
      enrolledStudents: 567,
      icon: Mountain,
      color: 'text-orange-600',
      gradientFrom: 'from-orange-500',
      gradientTo: 'to-red-500'
    },
    {
      id: 'flood-safety',
      title: 'Flood Safety & Response',
      type: 'flood',
      difficulty: 'beginner',
      duration: 45,
      lessons: 6,
      description: 'Learn comprehensive flood preparedness, response tactics, and recovery procedures for Indian monsoon conditions.',
      objectives: [
        'Understand flood formation and warning systems',
        'Create family emergency flood plans',
        'Practice water safety and evacuation techniques',
        'Learn post-flood recovery and health precautions'
      ],
      prerequisites: [],
      isUnlocked: true,
      progress: 0,
      rating: 4.6,
      enrolledStudents: 342,
      icon: Waves,
      color: 'text-blue-600',
      gradientFrom: 'from-blue-500',
      gradientTo: 'to-cyan-500'
    },
    {
      id: 'fire-prevention',
      title: 'Fire Prevention & Evacuation',
      type: 'fire',
      difficulty: 'intermediate',
      duration: 50,
      lessons: 7,
      description: 'Master fire prevention, detection, response, and safe evacuation procedures for buildings and homes.',
      objectives: [
        'Identify fire hazards and prevention methods',
        'Understand fire behavior and spread patterns',
        'Practice proper evacuation procedures',
        'Learn fire extinguisher usage and first aid'
      ],
      prerequisites: ['earthquake-basic'],
      isUnlocked: true,
      progress: 25,
      rating: 4.8,
      enrolledStudents: 298,
      icon: Flame,
      color: 'text-red-600',
      gradientFrom: 'from-red-500',
      gradientTo: 'to-orange-500'
    },
    {
      id: 'cyclone-preparedness',
      title: 'Cyclone & Storm Preparedness',
      type: 'cyclone',
      difficulty: 'advanced',
      duration: 60,
      lessons: 8,
      description: 'Comprehensive training for cyclone preparedness, especially relevant for coastal regions of India.',
      objectives: [
        'Understand cyclone formation and tracking',
        'Prepare homes and communities for storms',
        'Learn wind and flood protection strategies',
        'Practice emergency communication during storms'
      ],
      prerequisites: ['flood-safety', 'fire-prevention'],
      isUnlocked: false,
      progress: 0,
      rating: 4.7,
      enrolledStudents: 156,
      icon: Wind,
      color: 'text-gray-600',
      gradientFrom: 'from-gray-500',
      gradientTo: 'to-blue-600'
    },
    {
      id: 'landslide-awareness',
      title: 'Landslide Awareness & Safety',
      type: 'landslide',
      difficulty: 'intermediate',
      duration: 40,
      lessons: 5,
      description: 'Essential knowledge for landslide-prone areas, particularly relevant for hill stations and mountainous regions.',
      objectives: [
        'Recognize landslide warning signs',
        'Understand slope stability and triggers',
        'Practice evacuation from hillside areas',
        'Learn post-landslide safety measures'
      ],
      prerequisites: ['earthquake-basic'],
      isUnlocked: true,
      progress: 0,
      rating: 4.4,
      enrolledStudents: 87,
      icon: Mountain,
      color: 'text-brown-600',
      gradientFrom: 'from-amber-600',
      gradientTo: 'to-orange-700'
    },
    {
      id: 'thunderstorm-safety',
      title: 'Thunderstorm & Lightning Safety',
      type: 'thunderstorm',
      difficulty: 'beginner',
      duration: 30,
      lessons: 4,
      description: 'Learn to stay safe during thunderstorms, lightning strikes, and severe weather conditions.',
      objectives: [
        'Understand thunderstorm formation and dangers',
        'Learn lightning safety rules and myths',
        'Practice indoor and outdoor safety measures',
        'Create thunderstorm emergency plans'
      ],
      prerequisites: [],
      isUnlocked: true,
      progress: 80,
      rating: 4.5,
      enrolledStudents: 445,
      icon: Zap,
      color: 'text-yellow-600',
      gradientFrom: 'from-yellow-400',
      gradientTo: 'to-orange-500'
    },
    {
      id: 'heatwave-protection',
      title: 'Heatwave & Heat Illness Prevention',
      type: 'heatwave',
      difficulty: 'beginner',
      duration: 35,
      lessons: 5,
      description: 'Crucial for Indian summers - learn to prevent heat-related illnesses and stay safe in extreme temperatures.',
      objectives: [
        'Recognize heat illness symptoms and treatment',
        'Learn hydration and cooling strategies',
        'Understand heat vulnerability factors',
        'Create heat emergency action plans'
      ],
      prerequisites: [],
      isUnlocked: true,
      progress: 60,
      rating: 4.3,
      enrolledStudents: 234,
      icon: Snowflake,
      color: 'text-orange-600',
      gradientFrom: 'from-orange-400',
      gradientTo: 'to-red-500'
    }
  ];

  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800'
  };

  const categories = [
    { id: 'all', name: 'All Modules', count: disasterModules.length },
    { id: 'earthquake', name: 'Earthquake', count: disasterModules.filter(m => m.type === 'earthquake').length },
    { id: 'flood', name: 'Flood Safety', count: disasterModules.filter(m => m.type === 'flood').length },
    { id: 'fire', name: 'Fire Safety', count: disasterModules.filter(m => m.type === 'fire').length },
    { id: 'cyclone', name: 'Storm Safety', count: disasterModules.filter(m => m.type === 'cyclone').length },
    { id: 'landslide', name: 'Landslide', count: disasterModules.filter(m => m.type === 'landslide').length },
    { id: 'thunderstorm', name: 'Lightning', count: disasterModules.filter(m => m.type === 'thunderstorm').length },
    { id: 'heatwave', name: 'Heat Safety', count: disasterModules.filter(m => m.type === 'heatwave').length }
  ];

  const filteredModules = disasterModules.filter(module => {
    const categoryMatch = selectedCategory === 'all' || module.type === selectedCategory;
    const difficultyMatch = selectedDifficulty === 'all' || module.difficulty === selectedDifficulty;
    return categoryMatch && difficultyMatch;
  });

  const completedModules = disasterModules.filter(m => m.progress === 100).length;
  const inProgressModules = disasterModules.filter(m => m.progress > 0 && m.progress < 100).length;
  const totalProgress = Math.round(disasterModules.reduce((sum, module) => sum + module.progress, 0) / disasterModules.length);

  const startModule = (moduleId: string) => {
    // Navigate to the specific module detail page
    navigate(`/student/modules/${moduleId}`);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-sm ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
        ★
      </span>
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-6 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Disaster Preparedness Modules</h1>
            <p className="text-green-100 mt-1">Master essential emergency response skills through interactive learning modules</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{totalProgress}%</div>
            <div className="text-sm text-green-100">Overall Progress</div>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{disasterModules.length}</div>
            <div className="text-sm text-gray-600">Total Modules</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{completedModules}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">{inProgressModules}</div>
            <div className="text-sm text-gray-600">In Progress</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">{totalProgress}%</div>
            <div className="text-sm text-gray-600">Overall Progress</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Category Filter */}
            <div className="flex-1">
              <h3 className="font-semibold mb-3">Filter by Disaster Type</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className="text-sm"
                  >
                    {category.name}
                    <Badge variant="secondary" className="ml-2">
                      {category.count}
                    </Badge>
                  </Button>
                ))}
              </div>
            </div>

            {/* Difficulty Filter */}
            <div>
              <h3 className="font-semibold mb-3">Difficulty Level</h3>
              <div className="flex gap-2">
                {['all', 'beginner', 'intermediate', 'advanced'].map((level) => (
                  <Button
                    key={level}
                    variant={selectedDifficulty === level ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedDifficulty(level)}
                    className="capitalize text-sm"
                  >
                    {level}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModules.map((module) => {
          const IconComponent = module.icon;
          return (
            <Card key={module.id} className={`relative overflow-hidden hover:shadow-xl transition-shadow ${!module.isUnlocked ? 'opacity-75' : ''}`}>
              {/* Header with gradient background */}
              <div className={`bg-gradient-to-r ${module.gradientFrom} ${module.gradientTo} text-white p-6`}>
                <div className="flex items-center justify-between mb-4">
                  <IconComponent className="w-8 h-8" />
                  {!module.isUnlocked && <Lock className="w-5 h-5" />}
                </div>
                <h3 className="text-xl font-bold mb-2">{module.title}</h3>
                <div className="flex items-center space-x-4">
                  <Badge className={`${difficultyColors[module.difficulty]} bg-white bg-opacity-20 text-white border-white border-opacity-30`}>
                    {module.difficulty}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    {renderStars(module.rating)}
                    <span className="text-sm ml-1">({module.rating})</span>
                  </div>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="space-y-4">
                  <p className="text-gray-600 text-sm leading-relaxed">{module.description}</p>

                  {/* Module Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {module.duration} mins
                    </div>
                    <div className="flex items-center">
                      <Book className="w-4 h-4 mr-1" />
                      {module.lessons} lessons
                    </div>
                    <div className="flex items-center">
                      <Award className="w-4 h-4 mr-1" />
                      {module.enrolledStudents} students
                    </div>
                  </div>

                  {/* Progress */}
                  {module.progress > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{module.progress}%</span>
                      </div>
                      <Progress value={module.progress} className="h-2" />
                    </div>
                  )}

                  {/* Prerequisites */}
                  {module.prerequisites && module.prerequisites.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-gray-700">Prerequisites:</h4>
                      <div className="flex flex-wrap gap-1">
                        {module.prerequisites.map((prereq) => (
                          <Badge key={prereq} variant="outline" className="text-xs">
                            {prereq}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Learning Objectives Preview */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-gray-700">You'll Learn:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {module.objectives.slice(0, 2).map((objective, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="w-3 h-3 mr-2 mt-1 text-green-500 flex-shrink-0" />
                          <span>{objective}</span>
                        </li>
                      ))}
                      {module.objectives.length > 2 && (
                        <li className="text-blue-600 text-sm">+{module.objectives.length - 2} more objectives</li>
                      )}
                    </ul>
                  </div>

                  {/* Action Button */}
                  <Button
                    onClick={() => startModule(module.id)}
                    disabled={!module.isUnlocked}
                    className={`w-full ${
                      module.isUnlocked
                        ? module.progress > 0
                          ? 'bg-blue-600 hover:bg-blue-700'
                          : 'bg-green-600 hover:bg-green-700'
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {!module.isUnlocked ? (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Locked
                      </>
                    ) : module.progress > 0 ? (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Continue Learning
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Start Module
                      </>
                    )}
                  </Button>

                  {!module.isUnlocked && module.prerequisites && (
                    <p className="text-xs text-gray-500 text-center">
                      Complete prerequisites to unlock this module
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredModules.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Book className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No modules found</h3>
            <p className="text-gray-500">Try adjusting your filters to see more modules.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MultiDisasterModules;