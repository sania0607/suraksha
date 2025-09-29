import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import WeatherAlerts from '@/components/WeatherAlerts';

const StudentWeatherAlerts = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate('/student')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Weather & Environmental Alerts</h1>
          <p className="text-muted-foreground">
            Stay informed about weather conditions that could impact campus safety
          </p>
        </div>
      </div>

      {/* Info Card */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-800">About Weather Monitoring</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-blue-700">
            Our weather monitoring system uses OpenWeatherMap API to track severe weather conditions, air quality, 
            and environmental hazards that could affect campus safety. You'll receive real-time alerts for:
          </CardDescription>
          <ul className="list-disc list-inside text-sm text-blue-600 mt-3 space-y-1">
            <li>Severe thunderstorms and lightning</li>
            <li>High wind conditions</li>
            <li>Heavy rain and flooding risks</li>
            <li>Snow and ice conditions</li>
            <li>Poor air quality levels</li>
            <li>Extreme temperature conditions</li>
          </ul>
        </CardContent>
      </Card>

      {/* Weather Alerts Component */}
      <WeatherAlerts />
    </div>
  );
};

export default StudentWeatherAlerts;