import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Play, Brain, CheckCircle, X } from 'lucide-react';

const ModuleDetail = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const { modules, updateStudentScore } = useApp();
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  const module = modules.find(m => m.id === moduleId);

  if (!module) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-muted-foreground">Module not found</h2>
        <Link to="/student/modules">
          <Button variant="outline" className="mt-4">Back to Modules</Button>
        </Link>
      </div>
    );
  }

  const startQuiz = () => {
    setShowQuiz(true);
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResults(false);
  };

  const selectAnswer = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion < module.quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    const correctAnswers = selectedAnswers.filter((answer, index) => 
      answer === module.quiz.questions[index].correctAnswer
    ).length;
    
    const score = Math.round((correctAnswers / module.quiz.questions.length) * 100);
    updateStudentScore('current-user', module.id, score);
    setShowResults(true);
  };

  const calculateScore = () => {
    const correctAnswers = selectedAnswers.filter((answer, index) => 
      answer === module.quiz.questions[index].correctAnswer
    ).length;
    return Math.round((correctAnswers / module.quiz.questions.length) * 100);
  };

  if (showQuiz) {
    const question = module.quiz.questions[currentQuestion];
    const progress = ((currentQuestion + 1) / module.quiz.questions.length) * 100;

    if (showResults) {
      const score = calculateScore();
      const passed = score >= 70;

      return (
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-card">
            <CardHeader className="text-center">
              <div className={`text-6xl mb-4 ${passed ? 'success-bounce' : ''}`}>
                {passed ? '🎉' : '📚'}
              </div>
              <CardTitle className={`text-2xl ${passed ? 'text-success' : 'text-accent'}`}>
                {passed ? 'Congratulations!' : 'Keep Learning!'}
              </CardTitle>
              <CardDescription>
                You scored {score}% on the {module.title} quiz
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className={`text-4xl font-bold ${passed ? 'text-success' : 'text-accent'} mb-2`}>
                  {score}%
                </div>
                <Progress value={score} className="h-3" />
                <p className="text-sm text-muted-foreground mt-2">
                  {selectedAnswers.filter((answer, index) => 
                    answer === module.quiz.questions[index].correctAnswer
                  ).length} out of {module.quiz.questions.length} correct
                </p>
              </div>

              {passed && (
                <Badge variant="secondary" className="bg-success/10 text-success border-success/20 mx-auto flex w-fit">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Module Completed
                </Badge>
              )}

              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowQuiz(false)}
                  className="flex-1"
                >
                  Back to Module
                </Button>
                <Link to={`/student/drills/${moduleId}`} className="flex-1">
                  <Button variant="drill" className="w-full">
                    Practice Drill
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="text-2xl">{module.icon}</div>
                <div>
                  <CardTitle className="text-lg">{module.title} Quiz</CardTitle>
                  <CardDescription>Question {currentQuestion + 1} of {module.quiz.questions.length}</CardDescription>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setShowQuiz(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <Progress value={progress} className="h-2 mt-4" />
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">{question.question}</h3>
              
              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <Button
                    key={index}
                    variant={selectedAnswers[currentQuestion] === index ? "default" : "outline"}
                    onClick={() => selectAnswer(index)}
                    className="w-full text-left justify-start h-auto py-4 px-4"
                  >
                    <span className="flex items-center space-x-3">
                      <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold
                        ${selectedAnswers[currentQuestion] === index 
                          ? 'bg-primary text-primary-foreground border-primary' 
                          : 'border-muted-foreground'}`}>
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span>{option}</span>
                    </span>
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <Button 
                variant="outline"
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>
              <Button 
                onClick={nextQuestion}
                disabled={selectedAnswers[currentQuestion] === undefined}
                variant="module"
              >
                {currentQuestion === module.quiz.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link to="/student">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold flex items-center space-x-3">
            <span className="text-4xl">{module.icon}</span>
            <span>{module.title}</span>
          </h1>
          <p className="text-muted-foreground text-lg">{module.description}</p>
        </div>
      </div>

      {/* Module Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Learning Content */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Learning Content</CardTitle>
              <CardDescription>Essential knowledge for {module.title.toLowerCase()}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="prose prose-sm max-w-none">
                {module.id === 'earthquake' && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-primary">Drop, Cover, and Hold On</h4>
                    <p>The moment you feel shaking, immediately drop to your hands and knees, take cover under a desk or table, and hold on until the shaking stops.</p>
                    
                    <h4 className="font-semibold text-primary">Stay Calm</h4>
                    <p>Earthquakes can be scary, but staying calm helps you make better decisions and follow safety protocols effectively.</p>
                    
                    <h4 className="font-semibold text-primary">After the Shaking</h4>
                    <p>Once shaking stops, carefully evacuate the building using stairs only. Watch for aftershocks and falling debris.</p>
                  </div>
                )}
                
                {module.id === 'fire' && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-emergency">Fire Triangle</h4>
                    <p>Fire needs three elements: heat, fuel, and oxygen. Removing any one element can stop a fire.</p>
                    
                    <h4 className="font-semibold text-emergency">Evacuation Priority</h4>
                    <p>When you hear a fire alarm, immediately stop what you're doing and evacuate via the nearest safe exit.</p>
                    
                    <h4 className="font-semibold text-emergency">Stay Low</h4>
                    <p>Smoke rises, so stay close to the ground where air is cleaner. Cover your nose and mouth if possible.</p>
                  </div>
                )}
                
                {module.id === 'flood' && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-accent">Water Power</h4>
                    <p>Just 6 inches of moving water can knock you down. Two feet of water can float most vehicles.</p>
                    
                    <h4 className="font-semibold text-accent">Higher Ground</h4>
                    <p>Always move to higher ground when flooding is possible. Avoid low-lying areas and storm drains.</p>
                    
                    <h4 className="font-semibold text-accent">Never Drive Through</h4>
                    <p>Turn around, don't drown. Most flood deaths occur in vehicles. Never attempt to drive through flooded roads.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5" />
                <span>Test Your Knowledge</span>
              </CardTitle>
              <CardDescription>Take the quiz to earn your certificate</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={startQuiz} variant="module" className="w-full">
                <Play className="h-4 w-4" />
                Start Quiz ({module.quiz.questions.length} questions)
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Practice Drill</CardTitle>
              <CardDescription>Apply your knowledge in realistic scenarios</CardDescription>
            </CardHeader>
            <CardContent>
              <Link to={`/student/drills/${moduleId}`}>
                <Button variant="drill" className="w-full">
                  <Play className="h-4 w-4" />
                  Start Drill Simulation
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ModuleDetail;