import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Shield, Heart, Flame, Users, Navigation } from 'lucide-react';

interface SafetyFeature {
  id: string;
  type: 'exit' | 'assembly' | 'extinguisher' | 'firstaid';
  name: string;
  position: { x: number; y: number };
  description: string;
}

const CampusMap = () => {
  const navigate = useNavigate();
  const [selectedFeature, setSelectedFeature] = useState<SafetyFeature | null>(null);

  const safetyFeatures: SafetyFeature[] = [
    { id: '1', type: 'exit', name: 'Main Exit', position: { x: 85, y: 30 }, description: 'Primary evacuation route to parking lot' },
    { id: '2', type: 'exit', name: 'Emergency Exit A', position: { x: 15, y: 40 }, description: 'West side emergency exit' },
    { id: '3', type: 'exit', name: 'Emergency Exit B', position: { x: 85, y: 70 }, description: 'East side emergency exit' },
    { id: '4', type: 'assembly', name: 'Assembly Point 1', position: { x: 50, y: 15 }, description: 'Main assembly area - Football Field' },
    { id: '5', type: 'assembly', name: 'Assembly Point 2', position: { x: 20, y: 85 }, description: 'Secondary assembly area - Basketball Court' },
    { id: '6', type: 'extinguisher', name: 'Fire Extinguisher', position: { x: 30, y: 35 }, description: 'Class A fire extinguisher' },
    { id: '7', type: 'extinguisher', name: 'Fire Extinguisher', position: { x: 70, y: 55 }, description: 'Class ABC fire extinguisher' },
    { id: '8', type: 'firstaid', name: 'First Aid Station', position: { x: 50, y: 45 }, description: 'Nurse\'s office with medical supplies' }
  ];

  const getFeatureIcon = (type: string) => {
    switch (type) {
      case 'exit': return <Navigation className="h-4 w-4" />;
      case 'assembly': return <Users className="h-4 w-4" />;
      case 'extinguisher': return <Flame className="h-4 w-4" />;
      case 'firstaid': return <Heart className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  const getFeatureColor = (type: string) => {
    switch (type) {
      case 'exit': return 'bg-primary text-primary-foreground';
      case 'assembly': return 'bg-accent text-accent-foreground';
      case 'extinguisher': return 'bg-emergency text-emergency-foreground';
      case 'firstaid': return 'bg-success text-success-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const startEvacuationPractice = () => {
    navigate('/student/evacuation-practice');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Campus Safety Map</h1>
          <p className="text-muted-foreground">
            Interactive map showing safe zones, exits, and emergency equipment locations
          </p>
        </div>
        
        <Button onClick={startEvacuationPractice} className="shadow-elegant">
          <Shield className="h-4 w-4 mr-2" />
          Practice Evacuation
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Container */}
        <Card className="lg:col-span-2 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              School Campus Map
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg p-4 h-96 border-2 border-dashed border-border">
              {/* Campus Buildings - Simple representation */}
              <div className="absolute top-8 left-8 w-24 h-16 bg-card border-2 border-border rounded flex items-center justify-center text-xs font-medium shadow-soft">
                Library
              </div>
              <div className="absolute top-8 right-8 w-24 h-16 bg-card border-2 border-border rounded flex items-center justify-center text-xs font-medium shadow-soft">
                Science Block
              </div>
              <div className="absolute bottom-16 left-8 w-24 h-16 bg-card border-2 border-border rounded flex items-center justify-center text-xs font-medium shadow-soft">
                Admin Block
              </div>
              <div className="absolute bottom-16 right-8 w-24 h-16 bg-card border-2 border-border rounded flex items-center justify-center text-xs font-medium shadow-soft">
                Cafeteria
              </div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-20 bg-card border-2 border-border rounded flex items-center justify-center text-xs font-medium shadow-soft">
                Main Building
              </div>

              {/* Safety Features */}
              {safetyFeatures.map((feature) => (
                <button
                  key={feature.id}
                  className={`absolute w-8 h-8 rounded-full ${getFeatureColor(feature.type)} shadow-elegant transition-smooth hover:scale-110 flex items-center justify-center z-10`}
                  style={{
                    left: `${feature.position.x}%`,
                    top: `${feature.position.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  onClick={() => setSelectedFeature(feature)}
                >
                  {getFeatureIcon(feature.type)}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Legend and Details */}
        <div className="space-y-4">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>Legend</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <Navigation className="h-3 w-3 text-primary-foreground" />
                </div>
                <span className="text-sm">Emergency Exits</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                  <Users className="h-3 w-3 text-accent-foreground" />
                </div>
                <span className="text-sm">Assembly Points</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-emergency rounded-full flex items-center justify-center">
                  <Flame className="h-3 w-3 text-emergency-foreground" />
                </div>
                <span className="text-sm">Fire Extinguishers</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center">
                  <Heart className="h-3 w-3 text-success-foreground" />
                </div>
                <span className="text-sm">First Aid Stations</span>
              </div>
            </CardContent>
          </Card>

          {selectedFeature && (
            <Card className="shadow-elegant border-l-4 border-l-primary">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  {getFeatureIcon(selectedFeature.type)}
                  <CardTitle className="text-lg">{selectedFeature.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  {selectedFeature.description}
                </p>
                <Badge variant="outline" className="text-xs">
                  {selectedFeature.type.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </Badge>
              </CardContent>
            </Card>
          )}

          <Card className="shadow-soft bg-gradient-to-br from-accent/10 to-primary/10">
            <CardHeader>
              <CardTitle className="text-lg">Quick Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>• Know at least 2 evacuation routes</p>
              <p>• Assembly points are marked in blue</p>
              <p>• Stay low during fire evacuation</p>
              <p>• Never use elevators during emergencies</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CampusMap;