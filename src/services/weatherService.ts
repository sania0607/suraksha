// Weather Service for OpenWeatherMap API Integration
export interface WeatherAlert {
  id: string;
  event: string;
  start: number;
  end: number;
  description: string;
  severity: 'minor' | 'moderate' | 'severe' | 'extreme';
  tags: string[];
  areas: string[];
}

export interface WeatherData {
  location: {
    name: string;
    country: string;
    lat: number;
    lon: number;
  };
  current: {
    temp: number;
    feels_like: number;
    humidity: number;
    visibility: number;
    wind_speed: number;
    wind_deg: number;
    weather: {
      main: string;
      description: string;
      icon: string;
    }[];
    uvi: number;
  };
  alerts?: WeatherAlert[];
  forecast: {
    dt: number;
    temp: {
      min: number;
      max: number;
    };
    weather: {
      main: string;
      description: string;
      icon: string;
    }[];
    pop: number; // Probability of precipitation
  }[];
  aqi?: {
    co: number;
    no: number;
    no2: number;
    o3: number;
    so2: number;
    pm2_5: number;
    pm10: number;
    nh3: number;
  };
}

export interface EmergencyWeatherAlert {
  id: string;
  type: 'weather_alert' | 'air_quality' | 'severe_weather';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  location: string;
  startTime: Date;
  endTime?: Date;
  recommendations: string[];
  isActive: boolean;
}

class WeatherService {
  private apiKey: string;
  private baseUrl = 'https://api.openweathermap.org/data/2.5';
  private geocodingUrl = 'https://api.openweathermap.org/geo/1.0';
  private alertCheckInterval: NodeJS.Timeout | null = null;
  private alertCallbacks: ((alerts: EmergencyWeatherAlert[]) => void)[] = [];

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  // Get coordinates for a city/area
  async getCoordinates(cityName: string, countryCode?: string): Promise<{lat: number, lon: number} | null> {
    try {
      const query = countryCode ? `${cityName},${countryCode}` : cityName;
      const response = await fetch(
        `${this.geocodingUrl}/direct?q=${encodeURIComponent(query)}&limit=1&appid=${this.apiKey}`
      );

      if (!response.ok) {
        throw new Error(`Geocoding API error: ${response.status}`);
      }

      const data = await response.json();
      if (data.length === 0) {
        return null;
      }

      return {
        lat: data[0].lat,
        lon: data[0].lon
      };
    } catch (error) {
      console.error('Error fetching coordinates:', error);
      return null;
    }
  }

  // Get comprehensive weather data including alerts
  async getWeatherData(lat: number, lon: number): Promise<WeatherData | null> {
    try {
      // Get current weather and alerts
      const currentResponse = await fetch(
        `${this.baseUrl}/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&units=metric&appid=${this.apiKey}`
      );

      if (!currentResponse.ok) {
        throw new Error(`Weather API error: ${currentResponse.status}`);
      }

      const weatherData = await currentResponse.json();

      // Get air quality data
      const aqiResponse = await fetch(
        `${this.baseUrl}/air_pollution?lat=${lat}&lon=${lon}&appid=${this.apiKey}`
      );

      let aqiData = null;
      if (aqiResponse.ok) {
        const aqiResult = await aqiResponse.json();
        aqiData = aqiResult.list[0]?.components;
      }

      // Get location name
      const locationResponse = await fetch(
        `${this.geocodingUrl}/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${this.apiKey}`
      );

      let locationName = 'Unknown Location';
      let country = '';
      if (locationResponse.ok) {
        const locationData = await locationResponse.json();
        if (locationData.length > 0) {
          locationName = locationData[0].name;
          country = locationData[0].country;
        }
      }

      return {
        location: {
          name: locationName,
          country: country,
          lat,
          lon
        },
        current: {
          temp: weatherData.current.temp,
          feels_like: weatherData.current.feels_like,
          humidity: weatherData.current.humidity,
          visibility: weatherData.current.visibility || 0,
          wind_speed: weatherData.current.wind_speed,
          wind_deg: weatherData.current.wind_deg,
          weather: weatherData.current.weather,
          uvi: weatherData.current.uvi
        },
        alerts: weatherData.alerts?.map((alert: any) => ({
          id: `${alert.sender_name}-${alert.start}`,
          event: alert.event,
          start: alert.start,
          end: alert.end,
          description: alert.description,
          severity: this.mapSeverity(alert.tags),
          tags: alert.tags || [],
          areas: alert.areas || []
        })),
        forecast: weatherData.daily.slice(0, 5).map((day: any) => ({
          dt: day.dt,
          temp: {
            min: day.temp.min,
            max: day.temp.max
          },
          weather: day.weather,
          pop: day.pop
        })),
        aqi: aqiData
      };
    } catch (error) {
      console.error('Error fetching weather data:', error);
      return null;
    }
  }

