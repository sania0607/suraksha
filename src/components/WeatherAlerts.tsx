import React, { useState } from 'react';
import { useWeather } from '@/contexts/WeatherContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  Sun, 
  CloudLightning, 
  Wind, 
  AlertTriangle, 
  Settings, 
  MapPin, 
  RefreshCw,
  X,
  Play,
  Pause,
  Thermometer,
  Droplets,
  Eye,
  Compass
} from 'lucide-react';

const WeatherAlerts = () => {
  const {
    weatherData,
    weatherAlerts,
    isLoading,
    error,
    isMonitoring,
    apiKey,
    location,
    setApiKey,
    setLocationByCity,
    startMonitoring,
    stopMonitoring,
    refreshWeatherData,
    dismissAlert
  } = useWeather();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [tempApiKey, setTempApiKey] = useState(apiKey);
  const [tempCity, setTempCity] = useState('');
  const [tempCountry, setTempCountry] = useState('');

  const getWeatherIcon = (weatherMain: string) => {
    switch (weatherMain.toLowerCase()) {
      case 'clear': return <Sun className="h-6 w-6 text-yellow-500" />;
      case 'rain': return <CloudRain className="h-6 w-6 text-blue-500" />;
      case 'snow': return <CloudSnow className="h-6 w-6 text-gray-400" />;
      case 'thunderstorm': return <CloudLightning className="h-6 w-6 text-purple-500" />;
      case 'clouds': return <Cloud className="h-6 w-6 text-gray-500" />;
      case 'mist':
      case 'fog': return <Eye className="h-6 w-6 text-gray-400" />;
      default: return <Cloud className="h-6 w-6 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return '🚨';
      case 'high': return '⚠️';
      case 'medium': return '⚡';
      case 'low': return 'ℹ️';
      default: return 'ℹ️';
    }
  };

  const handleSaveSettings = async () => {
    if (tempApiKey !== apiKey) {
      setApiKey(tempApiKey);
    }

    if (tempCity) {
      const success = await setLocationByCity(tempCity, tempCountry || undefined);
      if (success) {
        setTempCity('');
        setTempCountry('');
        setIsSettingsOpen(false);
      }
    } else {
      setIsSettingsOpen(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Weather Alerts & Monitoring</h2>
          <p className="text-muted-foreground">
            Real-time weather alerts from OpenWeatherMap for disaster preparedness
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshWeatherData}
            disabled={isLoading || !apiKey || !location}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <Button
            variant={isMonitoring ? "destructive" : "default"}
            size="sm"
            onClick={isMonitoring ? stopMonitoring : startMonitoring}
            disabled={!apiKey || !location}
          >
            {isMonitoring ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Stop Monitoring
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Start Monitoring
              </>
            )}
          </Button>
          
          <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Weather Settings</DialogTitle>
                <DialogDescription>
                  Configure your OpenWeatherMap API key and monitoring location
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="api-key">OpenWeatherMap API Key</Label>
                  <Input
                    id="api-key"
                    type="password"
                    placeholder="Enter your API key"
                    value={tempApiKey}
                    onChange={(e) => setTempApiKey(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Get your free API key from{' '}
                    <a 
                      href="https://openweathermap.org/api" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      openweathermap.org
                    </a>
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="e.g., Mumbai"
                      value={tempCity}
                      onChange={(e) => setTempCity(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country Code (Optional)</Label>
                    <Input
                      id="country"
                      placeholder="e.g., IN"
                      value={tempCountry}
                      onChange={(e) => setTempCountry(e.target.value)}
                    />
                  </div>
                </div>
                
                {location && (
                  <div className="text-sm text-muted-foreground">
                    Current location: {location.name} ({location.lat.toFixed(4)}, {location.lon.toFixed(4)})
                  </div>
                )}
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsSettingsOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveSettings}>
                  Save Settings
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Configuration Required */}
      {(!apiKey || !location) && (
        <Alert>
          <Settings className="h-4 w-4" />
          <AlertTitle>Configuration Required</AlertTitle>
          <AlertDescription>
            Please configure your OpenWeatherMap API key and location in Settings to enable weather monitoring.
          </AlertDescription>
        </Alert>
      )}

      {/* Active Weather Alerts */}
      {weatherAlerts.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-red-600">🚨 Active Weather Alerts</h3>
          {weatherAlerts.map((alert) => (
            <Card key={alert.id} className="border-red-200 bg-red-50">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{getSeverityIcon(alert.severity)}</span>
                    <div>
                      <CardTitle className="text-red-800">{alert.title}</CardTitle>
                      <CardDescription className="text-red-600">
                        {alert.location} • {formatTime(alert.startTime)}
                        {alert.endTime && ` - ${formatTime(alert.endTime)}`}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getSeverityColor(alert.severity)}>
                      {alert.severity.toUpperCase()}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => dismissAlert(alert.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-red-700 mb-3">{alert.message}</p>
                <div>
                  <h4 className="font-medium text-red-800 mb-2">Recommended Actions:</h4>
                  <ul className="list-disc list-inside text-sm text-red-600 space-y-1">
                    {alert.recommendations.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Current Weather */}
      {weatherData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Current Weather - {weatherData.location.name}
              {isMonitoring && (
                <Badge variant="secondary" className="ml-2">
                  🟢 Monitoring Active
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                {getWeatherIcon(weatherData.current.weather[0].main)}
                <div>
                  <div className="font-medium">{weatherData.current.weather[0].description}</div>
                  <div className="text-sm text-muted-foreground">
                    {weatherData.current.temp.toFixed(1)}°C
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Wind className="h-5 w-5 text-blue-500" />
                <div>
                  <div className="font-medium">Wind Speed</div>
                  <div className="text-sm text-muted-foreground">
                    {weatherData.current.wind_speed.toFixed(1)} m/s
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Droplets className="h-5 w-5 text-blue-500" />
                <div>
                  <div className="font-medium">Humidity</div>
                  <div className="text-sm text-muted-foreground">
                    {weatherData.current.humidity}%
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Eye className="h-5 w-5 text-gray-500" />
                <div>
                  <div className="font-medium">Visibility</div>
                  <div className="text-sm text-muted-foreground">
                    {weatherData.current.visibility ? 
                      `${(weatherData.current.visibility / 1000).toFixed(1)} km` : 
                      'N/A'
                    }
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 5-Day Forecast */}
      {weatherData && weatherData.forecast && (
        <Card>
          <CardHeader>
            <CardTitle>5-Day Weather Forecast</CardTitle>
            <CardDescription>
              Monitor upcoming weather conditions for disaster preparedness
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {weatherData.forecast.map((day, index) => (
                <div key={day.dt} className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium mb-2">
                    {index === 0 ? 'Today' : new Date(day.dt * 1000).toLocaleDateString(undefined, { weekday: 'short' })}
                  </div>
                  <div className="flex justify-center mb-2">
                    {getWeatherIcon(day.weather[0].main)}
                  </div>
                  <div className="text-xs text-muted-foreground mb-1">
                    {day.weather[0].description}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">{day.temp.max.toFixed(0)}°</span>
                    <span className="text-muted-foreground">/{day.temp.min.toFixed(0)}°</span>
                  </div>
                  {day.pop > 0.3 && (
                    <div className="text-xs text-blue-600 mt-1">
                      {(day.pop * 100).toFixed(0)}% rain
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Air Quality Index */}
      {weatherData && weatherData.aqi && (
        <Card>
          <CardHeader>
            <CardTitle>Air Quality Index</CardTitle>
            <CardDescription>Current air pollution levels in your area</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-muted-foreground">PM2.5</div>
                <div className="font-medium">{weatherData.aqi.pm2_5.toFixed(1)} μg/m³</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-muted-foreground">PM10</div>
                <div className="font-medium">{weatherData.aqi.pm10.toFixed(1)} μg/m³</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-muted-foreground">O3</div>
                <div className="font-medium">{weatherData.aqi.o3.toFixed(1)} μg/m³</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-muted-foreground">NO2</div>
                <div className="font-medium">{weatherData.aqi.no2.toFixed(1)} μg/m³</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WeatherAlerts;