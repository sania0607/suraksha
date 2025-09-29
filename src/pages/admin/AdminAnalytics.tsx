import React from 'react';
import { useApp } from '@/contexts/FixedAppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, Target, Clock, Award, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const AdminAnalytics = () => {
  const { modules } = useApp();
  
  // Mock students data for analytics
  const students = [
    { 
      id: '1', 
      name: 'Alex Johnson', 
      quizScores: { earthquake: 85, fire: 90 },
      completedModules: ['earthquake', 'fire'],
      preparednessScore: 87
    },
    { 
      id: '2', 
      name: 'Sarah Davis', 
      quizScores: { earthquake: 92, fire: 88, flood: 95 },
      completedModules: ['earthquake', 'fire', 'flood'],
      preparednessScore: 92
    },
    { 
      id: '3', 
      name: 'Mike Chen', 
      quizScores: { earthquake: 78 },
      completedModules: ['earthquake'],
      preparednessScore: 78
    },
    { 
      id: '4', 
      name: 'Emma Wilson', 
      quizScores: { earthquake: 95, fire: 93, flood: 89, tornado: 91 },
      completedModules: ['earthquake', 'fire', 'flood', 'tornado'],
      preparednessScore: 95
    },
    { 
      id: '5', 
      name: 'David Brown', 
      quizScores: { earthquake: 88, fire: 85, flood: 92 },
      completedModules: ['earthquake', 'fire', 'flood'],
      preparednessScore: 88
    },
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

  // Mock analytics data (in real app, this would come from API)
  const participationTrend = [
    { month: 'Sep', students: 45, completion: 65 },
    { month: 'Oct', students: 52, completion: 72 },
    { month: 'Nov', students: 58, completion: 78 },
    { month: 'Dec', students: 64, completion: 81 },
    { month: 'Jan', students: 67, completion: 85 }
  ];

  const moduleEngagement = modules.map(module => {
    const completed = students.filter(s => s.completedModules.includes(module.id)).length;
    const avgTime = Math.round(Math.random() * 15 + 10); // Mock data
    const satisfaction = Math.round(Math.random() * 20 + 80); // Mock data
    
    return {
      name: module.title.replace(' Safety', '').replace(' Emergency', '').replace(' Response', ''),
      completed,
      participationRate: Math.round((completed / students.length) * 100),
      avgTime,
      satisfaction
    };
  });

  const skillsRadarData = [
    { skill: 'Risk Assessment', score: 85, fullMark: 100 },
    { skill: 'Emergency Response', score: 78, fullMark: 100 },
    { skill: 'Communication', score: 92, fullMark: 100 },
    { skill: 'Evacuation Procedures', score: 88, fullMark: 100 },
    { skill: 'First Aid Knowledge', score: 75, fullMark: 100 },
    { skill: 'Leadership', score: 82, fullMark: 100 }
  ];

  const drillPerformance = [
    { date: '2024-01-08', participation: 89, avgScore: 82, duration: 12 },
    { date: '2024-01-15', participation: 93, avgScore: 85, duration: 10 },
    { date: '2024-01-22', participation: 87, avgScore: 79, duration: 14 },
    { date: '2024-01-29', participation: 95, avgScore: 88, duration: 9 }
  ];

  const calculateStats = () => {
    const totalParticipation = Math.round(
      (students.reduce((sum, student) => sum + student.completedModules.length, 0) / 
       (students.length * modules.length)) * 100
    );
    
    const averageScore = Math.round(
      students.reduce((sum, student) => 
        sum + Object.values(student.quizScores).reduce((scoreSum, score) => scoreSum + score, 0) / 
        Math.max(Object.values(student.quizScores).length, 1), 0
      ) / students.length
    );

    const highPerformers = students.filter(s => s.preparednessScore >= 90).length;
    const needsAttention = students.filter(s => s.preparednessScore < 70).length;

    return { totalParticipation, averageScore, highPerformers, needsAttention };
  };

  const stats = calculateStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Analytics & Insights</h1>
        <p className="text-muted-foreground mt-2">
          Comprehensive analysis of student engagement and preparedness performance
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Participation</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.totalParticipation}%</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +5% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{stats.averageScore}%</div>
            <p className="text-xs text-muted-foreground">Across all modules</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Performers</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{stats.highPerformers}</div>
            <p className="text-xs text-muted-foreground">Students scoring 90%+</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Needs Attention</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{stats.needsAttention}</div>
            <p className="text-xs text-muted-foreground">Students scoring below 70%</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Participation Trend */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Participation Trends</CardTitle>
            <CardDescription>Student engagement and completion rates over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={participationTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'students' ? `${value} students` : `${value}%`,
                    name === 'students' ? 'Active Students' : 'Completion Rate'
                  ]}
                />
                <Area 
                  type="monotone" 
                  dataKey="completion" 
                  stackId="1" 
                  stroke="hsl(var(--primary))" 
                  fill="hsl(var(--primary))" 
                  fillOpacity={0.8} 
                />
                <Area 
                  type="monotone" 
                  dataKey="students" 
                  stackId="2" 
                  stroke="hsl(var(--accent))" 
                  fill="hsl(var(--accent))" 
                  fillOpacity={0.6} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Skills Radar */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Skills Assessment</CardTitle>
            <CardDescription>Average competency levels across key safety skills</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={skillsRadarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="skill" tick={{ fontSize: 10 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tickCount={6} tick={{ fontSize: 10 }} />
                <Radar 
                  name="Score" 
                  dataKey="score" 
                  stroke="hsl(var(--primary))" 
                  fill="hsl(var(--primary))" 
                  fillOpacity={0.3} 
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Module Performance */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Module Performance Analysis</CardTitle>
          <CardDescription>Detailed breakdown of engagement and satisfaction by module</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {moduleEngagement.map((module, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">{getModuleIcon(modules[index]?.disaster_type)}</div>
                  <div>
                    <h4 className="font-medium">{module.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {module.completed} of {students.length} students completed
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className={`text-lg font-bold ${
                      module.participationRate >= 80 ? 'text-success' :
                      module.participationRate >= 60 ? 'text-primary' :
                      'text-warning'
                    }`}>
                      {module.participationRate}%
                    </div>
                    <p className="text-xs text-muted-foreground">Participation</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-lg font-bold text-accent">{module.avgTime}m</div>
                    <p className="text-xs text-muted-foreground">Avg. Time</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-lg font-bold text-primary">{module.satisfaction}%</div>
                    <p className="text-xs text-muted-foreground">Satisfaction</p>
                  </div>
                  
                  <Badge variant={
                    module.participationRate >= 80 ? "secondary" :
                    module.participationRate >= 60 ? "outline" : "destructive"
                  } className={
                    module.participationRate >= 80 ? "bg-success/10 text-success border-success/20" : ""
                  }>
                    {module.participationRate >= 80 ? 'Excellent' :
                     module.participationRate >= 60 ? 'Good' : 'Needs Focus'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Drill Performance */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Emergency Drill Performance</CardTitle>
          <CardDescription>Recent drill participation and response effectiveness</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={drillPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'participation' ? `${value}%` :
                  name === 'avgScore' ? `${value}%` :
                  `${value} min`,
                  name === 'participation' ? 'Participation Rate' :
                  name === 'avgScore' ? 'Average Score' :
                  'Response Time'
                ]}
              />
              <Line 
                type="monotone" 
                dataKey="participation" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="avgScore" 
                stroke="hsl(var(--success))" 
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--success))', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Recommendations</CardTitle>
          <CardDescription>AI-powered insights to improve safety preparedness</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-success">Strengths</h4>
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-success rounded-full mt-2"></div>
                  <p className="text-sm">High engagement in Earthquake Safety module (95% completion)</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-success rounded-full mt-2"></div>
                  <p className="text-sm">Excellent communication skills development across all students</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-success rounded-full mt-2"></div>
                  <p className="text-sm">Consistent improvement in drill response times</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-warning">Areas for Improvement</h4>
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-warning rounded-full mt-2"></div>
                  <p className="text-sm">Focus on Flood Response module - lowest participation rate</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-warning rounded-full mt-2"></div>
                  <p className="text-sm">Provide additional first aid training resources</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-warning rounded-full mt-2"></div>
                  <p className="text-sm">Consider gamification to increase engagement</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalytics;