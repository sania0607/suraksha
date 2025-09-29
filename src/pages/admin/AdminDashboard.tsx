import React from 'react';
import { useApp } from '@/contexts/FixedAppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Users, BookOpen, Shield, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AdminDashboard = () => {
  const { modules, drillActive, setDrillActive } = useApp();
  
  // Mock students data for admin dashboard
  const students = [
    { id: '1', name: 'Alex Johnson', email: 'alex.johnson@university.edu', preparednessScore: 85, completedModules: ['earthquake', 'fire'] },
    { id: '2', name: 'Sarah Davis', email: 'sarah.davis@university.edu', preparednessScore: 92, completedModules: ['earthquake', 'fire', 'flood'] },
    { id: '3', name: 'Mike Chen', email: 'mike.chen@university.edu', preparednessScore: 78, completedModules: ['earthquake'] },
    { id: '4', name: 'Emma Wilson', email: 'emma.wilson@university.edu', preparednessScore: 95, completedModules: ['earthquake', 'fire', 'flood', 'tornado'] },
    { id: '5', name: 'David Brown', email: 'david.brown@university.edu', preparednessScore: 88, completedModules: ['earthquake', 'fire', 'flood'] },
  ];
  
  // Helper function to get module icons
  const getModuleIcon = (disasterType: string) => {
    switch (disasterType?.toLowerCase()) {
      case 'earthquake': return '🏗️';
      case 'fire': return '🔥';
      case 'flood': return '🌊';
      case 'tornado': return '🌪️';
      default: return '⚠️';
    }
  };

  // Calculate statistics
  const totalStudents = students.length;
  const averagePreparedness = Math.round(
    students.reduce((sum, student) => sum + student.preparednessScore, 0) / totalStudents
  );
  const completedAllModules = students.filter(
    student => student.completedModules.length === modules.length
  ).length;
  const completionRate = Math.round((completedAllModules / totalStudents) * 100);

  // Chart data
  const moduleCompletionData = modules.map(module => ({
    name: module.title.replace(' Safety', '').replace(' Emergency', '').replace(' Response', ''),
    completed: students.filter(student => student.completedModules.includes(module.id)).length,
    total: totalStudents
  }));

  const preparednessDistribution = [
    { name: 'Excellent (90-100%)', value: students.filter(s => s.preparednessScore >= 90).length, color: '#10b981' },
    { name: 'Good (70-89%)', value: students.filter(s => s.preparednessScore >= 70 && s.preparednessScore < 90).length, color: '#3b82f6' },
    { name: 'Needs Improvement (<70%)', value: students.filter(s => s.preparednessScore < 70).length, color: '#f59e0b' }
  ];

  const triggerDrill = () => {
    setDrillActive(!drillActive);
    alert(drillActive ? 'Emergency drill stopped.' : 'Emergency drill activated! All students have been notified.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Monitor student preparedness and manage emergency drills</p>
        </div>
        
        <Button 
          onClick={triggerDrill}
          variant={drillActive ? "destructive" : "emergency"}
          size="lg"
          className="emergency-pulse"
        >
          <Shield className="h-5 w-5" />
          {drillActive ? 'Stop Drill' : 'Trigger Emergency Drill'}
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">Enrolled in safety program</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Preparedness</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{averagePreparedness}%</div>
            <p className="text-xs text-muted-foreground">Across all modules</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Module Completion</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{completionRate}%</div>
            <p className="text-xs text-muted-foreground">{completedAllModules} of {totalStudents} completed all</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drill Status</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${drillActive ? 'text-emergency' : 'text-muted-foreground'}`}>
              {drillActive ? 'ACTIVE' : 'READY'}
            </div>
            <p className="text-xs text-muted-foreground">Emergency drill system</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Module Completion Chart */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Module Completion Rates</CardTitle>
            <CardDescription>Student progress across different disaster preparedness modules</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={moduleCompletionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [`${value} students`, 'Completed']}
                  labelFormatter={(label) => `${label} Module`}
                />
                <Bar dataKey="completed" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Preparedness Distribution */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Preparedness Score Distribution</CardTitle>
            <CardDescription>How students are performing across all modules</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={preparednessDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {preparednessDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} students`]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center mt-4 space-x-4">
              {preparednessDistribution.map((entry, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                  <span className="text-xs text-muted-foreground">{entry.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Student Details */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Student Performance Overview</CardTitle>
          <CardDescription>Individual student preparedness scores and module completion</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {students.map((student) => (
              <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium">{student.name}</h4>
                    <p className="text-sm text-muted-foreground">{student.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className={`text-lg font-bold ${
                      student.preparednessScore >= 90 ? 'text-success' :
                      student.preparednessScore >= 70 ? 'text-primary' :
                      'text-warning'
                    }`}>
                      {student.preparednessScore}%
                    </div>
                    <p className="text-xs text-muted-foreground">Preparedness</p>
                  </div>

                  <div className="text-center">
                    <div className="text-lg font-bold">
                      {student.completedModules.length}/{modules.length}
                    </div>
                    <p className="text-xs text-muted-foreground">Modules</p>
                  </div>

                  <div className="flex space-x-1">
                    {modules.map((module) => (
                      <div
                        key={module.id}
                        className={`w-6 h-6 rounded text-xs flex items-center justify-center ${
                          student.completedModules.includes(module.id)
                            ? 'bg-success text-success-foreground'
                            : 'bg-muted text-muted-foreground'
                        }`}
                        title={module.title}
                      >
                        {student.completedModules.includes(module.id) ? (
                          <CheckCircle className="h-3 w-3" />
                        ) : (
                          <span>{getModuleIcon(module.disaster_type)}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;