  // Convert weather alerts to emergency alerts
  convertToEmergencyAlerts(weatherData: WeatherData): EmergencyWeatherAlert[] {
    const alerts: EmergencyWeatherAlert[] = [];

    // Process weather alerts
    if (weatherData.alerts) {
      weatherData.alerts.forEach(alert => {
        const recommendations = this.getRecommendations(alert.event);
        
        alerts.push({
          id: alert.id,
          type: 'weather_alert',
          severity: this.mapAlertSeverity(alert.severity),
          title: `${alert.event} Alert`,
          message: alert.description,
          location: weatherData.location.name,
          startTime: new Date(alert.start * 1000),
          endTime: alert.end ? new Date(alert.end * 1000) : undefined,
          recommendations,
          isActive: Date.now() / 1000 < alert.end
        });
      });
    }

    // Check for severe weather conditions
    const currentWeather = weatherData.current.weather[0];
    if (this.isSevereWeather(currentWeather.main, weatherData.current)) {
      alerts.push({
        id: `severe-${Date.now()}`,
        type: 'severe_weather',
        severity: this.getWeatherSeverity(currentWeather.main, weatherData.current),
        title: `Severe ${currentWeather.main} Conditions`,
        message: `Current conditions: ${currentWeather.description}. Wind: ${weatherData.current.wind_speed} m/s`,
        location: weatherData.location.name,
        startTime: new Date(),
        recommendations: this.getRecommendations(currentWeather.main),
        isActive: true
      });
    }

    // Check air quality
    if (weatherData.aqi && this.isPoorAirQuality(weatherData.aqi)) {
      alerts.push({
        id: `aqi-${Date.now()}`,
        type: 'air_quality',
        severity: this.getAQISeverity(weatherData.aqi),
        title: 'Poor Air Quality Alert',
        message: `Air quality is unhealthy. PM2.5: ${weatherData.aqi.pm2_5} μg/m³, PM10: ${weatherData.aqi.pm10} μg/m³`,
        location: weatherData.location.name,
        startTime: new Date(),
        recommendations: [
          'Limit outdoor activities, especially for sensitive individuals',
          'Keep windows closed',
          'Use air purifiers if available',
          'Wear N95 masks when going outside'
        ],
        isActive: true
      });
    }

    return alerts;
  }

  // Start monitoring weather alerts
  startAlertMonitoring(lat: number, lon: number, intervalMinutes: number = 30) {
    if (this.alertCheckInterval) {
      clearInterval(this.alertCheckInterval);
    }

    const checkAlerts = async () => {
      const weatherData = await this.getWeatherData(lat, lon);
      if (weatherData) {
        const alerts = this.convertToEmergencyAlerts(weatherData);
        this.notifyAlertCallbacks(alerts);
      }
    };

    // Initial check
    checkAlerts();

    // Set up interval
    this.alertCheckInterval = setInterval(checkAlerts, intervalMinutes * 60 * 1000);
  }

  // Stop monitoring
  stopAlertMonitoring() {
    if (this.alertCheckInterval) {
      clearInterval(this.alertCheckInterval);
      this.alertCheckInterval = null;
    }
  }

