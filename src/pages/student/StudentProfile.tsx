import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { User, Mail, Trophy, BookOpen, CheckCircle, Star } from 'lucide-react';

const StudentProfile = () => {
  const { user, modules } = useApp();

  if (!user) return null;

  // Mock student data (in real app, this would come from API)
  const studentData = {
    completedModules: ['earthquake', 'fire'],
    quizScores: { earthquake: 90, fire: 85 },
    preparednessScore: 87,
    badges: [
      { id: 'first-module', name: 'First Steps', description: 'Completed your first module', icon: '🎯' },
      { id: 'quiz-master', name: 'Quiz Master', description: 'Scored 80+ on all quizzes', icon: '🧠' },
      { id: 'safety-champion', name: 'Safety Champion', description: 'Completed 2 modules', icon: '🛡️' }
    ],
    recentActivity: [
      { date: '2024-01-15', action: 'Completed Fire Emergency quiz', score: 85 },
      { date: '2024-01-12', action: 'Finished Fire Emergency module', score: null },
      { date: '2024-01-10', action: 'Completed Earthquake Safety quiz', score: 90 },
      { date: '2024-01-08', action: 'Started Earthquake Safety module', score: null }
    ]
  };

  const overallProgress = (studentData.completedModules.length / modules.length) * 100;
  const averageScore = studentData.completedModules.length > 0 
    ? Math.round(Object.values(studentData.quizScores).reduce((a, b) => a + b, 0) / Object.values(studentData.quizScores).length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-hero rounded-lg p-6 text-white">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <User className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="text-white/90 flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span>{user.email}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Preparedness Score</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{studentData.preparednessScore}%</div>
            <Progress value={studentData.preparednessScore} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Modules Completed</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {studentData.completedModules.length}/{modules.length}
            </div>
            <Progress value={overallProgress} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Quiz Score</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{averageScore}%</div>
            <Progress value={averageScore} className="h-2 mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Module Progress */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Module Progress</CardTitle>
          <CardDescription>Your progress across all disaster preparedness modules</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {modules.map((module) => {
              const isCompleted = studentData.completedModules.includes(module.id);
              const score = studentData.quizScores[module.id];
              
              return (
                <div key={module.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">{module.icon}</div>
                    <div>
                      <h4 className="font-medium">{module.title}</h4>
                      <p className="text-sm text-muted-foreground">{module.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    {isCompleted ? (
                      <>
                        <div className="text-center">
                          <div className="text-lg font-bold text-success">{score}%</div>
                          <p className="text-xs text-muted-foreground">Quiz Score</p>
                        </div>
                        <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Complete
                        </Badge>
                      </>
                    ) : (
                      <Badge variant="outline">
                        Not Started
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Badges */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Achievements</CardTitle>
          <CardDescription>Badges earned for your safety learning progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {studentData.badges.map((badge) => (
              <div key={badge.id} className="flex items-center space-x-3 p-4 bg-accent/10 border border-accent/20 rounded-lg">
                <div className="text-2xl">{badge.icon}</div>
                <div>
                  <h4 className="font-semibold text-accent">{badge.name}</h4>
                  <p className="text-sm text-muted-foreground">{badge.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest learning activities and achievements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {studentData.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b last:border-b-0">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    {activity.score ? (
                      <Star className="h-4 w-4 text-primary" />
                    ) : (
                      <BookOpen className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.date}</p>
                  </div>
                </div>
                
                {activity.score && (
                  <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                    {activity.score}%
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentProfile;