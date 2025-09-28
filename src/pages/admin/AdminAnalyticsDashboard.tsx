import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  Calendar,
  MapPin,
  Bell,
  Download,
  Eye,
  Award,
  Clock,
  Target,
  Shield,
  BookOpen,
  Activity
} from 'lucide-react';

const AdminDashboard = () => {
  const [dateRange, setDateRange] = useState('30days');

  // Sample data - in real app, this would come from API
  const dashboardData = {
    overview: {
      totalStudents: 1247,
      activeUsers: 892,
      completedDrills: 3456,
      alertsSent: 23,
      preparednessScore: 78
    },
    participation: {
      moduleCompletion: {
        earthquake: { completed: 456, total: 500, percentage: 91 },
        fire: { completed: 342, total: 500, percentage: 68 },
        flood: { completed: 289, total: 500, percentage: 58 },
        evacuation: { completed: 234, total: 500, percentage: 47 }
      },
      drillParticipation: {
        lastWeek: 234,
        lastMonth: 892,
        trend: '+15%'
      }
    },
    alerts: [
      {
        id: '1',
        type: 'earthquake',
        severity: 'medium',
        timestamp: '2024-01-15T14:30:00Z',
        affected: 456,
        responseRate: 89
      },
      {
        id: '2',
        type: 'fire',
        severity: 'high',
        timestamp: '2024-01-10T09:15:00Z',
        affected: 123,
        responseRate: 95
      }
    ],
    performance: {
      classwise: [
        { class: 'Class 10-A', students: 45, avgScore: 85, completed: 42 },
        { class: 'Class 10-B', students: 43, avgScore: 78, completed: 38 },
        { class: 'Class 9-A', students: 48, avgScore: 92, completed: 46 },
        { class: 'Class 9-B', students: 44, avgScore: 73, completed: 35 }
      ]
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-6 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-blue-100 mt-1">Monitor school disaster preparedness and response</p>
          </div>
          <div className="flex items-center space-x-4">
            <select 
              value={dateRange} 
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-white text-blue-600 px-3 py-2 rounded-lg border-0"
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="1year">Last Year</option>
            </select>
            <Button className="bg-white text-blue-600 hover:bg-blue-50">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-3xl font-bold text-blue-600">{dashboardData.overview.totalStudents.toLocaleString()}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-3xl font-bold text-green-600">{dashboardData.overview.activeUsers.toLocaleString()}</p>
                <p className="text-sm text-green-500">↑ 12% from last month</p>
              </div>
              <Activity className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Drills</p>
                <p className="text-3xl font-bold text-purple-600">{dashboardData.overview.completedDrills.toLocaleString()}</p>
                <p className="text-sm text-purple-500">↑ 8% from last week</p>
              </div>
              <Target className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Alerts Sent</p>
                <p className="text-3xl font-bold text-orange-600">{dashboardData.overview.alertsSent}</p>
                <p className="text-sm text-orange-500">Last 30 days</p>
              </div>
              <Bell className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Preparedness Score</p>
                <p className="text-3xl font-bold text-indigo-600">{dashboardData.overview.preparednessScore}%</p>
                <p className="text-sm text-indigo-500">Above target (75%)</p>
              </div>
              <Shield className="w-8 h-8 text-indigo-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="participation" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="participation">Participation</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="alerts">Alert Management</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="participation" className="space-y-6">
          {/* Module Completion Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                Module Completion Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(dashboardData.participation.moduleCompletion).map(([module, data]) => (
                  <div key={module} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold capitalize">{module} Safety</h4>
                      <Badge variant="secondary">{data.completed}/{data.total}</Badge>
                    </div>
                    <Progress value={data.percentage} className="h-3" />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{data.percentage}% Complete</span>
                      <span>{data.total - data.completed} Pending</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Drill Participation Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Drill Participation Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {dashboardData.participation.drillParticipation.lastWeek}
                  </div>
                  <div className="text-sm text-gray-600">Last Week</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {dashboardData.participation.drillParticipation.lastMonth}
                  </div>
                  <div className="text-sm text-gray-600">Last Month</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {dashboardData.participation.drillParticipation.trend}
                  </div>
                  <div className="text-sm text-gray-600">Growth Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          {/* Class-wise Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="w-5 h-5 mr-2" />
                Class-wise Performance Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Class</th>
                      <th className="text-left py-3 px-4">Students</th>
                      <th className="text-left py-3 px-4">Avg Score</th>
                      <th className="text-left py-3 px-4">Completed</th>
                      <th className="text-left py-3 px-4">Progress</th>
                      <th className="text-left py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.performance.classwise.map((classData, index) => {
                      const completionRate = (classData.completed / classData.students) * 100;
                      return (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">{classData.class}</td>
                          <td className="py-3 px-4">{classData.students}</td>
                          <td className="py-3 px-4">
                            <span className={`font-semibold ${
                              classData.avgScore >= 85 ? 'text-green-600' :
                              classData.avgScore >= 75 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {classData.avgScore}%
                            </span>
                          </td>
                          <td className="py-3 px-4">{classData.completed}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2">
                              <Progress value={completionRate} className="w-20 h-2" />
                              <span className="text-sm">{Math.round(completionRate)}%</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge className={
                              completionRate >= 90 ? 'bg-green-100 text-green-800' :
                              completionRate >= 75 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }>
                              {completionRate >= 90 ? 'Excellent' :
                               completionRate >= 75 ? 'Good' : 'Needs Attention'}
                            </Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Performance Insights */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <h4 className="font-semibold text-green-800">Top Performing</h4>
                  </div>
                  <p className="text-green-700">Class 9-A leads with 92% average score and 96% completion rate.</p>
                </div>
                
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    <h4 className="font-semibold text-yellow-800">Needs Attention</h4>
                  </div>
                  <p className="text-yellow-700">Class 9-B has the lowest completion rate at 80%. Consider additional support.</p>
                </div>
                
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <h4 className="font-semibold text-blue-800">Trending</h4>
                  </div>
                  <p className="text-blue-700">Fire safety modules show 15% improvement in scores over last month.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          {/* Recent Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  Recent Alert Activities
                </div>
                <Button size="sm" className="bg-red-600 hover:bg-red-700">
                  Send New Alert
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.alerts.map((alert) => (
                  <div key={alert.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity.toUpperCase()}
                        </Badge>
                        <span className="font-semibold capitalize">{alert.type} Alert</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {formatDate(alert.timestamp)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Students Affected:</span>
                        <span className="font-semibold ml-2">{alert.affected}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Response Rate:</span>
                        <span className="font-semibold ml-2 text-green-600">{alert.responseRate}%</span>
                      </div>
                      <div>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Alert Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">23</div>
                <div className="text-sm text-gray-600">Total Alerts Sent</div>
                <div className="text-sm text-green-500 mt-1">Last 30 days</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">91%</div>
                <div className="text-sm text-gray-600">Average Response Rate</div>
                <div className="text-sm text-green-500 mt-1">Above target (85%)</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">2.3m</div>
                <div className="text-sm text-gray-600">Avg Response Time</div>
                <div className="text-sm text-green-500 mt-1">Within target (3m)</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          {/* Report Generation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Download className="w-5 h-5 mr-2" />
                Generate Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { title: 'Student Progress Report', desc: 'Detailed analysis of individual student performance', icon: '📊' },
                  { title: 'Class Performance Summary', desc: 'Comparative analysis across all classes', icon: '📈' },
                  { title: 'Drill Participation Report', desc: 'Comprehensive drill attendance and performance data', icon: '🎯' },
                  { title: 'Emergency Response Analysis', desc: 'Response times and effectiveness during alerts', icon: '🚨' },
                  { title: 'Module Completion Statistics', desc: 'Learning module progress and completion rates', icon: '📚' },
                  { title: 'Preparedness Assessment', desc: 'Overall school disaster preparedness metrics', icon: '🛡️' }
                ].map((report, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <span className="text-3xl">{report.icon}</span>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-2">{report.title}</h3>
                          <p className="text-sm text-gray-600 mb-4">{report.desc}</p>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4 mr-2" />
                              Preview
                            </Button>
                            <Button size="sm">
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Scheduled Reports */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Scheduled Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: 'Weekly Progress Summary', frequency: 'Every Monday 9:00 AM', next: '2024-01-22', status: 'active' },
                  { name: 'Monthly Preparedness Report', frequency: 'First of every month', next: '2024-02-01', status: 'active' },
                  { name: 'Quarterly Assessment', frequency: 'Every 3 months', next: '2024-03-01', status: 'pending' }
                ].map((schedule, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">{schedule.name}</h4>
                      <p className="text-sm text-gray-600">{schedule.frequency}</p>
                    </div>
                    <div className="text-right">
                      <Badge className={schedule.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                        {schedule.status}
                      </Badge>
                      <p className="text-sm text-gray-600 mt-1">Next: {schedule.next}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;