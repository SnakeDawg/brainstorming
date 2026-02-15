import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Gamepad2, Briefcase, GraduationCap, Palette, Home } from 'lucide-react';
import Button from '../shared/Button';
import Card from '../shared/Card';
import RightSidebarStatus from '../shared/RightSidebarStatus';
import { useSetup } from '../../contexts/SetupContext';

interface UseCase {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
}

const useCases: UseCase[] = [
  {
    id: 'gaming',
    title: 'Gaming',
    description: 'Competitive, casual, or streaming',
    icon: <Gamepad2 className="w-8 h-8" />,
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    id: 'work',
    title: 'Work & Productivity',
    description: 'Office apps, business tools',
    icon: <Briefcase className="w-8 h-8" />,
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'school',
    title: 'School & Learning',
    description: 'Note-taking, research, online classes',
    icon: <GraduationCap className="w-8 h-8" />,
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    id: 'creative',
    title: 'Creative Work',
    description: 'Video, photo, design, music',
    icon: <Palette className="w-8 h-8" />,
    gradient: 'from-orange-500 to-red-500',
  },
  {
    id: 'general',
    title: 'General Use',
    description: 'Browsing, media, communication',
    icon: <Home className="w-8 h-8" />,
    gradient: 'from-gray-500 to-slate-500',
  },
];

const UseCaseSelectionScreen: React.FC = () => {
  const { state, dispatch } = useSetup();

  const handleSelect = (useCaseId: string) => {
    // Store the selection in a message for persona detection
    const message = {
      id: crypto.randomUUID(),
      role: 'user' as const,
      content: useCaseId,
      timestamp: new Date(),
    };
    dispatch({ type: 'ADD_MESSAGE', payload: message });

    // Move to details screen
    dispatch({ type: 'SET_PHASE', payload: 'analyzing' });
  };

  const handleBack = () => {
    dispatch({ type: 'SET_PHASE', payload: 'name-input' });
  };

  return (
    <div className="h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50 flex overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 flex flex-col p-8 min-h-0">
        <div className="max-w-5xl w-full mx-auto flex-1 flex flex-col min-h-0">
          {/* Header */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Button variant="ghost" size="sm" onClick={handleBack} leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back
            </Button>
          </motion.div>

          {/* Title */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Nice to meet you, {state.userName}! 😊
            </h1>
            <p className="text-lg text-gray-600">
              Tell me, how will you mainly be using this machine?
            </p>
          </motion.div>

          {/* Use Case Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {useCases.map((useCase, index) => (
              <motion.div
                key={useCase.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <Card
                  variant="elevated"
                  padding="lg"
                  className="h-full cursor-pointer group"
                  onClick={() => handleSelect(useCase.id)}
                >
                  <div className="flex flex-col items-center text-center">
                    {/* Icon */}
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${useCase.gradient} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                      {useCase.icon}
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {useCase.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-gray-600">
                      {useCase.description}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Sidebar Status */}
      <RightSidebarStatus />
    </div>
  );
};

export default UseCaseSelectionScreen;
