import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Monitor, Keyboard, Mouse, Headphones, Mic, CheckCircle2, ArrowRight } from 'lucide-react';
import Button from '../shared/Button';
import Card from '../shared/Card';
import { useSetup } from '../../contexts/SetupContext';
import { Peripheral } from '../../types/setup';

interface PeripheralType {
  type: 'keyboard' | 'mouse' | 'webcam' | 'speaker' | 'headphone' | 'microphone';
  icon: React.ReactNode;
  name: string;
  description: string;
}

const peripheralTypes: PeripheralType[] = [
  {
    type: 'keyboard',
    icon: <Keyboard className="w-6 h-6" />,
    name: 'Keyboard',
    description: 'External keyboard detected',
  },
  {
    type: 'mouse',
    icon: <Mouse className="w-6 h-6" />,
    name: 'Mouse',
    description: 'External mouse detected',
  },
  {
    type: 'headphone',
    icon: <Headphones className="w-6 h-6" />,
    name: 'Headphones / Speakers',
    description: 'Audio output device',
  },
  {
    type: 'microphone',
    icon: <Mic className="w-6 h-6" />,
    name: 'Microphone',
    description: 'Audio input device',
  },
];

const PeripheralSetupScreen: React.FC = () => {
  const { dispatch } = useSetup();
  const [detectedPeripherals, setDetectedPeripherals] = useState<Peripheral[]>([]);
  const [isScanning, setIsScanning] = useState(true);

  useEffect(() => {
    // Simulate peripheral detection
    const timer = setTimeout(() => {
      const peripherals: Peripheral[] = [
        {
          id: 'keyboard-1',
          name: 'Logitech Keyboard',
          type: 'keyboard',
          status: 'detected',
        },
        {
          id: 'mouse-1',
          name: 'Logitech Mouse',
          type: 'mouse',
          status: 'detected',
        },
        {
          id: 'headphone-1',
          name: 'Realtek Audio',
          type: 'headphone',
          status: 'detected',
        },
      ];

      setDetectedPeripherals(peripherals);
      dispatch({ type: 'SET_PERIPHERALS', payload: peripherals });
      setIsScanning(false);

      // Auto-configure peripherals
      peripherals.forEach((peripheral, index) => {
        setTimeout(() => {
          setDetectedPeripherals(prev =>
            prev.map(p =>
              p.id === peripheral.id
                ? { ...p, status: 'updating' as const }
                : p
            )
          );

          setTimeout(() => {
            setDetectedPeripherals(prev =>
              prev.map(p =>
                p.id === peripheral.id
                  ? { ...p, status: 'ready' as const }
                  : p
              )
            );
          }, 1500);
        }, index * 500);
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [dispatch]);

  const handleContinue = () => {
    dispatch({ type: 'SET_PHASE', payload: 'installation' });
  };

  const getPeripheralStatus = (peripheral: Peripheral) => {
    switch (peripheral.status) {
      case 'detected':
        return { text: 'Detected', color: 'text-blue-600' };
      case 'updating':
        return { text: 'Configuring...', color: 'text-yellow-600' };
      case 'ready':
        return { text: 'Ready', color: 'text-green-600' };
      default:
        return { text: 'Unknown', color: 'text-gray-600' };
    }
  };

  const allReady = detectedPeripherals.length > 0 && detectedPeripherals.every(p => p.status === 'ready');

  return (
    <div className="h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50 flex overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-3xl w-full">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-2xl mb-4">
              <Monitor className="w-8 h-8 text-primary-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Setting up your devices
            </h1>
            <p className="text-lg text-gray-600">
              {isScanning
                ? 'Detecting connected peripherals...'
                : 'We found some devices to configure'}
            </p>
          </motion.div>

          {/* Scanning Animation */}
          {isScanning && (
            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex gap-2">
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
              </div>
            </motion.div>
          )}

          {/* Peripheral List */}
          {!isScanning && (
            <motion.div
              className="space-y-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {detectedPeripherals.map((peripheral, index) => {
                const status = getPeripheralStatus(peripheral);
                const typeInfo = peripheralTypes.find(t => t.type === peripheral.type);

                return (
                  <motion.div
                    key={peripheral.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card variant="elevated" padding="md">
                      <div className="flex items-center gap-4">
                        {/* Icon */}
                        <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600">
                          {typeInfo?.icon}
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{peripheral.name}</h3>
                          <p className="text-sm text-gray-600">{typeInfo?.description}</p>
                        </div>

                        {/* Status */}
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-medium ${status.color}`}>
                            {status.text}
                          </span>
                          {peripheral.status === 'ready' && (
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                          )}
                          {peripheral.status === 'updating' && (
                            <motion.div
                              className="w-5 h-5 border-2 border-yellow-600 border-t-transparent rounded-full"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            />
                          )}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {/* Continue Button */}
          {allReady && (
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Button size="lg" onClick={handleContinue} rightIcon={<ArrowRight className="w-5 h-5" />}>
                Continue to Installation
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PeripheralSetupScreen;
