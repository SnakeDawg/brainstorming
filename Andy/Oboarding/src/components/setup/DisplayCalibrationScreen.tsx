import React, { useState } from 'react';
import { Monitor, ZoomIn, ZoomOut, Check, ChevronRight } from 'lucide-react';
import Button from '../shared/Button';
import Card from '../shared/Card';
import { useSetup } from '../../contexts/SetupContext';

const sampleTexts = [
  {
    scale: 100,
    text: 'The quick brown fox jumps over the lazy dog',
    size: 'text-sm',
  },
  {
    scale: 125,
    text: 'The quick brown fox jumps over the lazy dog',
    size: 'text-base',
  },
  {
    scale: 150,
    text: 'The quick brown fox jumps over the lazy dog',
    size: 'text-lg',
  },
  {
    scale: 175,
    text: 'The quick brown fox jumps over the lazy dog',
    size: 'text-xl',
  },
];

const DisplayCalibrationScreen: React.FC = () => {
  const { dispatch } = useSetup();
  const [selectedScale, setSelectedScale] = useState(125);
  const [currentResolution] = useState({ width: 3840, height: 2160, refreshRate: 60 });
  const [optimalResolution] = useState({ width: 3840, height: 2160, refreshRate: 60 });

  const handleContinue = () => {
    // Save display settings
    dispatch({
      type: 'ADD_TASK',
      payload: {
        id: 'display-settings',
        name: 'Apply display settings',
        type: 'configure',
        status: 'complete',
        progress: 100,
        currentAction: 'Complete',
      },
    });

    // Check if there are Bluetooth devices to pair
    dispatch({ type: 'SET_PHASE', payload: 'bluetooth-pairing' });
  };

  const handleApplyScale = (scale: number) => {
    setSelectedScale(scale);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50 flex overflow-hidden">
      <div className="flex-1 flex flex-col p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-2xl mb-4">
              <Monitor className="w-8 h-8 text-primary-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Optimize Your Display
            </h1>
            <p className="text-lg text-gray-600">
              Let's make sure everything looks perfect on your screen
            </p>
          </div>

          {/* Resolution Info */}
          <Card variant="elevated" padding="lg" className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Current Resolution</h3>
                <p className="text-2xl font-bold text-primary-600">
                  {currentResolution.width} × {currentResolution.height}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {currentResolution.refreshRate} Hz refresh rate
                </p>
              </div>
              {currentResolution.width === optimalResolution.width &&
                currentResolution.height === optimalResolution.height && (
                  <div className="flex items-center gap-2 text-green-600">
                    <Check className="w-6 h-6" />
                    <span className="font-medium">Optimal resolution</span>
                  </div>
                )}
            </div>
          </Card>

          {/* Scale Selection */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Choose Your Display Scale
            </h2>
            <p className="text-gray-600 mb-4">
              Select the scale that makes text most comfortable to read. You can change this later in Settings.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sampleTexts.map((sample) => (
                <button
                  key={sample.scale}
                  onClick={() => handleApplyScale(sample.scale)}
                  className={`relative p-6 rounded-2xl border-2 transition-all text-left ${
                    selectedScale === sample.scale
                      ? 'border-primary-600 bg-primary-50 shadow-lg'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  {/* Scale Label */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      {sample.scale < 125 ? (
                        <ZoomOut className="w-5 h-5 text-gray-600" />
                      ) : sample.scale > 125 ? (
                        <ZoomIn className="w-5 h-5 text-gray-600" />
                      ) : (
                        <Monitor className="w-5 h-5 text-gray-600" />
                      )}
                      <span className="font-semibold text-gray-900">{sample.scale}% Scale</span>
                    </div>
                    {selectedScale === sample.scale && (
                      <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Sample Text */}
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className={`${sample.size} text-gray-800 leading-relaxed`}>
                      {sample.text}
                    </p>
                    <div className="mt-2 flex gap-2">
                      <span className={`${sample.size} font-bold text-gray-900`}>Aa</span>
                      <span className={`${sample.size} text-gray-600`}>123</span>
                    </div>
                  </div>

                  {/* Recommendation */}
                  {sample.scale === 125 && (
                    <div className="mt-3 text-xs text-primary-600 font-medium">
                      Recommended for this display
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Visual Test Card */}
          <Card variant="elevated" padding="lg" className="mb-6 bg-blue-50 border-blue-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Monitor className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">Reading Comfort Test</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Stand at a comfortable distance from your monitor. The text should be easy to read without squinting or leaning forward.
                </p>
                <div className="bg-white p-4 rounded-lg border border-blue-200">
                  <p className={`${sampleTexts.find(s => s.scale === selectedScale)?.size} text-gray-800 leading-relaxed`}>
                    This is how text will appear with your selected {selectedScale}% scale setting. Can you read this comfortably from your normal sitting position?
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Continue Button */}
          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={handleContinue}
              rightIcon={<ChevronRight className="w-5 h-5" />}
            >
              Continue to Bluetooth Setup
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisplayCalibrationScreen;
