import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { Button } from '../../components/ui/button';
import { CheckCircle, Award, ArrowRight } from 'lucide-react';

const ModuleDetailNew = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const { modules, user, getModuleProgress } = useApp();
  const [currentStage, setCurrentStage] = useState(1);
  const [userPoints, setUserPoints] = useState(350);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(false);

  // Mapping from new module IDs to old module IDs in AppContext
  const moduleIdMapping: Record<string, string> = {
    'earthquake-safety': 'earthquake',
    'flood-safety': 'flood',
    'fire-prevention': 'fire',
    'cyclone-preparedness': 'cyclone',
    'landslide-awareness': 'landslide',
    'thunderstorm-safety': 'thunderstorm',
    'heatwave-protection': 'heatwave'
  };

  // Get the actual module ID to look up in AppContext
  const actualModuleId = moduleIdMapping[moduleId!] || moduleId;
  const module = modules.find(m => m.id === actualModuleId);

  if (!module) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Module Not Found</h2>
          <Button onClick={() => navigate('/student/modules')}>
            Back to Modules
          </Button>
        </div>
      </div>
    );
  }

  const getModuleContent = () => {
    if (actualModuleId === 'earthquake') {
      switch (currentStage) {
        case 1:
          return {
            title: "📘 Module 1: Introduction to Earthquakes",
            heading: "What is an Earthquake?",
            content: "Sudden shaking of the Earth caused by movement of rocks under the surface. Measured on the Richter Scale.",
            details: [
              "🌍 Tectonic plates shifting → release of energy",
              "📍 Epicenter = point on the surface, Hypocenter = origin underground", 
              "🏘️ Impact: Injuries, collapsed buildings, disrupted schools",
              "📚 Historical examples: Bhuj (2001), Nepal (2015), Turkey (2023)"
            ],
            myths: [
              "❌ Doorway = unsafe",
              "❌ Earthquakes only at night = false", 
              "✅ Drop, Cover, Hold On = safe"
            ]
          };
        case 2:
          return {
            title: "📘 Module 2: Preparedness (Before an Earthquake)",
            heading: "GET READY BEFORE IT STRIKES",
            content: "Learn how to stay ready at school, home, and community. Build emergency kits & know safe zones.",
            details: [
              "🏠 Fix heavy furniture to walls",
              "🔍 Identify safe zones (under desks, away from windows)",
              "🚪 Practice evacuation routes & know assembly points",
              "🎒 Emergency Kit: First aid, water, torch, whistle, medicines, power bank"
            ],
            preparation: [
              "📱 Keep family emergency contact list",
              "🩹 Learn basic first aid",
              "🎒 Pack a 'Go Bag'"
            ]
          };
        case 3:
          return {
            title: "📘 Module 3: Response (During an Earthquake)", 
            heading: "DROP, COVER & HOLD ON",
            content: "Know the correct actions depending on location. Avoid panic and unsafe moves.",
            details: [
              "🏢 Inside: Drop, Cover, Hold On - Stay away from windows",
              "🌳 Outside: Go to open ground, away from poles & trees",
              "🚗 In Vehicle: Stop safely, stay inside until shaking stops",
              "🚫 Don't use elevators"
            ]
          };
        case 4:
          return {
            title: "📘 Module 4: Recovery (After an Earthquake)",
            heading: "RECOVER & RESPOND SAFELY",
            content: "Learn safe behavior after shaking stops. Help yourself & others responsibly.",
            details: [
              "🩹 Check injuries, give first aid",
              "⚠️ Watch for falling debris while exiting", 
              "🏃‍♂️ Evacuate calmly to safe zones",
              "🏚️ Stay away from damaged buildings",
              "📳 Be alert for aftershocks",
              "📱 Use text/WhatsApp instead of calling"
            ]
          };
        case 5:
          return {
            title: "📘 Module 5: Drills & Evaluation",
            heading: "PRACTICE MAKES PERFECT",
            content: "Practice earthquake response through mock drills. Test knowledge via quizzes & scenarios.",
            details: [
              "🚨 Alarm rings → students Drop, Cover, Hold On",
              "👩‍🏫 Teacher leads evacuation",
              "🏫 Assembly in safe ground", 
              "🏆 Earthquake Hero Badge for top scorers",
              "💭 Reflection discussion after drills"
            ],
            takeaways: [
              "✅ Earthquakes can't be predicted, but preparedness saves lives",
              "✅ Always remember: Drop, Cover, Hold On", 
              "✅ Stay calm, follow your school's safety plan, and help others"
            ]
          };
        default:
          return null;
      }
    }
    return null;
  };

  const getCurrentPhase = () => {
    if (currentStage <= 2) return 'before';
    if (currentStage === 3) return 'during';
    return 'after';
  };

  const handleAnswerSelect = (answer: string, isCorrect: boolean) => {
    setSelectedAnswer(answer);
    setShowFeedback(true);
    
    if (isCorrect) {
      setUserPoints(prev => prev + 15);
      setTimeout(() => {
        if (currentStage < 5) {
          setCurrentStage(prev => prev + 1);
          setSelectedAnswer(null);
          setShowFeedback(false);
        } else {
          // Show congratulations after completing all modules
          setShowCongratulations(true);
        }
      }, 2000);
    }
  };

  const handleNextModule = () => {
    if (currentStage < 5) {
      setCurrentStage(prev => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      // Show congratulations after completing all modules
      setShowCongratulations(true);
    }
  };

  const handleCompleteModule = () => {
    setShowCongratulations(true);
  };

  const getCurrentQuestion = () => {
    const phase = getCurrentPhase();
    
    // Custom questions for each module stage
    if (actualModuleId === 'earthquake') {
      switch (currentStage) {
        case 1:
          return {
            question: 'What causes earthquakes?',
            options: ['Weather changes', 'Tectonic plates shifting', 'Ocean waves', 'Wind patterns'],
            correctAnswer: 1,
            phase: 'before'
          };
        case 2:
          return {
            question: 'What should be in your emergency kit?',
            options: ['Books & games', 'First aid & water', 'Toys & clothes', 'Food only'],
            correctAnswer: 1,
            phase: 'before'
          };
        case 3:
          return {
            question: 'What should you do IMMEDIATELY during an earthquake INDOORS?',
            options: ['Run Outside', 'Drop, Cover, Hold On', 'Call for Help', 'Stand in Doorway'],
            correctAnswer: 1,
            phase: 'during'
          };
        case 4:
          return {
            question: 'What should you do AFTER an earthquake stops?',
            options: ['Check for Injuries', 'Go Back Inside', 'Use Elevator', 'Ignore Aftershocks'],
            correctAnswer: 0,
            phase: 'after'
          };
        case 5:
          return {
            question: 'During a school earthquake drill, what happens first?',
            options: ['Run to exit', 'Drop, Cover, Hold On', 'Call parents', 'Hide under stairs'],
            correctAnswer: 1,
            phase: 'after'
          };
        default:
          return null;
      }
    }
    
    // Fallback to original questions
    return module.quiz.questions.find(q => q.phase === phase);
  };

  const currentQuestion = getCurrentQuestion();

  // Show congratulations screen if module is completed
  if (showCongratulations) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-green-50 flex items-center justify-center p-8">
        <div className="max-w-2xl mx-auto text-center">
          {/* Congratulations Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-12 border border-green-100">
            {/* Trophy Animation */}
            <div className="mb-8">
              <div className="text-8xl mb-4 animate-bounce">🏆</div>
              <div className="flex justify-center space-x-4 mb-6">
                <span className="text-6xl animate-pulse">🎉</span>
                <span className="text-6xl animate-pulse delay-100">🌟</span>
                <span className="text-6xl animate-pulse delay-200">🎊</span>
              </div>
            </div>

            {/* Congratulations Text */}
            <h1 className="text-5xl font-bold text-transparent bg-gradient-to-r from-teal-600 to-green-600 bg-clip-text mb-6">
              Congratulations!
            </h1>
            
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">
              Module Completed Successfully! 🌍
            </h2>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              You've successfully completed the <strong>Earthquake Preparedness & Response Module</strong>!
              <br />
              You're now better prepared to stay safe during earthquakes.
            </p>

            {/* Achievement Stats */}
            <div className="bg-gradient-to-r from-teal-50 to-green-50 rounded-2xl p-6 mb-8">
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-teal-600">5/5</div>
                  <div className="text-sm text-gray-600">Modules Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{userPoints}</div>
                  <div className="text-sm text-gray-600">Points Earned</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">100%</div>
                  <div className="text-sm text-gray-600">Course Progress</div>
                </div>
              </div>
            </div>

            {/* Key Achievements */}
            <div className="text-left mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">🎯 What You've Learned:</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">✅</span>
                  <span className="text-gray-700">Understanding earthquakes and their causes</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">✅</span>
                  <span className="text-gray-700">Emergency preparedness and kit building</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">✅</span>
                  <span className="text-gray-700">Drop, Cover, and Hold On technique</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">✅</span>
                  <span className="text-gray-700">Post-earthquake safety and recovery</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">✅</span>
                  <span className="text-gray-700">Emergency drills and evaluation</span>
                </div>
              </div>
            </div>

            {/* Certificate Badge */}
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-2xl p-4 mb-8">
              <div className="flex items-center justify-center space-x-3">
                <span className="text-3xl">🏅</span>
                <div>
                  <div className="text-lg font-bold">Earthquake Safety Certificate</div>
                  <div className="text-sm opacity-90">Awarded to {user?.name || 'Student'}</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <Button 
                className="w-full bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600 text-white rounded-xl py-4 text-lg font-semibold"
                onClick={() => navigate('/student/modules')}
              >
                <Award className="w-6 h-6 mr-3" />
                Continue Learning - Explore More Modules
              </Button>
              
              <Button 
                variant="outline"
                className="w-full border-2 border-teal-500 text-teal-600 hover:bg-teal-50 rounded-xl py-4 text-lg font-semibold"
                onClick={() => navigate('/student/home')}
              >
                Return to Dashboard
              </Button>
            </div>

            {/* Share Achievement */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-3">Share your achievement!</p>
              <div className="flex justify-center space-x-4">
                <span className="text-2xl cursor-pointer hover:scale-110 transition-transform">📱</span>
                <span className="text-2xl cursor-pointer hover:scale-110 transition-transform">💬</span>
                <span className="text-2xl cursor-pointer hover:scale-110 transition-transform">📧</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Mission Header */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white px-8 py-6 rounded-xl">
        <div className="flex items-center space-x-3">
          <span className="text-3xl">🌍</span>
          <div>
            <h1 className="text-2xl font-bold">Earthquake Preparedness & Response Module</h1>
            <p className="text-teal-100 mt-1">Building safer communities through education</p>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex gap-8">
        {/* Left Content - Lesson */}
        <div className="flex-1">
          {(() => {
            const moduleContent = getModuleContent();
            if (!moduleContent) return null;

            return (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-teal-700 mb-2">{moduleContent.title}</h2>
                  <div className="w-20 h-1 bg-teal-500 rounded"></div>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-sm">
                  <h1 className="text-4xl font-bold text-gray-800 mb-4">
                    {moduleContent.heading}
                  </h1>
                  <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                    {moduleContent.content}
                  </p>

                  {/* Main Content Section */}
                  <div className="space-y-6">
                    {moduleContent.details && (
                      <div className="bg-blue-50 rounded-xl p-6">
                        <h3 className="text-xl font-semibold text-blue-800 mb-4">📚 Key Learning Points</h3>
                        <ul className="space-y-3">
                          {moduleContent.details.map((detail, index) => (
                            <li key={index} className="flex items-start space-x-3">
                              <span className="text-blue-600 mt-1">•</span>
                              <span className="text-blue-800">{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {moduleContent.myths && (
                      <div className="bg-yellow-50 rounded-xl p-6">
                        <h3 className="text-xl font-semibold text-yellow-800 mb-4">🚨 Myth vs Reality</h3>
                        <ul className="space-y-2">
                          {moduleContent.myths.map((myth, index) => (
                            <li key={index} className="text-yellow-800 text-lg">{myth}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {moduleContent.preparation && (
                      <div className="bg-green-50 rounded-xl p-6">
                        <h3 className="text-xl font-semibold text-green-800 mb-4">🎒 Personal Preparedness</h3>
                        <ul className="space-y-3">
                          {moduleContent.preparation.map((prep, index) => (
                            <li key={index} className="flex items-start space-x-3">
                              <span className="text-green-600 mt-1">•</span>
                              <span className="text-green-800">{prep}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {moduleContent.takeaways && (
                      <div className="bg-purple-50 rounded-xl p-6">
                        <h3 className="text-xl font-semibold text-purple-800 mb-4">🏆 Key Takeaways</h3>
                        <ul className="space-y-3">
                          {moduleContent.takeaways.map((takeaway, index) => (
                            <li key={index} className="text-purple-800 text-lg">{takeaway}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Illustration based on current stage */}
                    <div className="bg-gray-50 rounded-xl p-8">
                      <div className="flex justify-center">
                        {currentStage === 1 && (
                          <img 
                            src="/earthquake.png" 
                            alt="Understanding earthquakes and tectonic plates" 
                            className="w-full max-w-lg h-64 object-cover rounded-lg"
                          />
                        )}
                        {currentStage === 2 && (
                          <img 
                            src="/earthquake.png" 
                            alt="Emergency preparedness kit and planning" 
                            className="w-full max-w-lg h-64 object-cover rounded-lg"
                          />
                        )}
                        {(currentStage === 3 || currentStage === 5) && (
                          <img 
                            src="/hold drop.png" 
                            alt="Students practicing Drop, Cover, and Hold On" 
                            className="w-full max-w-lg h-64 object-cover rounded-lg"
                          />
                        )}
                        {currentStage === 4 && (
                          <img 
                            src="/placeholder.svg" 
                            alt="Post-earthquake recovery and safety procedures" 
                            className="w-full max-w-lg h-64 object-cover rounded-lg bg-green-100"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Right Content - Interactive Quiz */}
        <div className="w-96 bg-white rounded-lg shadow-sm p-8">
          {currentQuestion && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-6 leading-relaxed">
                  {currentQuestion.question}
                </h3>

                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => {
                    const isCorrect = index === currentQuestion.correctAnswer;
                    const isSelected = selectedAnswer === option;
                    
                    let buttonClass = "w-full p-4 text-left rounded-lg border-2 transition-all duration-200 font-medium text-white ";
                    
                    if (showFeedback && isSelected) {
                      if (isCorrect) {
                        buttonClass += "bg-yellow-400 border-yellow-500 text-gray-800";
                      } else {
                        buttonClass += "bg-red-400 border-red-500 text-white";
                      }
                    } else if (showFeedback && isCorrect) {
                      buttonClass += "bg-yellow-400 border-yellow-500 text-gray-800";
                    } else {
                      // Color coding based on option type
                      if (option.includes('Run Outside') || option === 'Run Outside') {
                        buttonClass += "bg-teal-600 border-teal-600 hover:bg-teal-700";
                      } else if (option.includes('Drop, Cover') || option === 'Drop, Cover, Hold On') {
                        buttonClass += "bg-yellow-400 border-yellow-400 text-gray-800 hover:bg-yellow-500";
                      } else if (option.includes('Call for Help') || option === 'Call for Help') {
                        buttonClass += "bg-blue-500 border-blue-500 hover:bg-blue-600";
                      } else {
                        buttonClass += "bg-gray-400 border-gray-400 hover:bg-gray-500";
                      }
                    }

                    return (
                      <Button
                        key={option}
                        className={buttonClass}
                        onClick={() => !showFeedback && handleAnswerSelect(option, isCorrect)}
                        disabled={showFeedback}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span>{option}</span>
                          {showFeedback && isSelected && isCorrect && (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          )}
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Progress Section */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-600">Module {currentStage}/5 Complete</span>
                  <span className="text-sm text-teal-600 font-medium">
                    {Math.round((currentStage / 5) * 100)}%
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
                  <div 
                    className="bg-gradient-to-r from-teal-500 to-teal-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${(currentStage / 5) * 100}%` }}
                  ></div>
                </div>

                {/* Module Progress Indicators */}
                <div className="flex justify-between items-center mb-6">
                  {[1, 2, 3, 4, 5].map((moduleNum) => (
                    <div key={moduleNum} className="flex flex-col items-center space-y-2">
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold ${
                          moduleNum <= currentStage 
                            ? 'bg-teal-500 text-white' 
                            : moduleNum === currentStage + 1 && showFeedback
                              ? 'bg-yellow-400 text-gray-800 animate-pulse'
                              : 'bg-gray-300 text-gray-600'
                        }`}
                      >
                        {moduleNum}
                      </div>
                      <span className={`text-xs ${
                        moduleNum <= currentStage ? 'text-teal-600 font-medium' : 'text-gray-400'
                      }`}>
                        M{moduleNum}
                      </span>
                    </div>
                  ))}
                </div>
                
                {/* Action Buttons */}
                {!showFeedback && (
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg py-3 mb-3"
                    onClick={handleNextModule}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <span>Next Module</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </Button>
                )}

                {showFeedback && currentStage < 5 && (
                  <Button 
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-lg py-3 border-2 border-dashed border-teal-400 mb-3"
                    onClick={() => {
                      setCurrentStage(prev => prev + 1);
                      setSelectedAnswer(null);
                      setShowFeedback(false);
                    }}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <span>Continue to Next Module</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </Button>
                )}
                
                {currentStage === 5 && showFeedback && (
                  <Button 
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg py-3"
                    onClick={handleCompleteModule}
                  >
                    <Award className="w-4 h-4 mr-2" />
                    Complete Earthquake Module
                  </Button>
                )}

                {currentStage === 5 && !showFeedback && (
                  <Button 
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg py-3"
                    onClick={handleCompleteModule}
                  >
                    <Award className="w-4 h-4 mr-2" />
                    Complete Final Module
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModuleDetailNew;