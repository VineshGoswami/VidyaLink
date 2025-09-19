import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ChatPanel = ({ isCollapsed = false, onToggleCollapse = () => {} }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const mockMessages = [
    {
      id: 1,
      sender: "Dr. Priya Sharma",
      role: "educator",
      content: "Welcome everyone! Today we\'ll be covering advanced VLSI design principles.",
      timestamp: new Date(Date.now() - 300000),
      isSystem: false
    },
    {
      id: 2,
      sender: "System",
      role: "system",
      content: "Rahul Kumar joined the session",
      timestamp: new Date(Date.now() - 280000),
      isSystem: true
    },
    {
      id: 3,
      sender: "Anita Patel",
      role: "student",
      content: "Good morning ma\'am! Can you please share the presentation slides?",
      timestamp: new Date(Date.now() - 240000),
      isSystem: false
    },
    {
      id: 4,
      sender: "Dr. Priya Sharma",
      role: "educator",
      content: "Of course! I\'ll share them in the content library after the session.",
      timestamp: new Date(Date.now() - 200000),
      isSystem: false
    },
    {
      id: 5,
      sender: "Vikram Singh",
      role: "student",
      content: "Ma'am, the audio is very clear. Thank you for the excellent session setup.",
      timestamp: new Date(Date.now() - 180000),
      isSystem: false
    },
    {
      id: 6,
      sender: "Priya Reddy",
      role: "student",
      content: "Could you please explain the difference between CMOS and BiCMOS technology?",
      timestamp: new Date(Date.now() - 120000),
      isSystem: false
    },
    {
      id: 7,
      sender: "System",
      role: "system",
      content: "Poll started: Which VLSI design tool do you prefer?",
      timestamp: new Date(Date.now() - 60000),
      isSystem: true
    }
  ];

  useEffect(() => {
    setMessages(mockMessages);
  }, []);

  useEffect(() => {
    messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (message?.trim()) {
      const newMessage = {
        id: messages?.length + 1,
        sender: "You",
        role: "student",
        content: message,
        timestamp: new Date(),
        isSystem: false
      };
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e?.key === 'Enter' && !e?.shiftKey) {
      e?.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return timestamp?.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'educator': return 'text-primary';
      case 'student': return 'text-foreground';
      case 'system': return 'text-muted-foreground';
      default: return 'text-foreground';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'educator': return 'GraduationCap';
      case 'student': return 'User';
      case 'system': return 'Info';
      default: return 'User';
    }
  };

  if (isCollapsed) {
    return (
      <div className="w-12 bg-card border-l border-border flex flex-col items-center py-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="mb-4"
        >
          <Icon name="MessageSquare" size={20} />
        </Button>
        <div className="flex flex-col gap-2">
          {messages?.slice(-3)?.map((msg) => (
            <div key={msg?.id} className="w-2 h-2 bg-primary rounded-full"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-card border-l border-border flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon name="MessageSquare" size={20} className="text-primary" />
          <h3 className="font-semibold text-foreground">Live Chat</h3>
          <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
            {messages?.filter(m => !m?.isSystem)?.length}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
        >
          <Icon name="ChevronRight" size={16} />
        </Button>
      </div>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages?.map((msg) => (
          <div key={msg?.id} className={`${msg?.isSystem ? 'text-center' : ''}`}>
            {msg?.isSystem ? (
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Icon name={getRoleIcon(msg?.role)} size={12} />
                <span>{msg?.content}</span>
                <span className="text-xs">{formatTime(msg?.timestamp)}</span>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Icon 
                    name={getRoleIcon(msg?.role)} 
                    size={14} 
                    className={getRoleColor(msg?.role)} 
                  />
                  <span className={`text-sm font-medium ${getRoleColor(msg?.role)}`}>
                    {msg?.sender}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatTime(msg?.timestamp)}
                  </span>
                </div>
                <div className="ml-6 text-sm text-foreground bg-muted/30 rounded-lg p-2">
                  {msg?.content}
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      {/* Message Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e?.target?.value)}
              onKeyPress={handleKeyPress}
              className="border-0 bg-muted/50"
            />
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!message?.trim()}
            size="icon"
          >
            <Icon name="Send" size={16} />
          </Button>
        </div>
        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
          <span>Press Enter to send</span>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span>Connected</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;