import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/FixedAppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Play, Clock, Target, BookOpen } from 'lucide-react';

const ModulesPageSimple = () => {
  const { modules, userProgress } = useApp();
  const navigate = useNavigate();

  const getModuleIcon = (disasterType: string) => {
    switch (disasterType?.toLowerCase()) {
      case 'earthquake': return '🏗️';
      case 'fire': return '🔥';
      case 'flood': return '🌊';
      case 'tornado': return '🌪️';
      default: return '⚠️';
    }
  };

  const getModuleProgress = (moduleId: string) => {
    const progress = userProgress.find(p => p.module_id === moduleId);
    return progress || null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-teal-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Disaster Preparedness Modules</h1>
        <p className="text-teal-100 text-lg">
          Learn essential skills to stay safe during various emergency situations
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-100 rounded-lg">
                <BookOpen className="h-5 w-5 text-teal-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{modules.length}</p>
                <p className="text-sm text-gray-600">Available Modules</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Target className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{userProgress.filter(p => p.completed).length}</p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{userProgress.reduce((sum, p) => sum + p.time_spent, 0)}</p>
                <p className="text-sm text-gray-600">Minutes Studied</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => {
          const progress = getModuleProgress(module.id);
          const isCompleted = progress?.completed || false;
          const progressPercent = progress ? (progress.score || 0) : 0;
          
          return (
            <Card 
              key={module.id} 
              className="transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer border-2 hover:border-teal-400"
              onClick={() => navigate(`/student/modules/${module.slug || module.id}`)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-3xl">{getModuleIcon(module.disaster_type)}</div>
                  {isCompleted && (
                    <Badge className="bg-green-100 text-green-600 border-green-200">
                      ✓ Completed
                    </Badge>
                  )}
                </div>
                
                <CardTitle className="text-lg">{module.title}</CardTitle>
                <CardDescription className="text-sm line-clamp-2">
                  {module.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  {/* Module Stats */}
                  <div className="flex justify-between text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {module.estimated_duration} min
                    </span>
                    <span className="flex items-center gap-1">
                      <Target className="h-3 w-3" />
                      {module.difficulty_level}
                    </span>
                  </div>

                  {/* Progress */}
                  {progress && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Progress</span>
                        <span>{progressPercent}%</span>
                      </div>
                      <Progress value={progressPercent} className="h-2" />
                    </div>
                  )}

                  {/* Action Button */}
                  <Button 
                    className="w-full mt-4 bg-teal-600 hover:bg-teal-700 text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/student/modules/${module.slug || module.id}`);
                    }}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    {isCompleted ? 'Review Module' : progress ? 'Continue' : 'Start Module'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {modules.length === 0 && (
        <Card className="text-center p-12">
          <div className="text-4xl mb-4">📚</div>
          <h3 className="text-xl font-semibold mb-2">No Modules Available</h3>
          <p className="text-gray-600 mb-4">
            Check back later for new disaster preparedness modules.
          </p>
        </Card>
      )}
    </div>
  );
};

export default ModulesPageSimple;