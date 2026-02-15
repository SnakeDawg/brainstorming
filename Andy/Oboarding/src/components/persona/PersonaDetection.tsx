import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, CheckCircle2, Gamepad2, GraduationCap, Briefcase, Palette, Home } from 'lucide-react';
import Button from '../shared/Button';
import Card from '../shared/Card';
import ProgressBar from '../shared/ProgressBar';
import { useSetup } from '../../contexts/SetupContext';
import { PersonaType } from '../../types/personas';
import personasData from '../../data/personas.json';

const PersonaDetection: React.FC = () => {
  const { state, dispatch } = useSetup();
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Simulate detection progress animation
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsComplete(true);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(interval);
  }, []);

  const handleContinue = () => {
    dispatch({ type: 'SET_PHASE', payload: 'persona-confirmation' });
  };

  const handleChangePersona = () => {
    // Allow user to manually select a different persona
    dispatch({ type: 'SET_PERSONA', payload: null });
    dispatch({ type: 'SET_PHASE', payload: 'interview' });
  };

  if (!state.detectedPersona) {
    return null;
  }

  const detectedPersona = state.detectedPersona;
  const personaData = personasData.find(p => p.id === detectedPersona.persona);
  const secondaryPersonaData = detectedPersona.secondaryPersona
    ? personasData.find(p => p.id === detectedPersona.secondaryPersona)
    : null;

  const getPersonaIcon = (persona: PersonaType) => {
    switch (persona) {
      case 'Gamer':
        return Gamepad2;
      case 'Student':
        return GraduationCap;
      case 'Professional':
        return Briefcase;
      case 'Creator':
        return Palette;
      case 'Casual':
        return Home;
      default:
        return Sparkles;
    }
  };

  const PrimaryIcon = getPersonaIcon(state.detectedPersona.persona);
  const SecondaryIcon = state.detectedPersona.secondaryPersona
    ? getPersonaIcon(state.detectedPersona.secondaryPersona)
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50 flex items-center justify-center p-8">
      <div className="max-w-3xl w-full">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-600 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analyzing Your Preferences</h1>
          <p className="text-lg text-gray-600">
            {isComplete
              ? "I've detected your persona!"
              : 'Understanding your needs based on our conversation...'}
          </p>
        </motion.div>

        {/* Detection Progress */}
        {!isComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card variant="elevated" padding="lg" className="mb-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Detection Progress</span>
                      <span className="text-sm text-gray-600">{progress}%</span>
                    </div>
                    <ProgressBar progress={progress} size="md" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 text-center">
                  Analyzing conversation patterns and interests...
                </p>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Detected Persona */}
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card variant="elevated" padding="lg" className="mb-6">
              <div className="text-center mb-6">
                <motion.div
                  className="inline-flex items-center justify-center mb-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                >
                  <div
                    className="relative w-24 h-24 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: personaData?.color || '#6366f1' }}
                  >
                    <PrimaryIcon className="w-12 h-12 text-white" />
                    {isComplete && (
                      <motion.div
                        className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5, type: 'spring' }}
                      >
                        <CheckCircle2 className="w-6 h-6 text-white" />
                      </motion.div>
                    )}
                  </div>
                </motion.div>

                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {personaData?.name}
                  {state.detectedPersona.isHybrid && secondaryPersonaData && (
                    <span className="text-primary-600"> + {secondaryPersonaData.name}</span>
                  )}
                </h2>
                <p className="text-gray-600">{personaData?.description}</p>

                {/* Confidence Badge */}
                {state.detectedPersona.confidence !== undefined && !isNaN(state.detectedPersona.confidence) && (
                  <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full">
                    <span className="text-sm font-medium text-primary-700">
                      {Math.round(state.detectedPersona.confidence)}% confidence
                    </span>
                  </div>
                )}
              </div>

              {/* Hybrid Persona Display */}
              {state.detectedPersona.isHybrid && secondaryPersonaData && SecondaryIcon && (
                <motion.div
                  className="border-t border-gray-200 pt-6 mt-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <p className="text-sm text-gray-600 text-center mb-4">
                    You have a hybrid profile combining:
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-xl">
                      <div
                        className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-2"
                        style={{ backgroundColor: personaData?.color }}
                      >
                        <PrimaryIcon className="w-6 h-6 text-white" />
                      </div>
                      <p className="font-semibold text-gray-900">{personaData?.name}</p>
                      <p className="text-xs text-gray-600 mt-1">Primary</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-xl">
                      <div
                        className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-2"
                        style={{ backgroundColor: secondaryPersonaData.color }}
                      >
                        <SecondaryIcon className="w-6 h-6 text-white" />
                      </div>
                      <p className="font-semibold text-gray-900">{secondaryPersonaData.name}</p>
                      <p className="text-xs text-gray-600 mt-1">Secondary</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <Button onClick={handleContinue} size="lg" className="flex-1">
                  Continue to App Recommendations
                </Button>
                <Button onClick={handleChangePersona} variant="ghost" size="lg">
                  This isn't quite right
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Footer */}
        <motion.p
          className="text-center text-sm text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Based on this, I'll recommend apps and settings tailored to your needs
        </motion.p>
      </div>
    </div>
  );
};

export default PersonaDetection;
