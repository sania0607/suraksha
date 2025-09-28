import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Bell, MapPin, Clock, Info, X, Volume2, VolumeX } from 'lucide-react';

interface DisasterAlert {
  id: string;
  type: 'earthquake' | 'flood' | 'fire' | 'cyclone' | 'tsunami' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  location: string;
  timestamp: Date;
  source: string;
  isActive: boolean;
  actionRequired?: string;
}

const DisasterAlerts = () => {
  const [alerts, setAlerts] = useState<DisasterAlert[]>([
    // Sample active alerts
    {
      id: '1',
      type: 'earthquake',
      severity: 'medium',
      title: 'Moderate Earthquake Detected',
      message: 'A 4.2 magnitude earthquake occurred 15km from your location. No immediate danger, but stay alert for aftershocks.',
      location: 'Delhi NCR',
      timestamp: new Date(Date.now() - 300000), // 5 minutes ago
      source: 'NDMA',
      isActive: true,
      actionRequired: 'Stay calm, be prepared for aftershocks'
    },
    {
      id: '2',
      type: 'flood',
      severity: 'high',
      title: 'Flood Warning Issued',
      message: 'Heavy rainfall expected in next 6 hours. Avoid low-lying areas and stay indoors.',
      location: 'Mumbai, Maharashtra',
      timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
      source: 'IMD',
      isActive: true,
      actionRequired: 'Avoid travel, stay on higher floors'
    },
    {
      id: '3',
      type: 'fire',
      severity: 'critical',
      title: 'Fire Emergency - School Campus',
      message: 'Fire detected in Block C. Immediate evacuation in progress. Follow your assigned evacuation route.',
      location: 'DPS School, Sector 12',
      timestamp: new Date(Date.now() - 120000), // 2 minutes ago
      source: 'School Safety System',
      isActive: true,
      actionRequired: 'EVACUATE IMMEDIATELY - Follow fire drill procedures'
    }
  ]);

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [filter, setFilter] = useState<'all' | DisasterAlert['severity']>('all');

  const severityColors = {
    low: 'bg-green-100 text-green-800 border-green-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    high: 'bg-orange-100 text-orange-800 border-orange-200',
    critical: 'bg-red-100 text-red-800 border-red-200'
  };

  const typeEmojis = {
    earthquake: '🌍',
    flood: '🌊',
    fire: '🔥',
    cyclone: '🌪️',
    tsunami: '🌊',
    other: '⚠️'
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const dismissAlert = (id: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, isActive: false } : alert
    ));
  };

  const filteredAlerts = alerts.filter(alert => 
    alert.isActive && (filter === 'all' || alert.severity === filter)
  );

  // Simulate new alerts (in real app, this would come from WebSocket/Push notifications)
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate random new alert (very low probability)
      if (Math.random() < 0.1) {
        const newAlert: DisasterAlert = {
          id: Date.now().toString(),
          type: 'earthquake',
          severity: 'low',
          title: 'Minor Tremor Detected',
          message: 'A minor tremor was detected. No action required, monitoring continues.',
          location: 'Your Area',
          timestamp: new Date(),
          source: 'Seismic Monitor',
          isActive: true
        };
        setAlerts(prev => [newAlert, ...prev]);
        
        if (soundEnabled) {
          // In real app, play notification sound
          console.log('🔔 New alert sound');
        }
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [soundEnabled]);

  const criticalAlerts = filteredAlerts.filter(a => a.severity === 'critical');
  const activeAlertsCount = filteredAlerts.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-8 py-6 rounded-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bell className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">Disaster Alerts</h1>
              <p className="text-orange-100 mt-1">Real-time emergency notifications for your area</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge className="bg-white text-red-600 text-lg px-3 py-1">
              {activeAlertsCount} Active
            </Badge>
            <Button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`${soundEnabled ? 'bg-white text-red-600' : 'bg-red-800 text-white'} hover:bg-red-50`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Critical Alerts Banner */}
      {criticalAlerts.length > 0 && (
        <Card className="border-red-500 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <div>
                <h3 className="font-bold text-red-800">⚠️ CRITICAL ALERTS ACTIVE</h3>
                <p className="text-red-700">
                  {criticalAlerts.length} critical alert{criticalAlerts.length > 1 ? 's' : ''} requiring immediate attention
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filter Buttons */}
      <div className="flex space-x-2">
        {['all', 'critical', 'high', 'medium', 'low'].map((level) => (
          <Button
            key={level}
            variant={filter === level ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(level as typeof filter)}
            className="capitalize"
          >
            {level}
            {level !== 'all' && (
              <Badge variant="secondary" className="ml-2">
                {alerts.filter(a => a.isActive && a.severity === level).length}
              </Badge>
            )}
          </Button>
        ))}
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-xl font-semibold text-green-600 mb-2">All Clear!</h3>
              <p className="text-gray-600">No active disaster alerts in your area.</p>
            </CardContent>
          </Card>
        ) : (
          filteredAlerts.map((alert) => (
            <Card key={alert.id} className={`border-l-4 ${
              alert.severity === 'critical' ? 'border-l-red-500 bg-red-50' :
              alert.severity === 'high' ? 'border-l-orange-500 bg-orange-50' :
              alert.severity === 'medium' ? 'border-l-yellow-500 bg-yellow-50' :
              'border-l-green-500 bg-green-50'
            }`}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="text-2xl">{typeEmojis[alert.type]}</span>
                      <Badge className={severityColors[alert.severity]}>
                        {alert.severity.toUpperCase()}
                      </Badge>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-1" />
                        {formatTimeAgo(alert.timestamp)}
                      </div>
                    </div>

                    <h3 className="text-xl font-bold mb-2">{alert.title}</h3>
                    <p className="text-gray-700 mb-3">{alert.message}</p>

                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {alert.location}
                      </div>
                      <div className="flex items-center">
                        <Info className="w-4 h-4 mr-1" />
                        Source: {alert.source}
                      </div>
                    </div>

                    {alert.actionRequired && (
                      <div className={`p-3 rounded-lg mb-3 ${
                        alert.severity === 'critical' ? 'bg-red-100 border border-red-200' :
                        alert.severity === 'high' ? 'bg-orange-100 border border-orange-200' :
                        'bg-blue-100 border border-blue-200'
                      }`}>
                        <h4 className="font-semibold mb-1">
                          {alert.severity === 'critical' ? '🚨 IMMEDIATE ACTION REQUIRED:' : '⚠️ Recommended Action:'}
                        </h4>
                        <p className="text-sm">{alert.actionRequired}</p>
                      </div>
                    )}
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => dismissAlert(alert.id)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Emergency Actions */}
      {criticalAlerts.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Emergency Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button className="bg-red-600 hover:bg-red-700 h-16">
                📞 Call Emergency Services
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 h-16">
                📧 Alert Family Members
              </Button>
              <Button className="bg-green-600 hover:bg-green-700 h-16">
                🏃‍♂️ View Evacuation Route
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DisasterAlerts;