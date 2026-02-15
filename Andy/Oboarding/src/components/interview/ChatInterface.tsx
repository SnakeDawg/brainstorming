import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, MicOff, ArrowLeft, ChevronRight } from 'lucide-react';
import Button from '../shared/Button';
import Card from '../shared/Card';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import QuickReplyPills from './QuickReplyPills';
import { useSetup } from '../../contexts/SetupContext';
import { useAIChat } from '../../hooks/useAIChat';
import { usePersonaDetection } from '../../hooks/usePersonaDetection';
import { useBackgroundTasks } from '../../hooks/useBackgroundTasks';

const ChatInterface: React.FC = () => {
  const { state, dispatch } = useSetup();
  const { sendMessage, isTyping, getCurrentSuggestions } = useAIChat();
  const { detectPersona } = usePersonaDetection();

  // Start background task simulation
  useBackgroundTasks();

  const [inputValue, setInputValue] = useState('');
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const hasInitialized = useRef(false);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.messages, isTyping]);

  // Send initial greeting and add background tasks when component mounts - only runs once
  useEffect(() => {
    if (state.messages.length === 0 && !hasInitialized.current) {
      hasInitialized.current = true;
      // Add initial background tasks
      const userInterviewTask = {
        id: 'task-user-interview',
        name: 'User Interview',
        type: 'configure' as const,
        status: 'in-progress' as const,
        progress: 0,
        currentAction: 'In progress',
      };

      const windowsUpdateTask = {
        id: 'task-windows-update',
        name: 'Updating Windows',
        type: 'update' as const,
        status: 'in-progress' as const,
        progress: 15,
        currentAction: 'Downloading updates',
        timeRemaining: 300,
      };

      const driverUpdateTask = {
        id: 'task-driver-update',
        name: 'Updating Device Drivers',
        type: 'update' as const,
        status: 'pending' as const,
        progress: 0,
        currentAction: 'Queued',
      };

      dispatch({ type: 'ADD_TASK', payload: userInterviewTask });
      dispatch({ type: 'ADD_TASK', payload: windowsUpdateTask });
      dispatch({ type: 'ADD_TASK', payload: driverUpdateTask });

      // Send greeting asking for name
      const greeting = {
        id: crypto.randomUUID(),
        role: 'assistant' as const,
        content: "Hi! I'm Abhi, your AI setup assistant. I'm here to help make your new PC feel like home. 😊\n\nWhat's your name?",
        timestamp: new Date(),
      };
      dispatch({ type: 'ADD_MESSAGE', payload: greeting });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Detect persona after sufficient conversation (but don't auto-transition)
  useEffect(() => {
    const userMessages = state.messages.filter(m => m.role === 'user');

    // Detect persona after 3 user messages but let user click button to proceed
    if (userMessages.length >= 3 && !state.detectedPersona) {
      const detectAsync = async () => {
        const result = await detectPersona(state.messages);
        // Set persona (even with lower confidence)
        dispatch({ type: 'SET_PERSONA', payload: result });
      };
      detectAsync();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.messages.length, state.detectedPersona]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage = {
      id: crypto.randomUUID(),
      role: 'user' as const,
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    // Add user message to state
    dispatch({ type: 'ADD_MESSAGE', payload: userMessage });
    setInputValue('');

    // Get AI response
    const aiResponse = await sendMessage(userMessage.content);
    dispatch({ type: 'ADD_MESSAGE', payload: aiResponse });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickReply = async (suggestion: string) => {
    if (isTyping) return;

    const userMessage = {
      id: crypto.randomUUID(),
      role: 'user' as const,
      content: suggestion,
      timestamp: new Date(),
    };

    // Add user message to state
    dispatch({ type: 'ADD_MESSAGE', payload: userMessage });

    // Get AI response
    const aiResponse = await sendMessage(userMessage.content);
    dispatch({ type: 'ADD_MESSAGE', payload: aiResponse });
  };

  const handleBack = () => {
    dispatch({ type: 'SET_PHASE', payload: 'welcome' });
  };

  const handleProceedToAnalyzing = () => {
    dispatch({ type: 'SET_PHASE', payload: 'persona-confirmation' });
  };

  // Check if interview is complete (has persona detected and sufficient messages)
  const userMessages = state.messages.filter(m => m.role === 'user');
  const isInterviewComplete = userMessages.length >= 3 && state.detectedPersona !== null;

  return (
    <div className="h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50 flex overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 flex flex-col p-8 min-h-0">
        <div className="max-w-4xl w-full flex-1 flex flex-col mx-auto min-h-0">
          {/* Header */}
          <motion.div
            className="mb-4 flex items-center gap-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Button variant="ghost" size="sm" onClick={handleBack} leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">Let's Get to Know You</h1>
              <p className="text-sm text-gray-600">Answer a few questions to personalize your setup</p>
            </div>
          </motion.div>

          {/* Chat Container */}
          <motion.div
            className="flex-1 flex flex-col min-h-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card variant="elevated" padding="none" className="flex-1 flex flex-col overflow-hidden min-h-0">
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {state.messages.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))}

                {/* Typing Indicator */}
                <AnimatePresence>
                  {isTyping && <TypingIndicator />}
                </AnimatePresence>

                {/* Quick Reply Pills */}
                {!isTyping && getCurrentSuggestions().length > 0 && (
                  <QuickReplyPills
                    suggestions={getCurrentSuggestions()}
                    onSelect={handleQuickReply}
                    disabled={isTyping}
                  />
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Interview Complete Button */}
              {isInterviewComplete && (
                <div className="border-t border-gray-200 p-6 bg-gradient-to-r from-primary-50 to-purple-50 text-center">
                  <p className="text-gray-700 mb-4 font-medium">
                    Great! I have enough information to analyze your needs and recommend the perfect setup for you.
                  </p>
                  <Button
                    size="lg"
                    onClick={handleProceedToAnalyzing}
                    rightIcon={<ChevronRight className="w-5 h-5" />}
                  >
                    Let's see my recommendations
                  </Button>
                </div>
              )}

              {/* Input Area */}
              {!isInterviewComplete && (
              <div className="border-t border-gray-200 p-4 bg-gray-50">
                <div className="flex gap-3 items-end">
                  {/* Voice Toggle */}
                  <Button
                    variant={isVoiceEnabled ? 'primary' : 'ghost'}
                    size="md"
                    onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
                    className="flex-shrink-0"
                    aria-label={isVoiceEnabled ? 'Disable voice input' : 'Enable voice input'}
                  >
                    {isVoiceEnabled ? (
                      <Mic className="w-5 h-5" />
                    ) : (
                      <MicOff className="w-5 h-5" />
                    )}
                  </Button>

                  {/* Text Input */}
                  <textarea
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 resize-none rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent max-h-32 text-sm"
                    rows={1}
                    disabled={isTyping}
                    style={{
                      minHeight: '44px',
                      height: 'auto',
                    }}
                  />

                  {/* Send Button */}
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isTyping}
                    size="md"
                    className="flex-shrink-0"
                    aria-label="Send message"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>

                {/* Helper Text */}
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Press Enter to send • Shift + Enter for new line
                  {isVoiceEnabled && ' • Voice input enabled'}
                </p>
              </div>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
