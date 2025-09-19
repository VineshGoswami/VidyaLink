import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const InteractiveQuiz = ({ 
  currentTime, 
  onSeekTo,
  className = '' 
}) => {
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [quizHistory, setQuizHistory] = useState([]);

  // Mock quiz data with timestamps
  const quizzes = [
    {
      id: 1,
      timestamp: 120,
      title: "MOSFET Fundamentals",
      questions: [
        {
          id: 1,
          question: "What are the four terminals of a MOSFET?",
          type: "multiple-choice",
          options: [
            "Gate, Source, Drain, Body",
            "Anode, Cathode, Gate, Base",
            "Collector, Emitter, Base, Gate",
            "Input, Output, Control, Ground"
          ],
          correctAnswer: 0,
          explanation: "A MOSFET has four terminals: Gate (controls current flow), Source (current enters), Drain (current exits), and Body/Substrate (usually connected to source)."
        },
        {
          id: 2,
          question: "Which parameter determines when a MOSFET turns on?",
          type: "multiple-choice",
          options: [
            "Drain voltage",
            "Source voltage", 
            "Threshold voltage",
            "Body voltage"
          ],
          correctAnswer: 2,
          explanation: "The threshold voltage (Vth) is the minimum gate-to-source voltage required to create a conducting channel between source and drain."
        }
      ]
    },
    {
      id: 2,
      timestamp: 420,
      title: "Scaling and Process Variations",
      questions: [
        {
          id: 3,
          question: "What is the main challenge with Moore\'s Law today?",
          type: "multiple-choice",
          options: [
            "Cost of manufacturing",
            "Physical limitations of silicon",
            "Power density issues",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "Modern semiconductor scaling faces multiple challenges: manufacturing costs increase exponentially, physical limits of silicon atoms, and power density creates thermal issues."
        }
      ]
    },
    {
      id: 3,
      timestamp: 620,
      title: "Power Optimization",
      questions: [
        {
          id: 4,
          question: "Which technique reduces dynamic power consumption?",
          type: "multiple-choice",
          options: [
            "Clock gating",
            "Power gating",
            "Voltage scaling",
            "All of the above"
          ],
          correctAnswer: 3,
          explanation: "All three techniques help reduce power: Clock gating stops clock signals to unused circuits, power gating completely shuts off power to unused blocks, and voltage scaling reduces operating voltage."
        }
      ]
    }
  ];

  useEffect(() => {
    // Check if there's a quiz at current timestamp
    const quiz = quizzes?.find(q => 
      Math.abs(currentTime - q?.timestamp) < 5 && // 5 second window
      !quizHistory?.some(h => h?.quizId === q?.id)
    );
    
    if (quiz && !activeQuiz) {
      setActiveQuiz(quiz);
      setSelectedAnswers({});
      setShowResults(false);
    }
  }, [currentTime, activeQuiz, quizHistory]);

  const handleAnswerSelect = (questionId, answerIndex) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const handleSubmitQuiz = () => {
    setShowResults(true);
    
    // Calculate score
    const totalQuestions = activeQuiz?.questions?.length;
    const correctAnswers = activeQuiz?.questions?.filter(q => 
      selectedAnswers?.[q?.id] === q?.correctAnswer
    )?.length;
    
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    
    // Add to history
    setQuizHistory(prev => [...prev, {
      quizId: activeQuiz?.id,
      timestamp: activeQuiz?.timestamp,
      title: activeQuiz?.title,
      score,
      answers: selectedAnswers,
      completedAt: new Date()
    }]);
  };

  const handleCloseQuiz = () => {
    setActiveQuiz(null);
    setSelectedAnswers({});
    setShowResults(false);
  };

  const handleRetakeQuiz = () => {
    setSelectedAnswers({});
    setShowResults(false);
    // Remove from history to allow retake
    setQuizHistory(prev => prev?.filter(h => h?.quizId !== activeQuiz?.id));
  };

  const getQuestionIcon = (type) => {
    switch (type) {
      case 'multiple-choice':
        return 'CheckCircle';
      case 'true-false':
        return 'ToggleLeft';
      default:
        return 'HelpCircle';
    }
  };

  if (!activeQuiz) {
    return (
      <div className={`bg-card border border-border rounded-lg p-4 ${className}`}>
        <div className="text-center">
          <Icon name="Brain" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="font-medium text-foreground mb-2">Interactive Quizzes</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Quizzes will appear automatically at specific timestamps during the video
          </p>
          
          {quizHistory?.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-foreground">Completed Quizzes</h4>
              {quizHistory?.map((quiz) => (
                <div key={quiz?.quizId} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                  <div className="text-left">
                    <p className="text-sm font-medium">{quiz?.title}</p>
                    <p className="text-xs text-muted-foreground">
                      Score: {quiz?.score}% • {quiz?.completedAt?.toLocaleTimeString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onSeekTo(quiz?.timestamp)}
                  >
                    <Icon name="Play" size={14} />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-card border border-border rounded-lg ${className}`}>
      {/* Quiz Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Icon name="Brain" size={20} className="text-primary" />
          <div>
            <h3 className="font-semibold text-foreground">{activeQuiz?.title}</h3>
            <p className="text-sm text-muted-foreground">
              Quiz at {Math.floor(activeQuiz?.timestamp / 60)}:{(activeQuiz?.timestamp % 60)?.toString()?.padStart(2, '0')}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCloseQuiz}
        >
          <Icon name="X" size={20} />
        </Button>
      </div>
      {/* Quiz Content */}
      <div className="p-4">
        {!showResults ? (
          <div className="space-y-6">
            {activeQuiz?.questions?.map((question, qIndex) => (
              <div key={question?.id} className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                    <Icon name={getQuestionIcon(question?.type)} size={14} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground mb-3">
                      {qIndex + 1}. {question?.question}
                    </h4>
                    
                    <div className="space-y-2">
                      {question?.options?.map((option, optIndex) => (
                        <label
                          key={optIndex}
                          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                            selectedAnswers?.[question?.id] === optIndex
                              ? 'bg-primary/10 border border-primary' :'bg-muted/30 hover:bg-muted/50 border border-transparent'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`question-${question?.id}`}
                            value={optIndex}
                            checked={selectedAnswers?.[question?.id] === optIndex}
                            onChange={() => handleAnswerSelect(question?.id, optIndex)}
                            className="sr-only"
                          />
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            selectedAnswers?.[question?.id] === optIndex
                              ? 'border-primary bg-primary' :'border-muted-foreground'
                          }`}>
                            {selectedAnswers?.[question?.id] === optIndex && (
                              <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                            )}
                          </div>
                          <span className="text-sm text-foreground">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                {Object.keys(selectedAnswers)?.length} of {activeQuiz?.questions?.length} answered
              </p>
              <Button
                onClick={handleSubmitQuiz}
                disabled={Object.keys(selectedAnswers)?.length !== activeQuiz?.questions?.length}
              >
                Submit Quiz
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Results Summary */}
            <div className="text-center p-6 bg-muted/30 rounded-lg">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Trophy" size={32} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Quiz Complete!</h3>
              <p className="text-3xl font-bold text-primary mb-2">
                {Math.round((activeQuiz?.questions?.filter(q => selectedAnswers?.[q?.id] === q?.correctAnswer)?.length / activeQuiz?.questions?.length) * 100)}%
              </p>
              <p className="text-sm text-muted-foreground">
                {activeQuiz?.questions?.filter(q => selectedAnswers?.[q?.id] === q?.correctAnswer)?.length} out of {activeQuiz?.questions?.length} correct
              </p>
            </div>

            {/* Detailed Results */}
            <div className="space-y-4">
              <h4 className="font-medium text-foreground">Review Answers</h4>
              {activeQuiz?.questions?.map((question, qIndex) => {
                const isCorrect = selectedAnswers?.[question?.id] === question?.correctAnswer;
                const userAnswer = selectedAnswers?.[question?.id];
                
                return (
                  <div key={question?.id} className="space-y-3 p-4 border border-border rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                        isCorrect ? 'bg-success text-success-foreground' : 'bg-error text-error-foreground'
                      }`}>
                        <Icon name={isCorrect ? "Check" : "X"} size={14} />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium text-foreground mb-2">
                          {qIndex + 1}. {question?.question}
                        </h5>
                        
                        <div className="space-y-2 mb-3">
                          <p className="text-sm">
                            <span className="text-muted-foreground">Your answer: </span>
                            <span className={isCorrect ? 'text-success' : 'text-error'}>
                              {question?.options?.[userAnswer]}
                            </span>
                          </p>
                          {!isCorrect && (
                            <p className="text-sm">
                              <span className="text-muted-foreground">Correct answer: </span>
                              <span className="text-success">
                                {question?.options?.[question?.correctAnswer]}
                              </span>
                            </p>
                          )}
                        </div>
                        
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <p className="text-sm text-muted-foreground">
                            <strong>Explanation:</strong> {question?.explanation}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-border">
              <Button variant="outline" onClick={handleRetakeQuiz}>
                <Icon name="RotateCcw" size={16} />
                Retake Quiz
              </Button>
              <Button onClick={handleCloseQuiz}>
                Continue Learning
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractiveQuiz;