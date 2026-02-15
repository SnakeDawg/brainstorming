import React, { useEffect, useState } from 'react';
import { Monitor, Keyboard, Mouse, Headphones, Webcam, Bluetooth, Usb, CheckCircle2, Loader2, ChevronRight } from 'lucide-react';
import Button from '../shared/Button';
import Card from '../shared/Card';
import { useSetup } from '../../contexts/SetupContext';

interface DetectedDevice {
  id: string;
  name: string;
  type: 'keyboard' | 'mouse' | 'monitor' | 'webcam' | 'dock' | 'bluetooth' | 'speaker';
  vendor: string;
  firmwareVersion?: string;
  needsFirmwareUpdate: boolean;
  needsDriverUpdate: boolean;
  hasCompanionApp: boolean;
  status: 'detecting' | 'detected' | 'ready';
  progress?: number;
}

const DeviceDetectionScreen: React.FC = () => {
  const { dispatch } = useSetup();
  const [devices, setDevices] = useState<DetectedDevice[]>([]);
  const [isScanning, setIsScanning] = useState(true);
  const [currentStep, setCurrentStep] = useState<'detecting' | 'updating' | 'complete'>('detecting');

  useEffect(() => {
    // Simulate device detection
    setTimeout(() => {
      const mockDevices: DetectedDevice[] = [
        {
          id: 'monitor-1',
          name: 'Dell U2720Q',
          type: 'monitor',
          vendor: 'Dell',
          needsFirmwareUpdate: false,
          needsDriverUpdate: false,
          hasCompanionApp: true,
          status: 'detected',
        },
        {
          id: 'monitor-2',
          name: 'LG 27GN950',
          type: 'monitor',
          vendor: 'LG',
          needsFirmwareUpdate: true,
          needsDriverUpdate: false,
          hasCompanionApp: true,
          status: 'detected',
          firmwareVersion: '1.0.2',
        },
        {
          id: 'keyboard-1',
          name: 'Logitech MX Keys',
          type: 'keyboard',
          vendor: 'Logitech',
          needsFirmwareUpdate: true,
          needsDriverUpdate: false,
          hasCompanionApp: true,
          status: 'detected',
          firmwareVersion: '12.4.0',
        },
        {
          id: 'mouse-1',
          name: 'Logitech MX Master 3',
          type: 'mouse',
          vendor: 'Logitech',
          needsFirmwareUpdate: false,
          needsDriverUpdate: false,
          hasCompanionApp: true,
          status: 'detected',
        },
        {
          id: 'webcam-1',
          name: 'Logitech Brio',
          type: 'webcam',
          vendor: 'Logitech',
          needsFirmwareUpdate: false,
          needsDriverUpdate: true,
          hasCompanionApp: true,
          status: 'detected',
        },
        {
          id: 'dock-1',
          name: 'CalDigit TS4',
          type: 'dock',
          vendor: 'CalDigit',
          needsFirmwareUpdate: true,
          needsDriverUpdate: false,
          hasCompanionApp: false,
          status: 'detected',
          firmwareVersion: '86.1',
        },
      ];

      setDevices(mockDevices);
      setIsScanning(false);
      setCurrentStep('complete');

      // Queue tasks for later installation (during installation phase)
      mockDevices.forEach(device => {
        if (device.needsFirmwareUpdate) {
          dispatch({
            type: 'ADD_TASK',
            payload: {
              id: `firmware-${device.id}`,
              name: `Update ${device.name} firmware`,
              type: 'update',
              status: 'pending',
              progress: 0,
              currentAction: 'Queued for installation',
            },
          });
        }
        if (device.needsDriverUpdate) {
          dispatch({
            type: 'ADD_TASK',
            payload: {
              id: `driver-${device.id}`,
              name: `Install ${device.name} driver`,
              type: 'install',
              status: 'pending',
              progress: 0,
              currentAction: 'Queued for installation',
            },
          });
        }
        if (device.hasCompanionApp) {
          dispatch({
            type: 'ADD_TASK',
            payload: {
              id: `app-${device.id}`,
              name: `Install ${device.vendor} companion app`,
              type: 'install',
              status: 'pending',
              progress: 0,
              currentAction: 'Queued for installation',
            },
          });
        }
      });
    }, 2000);
  }, [dispatch]);

  const getDeviceIcon = (type: DetectedDevice['type']) => {
    switch (type) {
      case 'monitor':
        return <Monitor className="w-6 h-6" />;
      case 'keyboard':
        return <Keyboard className="w-6 h-6" />;
      case 'mouse':
        return <Mouse className="w-6 h-6" />;
      case 'webcam':
        return <Webcam className="w-6 h-6" />;
      case 'dock':
        return <Usb className="w-6 h-6" />;
      case 'speaker':
        return <Headphones className="w-6 h-6" />;
      case 'bluetooth':
        return <Bluetooth className="w-6 h-6" />;
    }
  };

  const getStatusDisplay = (device: DetectedDevice) => {
    switch (device.status) {
      case 'detecting':
        return { text: 'Detecting...', icon: <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />, color: 'text-blue-600' };
      case 'detected':
      case 'ready':
        return { text: 'Detected', icon: <CheckCircle2 className="w-5 h-5 text-green-600" />, color: 'text-green-600' };
    }
  };

  const handleContinue = () => {
    // Check if there are displays to configure
    const hasDisplays = devices.some(d => d.type === 'monitor');
    if (hasDisplays && devices.filter(d => d.type === 'monitor').length > 1) {
      dispatch({ type: 'SET_PHASE', payload: 'display-arrangement' });
    } else if (hasDisplays) {
      dispatch({ type: 'SET_PHASE', payload: 'display-calibration' });
    } else {
      dispatch({ type: 'SET_PHASE', payload: 'bluetooth-pairing' });
    }
  };

  const devicesNeedingUpdates = devices.filter(
    d => d.needsFirmwareUpdate || d.needsDriverUpdate
  ).length;

  return (
    <div className="h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50 flex overflow-hidden">
      <div className="flex-1 flex flex-col p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-2xl mb-4">
              <Usb className="w-8 h-8 text-primary-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isScanning ? 'Detecting Your Devices' : 'Devices Detected'}
            </h1>
            <p className="text-lg text-gray-600">
              {isScanning
                ? 'Scanning for connected peripherals...'
                : `Found ${devices.length} device${devices.length !== 1 ? 's' : ''}. Updates and drivers will be installed in the background.`}
            </p>
          </div>

          {/* Scanning State */}
          {isScanning && (
            <div className="flex justify-center py-12">
              <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
            </div>
          )}

          {/* Device List */}
          {!isScanning && (
            <div className="space-y-3 mb-8">
              {devices.map((device) => {
                const status = getStatusDisplay(device);
                return (
                  <Card key={device.id} variant="elevated" padding="md">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600">
                        {getDeviceIcon(device.type)}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">{device.name}</h3>
                          {device.firmwareVersion && (
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                              v{device.firmwareVersion}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-sm text-gray-600">{device.vendor}</p>
                          {device.needsFirmwareUpdate && (
                            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                              Update queued
                            </span>
                          )}
                          {device.needsDriverUpdate && (
                            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                              Driver queued
                            </span>
                          )}
                          {device.hasCompanionApp && (
                            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                              App queued
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {status.icon}
                        <span className={`text-sm font-medium ${status.color}`}>
                          {status.text}
                        </span>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Summary Card */}
          {currentStep === 'complete' && (
            <Card variant="elevated" padding="lg" className="mb-6 bg-blue-50 border-blue-200">
              <div className="flex items-center gap-4">
                <CheckCircle2 className="w-12 h-12 text-blue-600 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    Device detection complete
                  </h3>
                  <p className="text-sm text-gray-600">
                    {devices.length} device{devices.length !== 1 ? 's' : ''} detected. {devicesNeedingUpdates > 0 ? `${devicesNeedingUpdates} update${devicesNeedingUpdates !== 1 ? 's' : ''} queued for installation.` : 'All devices are up to date.'}
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Continue Button */}
          {currentStep === 'complete' && (
            <div className="flex justify-center">
              <Button
                size="lg"
                onClick={handleContinue}
                rightIcon={<ChevronRight className="w-5 h-5" />}
              >
                {devices.some(d => d.type === 'monitor')
                  ? 'Configure Displays'
                  : 'Continue to Bluetooth Pairing'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeviceDetectionScreen;
