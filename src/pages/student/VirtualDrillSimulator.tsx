import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle, 
  XCircle, 
  Clock, 
  MapPin, 
  Users,
  AlertTriangle,
  Award,
  Timer
} from 'lucide-react';

interface DrillScenario {
  id: string;
  title: string;
  type: 'earthquake' | 'fire' | 'flood' | 'evacuation';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in minutes
  location: string;
  description: string;
  objectives: string[];
  steps: DrillStep[];
}

interface DrillStep {
  id: string;
  title: string;
  description: string;
  timeLimit: number; // in seconds
  type: 'decision' | 'action' | 'knowledge';
  options?: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  correctAction?: string;
  hints?: string[];
}

interface DrillResult {
  stepId: string;
  response: string;
  isCorrect: boolean;
  timeSpent: number;
  score: number;
}

const VirtualDrillSimulator = () => {
  const [availableDrills] = useState<DrillScenario[]>([
    {
      id: 'earthquake-basic',
      title: 'Earthquake Response - Classroom',
      type: 'earthquake',
      difficulty: 'beginner',
      duration: 15,
      location: 'Classroom (2nd Floor)',
      description: 'Learn proper earthquake response procedures while in a classroom setting.',
      objectives: [
        'Identify safe spots during earthquake',
        'Execute Drop, Cover, Hold technique',
        'Follow proper evacuation procedures',
        'Demonstrate post-earthquake safety checks'
      ],
      steps: [
        {
          id: 'step1',
          title: 'Initial Response',
          description: 'You feel strong shaking in your classroom. What is your immediate response?',
          timeLimit: 10,
          type: 'decision',
          options: [
            {
              id: 'run',
              text: 'Run out of the classroom immediately',
              isCorrect: false,
              explanation: 'Running during shaking increases risk of falls and injuries.'
            },
            {
              id: 'drop-cover',
              text: 'Drop, Cover, and Hold under your desk',
              isCorrect: true,
              explanation: 'Correct! This protects you from falling objects and debris.'
            },
            {
              id: 'doorway',
              text: 'Stand in the doorway',
              isCorrect: false,
              explanation: 'Modern doorways are not stronger than other parts of buildings.'
            },
            {
              id: 'window',
              text: 'Move near the windows',
              isCorrect: false,
              explanation: 'Windows can shatter during earthquakes, making this dangerous.'
            }
          ]
        },
        {
          id: 'step2',
          title: 'During Shaking',
          description: 'The earthquake continues for 45 seconds. You are under your desk. What should you do?',
          timeLimit: 15,
          type: 'decision',
          options: [
            {
              id: 'stay-put',
              text: 'Stay under the desk until shaking stops completely',
              isCorrect: true,
              explanation: 'Correct! Stay protected until all movement stops.'
            },
            {
              id: 'peek-out',
              text: 'Look around to see what\'s happening',
              isCorrect: false,
              explanation: 'Keep your head protected - debris could still be falling.'
            },
            {
              id: 'help-others',
              text: 'Leave your cover to help a fallen classmate',
              isCorrect: false,
              explanation: 'Wait until shaking stops before helping others safely.'
            }
          ]
        },
        {
          id: 'step3',
          title: 'Post-Earthquake Assessment',
          description: 'Shaking has stopped. What is your first priority?',
          timeLimit: 20,
          type: 'decision',
          options: [
            {
              id: 'self-check',
              text: 'Check yourself and immediate area for injuries/hazards',
              isCorrect: true,
              explanation: 'Always ensure your own safety first before helping others.'
            },
            {
              id: 'call-family',
              text: 'Immediately call family members',
              isCorrect: false,
              explanation: 'Communication lines may be down, and you need to secure your area first.'
            },
            {
              id: 'social-media',
              text: 'Post on social media about the earthquake',
              isCorrect: false,
              explanation: 'Focus on safety first, not social media updates.'
            }
          ]
        },
        {
          id: 'step4',
          title: 'Evacuation Decision',
          description: 'You notice cracks in the classroom wall and ceiling. The teacher is organizing evacuation. What do you do?',
          timeLimit: 15,
          type: 'decision',
          options: [
            {
              id: 'follow-procedure',
              text: 'Follow the established evacuation route calmly',
              isCorrect: true,
              explanation: 'Correct! Organized evacuation prevents panic and injuries.'
            },
            {
              id: 'fastest-exit',
              text: 'Take the fastest route out, even if it\'s not the designated path',
              isCorrect: false,
              explanation: 'Designated routes are safest and avoid crowding in unsafe areas.'
            },
            {
              id: 'stay-inside',
              text: 'Stay inside until emergency responders arrive',
              isCorrect: false,
              explanation: 'With visible damage, evacuation is necessary for safety.'
            }
          ]
        },
        {
          id: 'step5',
          title: 'Assembly Point',
          description: 'You\'ve reached the designated assembly area. What should you do now?',
          timeLimit: 10,
          type: 'decision',
          options: [
            {
              id: 'report-attendance',
              text: 'Report to your teacher and wait for attendance check',
              isCorrect: true,
              explanation: 'This ensures everyone is accounted for and safe.'
            },
            {
              id: 'go-home',
              text: 'Leave immediately to go home',
              isCorrect: false,
              explanation: 'Stay at the assembly point until officially dismissed.'
            },
            {
              id: 'return-building',
              text: 'Go back to get your belongings',
              isCorrect: false,
              explanation: 'Never re-enter a building after an earthquake until it\'s cleared as safe.'
            }
          ]
        }
      ]
    },
    {
      id: 'fire-evacuation',
      title: 'Fire Emergency - School Building',
      type: 'fire',
      difficulty: 'intermediate',
      duration: 12,
      location: 'School Building (3rd Floor)',
      description: 'Navigate a fire emergency evacuation from upper floors.',
      objectives: [
        'Identify fire emergency signals',
        'Execute proper evacuation sequence',
        'Navigate smoke-filled areas safely',
        'Assist others during evacuation'
      ],
      steps: [
        {
          id: 'fire-step1',
          title: 'Fire Alarm Response',
          description: 'The fire alarm is sounding. You smell smoke coming from the hallway. What\'s your immediate action?',
          timeLimit: 8,
          type: 'decision',
          options: [
            {
              id: 'investigate',
              text: 'Go check where the smoke is coming from',
              isCorrect: false,
              explanation: 'Never investigate the source of smoke - evacuate immediately.'
            },
            {
              id: 'alert-evacuate',
              text: 'Alert others nearby and start evacuation procedures',
              isCorrect: true,
              explanation: 'Correct! Quick alert and evacuation saves lives.'
            },
            {
              id: 'wait-instructions',
              text: 'Wait for specific instructions from teachers',
              isCorrect: false,
              explanation: 'In fire emergencies, immediate action is critical.'
            }
          ]
        }
      ]
    }
  ]);

  const [selectedDrill, setSelectedDrill] = useState<DrillScenario | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [timer, setTimer] = useState(0);
  const [results, setResults] = useState<DrillResult[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800'
  };

  const typeEmojis = {
    earthquake: '🌍',
    fire: '🔥',
    flood: '🌊',
    evacuation: '🏃‍♂️'
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && !isCompleted && selectedDrill) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, isCompleted, selectedDrill]);

  const startDrill = (drill: DrillScenario) => {
    setSelectedDrill(drill);
    setCurrentStep(0);
    setTimer(0);
    setResults([]);
    setIsCompleted(false);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setIsRunning(true);
  };

  const submitAnswer = (optionId: string) => {
    if (!selectedDrill || showExplanation) return;

    const currentStepData = selectedDrill.steps[currentStep];
    const selectedOption = currentStepData.options?.find(opt => opt.id === optionId);
    
    if (!selectedOption) return;

    setSelectedAnswer(optionId);
    setShowExplanation(true);
    
    const result: DrillResult = {
      stepId: currentStepData.id,
      response: selectedOption.text,
      isCorrect: selectedOption.isCorrect,
      timeSpent: timer,
      score: selectedOption.isCorrect ? 100 : 0
    };

    setResults(prev => [...prev, result]);
  };

  const nextStep = () => {
    if (!selectedDrill) return;

    if (currentStep < selectedDrill.steps.length - 1) {
      setCurrentStep(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setIsCompleted(true);
      setIsRunning(false);
    }
  };

  const resetDrill = () => {
    setSelectedDrill(null);
    setCurrentStep(0);
    setTimer(0);
    setResults([]);
    setIsCompleted(false);
    setIsRunning(false);
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateScore = () => {
    if (results.length === 0) return 0;
    const totalScore = results.reduce((sum, result) => sum + result.score, 0);
    return Math.round(totalScore / results.length);
  };

  const getPerformanceMessage = (score: number) => {
    if (score >= 90) return { message: 'Excellent! You\'re well-prepared for emergencies!', color: 'text-green-600' };
    if (score >= 75) return { message: 'Good job! Review the areas you missed.', color: 'text-blue-600' };
    if (score >= 60) return { message: 'Fair performance. More practice recommended.', color: 'text-yellow-600' };
    return { message: 'Needs improvement. Please review emergency procedures.', color: 'text-red-600' };
  };

  if (!selectedDrill) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-6 rounded-xl">
          <div className="flex items-center space-x-3">
            <Play className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">Virtual Drill Simulator</h1>
              <p className="text-blue-100 mt-1">Practice emergency response in realistic scenarios</p>
            </div>
          </div>
        </div>

        {/* Drill Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {availableDrills.map((drill) => (
            <Card key={drill.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <span className="text-2xl">{typeEmojis[drill.type]}</span>
                    <span>{drill.title}</span>
                  </CardTitle>
                  <Badge className={difficultyColors[drill.difficulty]}>
                    {drill.difficulty}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-600">{drill.description}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {drill.duration} minutes
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {drill.location}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm mb-2">Learning Objectives:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {drill.objectives.slice(0, 2).map((objective, index) => (
                        <li key={index} className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>{objective}</span>
                        </li>
                      ))}
                      {drill.objectives.length > 2 && (
                        <li className="text-blue-600">+{drill.objectives.length - 2} more objectives</li>
                      )}
                    </ul>
                  </div>

                  <Button 
                    onClick={() => startDrill(drill)}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Drill
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (isCompleted) {
    const score = calculateScore();
    const performance = getPerformanceMessage(score);
    
    return (
      <div className="space-y-6">
        {/* Results Header */}
        <Card className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4">🏆</div>
            <h1 className="text-3xl font-bold mb-2">Drill Completed!</h1>
            <p className="text-xl">{selectedDrill.title}</p>
          </CardContent>
        </Card>

        {/* Score Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{score}%</div>
              <div className="text-sm text-gray-600">Overall Score</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{formatTime(timer)}</div>
              <div className="text-sm text-gray-600">Total Time</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {results.filter(r => r.isCorrect).length}/{results.length}
              </div>
              <div className="text-sm text-gray-600">Correct Answers</div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Message */}
        <Card>
          <CardContent className="p-6 text-center">
            <Award className={`w-12 h-12 mx-auto mb-4 ${performance.color}`} />
            <h3 className={`text-xl font-bold mb-2 ${performance.color}`}>
              {performance.message}
            </h3>
          </CardContent>
        </Card>

        {/* Detailed Results */}
        <Card>
          <CardHeader>
            <CardTitle>Step-by-Step Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {result.isCorrect ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-600" />
                    )}
                    <div>
                      <div className="font-medium">Step {index + 1}</div>
                      <div className="text-sm text-gray-600">{result.response}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{result.score}%</div>
                    <div className="text-sm text-gray-600">{formatTime(result.timeSpent)}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex space-x-4">
          <Button onClick={resetDrill} className="flex-1">
            <RotateCcw className="w-4 h-4 mr-2" />
            Try Another Drill
          </Button>
          <Button onClick={() => startDrill(selectedDrill)} variant="outline" className="flex-1">
            <Play className="w-4 h-4 mr-2" />
            Retry This Drill
          </Button>
        </div>
      </div>
    );
  }

  const currentStepData = selectedDrill.steps[currentStep];
  const progress = ((currentStep + 1) / selectedDrill.steps.length) * 100;

  return (
    <div className="space-y-6">
      {/* Drill Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{typeEmojis[selectedDrill.type]}</span>
              <h1 className="text-2xl font-bold">{selectedDrill.title}</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className={difficultyColors[selectedDrill.difficulty]}>
                {selectedDrill.difficulty}
              </Badge>
              <div className="flex items-center text-lg font-mono">
                <Timer className="w-5 h-5 mr-2" />
                {formatTime(timer)}
              </div>
            </div>
          </div>
          <Progress value={progress} className="h-3" />
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>Step {currentStep + 1} of {selectedDrill.steps.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
        </CardContent>
      </Card>

      {/* Current Step */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <span>{currentStepData.title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <p className="text-lg text-gray-700">{currentStepData.description}</p>

            {currentStepData.type === 'decision' && currentStepData.options && (
              <div className="space-y-3">
                <h4 className="font-semibold">Choose your response:</h4>
                {currentStepData.options.map((option) => (
                  <div key={option.id} className="relative">
                    <Button
                      onClick={() => submitAnswer(option.id)}
                      disabled={showExplanation}
                      variant={
                        selectedAnswer === option.id
                          ? option.isCorrect
                            ? 'default'
                            : 'destructive'
                          : 'outline'
                      }
                      className={`w-full p-4 h-auto text-left justify-start ${
                        selectedAnswer === option.id && showExplanation
                          ? option.isCorrect
                            ? 'bg-green-100 border-green-500 text-green-800'
                            : 'bg-red-100 border-red-500 text-red-800'
                          : ''
                      }`}
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          {showExplanation && selectedAnswer === option.id && (
                            <>
                              {option.isCorrect ? (
                                <CheckCircle className="w-5 h-5 text-green-600" />
                              ) : (
                                <XCircle className="w-5 h-5 text-red-600" />
                              )}
                            </>
                          )}
                          <span>{option.text}</span>
                        </div>
                        {showExplanation && selectedAnswer === option.id && (
                          <div className="mt-2 text-sm font-normal">
                            {option.explanation}
                          </div>
                        )}
                      </div>
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {showExplanation && (
              <div className="flex justify-between items-center pt-4">
                <div className="text-sm text-gray-600">
                  Time taken: {formatTime(timer)}
                </div>
                <Button onClick={nextStep} className="bg-blue-600 hover:bg-blue-700">
                  {currentStep < selectedDrill.steps.length - 1 ? 'Next Step' : 'Complete Drill'}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <div className="flex space-x-4">
        <Button onClick={resetDrill} variant="outline">
          <RotateCcw className="w-4 h-4 mr-2" />
          End Drill
        </Button>
        <Button 
          onClick={() => setIsRunning(!isRunning)} 
          variant="outline"
          className="ml-auto"
        >
          {isRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
          {isRunning ? 'Pause' : 'Resume'}
        </Button>
      </div>
    </div>
  );
};

export default VirtualDrillSimulator;