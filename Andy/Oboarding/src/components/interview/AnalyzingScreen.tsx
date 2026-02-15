import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, Sparkles } from 'lucide-react';
import RightSidebarStatus from '../shared/RightSidebarStatus';
import { useSetup } from '../../contexts/SetupContext';
import { usePersonaDetection } from '../../hooks/usePersonaDetection';

const AnalyzingScreen: React.FC = () => {
  const { state, dispatch } = useSetup();
  const { detectPersona } = usePersonaDetection();

  useEffect(() => {
    // Simulate analysis time
    const timer = setTimeout(async () => {
      // Detect persona
      const result = await detectPersona(state.messages);
      dispatch({ type: 'SET_PERSONA', payload: result });

      // Complete user interview task
      dispatch({
        type: 'UPDATE_TASK_PROGRESS',
        payload: {
          id: 'task-user-interview',
          progress: 100,
          currentAction: 'Complete',
        },
      });
      setTimeout(() => {
        dispatch({ type: 'COMPLETE_TASK', payload: 'task-user-interview' });
      }, 500);

      // Transition to persona detection
      setTimeout(() => {
        dispatch({ type: 'SET_PHASE', payload: 'persona-detection' });
      }, 2500);
    }, 2000);

    return () => clearTimeout(timer);
  }, [state.messages, dispatch, detectPersona]);

  return (
    <div className="h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50 flex overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-2xl w-full text-center">
          {/* Animated Icon */}
          <motion.div
            className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full mb-8 relative"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Brain className="w-12 h-12 text-white" />

            {/* Sparkles */}
            <motion.div
              className="absolute -top-2 -right-2"
              animate={{
                opacity: [0, 1, 0],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <Sparkles className="w-6 h-6 text-yellow-400" />
            </motion.div>

            <motion.div
              className="absolute -bottom-2 -left-2"
              animate={{
                opacity: [0, 1, 0],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.75,
              }}
            >
              <Sparkles className="w-6 h-6 text-pink-400" />
            </motion.div>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Analyzing your preferences...
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              I'm using AI to understand exactly what you need and recommend the perfect apps for you.
            </p>
          </motion.div>

          {/* Loading Dots */}
          <motion.div
            className="flex justify-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 bg-primary-500 rounded-full"
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.2,
                }}
              />
            ))}
          </motion.div>
        </div>
      </div>

      {/* Right Sidebar Status */}
      <RightSidebarStatus />
    </div>
  );
};

export default AnalyzingScreen;
