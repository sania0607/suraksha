import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, MapPin, Users, Clock, ArrowLeft } from 'lucide-react';

interface EvacuationScenario {
  id: string;
  title: string;
  location: string;
  situation: string;
  choices: {
    id: string;
    text: string;
    correct: boolean;
    feedback: string;
    timeImpact: number; // seconds added/subtracted
  }[];
}

const EvacuationPractice = () => {
  const navigate = useNavigate();
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [evacuationTime, setEvacuationTime] = useState(300); // Start with 5 minutes
  const [completed, setCompleted] = useState(false);

  const scenarios: EvacuationScenario[] = [
    {
      id: '1',
      title: 'Fire Alarm in Library',
      location: 'Second Floor Library',
      situation: 'You\'re studying on the second floor when the fire alarm goes off. You can smell smoke coming from downstairs.',
      choices: [
        {
          id: 'a',
          text: 'Use the elevator to get down quickly',
          correct: false,
          feedback: 'Never use elevators during a fire! They can trap you between floors.',
          timeImpact: 60
        },
        {
          id: 'b',
          text: 'Find the nearest stairwell and exit, staying low',
          correct: true,
          feedback: 'Perfect! Always use stairs and stay low to avoid smoke inhalation.',
          timeImpact: -30
        },
        {
          id: 'c',
          text: 'Wait for further instructions',
          correct: false,
          feedback: 'Don\'t wait! When you hear the alarm and smell smoke, evacuate immediately.',
          timeImpact: 90
        }
      ]
    },
    {
      id: '2',
      title: 'Blocked Main Exit',
      location: 'Main Hallway',
      situation: 'You\'re heading to the main exit but find it blocked by debris. Students are crowding around it.',
      choices: [
        {
          id: 'a',
          text: 'Push through the crowd to the main exit',
          correct: false,
          feedback: 'Avoid crowded exits! This creates dangerous bottlenecks.',
          timeImpact: 45
        },
        {
          id: 'b',
          text: 'Turn around and use the emergency exit you passed earlier',
          correct: true,
          feedback: 'Excellent! Always have a backup route and use less crowded exits.',
          timeImpact: -20
        },
        {
          id: 'c',
          text: 'Help clear the debris from the main exit',
          correct: false,
          feedback: 'Don\'t waste time! Your safety comes first - use an alternate route.',
          timeImpact: 120
        }
      ]
    },
    {
      id: '3',
      title: 'Assembly Point Decision',
      location: 'Outside Building',
      situation: 'You\'ve safely exited the building. You can see two assembly points: one closer but crowded, one farther but with fewer people.',
      choices: [
        {
          id: 'a',
          text: 'Go to the closer assembly point despite the crowd',
          correct: false,
          feedback: 'Crowded assembly points can be chaotic. Choose the safer option.',
          timeImpact: 30
        },
        {
          id: 'b',
          text: 'Head to the less crowded assembly point',
          correct: true,
          feedback: 'Smart choice! Less crowded areas are safer and easier to manage.',
          timeImpact: -15
        },
        {
          id: 'c',
          text: 'Stay near the building to help others',
          correct: false,
          feedback: 'Never stay near the building! Move to designated safe areas immediately.',
          timeImpact: 60
        }
      ]
    }
  ];

  const handleChoiceSelect = (choiceId: string) => {
    setSelectedChoice(choiceId);
    setShowFeedback(true);
    
    const choice = scenarios[currentScenario].choices.find(c => c.id === choiceId);
    if (choice) {
      if (choice.correct) {
        setScore(score + 1);
      }
      setEvacuationTime(evacuationTime + choice.timeImpact);
    }
  };

  const handleNext = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
      setSelectedChoice(null);
      setShowFeedback(false);
    } else {
      setCompleted(true);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    if (evacuationTime <= 180) return 'text-success';
    if (evacuationTime <= 300) return 'text-warning';
    return 'text-emergency';
  };

  const getPerformanceMessage = () => {
    const percentage = (score / scenarios.length) * 100;
    const timeScore = evacuationTime <= 180 ? 'Excellent' : evacuationTime <= 300 ? 'Good' : 'Needs Improvement';
    
    if (percentage >= 80 && evacuationTime <= 240) {
      return { title: '🌟 Excellent Performance!', description: 'You made safe choices and evacuated quickly.' };
    } else if (percentage >= 60) {
      return { title: '👍 Good Job!', description: 'You showed good safety awareness. Practice more for better timing.' };
    } else {
      return { title: '📚 Keep Learning!', description: 'Review the safety guidelines and try again.' };
    }
  };

  if (completed) {
    const performance = getPerformanceMessage();
    
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate('/student/campus-map')} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Campus Map
        </Button>

        <Card className="shadow-elegant border-l-4 border-l-primary">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{performance.title}</CardTitle>
            <CardDescription className="text-lg">{performance.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-primary/10 rounded-lg">
                <div className="text-2xl font-bold text-primary">{score}/{scenarios.length}</div>
                <div className="text-sm text-muted-foreground">Correct Choices</div>
              </div>
              <div className="text-center p-4 bg-accent/10 rounded-lg">
                <div className={`text-2xl font-bold ${getTimeColor()}`}>
                  {formatTime(evacuationTime)}
                </div>
                <div className="text-sm text-muted-foreground">Total Evacuation Time</div>
              </div>
              <div className="text-center p-4 bg-success/10 rounded-lg">
                <div className="text-2xl font-bold text-success">
                  {Math.round((score / scenarios.length) * 100)}%
                </div>
                <div className="text-sm text-muted-foreground">Safety Score</div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">Key Takeaways:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Always know multiple evacuation routes</li>
                <li>• Never use elevators during emergencies</li>
                <li>• Stay low during fire evacuations to avoid smoke</li>
                <li>• Move quickly but don't panic</li>
                <li>• Go to designated assembly points and stay there</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={() => {
                  setCurrentScenario(0);
                  setSelectedChoice(null);
                  setShowFeedback(false);
                  setScore(0);
                  setEvacuationTime(300);
                  setCompleted(false);
                }}
                variant="outline"
                className="flex-1"
              >
                Practice Again
              </Button>
              <Button onClick={() => navigate('/student/campus-map')} className="flex-1">
                Back to Map
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const scenario = scenarios[currentScenario];
  const progress = ((currentScenario + 1) / scenarios.length) * 100;

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => navigate('/student/campus-map')} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Campus Map
      </Button>

      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Evacuation Practice</h1>
          <p className="text-muted-foreground">
            Practice making quick, safe decisions during emergency evacuations
          </p>
        </div>
        
        <div className="text-right">
          <div className={`text-2xl font-bold ${getTimeColor()}`}>
            {formatTime(evacuationTime)}
          </div>
          <div className="text-sm text-muted-foreground">Time Remaining</div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Progress value={progress} className="flex-1" />
          <Badge variant="outline">
            {currentScenario + 1} / {scenarios.length}
          </Badge>
        </div>
      </div>

      <Card className="shadow-elegant">
        <CardHeader>
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>{scenario.title}</CardTitle>
              <CardDescription className="flex items-center gap-1 mt-1">
                <Users className="h-4 w-4" />
                {scenario.location}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 bg-muted/50 rounded-lg border-l-4 border-l-primary">
            <p className="text-foreground">{scenario.situation}</p>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold">What do you do?</h3>
            {scenario.choices.map((choice) => (
              <button
                key={choice.id}
                onClick={() => !showFeedback && handleChoiceSelect(choice.id)}
                disabled={showFeedback}
                className={`w-full p-4 text-left border-2 rounded-lg transition-smooth ${
                  selectedChoice === choice.id
                    ? choice.correct
                      ? 'border-success bg-success/10'
                      : 'border-emergency bg-emergency/10'
                    : showFeedback && choice.correct
                    ? 'border-success bg-success/10'
                    : 'border-border bg-card hover:bg-muted/50'
                } ${showFeedback ? 'cursor-default' : 'cursor-pointer'}`}
              >
                <div className="flex items-start gap-3">
                  {showFeedback && selectedChoice === choice.id && (
                    choice.correct ? (
                      <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-emergency mt-0.5" />
                    )
                  )}
                  {showFeedback && choice.correct && selectedChoice !== choice.id && (
                    <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium">{choice.text}</p>
                    {showFeedback && (selectedChoice === choice.id || choice.correct) && (
                      <p className="text-sm text-muted-foreground mt-2">{choice.feedback}</p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {showFeedback && (
            <div className="flex justify-end">
              <Button onClick={handleNext} className="shadow-elegant">
                {currentScenario < scenarios.length - 1 ? 'Next Scenario' : 'View Results'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EvacuationPractice;