import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Button from '../shared/Button';
import RightSidebarStatus from '../shared/RightSidebarStatus';
import { useSetup } from '../../contexts/SetupContext';

const UseCaseDetailsScreen: React.FC = () => {
  const { state, dispatch } = useSetup();
  const [details, setDetails] = useState('');

  // Get the selected use case from messages
  const selectedUseCase = state.messages.find(m => m.role === 'user')?.content || '';

  const getPromptText = () => {
    switch (selectedUseCase) {
      case 'gaming':
        return 'What types of games are you into? This helps me recommend the right software and optimize your settings.';
      case 'work':
        return 'What tools do you primarily use for work?';
      case 'school':
        return 'What will you need for school? Note-taking, video calls, programming?';
      case 'creative':
        return 'What type of content do you create?';
      case 'general':
        return 'Are there any specific apps or activities you do regularly?';
      default:
        return 'Tell me a bit more about what you need.';
    }
  };

  const getSuggestions = () => {
    switch (selectedUseCase) {
      case 'gaming':
        return ['Competitive FPS', 'RPGs & Story Games', 'Strategy Games', 'Indie Games'];
      case 'work':
        return ['Microsoft Office', 'Google Workspace', 'Development Tools', 'Creative Suite'];
      case 'school':
        return ['Note-taking', 'Video Conferencing', 'Programming', 'Research & Writing'];
      case 'creative':
        return ['Video Editing', 'Photo Editing', 'Graphic Design', 'Music Production'];
      case 'general':
        return ['Web Browsing', 'Streaming Media', 'Social Media', 'Email'];
      default:
        return [];
    }
  };

  const handleContinue = (selectedDetail?: string) => {
    const finalDetail = selectedDetail || details;
    if (finalDetail.trim()) {
      const message = {
        id: crypto.randomUUID(),
        role: 'user' as const,
        content: finalDetail.trim(),
        timestamp: new Date(),
      };
      dispatch({ type: 'ADD_MESSAGE', payload: message });
      dispatch({ type: 'SET_PHASE', payload: 'analyzing' });
    }
  };

  const handleBack = () => {
    // Remove the last message (use case selection)
    dispatch({ type: 'SET_PHASE', payload: 'interview' });
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {/* Heading */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">
              {getPromptText()}
            </h1>

            {/* Suggestions */}
            <motion.div
              className="flex flex-wrap gap-3 justify-center mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {getSuggestions().map((suggestion, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleContinue(suggestion)}
                  className="px-6 py-3 bg-white border-2 border-primary-200 text-primary-700 rounded-full text-sm font-medium hover:bg-primary-50 hover:border-primary-300 transition-colors"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {suggestion}
                </motion.button>
              ))}
            </motion.div>

            {/* Divider */}
            <motion.div
              className="flex items-center gap-4 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex-1 h-px bg-gray-300" />
              <span className="text-sm text-gray-500">or type your own</span>
              <div className="flex-1 h-px bg-gray-300" />
            </motion.div>

            {/* Text Input */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Tell me more..."
                className="w-full px-6 py-4 text-base border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                rows={3}
              />
            </motion.div>

            {/* Continue Button */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <Button
                size="lg"
                onClick={() => handleContinue()}
                disabled={!details.trim()}
                className="px-12"
              >
                Continue
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Right Sidebar Status */}
      <RightSidebarStatus />
    </div>
  );
};

export default UseCaseDetailsScreen;