  // Subscribe to alert notifications
  onAlertsUpdate(callback: (alerts: EmergencyWeatherAlert[]) => void) {
    this.alertCallbacks.push(callback);
  }

  // Unsubscribe from alerts
  offAlertsUpdate(callback: (alerts: EmergencyWeatherAlert[]) => void) {
    this.alertCallbacks = this.alertCallbacks.filter(cb => cb !== callback);
  }

  private notifyAlertCallbacks(alerts: EmergencyWeatherAlert[]) {
    this.alertCallbacks.forEach(callback => callback(alerts));
  }

  private mapSeverity(tags: string[]): WeatherAlert['severity'] {
    if (tags.includes('Extreme')) return 'extreme';
    if (tags.includes('Severe')) return 'severe';
    if (tags.includes('Moderate')) return 'moderate';
    return 'minor';
  }

  private mapAlertSeverity(severity: WeatherAlert['severity']): EmergencyWeatherAlert['severity'] {
    switch (severity) {
      case 'extreme': return 'critical';
      case 'severe': return 'high';
      case 'moderate': return 'medium';
      default: return 'low';
    }
  }

  private isSevereWeather(weatherMain: string, current: any): boolean {
    const severeConditions = ['Thunderstorm', 'Tornado', 'Hurricane', 'Blizzard'];
    const highWind = current.wind_speed > 15; // 15 m/s = ~54 km/h
    const lowVisibility = current.visibility < 1000; // Less than 1km
    
    return severeConditions.includes(weatherMain) || highWind || lowVisibility;
  }

  private getWeatherSeverity(weatherMain: string, current: any): EmergencyWeatherAlert['severity'] {
    if (['Tornado', 'Hurricane'].includes(weatherMain)) return 'critical';
    if (weatherMain === 'Thunderstorm' || current.wind_speed > 20) return 'high';
    if (current.wind_speed > 10 || current.visibility < 5000) return 'medium';
    return 'low';
  }

  private isPoorAirQuality(aqi: any): boolean {
    // WHO guidelines: PM2.5 > 15 μg/m³, PM10 > 45 μg/m³
    return aqi.pm2_5 > 15 || aqi.pm10 > 45;
  }

  private getAQISeverity(aqi: any): EmergencyWeatherAlert['severity'] {
    if (aqi.pm2_5 > 55 || aqi.pm10 > 154) return 'critical';
    if (aqi.pm2_5 > 35 || aqi.pm10 > 100) return 'high';
    if (aqi.pm2_5 > 25 || aqi.pm10 > 75) return 'medium';
    return 'low';
  }

  private getRecommendations(eventType: string): string[] {
    const recommendations: Record<string, string[]> = {
      'Thunderstorm': [
        'Stay indoors and away from windows',
        'Avoid using electrical appliances',
        'Do not take shelter under trees',
        'If outdoors, seek low ground and crouch down'
      ],
      'Rain': [
        'Carry umbrella or raincoat',
        'Be cautious of slippery surfaces',
        'Avoid flooded areas',
        'Drive carefully with reduced visibility'
      ],
      'Snow': [
        'Dress in warm layers',
        'Be careful of icy surfaces',
        'Keep emergency supplies in vehicle',
        'Limit outdoor exposure'
      ],
      'Fog': [
        'Use fog lights while driving',
        'Reduce speed and increase following distance',
        'Be extra cautious at intersections',
        'Consider delaying non-essential travel'
      ],
      'Tornado': [
        'Seek shelter immediately in lowest floor interior room',
        'Stay away from windows and doors',
        'Cover yourself with heavy blankets',
        'Listen to emergency broadcasts'
      ],
      'Hurricane': [
        'Evacuate if ordered by authorities',
        'Secure outdoor objects',
        'Stock up on emergency supplies',
        'Stay indoors until all clear is given'
      ]
    };

    return recommendations[eventType] || [
      'Stay informed through official weather updates',
      'Follow local emergency guidance',
      'Avoid unnecessary outdoor activities',
      'Keep emergency contacts handy'
    ];
  }
}

export default WeatherService;