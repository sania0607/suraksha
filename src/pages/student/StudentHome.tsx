import { Link } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Play, CheckCircle, AlertTriangle, Trophy } from 'lucide-react';

const StudentHome = () => {
  const { user, modules } = useApp();

  // Mock student progress data
  const completedModules = ['earthquake', 'fire'];
  const overallProgress = (completedModules.length / modules.length) * 100;

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-teal-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}! 👋</h1>
        <p className="text-teal-100 text-lg">Ready to strengthen your disaster preparedness skills?</p>
      </div>

      {/* Progress Overview */}
      <Card className="shadow-lg bg-white">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-5 w-5 text-orange-400" />
            <span>Your Progress</span>
          </CardTitle>
          <CardDescription>Track your disaster preparedness journey</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Overall Preparedness</span>
                <span className="font-medium">{Math.round(overallProgress)}%</span>
              </div>
              <Progress value={overallProgress} className="h-2" />
            </div>
            
            <div className="flex space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>{completedModules.length} Completed</span>
              </div>
              <div className="flex items-center space-x-1">
                <AlertTriangle className="h-4 w-4 text-orange-400" />
                <span>{modules.length - completedModules.length} Remaining</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Disaster Modules */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Disaster Preparedness Modules</h2>
          <Link to="/student/modules">
            <Button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg">View All</Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => {
            const isCompleted = completedModules.includes(module.id);
            const colorClass = module.color === 'primary' ? 'border-teal-200 hover:border-teal-400' :
                              module.color === 'emergency' ? 'border-red-200 hover:border-red-400' :
                              'border-orange-200 hover:border-orange-400';
            
            return (
              <Card key={module.id} className={`transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer ${colorClass} border-2 bg-white`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="text-3xl">{module.icon}</div>
                    {isCompleted && (
                      <Badge className="bg-green-100 text-green-600 border-green-200">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Complete
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg">{module.title}</CardTitle>
                  <CardDescription className="text-sm">{module.description}</CardDescription>
                </CardHeader>
                
                <CardContent>
                  <Link to={`/student/modules/${module.id}`}>
                    <Button 
                      className={`w-full transition-colors duration-200 ${
                        isCompleted 
                          ? 'bg-green-500 hover:bg-green-600 text-white' 
                          : 'bg-teal-600 hover:bg-teal-700 text-white'
                      }`}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      {isCompleted ? 'Review Module' : 'Start Module'}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="shadow-lg bg-white">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Emergency tools and practice</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link to="/student/virtual-drills">
              <Button className="w-full h-16 flex-col space-y-1 bg-blue-500 hover:bg-blue-600 text-white">
                <AlertTriangle className="h-5 w-5" />
                <span>Practice Drills</span>
              </Button>
            </Link>
            
            <Link to="/student/sos">
              <Button className="w-full h-16 flex-col space-y-1 bg-red-500 hover:bg-red-600 text-white animate-pulse">
                <span className="text-2xl">🚨</span>
                <span className="text-sm">Emergency SOS</span>
              </Button>
            </Link>
            
            <Link to="/student/profile">
              <Button className="w-full h-16 flex-col space-y-1 bg-orange-400 hover:bg-orange-500 text-white">
                <Trophy className="h-5 w-5" />
                <span>View Profile</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentHome;