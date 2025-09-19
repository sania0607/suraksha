import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Play, CheckCircle, Clock, BookOpen } from 'lucide-react';

const StudentModules = () => {
  const { modules } = useApp();

  // Mock completion data (in real app, this would come from user data)
  const completedModules = ['earthquake', 'fire'];
  const moduleScores = { earthquake: 90, fire: 85 };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Disaster Preparedness Modules</h1>
        <p className="text-muted-foreground mt-2">
          Master essential emergency response skills through interactive learning modules
        </p>
      </div>

      {/* Progress Overview */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5" />
            <span>Learning Progress</span>
          </CardTitle>
          <CardDescription>Track your journey through all disaster preparedness modules</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Overall Progress</span>
                <span className="font-medium">
                  {completedModules.length}/{modules.length} completed
                </span>
              </div>
              <Progress value={(completedModules.length / modules.length) * 100} className="h-3" />
            </div>
            
            <div className="flex space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>{completedModules.length} Completed</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-accent" />
                <span>{modules.length - completedModules.length} Remaining</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => {
          const isCompleted = completedModules.includes(module.id);
          const score = moduleScores[module.id];
          const colorClass = module.color === 'primary' ? 'border-primary/20 hover:border-primary/40' :
                            module.color === 'emergency' ? 'border-emergency/20 hover:border-emergency/40' :
                            'border-accent/20 hover:border-accent/40';
          
          return (
            <Card key={module.id} className={`module-card cursor-pointer ${colorClass} border-2 relative overflow-hidden`}>
              {/* Status Badge */}
              <div className="absolute top-4 right-4 z-10">
                {isCompleted ? (
                  <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Complete
                  </Badge>
                ) : (
                  <Badge variant="outline">
                    Available
                  </Badge>
                )}
              </div>

              {/* Module Icon Background */}
              <div className="absolute top-0 right-0 text-8xl opacity-10 -mr-4 -mt-4">
                {module.icon}
              </div>

              <CardHeader className="pb-3 relative z-10">
                <div className="text-4xl mb-2">{module.icon}</div>
                <CardTitle className="text-xl">{module.title}</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  {module.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Module Details */}
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span>Quiz Questions:</span>
                    <span className="font-medium">{module.quiz.questions.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Drill Scenarios:</span>
                    <span className="font-medium">{module.drillScenarios.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Estimated Time:</span>
                    <span className="font-medium">15-20 min</span>
                  </div>
                </div>

                {/* Score Display for Completed Modules */}
                {isCompleted && score && (
                  <div className="bg-success/10 border border-success/20 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Your Score:</span>
                      <span className="text-lg font-bold text-success">{score}%</span>
                    </div>
                    <Progress value={score} className="h-2 mt-2" />
                  </div>
                )}

                {/* Action Button */}
                <Link to={`/student/modules/${module.id}`}>
                  <Button 
                    variant={isCompleted ? "success" : "module"} 
                    className="w-full"
                    size="lg"
                  >
                    <Play className="h-4 w-4" />
                    {isCompleted ? 'Review & Practice' : 'Start Learning'}
                  </Button>
                </Link>

                {/* Additional Actions for Completed Modules */}
                {isCompleted && (
                  <div className="flex space-x-2">
                    <Link to={`/student/drills/${module.id}`} className="flex-1">
                      <Button variant="drill" size="sm" className="w-full">
                        Practice Drill
                      </Button>
                    </Link>
                    <Link to={`/student/modules/${module.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        Retake Quiz
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Learning Tips */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Learning Tips</CardTitle>
          <CardDescription>Make the most of your disaster preparedness training</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-primary">Study Approach</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Read through the module content carefully</li>
                <li>• Take notes on key safety procedures</li>
                <li>• Practice scenarios multiple times</li>
                <li>• Review any mistakes from quizzes</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-accent">Real-World Application</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Discuss scenarios with family and friends</li>
                <li>• Identify evacuation routes in your buildings</li>
                <li>• Keep emergency contacts updated</li>
                <li>• Practice drills regularly outside of training</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentModules;