import React, { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertTriangle, 
  Bell, 
  MapPin, 
  Clock, 
  Info, 
  X, 
  Volume2, 
  VolumeX,
  Phone,
  Users,
  CheckCircle,
  Siren
} from 'lucide-react';

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

const EmergencyCenter = () => {
  const { triggerSOS } = useApp();
  
  // SOS State
  const [sosTriggered, setSosTriggered] = useState(false);
  const [countdown, setCountdown] = useState(0);
  
  // Alerts State
  const [alerts, setAlerts] = useState<DisasterAlert[]>([
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

  // SOS Functions
  const handleSOSPress = () => {
    setCountdown(3);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          triggerSOS();
          setSosTriggered(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const resetSOS = () => {
    setSosTriggered(false);
    setCountdown(0);
  };

  // Alert Functions
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

  const criticalAlerts = filteredAlerts.filter(a => a.severity === 'critical');
  const activeAlertsCount = filteredAlerts.length;

  // Emergency contacts for quick access
  const emergencyNumbers = [
    { number: '112', label: 'Emergency Services', icon: '🚨' },
    { number: '101', label: 'Fire Brigade', icon: '🔥' },
    { number: '108', label: 'Ambulance', icon: '🚑' },
    { number: '100', label: 'Police', icon: '👮' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-8 py-6 rounded-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Siren className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">Emergency Center</h1>
              <p className="text-orange-100 mt-1">SOS alerts, disaster notifications, and emergency response</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {activeAlertsCount > 0 && (
              <Badge className="bg-white text-red-600 text-lg px-3 py-1">
                {activeAlertsCount} Active Alerts
              </Badge>
            )}
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
                <h3 className="font-bold text-red-800">⚠️ CRITICAL EMERGENCY</h3>
                <p className="text-red-700">
                  {criticalAlerts.length} critical alert{criticalAlerts.length > 1 ? 's' : ''} requiring immediate action
                </p>
              </div>
              <Button 
                onClick={handleSOSPress}
                disabled={countdown > 0}
                className="ml-auto bg-red-600 hover:bg-red-700 text-white px-6 py-2"
              >
                {countdown > 0 ? `SOS in ${countdown}` : 'ACTIVATE SOS'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="sos" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sos">SOS Emergency</TabsTrigger>
          <TabsTrigger value="alerts">Active Alerts</TabsTrigger>
          <TabsTrigger value="contacts">Quick Contacts</TabsTrigger>
        </TabsList>

        <TabsContent value="sos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Siren className="w-6 h-6 text-red-600" />
                <span>Emergency SOS</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {!sosTriggered ? (
                <div className="text-center space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-gray-800">Press SOS in Emergency</h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                      This will immediately notify security, emergency services, and your emergency contacts
                    </p>
                  </div>

                  <div className="space-y-4">
                    <Button 
                      onClick={handleSOSPress}
                      disabled={countdown > 0}
                      className="w-48 h-48 rounded-full bg-red-600 hover:bg-red-700 text-white text-xl font-bold shadow-lg hover:shadow-xl transition-all mx-auto block"
                    >
                      {countdown > 0 ? (
                        <div className="space-y-2">
                          <Siren className="w-12 h-12 mx-auto animate-pulse" />
                          <div>SOS in {countdown}</div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Siren className="w-12 h-12 mx-auto" />
                          <div>SOS</div>
                        </div>
                      )}
                    </Button>

                    <div className="bg-yellow-50 rounded-lg p-4 max-w-md mx-auto">
                      <div className="flex items-start space-x-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-yellow-800">How SOS Works</h4>
                          <ul className="text-sm text-yellow-700 mt-2 space-y-1">
                            <li>• Alerts school security immediately</li>
                            <li>• Notifies emergency services</li>
                            <li>• Sends location to your emergency contacts</li>
                            <li>• Triggers campus-wide emergency protocols</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-6">
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-12 h-12 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-green-600">SOS Activated Successfully</h3>
                    <p className="text-gray-600 mt-2">Help is on the way. Stay where you are unless instructed otherwise.</p>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-6 max-w-md mx-auto">
                    <h4 className="font-semibold text-green-800 mb-3">Notifications Sent To:</h4>
                    <div className="space-y-2 text-sm text-green-700">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4" />
                        <span>School Security & Administration</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4" />
                        <span>Emergency Services (112)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4" />
                        <span>Your Emergency Contacts</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4" />
                        <span>Campus Safety Team</span>
                      </div>
                    </div>
                  </div>

                  <Button onClick={resetSOS} variant="outline">
                    Reset SOS System
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
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
        </TabsContent>

        <TabsContent value="contacts" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {emergencyNumbers.map((contact) => (
              <Card key={contact.number} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{contact.icon}</span>
                      <div>
                        <h3 className="font-semibold">{contact.label}</h3>
                        <p className="text-2xl font-bold text-blue-600">{contact.number}</p>
                      </div>
                    </div>
                    <Button 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => window.open(`tel:${contact.number}`, '_self')}
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Call
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Emergency Protocols</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-semibold text-red-800 mb-2">🔥 Fire Emergency</h4>
                  <p className="text-red-700 text-sm">Activate alarm, evacuate via nearest exit, meet at assembly point, call 101</p>
                </div>
                
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <h4 className="font-semibold text-orange-800 mb-2">🌍 Earthquake</h4>
                  <p className="text-orange-700 text-sm">Drop, Cover, Hold On. Stay under desk during shaking, then evacuate carefully</p>
                </div>
                
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">🚑 Medical Emergency</h4>
                  <p className="text-blue-700 text-sm">Call 108, provide first aid if trained, don't move injured person unless necessary</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmergencyCenter;