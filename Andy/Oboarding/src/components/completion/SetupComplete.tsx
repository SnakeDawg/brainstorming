import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Sparkles, ExternalLink } from 'lucide-react';
import Button from '../shared/Button';
import Card from '../shared/Card';
import { useSetup } from '../../contexts/SetupContext';

const SetupComplete: React.FC = () => {
  const { state } = useSetup();

  const setupDuration = state.startTime
    ? Math.round((new Date().getTime() - state.startTime.getTime()) / 1000 / 60)
    : 0;

  const handleFinish = () => {
    // In a real app, this would close the setup wizard
    alert('Setup complete! Your PC is ready to use.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50 flex items-center justify-center p-8">
      <div className="max-w-3xl w-full">
        {/* Success Animation */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center justify-center w-24 h-24 bg-green-500 rounded-full mb-6 shadow-2xl"
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          >
            <CheckCircle2 className="w-14 h-14 text-white" />
          </motion.div>

          <h1 className="text-4xl font-bold text-gray-900 mb-3">Your PC is All Set!</h1>
          <p className="text-xl text-gray-600">
            Setup completed in {setupDuration} minutes - you're ready to go
          </p>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Apps Installed */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card variant="elevated" padding="lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Apps Installed</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">{state.completedTasks.length}</p>
              <p className="text-sm text-gray-600">
                {state.selectedApps.map(app => app.name).join(', ')}
              </p>
            </Card>
          </motion.div>

          {/* Persona Detected */}
          {state.detectedPersona && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card variant="elevated" padding="lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Setup Profile</h3>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{state.detectedPersona.persona}</p>
                <p className="text-sm text-gray-600">
                  Optimized for your {state.detectedPersona.persona.toLowerCase()} needs
                </p>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card variant="elevated" padding="lg" className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Tips</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">All your apps are ready</p>
                  <p className="text-sm text-gray-600">
                    Find them in the Start Menu or taskbar
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Settings optimized for you</p>
                  <p className="text-sm text-gray-600">
                    System preferences configured based on your {state.detectedPersona?.persona.toLowerCase()} profile
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Need help?</p>
                  <p className="text-sm text-gray-600">
                    Access Abhi anytime from the Start Menu → AI Assistant
                  </p>
                </div>
              </li>
            </ul>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Button size="lg" onClick={handleFinish} className="px-8">
            Finish Setup
          </Button>
          <Button
            size="lg"
            variant="ghost"
            onClick={() => window.open('https://support.microsoft.com', '_blank')}
            rightIcon={<ExternalLink className="w-4 h-4" />}
          >
            Help & Support
          </Button>
        </motion.div>

        {/* Footer */}
        <motion.p
          className="text-center text-sm text-gray-500 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Thank you for using Abhi! We hope you enjoy your new PC.
        </motion.p>
      </div>
    </div>
  );
};

export default SetupComplete;
