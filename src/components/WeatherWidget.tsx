import React from 'react';
import { Link } from 'react-router-dom';
import { useWeather } from '@/contexts/WeatherContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Cloud, AlertTriangle, ArrowRight, Settings } from 'lucide-react';

const WeatherWidget = () => {
  const { weatherData, weatherAlerts, isMonitoring, apiKey, location } = useWeather();

  // If not configured, show setup prompt
  if (!apiKey || !location) {
    return (
      <Card className="border-blue-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cloud className="h-5 w-5 text-blue-500" />
              <CardTitle className="text-lg">Weather Monitoring</CardTitle>
            </div>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className="mb-3">
            Get real-time weather alerts for disaster preparedness
          </CardDescription>
          <Link to="/student/weather-alerts">
            <Button size="sm" className="w-full">
              Set Up Weather Alerts
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  // Show active alerts
  const activeAlerts = weatherAlerts.filter(alert => alert.isActive);
  const criticalAlerts = activeAlerts.filter(alert => alert.severity === 'critical' || alert.severity === 'high');

  return (
    <Card className={criticalAlerts.length > 0 ? "border-red-200 bg-red-50" : "border-blue-200"}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cloud className="h-5 w-5 text-blue-500" />
            <CardTitle className="text-lg">Weather Status</CardTitle>
            {isMonitoring && (
              <Badge variant="secondary" className="text-xs">
                🟢 Monitoring
              </Badge>
            )}
          </div>
          {activeAlerts.length > 0 && (
            <AlertTriangle className="h-5 w-5 text-red-500" />
          )}
        </div>
      </CardHeader>
      <CardContent>
        {criticalAlerts.length > 0 ? (
          <div className="space-y-2">
            <div className="text-red-600 font-medium">
              🚨 {criticalAlerts.length} Critical Alert{criticalAlerts.length > 1 ? 's' : ''}
            </div>
            <div className="text-sm text-red-700">
              {criticalAlerts[0].title} - {criticalAlerts[0].message.substring(0, 80)}...
            </div>
            <Link to="/student/weather-alerts">
              <Button size="sm" variant="destructive" className="w-full">
                View All Alerts
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        ) : weatherData ? (
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">
              {weatherData.location.name} • {weatherData.current.temp.toFixed(1)}°C
            </div>
            <div className="text-sm">
              {weatherData.current.weather[0].description}
              {weatherData.current.wind_speed > 10 && (
                <span className="text-orange-600 ml-2">
                  • High winds: {weatherData.current.wind_speed.toFixed(1)} m/s
                </span>
              )}
            </div>
            {activeAlerts.length > 0 ? (
              <div className="text-sm text-orange-600">
                ⚠️ {activeAlerts.length} weather alert{activeAlerts.length > 1 ? 's' : ''} active
              </div>
            ) : (
              <div className="text-sm text-green-600">
                ✅ No weather alerts
              </div>
            )}
            <Link to="/student/weather-alerts">
              <Button size="sm" variant="outline" className="w-full">
                View Details
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="text-sm text-muted-foreground mb-2">
              Weather data not available
            </div>
            <Link to="/student/weather-alerts">
              <Button size="sm" variant="outline">
                Check Settings
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WeatherWidget;