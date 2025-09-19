import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const InteractiveControls = ({ 
  onRaiseHand = () => {},
  onToggleAudio = () => {},
  onToggleVideo = () => {},
  isHandRaised = false,
  isAudioOn = true,
  isVideoOn = false
}) => {
  const [showPoll, setShowPoll] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedPollOption, setSelectedPollOption] = useState('');
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState('');

  const mockPoll = {
    id: 1,
    question: "Which VLSI design methodology do you find most challenging?",
    options: [
      { id: 'a', text: 'Full Custom Design', votes: 12 },
      { id: 'b', text: 'Semi-Custom Design', votes: 8 },
      { id: 'c', text: 'FPGA Implementation', votes: 15 },
      { id: 'd', text: 'System-on-Chip Design', votes: 5 }
    ],
    totalVotes: 40,
    timeLeft: 45
  };

  const mockQuiz = {
    id: 1,
    question: "What is the primary advantage of CMOS technology over NMOS?",
    options: [
      { id: 'a', text: 'Higher speed operation' },
      { id: 'b', text: 'Lower power consumption' },
      { id: 'c', text: 'Smaller chip area' },
      { id: 'd', text: 'Better noise immunity' }
    ],
    timeLeft: 30,
    correctAnswer: 'b'
  };

  const handlePollSubmit = () => {
    if (selectedPollOption) {
      console.log('Poll answer submitted:', selectedPollOption);
      setShowPoll(false);
      setSelectedPollOption('');
    }
  };

  const handleQuizSubmit = () => {
    if (selectedQuizAnswer) {
      console.log('Quiz answer submitted:', selectedQuizAnswer);
      setShowQuiz(false);
      setSelectedQuizAnswer('');
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Controls */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <Icon name="Settings" size={16} />
          Session Controls
        </h3>
        
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant={isHandRaised ? "default" : "outline"}
            onClick={onRaiseHand}
            className="flex items-center gap-2"
          >
            <Icon name="Hand" size={16} />
            {isHandRaised ? "Hand Raised" : "Raise Hand"}
          </Button>

          <Button
            variant={isAudioOn ? "default" : "outline"}
            onClick={onToggleAudio}
            className="flex items-center gap-2"
          >
            <Icon name={isAudioOn ? "Mic" : "MicOff"} size={16} />
            {isAudioOn ? "Mute" : "Unmute"}
          </Button>

          <Button
            variant={isVideoOn ? "default" : "outline"}
            onClick={onToggleVideo}
            className="flex items-center gap-2"
          >
            <Icon name={isVideoOn ? "Video" : "VideoOff"} size={16} />
            {isVideoOn ? "Stop Video" : "Start Video"}
          </Button>

          <Button
            variant="outline"
            onClick={() => setShowPoll(true)}
            className="flex items-center gap-2"
          >
            <Icon name="BarChart3" size={16} />
            View Poll
          </Button>
        </div>
      </div>
      {/* Live Poll */}
      {showPoll && (
        <div className="bg-card border border-border rounded-lg p-4 animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Icon name="BarChart3" size={16} className="text-primary" />
              Live Poll
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {mockPoll?.timeLeft}s left
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowPoll(false)}
              >
                <Icon name="X" size={14} />
              </Button>
            </div>
          </div>

          <p className="text-sm text-foreground mb-4">{mockPoll?.question}</p>

          <div className="space-y-2 mb-4">
            {mockPoll?.options?.map((option) => {
              const percentage = (option?.votes / mockPoll?.totalVotes) * 100;
              return (
                <label
                  key={option?.id}
                  className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedPollOption === option?.id
                      ? 'border-primary bg-primary/5' :'border-border hover:bg-muted/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="poll"
                    value={option?.id}
                    checked={selectedPollOption === option?.id}
                    onChange={(e) => setSelectedPollOption(e?.target?.value)}
                    className="w-4 h-4 text-primary"
                  />
                  <div className="flex-1">
                    <span className="text-sm text-foreground">{option?.text}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 bg-muted rounded-full h-1">
                        <div 
                          className="bg-primary h-1 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {option?.votes} ({Math.round(percentage)}%)
                      </span>
                    </div>
                  </div>
                </label>
              );
            })}
          </div>

          <Button
            onClick={handlePollSubmit}
            disabled={!selectedPollOption}
            className="w-full"
          >
            Submit Vote
          </Button>
        </div>
      )}
      {/* Quiz Widget */}
      {showQuiz && (
        <div className="bg-card border border-border rounded-lg p-4 animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Icon name="HelpCircle" size={16} className="text-secondary" />
              Quick Quiz
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {mockQuiz?.timeLeft}s left
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowQuiz(false)}
              >
                <Icon name="X" size={14} />
              </Button>
            </div>
          </div>

          <p className="text-sm text-foreground mb-4">{mockQuiz?.question}</p>

          <div className="space-y-2 mb-4">
            {mockQuiz?.options?.map((option) => (
              <label
                key={option?.id}
                className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedQuizAnswer === option?.id
                    ? 'border-secondary bg-secondary/5' :'border-border hover:bg-muted/50'
                }`}
              >
                <input
                  type="radio"
                  name="quiz"
                  value={option?.id}
                  checked={selectedQuizAnswer === option?.id}
                  onChange={(e) => setSelectedQuizAnswer(e?.target?.value)}
                  className="w-4 h-4 text-secondary"
                />
                <span className="text-sm text-foreground">{option?.text}</span>
              </label>
            ))}
          </div>

          <Button
            onClick={handleQuizSubmit}
            disabled={!selectedQuizAnswer}
            variant="secondary"
            className="w-full"
          >
            Submit Answer
          </Button>
        </div>
      )}
      {/* Session Info */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <Icon name="Info" size={16} />
          Session Info
        </h3>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Duration:</span>
            <span className="text-foreground font-mono">1:23:45</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Participants:</span>
            <span className="text-foreground">24 students</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Recording:</span>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-error rounded-full animate-pulse"></div>
              <span className="text-foreground">Active</span>
            </div>
          </div>
        </div>
      </div>
      {/* Quick Actions */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowQuiz(true)}
          className="flex-1"
        >
          <Icon name="HelpCircle" size={14} className="mr-1" />
          Quiz
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
        >
          <Icon name="Share" size={14} className="mr-1" />
          Share
        </Button>
      </div>
    </div>
  );
};

export default InteractiveControls;