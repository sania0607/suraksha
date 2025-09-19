import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Play, Shield, AlertTriangle, CheckCircle, Clock, Target } from 'lucide-react';

const StudentDrills = () => {
  const { modules, drillActive } = useApp();
  
  // Mock drill completion data
  const completedDrills = ['earthquake'];
  const drillScores = { earthquake: 85 };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center space-x-3">
          <Shield className="h-8 w-8 text-primary" />
          <span>Emergency Drills</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          Practice emergency responses in realistic scenarios to build muscle memory and confidence
        </p>
      </div>

      {/* Active Drill Alert */}
      {drillActive && (
        <Alert className="border-emergency/20 bg-emergency/10">
          <AlertTriangle className="h-4 w-4 text-emergency" />
          <AlertDescription className="text-emergency font-medium">
            🚨 Emergency drill is currently active! Follow your training protocols and listen for instructions.
          </AlertDescription>
        </Alert>
      )}

      {/* Drill Overview */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Drill Progress</span>
          </CardTitle>
          <CardDescription>Track your emergency response training across all scenarios</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{completedDrills.length}</div>
              <p className="text-sm text-muted-foreground">Drills Completed</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">{modules.length - completedDrills.length}</div>
              <p className="text-sm text-muted-foreground">Available Drills</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-success">
                {completedDrills.length > 0 ? Math.round(Object.values(drillScores).reduce((a, b) => a + b, 0) / Object.values(drillScores).length) : 0}%
              </div>
              <p className="text-sm text-muted-foreground">Average Score</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Drill Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => {
          const isCompleted = completedDrills.includes(module.id);
          const score = drillScores[module.id];
          const scenarios = module.drillScenarios.length;
          
          return (
            <Card key={module.id} className="module-card shadow-card border-2 border-accent/20 hover:border-accent/40 relative overflow-hidden">
              {/* Status Badge */}
              <div className="absolute top-4 right-4 z-10">
                {isCompleted ? (
                  <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Completed
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                    Ready
                  </Badge>
                )}
              </div>

              {/* Module Icon Background */}
              <div className="absolute top-0 right-0 text-8xl opacity-10 -mr-4 -mt-4">
                {module.icon}
              </div>

              <CardHeader className="pb-3 relative z-10">
                <div className="text-4xl mb-2">{module.icon}</div>
                <CardTitle className="text-xl">{module.title} Drill</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  Practice emergency response procedures through interactive scenarios
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Drill Details */}
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center space-x-1">
                      <Target className="h-3 w-3" />
                      <span>Scenarios:</span>
                    </span>
                    <span className="font-medium">{scenarios}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>Duration:</span>
                    </span>
                    <span className="font-medium">5-10 min</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Difficulty:</span>
                    <span className="font-medium">
                      {module.id === 'earthquake' ? 'Beginner' : 
                       module.id === 'fire' ? 'Intermediate' : 'Advanced'}
                    </span>
                  </div>
                </div>

                {/* Score Display for Completed Drills */}
                {isCompleted && score && (
                  <div className="bg-success/10 border border-success/20 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Best Score:</span>
                      <span className="text-lg font-bold text-success">{score}%</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Great job! Keep practicing to maintain your skills.
                    </div>
                  </div>
                )}

                {/* Scenario Preview */}
                <div className="bg-muted/30 rounded-lg p-3">
                  <h5 className="text-sm font-medium mb-1">Sample Scenario:</h5>
                  <p className="text-xs text-muted-foreground italic">
                    {module.drillScenarios[0]?.scenario.substring(0, 80)}...
                  </p>
                </div>

                {/* Action Button */}
                <Link to={`/student/drills/${module.id}`}>
                  <Button 
                    variant="drill" 
                    className="w-full"
                    size="lg"
                  >
                    <Play className="h-4 w-4" />
                    {isCompleted ? 'Practice Again' : 'Start Drill'}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Drill Instructions */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>How Drills Work</CardTitle>
          <CardDescription>Understanding the emergency drill simulation system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-primary">Drill Process</h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs font-bold text-primary">1</div>
                  <div>
                    <p className="text-sm font-medium">Read the Scenario</p>
                    <p className="text-xs text-muted-foreground">Understand the emergency situation presented</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs font-bold text-primary">2</div>
                  <div>
                    <p className="text-sm font-medium">Choose Your Response</p>
                    <p className="text-xs text-muted-foreground">Select the best course of action from the options</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs font-bold text-primary">3</div>
                  <div>
                    <p className="text-sm font-medium">Learn from Feedback</p>
                    <p className="text-xs text-muted-foreground">Review explanations for all choices</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-accent">Best Practices</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li className="flex items-start space-x-2">
                  <span className="text-accent">•</span>
                  <span>Take your time to think through each scenario</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-accent">•</span>
                  <span>Consider safety as the top priority</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-accent">•</span>
                  <span>Learn from both correct and incorrect choices</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-accent">•</span>
                  <span>Practice regularly to build muscle memory</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-accent">•</span>
                  <span>Discuss scenarios with friends and family</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDrills;