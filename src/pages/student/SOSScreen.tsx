import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Phone, MapPin, Users, AlertTriangle, CheckCircle } from 'lucide-react';

const SOSScreen = () => {
  const { triggerSOS } = useApp();
  const [sosTriggered, setSosTriggered] = useState(false);
  const [countdown, setCountdown] = useState(0);

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

  if (sosTriggered) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="shadow-emergency border-2 border-emergency/20">
          <CardHeader className="text-center">
            <div className="text-6xl mb-4 success-bounce">✅</div>
            <CardTitle className="text-2xl text-success">Emergency Alert Sent!</CardTitle>
            <CardDescription>Your SOS has been successfully transmitted</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="bg-success/10 border border-success/20 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="h-5 w-5 text-success" />
                <span className="font-semibold text-success">Alert Status: ACTIVE</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Emergency services and school administrators have been notified of your location and situation.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-card border rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Phone className="h-4 w-4 text-primary" />
                  <span className="font-medium">Emergency Services</span>
                </div>
                <p className="text-sm text-muted-foreground">911 contacted</p>
                <Badge variant="secondary" className="bg-success/10 text-success border-success/20 mt-2">
                  Dispatched
                </Badge>
              </div>

              <div className="bg-card border rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="font-medium">School Safety</span>
                </div>
                <p className="text-sm text-muted-foreground">Administrators alerted</p>
                <Badge variant="secondary" className="bg-success/10 text-success border-success/20 mt-2">
                  Notified
                </Badge>
              </div>
            </div>

            <div className="bg-muted/30 rounded-lg p-4">
              <h4 className="font-semibold mb-2 flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4" />
                <span>What to do now:</span>
              </h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Stay calm and remain in a safe location if possible</li>
                <li>• Wait for emergency responders to arrive</li>
                <li>• Follow instructions from school safety personnel</li>
                <li>• Keep your phone with you for further communication</li>
              </ul>
            </div>

            <Button onClick={resetSOS} variant="outline" className="w-full">
              Reset SOS (For Demo)
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-emergency mb-2">🚨 Emergency SOS</h1>
        <p className="text-muted-foreground">
          Use only in real emergencies. This will alert emergency services and school administration.
        </p>
      </div>

      {/* SOS Button */}
      <Card className="shadow-emergency border-2 border-emergency/20">
        <CardHeader className="text-center">
          <CardTitle className="text-emergency">Emergency Alert System</CardTitle>
          <CardDescription>
            Press and hold the button below to send an immediate distress signal
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            {countdown > 0 ? (
              <div className="relative">
                <Button 
                  variant="emergency" 
                  size="emergency"
                  className="w-32 h-32 text-3xl font-bold cursor-not-allowed"
                  disabled
                >
                  {countdown}
                </Button>
                <div className="absolute inset-0 rounded-full border-4 border-emergency animate-ping"></div>
              </div>
            ) : (
              <Button 
                variant="emergency" 
                size="emergency"
                onClick={handleSOSPress}
                className="w-32 h-32 text-3xl font-bold hover:scale-110 transition-all duration-200"
              >
                SOS
              </Button>
            )}
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {countdown > 0 
                ? "Sending emergency alert..." 
                : "Press the red button to send emergency alert"
              }
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contacts */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Phone className="h-5 w-5" />
            <span>Emergency Contacts</span>
          </CardTitle>
          <CardDescription>Important numbers for different types of emergencies</CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-muted/30 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-3 h-3 bg-emergency rounded-full"></div>
                <span className="font-semibold">Emergency Services</span>
              </div>
              <p className="text-lg font-bold">911</p>
              <p className="text-xs text-muted-foreground">Police, Fire, Medical</p>
            </div>

            <div className="bg-muted/30 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <span className="font-semibold">School Security</span>
              </div>
              <p className="text-lg font-bold">(555) 123-SAFE</p>
              <p className="text-xs text-muted-foreground">Campus Safety Office</p>
            </div>

            <div className="bg-muted/30 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-3 h-3 bg-accent rounded-full"></div>
                <span className="font-semibold">Crisis Hotline</span>
              </div>
              <p className="text-lg font-bold">988</p>
              <p className="text-xs text-muted-foreground">Mental Health Crisis</p>
            </div>

            <div className="bg-muted/30 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-3 h-3 bg-warning rounded-full"></div>
                <span className="font-semibold">Poison Control</span>
              </div>
              <p className="text-lg font-bold">(800) 222-1222</p>
              <p className="text-xs text-muted-foreground">24/7 Poison Help</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Safety Tips */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Location & Safety</span>
          </CardTitle>
          <CardDescription>Your safety information</CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Your Current Location</h4>
              <p className="text-sm text-muted-foreground">
                📍 Academic Building A, Room 205<br />
                123 University Ave, Campus Zone 1
              </p>
            </div>

            <div className="bg-muted/30 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Before Using SOS:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Assess if you're in immediate danger</li>
                <li>• Move to a safe location if possible</li>
                <li>• Stay calm and follow emergency procedures</li>
                <li>• Only use for genuine emergencies</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SOSScreen;