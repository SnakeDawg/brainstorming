import React from 'react';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';
import { useSetup } from '../../contexts/SetupContext';
import { SetupPhase } from '../../types/setup';

interface SetupStep {
  id: string;
  label: string;
  phases: SetupPhase[];
}

const SetupProgressBar: React.FC = () => {
  const { state } = useSetup();

  const steps: SetupStep[] = [
    {
      id: 'welcome',
      label: 'Welcome',
      phases: ['welcome', 'privacy', 'name-input'],
    },
    {
      id: 'interview',
      label: 'User Interview',
      phases: ['interview', 'analyzing'],
    },
    {
      id: 'persona',
      label: 'Profile Detection',
      phases: ['persona-detection', 'persona-confirmation'],
    },
    {
      id: 'apps',
      label: 'App Selection',
      phases: ['app-recommendations'],
    },
    {
      id: 'setup',
      label: 'Device Setup',
      phases: ['peripheral-setup', 'device-setup'],
    },
    {
      id: 'installation',
      label: 'Installation',
      phases: ['installation'],
    },
    {
      id: 'complete',
      label: 'Complete',
      phases: ['complete'],
    },
  ];

  const getCurrentStepIndex = () => {
    return steps.findIndex(step => step.phases.includes(state.currentPhase));
  };

  const currentStepIndex = getCurrentStepIndex();

  const getStepStatus = (index: number): 'complete' | 'current' | 'pending' => {
    if (index < currentStepIndex) return 'complete';
    if (index === currentStepIndex) return 'current';
    return 'pending';
  };

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        {/* Progress Steps */}
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const status = getStepStatus(index);
            const isLast = index === steps.length - 1;

            return (
              <React.Fragment key={step.id}>
                {/* Step */}
                <div className="flex items-center gap-3">
                  {/* Icon */}
                  <div className="relative">
                    {status === 'complete' && (
                      <div
                       
                       
                        className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center"
                      >
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      </div>
                    )}
                    {status === 'current' && (
                      <div
                       
                       
                        className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center"
                      >
                        <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                      </div>
                    )}
                    {status === 'pending' && (
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <Circle className="w-5 h-5 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Label */}
                  <div className="flex flex-col">
                    <span
                      className={`text-sm font-medium ${
                        status === 'complete'
                          ? 'text-green-700'
                          : status === 'current'
                          ? 'text-blue-700'
                          : 'text-gray-400'
                      }`}
                    >
                      {step.label}
                    </span>
                    {status === 'current' && (
                      <span className="text-xs text-gray-500">In progress</span>
                    )}
                  </div>
                </div>

                {/* Connector Line */}
                {!isLast && (
                  <div className="flex-1 mx-4">
                    <div className="h-0.5 bg-gray-200 relative overflow-hidden">
                      {status === 'complete' && (
                        <div className="absolute inset-0 bg-green-500" />
                      )}
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Overall Progress Percentage */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-600">Overall Setup Progress</span>
            <span className="text-xs font-bold text-gray-900">
              {Math.round((currentStepIndex / (steps.length - 1)) * 100)}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300"
              style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupProgressBar;
