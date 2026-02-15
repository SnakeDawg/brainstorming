import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles } from 'lucide-react';
import Button from '../shared/Button';
import { useSetup } from '../../contexts/SetupContext';
import { useBackgroundTasks } from '../../hooks/useBackgroundTasks';
import { getMockConversation } from '../../utils/mockData';

const NameInputScreen: React.FC = () => {
  const { state, dispatch } = useSetup();
  const [name, setName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Start background task simulation
  useBackgroundTasks();

  useEffect(() => {
    // Focus input on mount
    inputRef.current?.focus();

    // Add initial background tasks if not already added
    if (state.activeTasks.length === 0) {
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleContinue = () => {
    if (name.trim()) {
      dispatch({ type: 'SET_USER_NAME', payload: name.trim() });

      // For demo/testing: use mock conversation data
      // Comment this out to use real interview
      const useMockData = true;

      if (useMockData) {
        // Add mock conversation messages
        const mockMessages = getMockConversation(name.trim());
        mockMessages.forEach(msg => {
          dispatch({ type: 'ADD_MESSAGE', payload: msg });
        });

        // Go to interview screen to show the conversation
        dispatch({ type: 'SET_PHASE', payload: 'interview' });
      } else {
        // Add initial greeting message to start the interview
        dispatch({
          type: 'ADD_MESSAGE',
          payload: {
            id: `msg-${Date.now()}`,
            role: 'assistant',
            content: `Nice to meet you, ${name.trim()}! I'm here to help set up your new PC perfectly for you. To get started, tell me a bit about how you'll be using this computer. What do you mainly plan to do with it?`,
            timestamp: new Date()
          }
        });

        dispatch({ type: 'SET_PHASE', payload: 'interview' });
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleContinue();
    }
  };

  const handleBack = () => {
    dispatch({ type: 'SET_PHASE', payload: 'welcome' });
  };

  return (
    <div className="h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50 flex overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-2xl w-full">
          {/* Back Button */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Button variant="ghost" size="sm" onClick={handleBack} leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back
            </Button>
          </motion.div>

          {/* Main Content */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {/* Icon */}
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-2xl mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
            >
              <Sparkles className="w-8 h-8 text-primary-600" />
            </motion.div>

            {/* Heading */}
            <motion.h1
              className="text-4xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Hi! I'm Abhi 👋
            </motion.h1>

            <motion.p
              className="text-xl text-gray-600 mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              I'm your AI setup assistant. I'm here to help make your new PC feel like home.
            </motion.p>

            {/* Name Input */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label htmlFor="name" className="block text-lg font-medium text-gray-700 mb-4">
                What's your name?
              </label>
              <input
                ref={inputRef}
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your first name"
                className="w-full max-w-md mx-auto px-6 py-4 text-lg text-center border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </motion.div>

            {/* Continue Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Button
                size="lg"
                onClick={handleContinue}
                disabled={!name.trim()}
                className="px-12"
              >
                Continue
              </Button>
            </motion.div>

            {/* Helper Text */}
            <motion.p
              className="text-sm text-gray-500 mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              Press Enter to continue
            </motion.p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default NameInputScreen;
