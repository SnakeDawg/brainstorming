import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Shield, Zap } from 'lucide-react';
import Button from '../shared/Button';
import Card from '../shared/Card';
import Modal from '../shared/Modal';
import { useSetup } from '../../contexts/SetupContext';

const WelcomeScreen: React.FC = () => {
  const { dispatch } = useSetup();
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showSkipDialog, setShowSkipDialog] = useState(false);

  const handleResetSetup = () => {
    localStorage.clear();
    window.location.reload();
  };

  const handleContinue = () => {
    setShowPrivacy(true);
  };

  const handleAcceptPrivacy = () => {
    setShowPrivacy(false);
    dispatch({ type: 'SET_PHASE', payload: 'name-input' });
  };

  const handleSkip = () => {
    setShowSkipDialog(true);
  };

  const confirmSkip = () => {
    // In a real app, this would exit the setup
    alert('Setup skipped. You can access Abhi later from the Start Menu.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50 flex items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        {/* Logo/Brand */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-600 rounded-2xl mb-4 shadow-lg">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-2">Welcome to Abhi</h1>
          <p className="text-xl text-gray-600">Your AI-Powered PC Setup Assistant</p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card variant="elevated" padding="lg" className="mb-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                Let me help you set up your new PC
              </h2>
              <p className="text-lg text-gray-600">
                I'll guide you through the entire process - no technical knowledge required.
              </p>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <motion.div
                className="text-center p-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-xl mb-3">
                  <Zap className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Quick Setup</h3>
                <p className="text-sm text-gray-600">Your PC will be ready in just 8-12 minutes</p>
              </motion.div>

              <motion.div
                className="text-center p-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl mb-3">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Personalized</h3>
                <p className="text-sm text-gray-600">AI detects your needs and recommends apps</p>
              </motion.div>

              <motion.div
                className="text-center p-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mb-3">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Privacy First</h3>
                <p className="text-sm text-gray-600">All processing happens on your device</p>
              </motion.div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={handleContinue} className="px-8">
                Get Started
              </Button>
              <Button size="lg" variant="ghost" onClick={handleSkip}>
                Skip Setup
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.div
          className="text-center space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-sm text-gray-500">
            This setup assistant showcases the future of AI-powered PC onboarding
          </p>
          <button
            onClick={handleResetSetup}
            className="text-xs text-gray-400 hover:text-primary-600 underline"
          >
            Reset Demo
          </button>
        </motion.div>
      </div>

      {/* Privacy Modal */}
      <Modal
        isOpen={showPrivacy}
        onClose={() => setShowPrivacy(false)}
        title="Privacy First"
        size="lg"
        footer={
          <div className="flex gap-3">
            <Button onClick={handleAcceptPrivacy} className="flex-1">
              Accept & Continue
            </Button>
            <Button variant="ghost" onClick={() => setShowPrivacy(false)}>
              Decline (Exit)
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            Abhi uses AI to personalize your setup. Here's what you need to know:
          </p>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Data Collected</h4>
                <p className="text-sm text-gray-600">
                  Device info, setup preferences, and conversation summary
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Processing</h4>
                <p className="text-sm text-gray-600">
                  Primary processing on-device; optional cloud AI for complex questions
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Storage</h4>
                <p className="text-sm text-gray-600">
                  Encrypted locally; auto-deleted after 30 days
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900 mb-1">No Sharing</h4>
                <p className="text-sm text-gray-600">
                  Data not shared with third parties without consent
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <button
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              onClick={() => window.open('#', '_blank')}
            >
              Read Full Privacy Policy →
            </button>
          </div>
        </div>
      </Modal>

      {/* Skip Confirmation Dialog */}
      <Modal
        isOpen={showSkipDialog}
        onClose={() => setShowSkipDialog(false)}
        title="Skip Automated Setup?"
        size="md"
        footer={
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setShowSkipDialog(false)} className="flex-1">
              Continue Setup
            </Button>
            <Button variant="danger" onClick={confirmSkip} className="flex-1">
              Skip
            </Button>
          </div>
        }
      >
        <p className="text-gray-700 leading-relaxed">
          You'll need to manually configure system settings, install apps, and migrate data. You can always
          access Abhi later from the Start Menu.
        </p>
      </Modal>
    </div>
  );
};

export default WelcomeScreen;
