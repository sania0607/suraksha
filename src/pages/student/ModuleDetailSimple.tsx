import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '@/contexts/FixedAppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, BookOpen, Clock, Target } from 'lucide-react';

const ModuleDetailSimple = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const { modules, startModule } = useApp();

  const module = modules.find(m => m.id === moduleId || m.slug === moduleId);

  if (!module) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Module Not Found</h2>
            <p className="text-gray-600 mb-4">The requested module could not be found.</p>
            <Link to="/student/modules">
              <Button>Back to Modules</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getModuleIcon = (disasterType: string) => {
    switch (disasterType?.toLowerCase()) {
      case 'earthquake': return '🏗️';
      case 'fire': return '🔥';
      case 'flood': return '🌊';
      case 'tornado': return '🌪️';
      default: return '⚠️';
    }
  };

  const handleStartModule = async () => {
    try {
      await startModule(module.id);
      // Navigate to first phase or show success message
    } catch (error) {
      console.error('Failed to start module:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link to="/student/modules">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Modules
            </Button>
          </Link>
        </div>

        {/* Module Info */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start gap-4">
              <div className="text-4xl">{getModuleIcon(module.disaster_type)}</div>
              <div className="flex-1">
                <CardTitle className="text-2xl mb-2">{module.title}</CardTitle>
                <CardDescription className="text-lg">{module.description}</CardDescription>
                <div className="flex gap-2 mt-4">
                  <Badge variant="secondary">
                    <BookOpen className="h-3 w-3 mr-1" />
                    {module.disaster_type}
                  </Badge>
                  <Badge variant="secondary">
                    <Clock className="h-3 w-3 mr-1" />
                    ~{module.estimated_duration} min
                  </Badge>
                  <Badge variant="secondary">
                    <Target className="h-3 w-3 mr-1" />
                    {module.difficulty_level}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Phases */}
        <div className="grid gap-4 mb-6">
          {module.phases.map((phase, index) => (
            <Card key={phase.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="bg-teal-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                    {index + 1}
                  </span>
                  {phase.title}
                </CardTitle>
                <CardDescription>{phase.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    {phase.estimated_minutes} minutes • {phase.steps.length} steps
                  </span>
                  <Badge variant={phase.is_required ? "default" : "secondary"}>
                    {phase.is_required ? "Required" : "Optional"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Button onClick={handleStartModule} className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 text-lg">
                Start Module
              </Button>
              <p className="text-sm text-gray-600 mt-2">
                This module will guide you through {module.phases.length} phases of {module.disaster_type} preparedness
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ModuleDetailSimple;