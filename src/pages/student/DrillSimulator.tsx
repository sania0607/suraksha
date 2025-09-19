import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle, X, AlertTriangle, RotateCcw } from 'lucide-react';

interface DrillState {
  currentScenario: number;
  selectedChoices: boolean[];
  showFeedback: boolean;
  completed: boolean;
}

const DrillSimulator = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const { modules } = useApp();
  
  const [drillState, setDrillState] = useState<DrillState>({
    currentScenario: 0,
    selectedChoices: [],
    showFeedback: false,
    completed: false
  });

  const module = modules.find(m => m.id === moduleId);

  if (!module) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-muted-foreground">Drill not found</h2>
        <Link to="/student/drills">
          <Button variant="outline" className="mt-4">Back to Drills</Button>
        </Link>
      </div>
    );
  }

  const currentScenario = module.drillScenarios[drillState.currentScenario];
  
  const makeChoice = (choiceIndex: number) => {
    const choice = currentScenario.choices[choiceIndex];
    const newSelectedChoices = [...drillState.selectedChoices];
    newSelectedChoices[drillState.currentScenario] = choice.correct;
    
    setDrillState({
      ...drillState,
      selectedChoices: newSelectedChoices,
      showFeedback: true
    });
  };

  const nextScenario = () => {
    if (drillState.currentScenario < module.drillScenarios.length - 1) {
      setDrillState({
        ...drillState,
        currentScenario: drillState.currentScenario + 1,
        showFeedback: false
      });
    } else {
      setDrillState({
        ...drillState,
        completed: true
      });
    }
  };

  const resetDrill = () => {
    setDrillState({
      currentScenario: 0,
      selectedChoices: [],
      showFeedback: false,
      completed: false
    });
  };

  const calculateScore = () => {
    const correctChoices = drillState.selectedChoices.filter(Boolean).length;
    return Math.round((correctChoices / module.drillScenarios.length) * 100);
  };

  if (drillState.completed) {
    const score = calculateScore();
    const passed = score >= 70;

    return (
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-card">
          <CardHeader className="text-center">
            <div className={`text-6xl mb-4 ${passed ? 'success-bounce' : ''}`}>
              {passed ? '🎯' : '🔄'}
            </div>
            <CardTitle className={`text-2xl ${passed ? 'text-success' : 'text-accent'}`}>
              {passed ? 'Drill Completed!' : 'Practice Makes Perfect!'}
            </CardTitle>
            <CardDescription>
              {module.title} emergency drill simulation results
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className={`text-4xl font-bold ${passed ? 'text-success' : 'text-accent'} mb-2`}>
                {score}%
              </div>
              <p className="text-muted-foreground">
                {drillState.selectedChoices.filter(Boolean).length} out of {module.drillScenarios.length} scenarios handled correctly
              </p>
            </div>

            {passed && (
              <Badge variant="secondary" className="bg-success/10 text-success border-success/20 mx-auto flex w-fit">
                <CheckCircle className="h-4 w-4 mr-1" />
                Drill Mastered
              </Badge>
            )}

            <div className="bg-muted/30 rounded-lg p-4 space-y-2">
              <h4 className="font-semibold text-sm">Key Takeaways:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                {module.id === 'earthquake' && (
                  <>
                    <li>• Drop, Cover, and Hold On immediately when shaking starts</li>
                    <li>• Never run outside during shaking - injury risk is too high</li>
                    <li>• Wait for shaking to stop before evacuating</li>
                  </>
                )}
                {module.id === 'fire' && (
                  <>
                    <li>• Treat every fire alarm as real - evacuate immediately</li>
                    <li>• Use stairs only, never elevators during fire emergencies</li>
                    <li>• Stay low to avoid smoke inhalation</li>
                  </>
                )}
                {module.id === 'flood' && (
                  <>
                    <li>• Move to higher ground as soon as flooding is possible</li>
                    <li>• Never attempt to walk or drive through flood water</li>
                    <li>• Six inches of moving water can knock you down</li>
                  </>
                )}
              </ul>
            </div>

            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                onClick={resetDrill}
                className="flex-1"
              >
                <RotateCcw className="h-4 w-4" />
                Try Again
              </Button>
              <Link to="/student" className="flex-1">
                <Button variant="module" className="w-full">
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link to={`/student/modules/${moduleId}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold flex items-center space-x-3">
            <span className="text-3xl">{module.icon}</span>
            <span>{module.title} Drill</span>
          </h1>
          <p className="text-muted-foreground">
            Scenario {drillState.currentScenario + 1} of {module.drillScenarios.length}
          </p>
        </div>
      </div>

      {/* Drill Scenario */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-accent" />
            <CardTitle>Emergency Scenario</CardTitle>
          </div>
          <CardDescription>Choose the best response to this emergency situation</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {!drillState.showFeedback ? (
            <>
              <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                <p className="text-lg">{currentScenario.scenario}</p>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">What would you do?</h4>
                {currentScenario.choices.map((choice, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={() => makeChoice(index)}
                    className="w-full text-left justify-start h-auto py-4 px-4 hover:bg-primary/5"
                  >
                    <span className="flex items-center space-x-3">
                      <span className="w-6 h-6 rounded-full border-2 border-muted-foreground flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </span>
                      <span>{choice.text}</span>
                    </span>
                  </Button>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="space-y-4">
                {currentScenario.choices.map((choice, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-2 ${
                      choice.correct 
                        ? 'bg-success/10 border-success/20' 
                        : 'bg-muted/30 border-muted'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      {choice.correct ? (
                        <CheckCircle className="h-5 w-5 text-success" />
                      ) : (
                        <X className="h-5 w-5 text-muted-foreground" />
                      )}
                      <span className={`font-medium ${choice.correct ? 'text-success' : ''}`}>
                        {choice.text}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground pl-8">
                      {choice.feedback}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex justify-center">
                <Button onClick={nextScenario} variant="drill">
                  {drillState.currentScenario < module.drillScenarios.length - 1 
                    ? 'Next Scenario' 
                    : 'Complete Drill'
                  }
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DrillSimulator;