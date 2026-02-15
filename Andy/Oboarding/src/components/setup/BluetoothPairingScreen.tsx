import React, { useState, useEffect } from 'react';
import { Bluetooth, BluetoothSearching, Headphones, Keyboard, Mouse, Speaker, CheckCircle2, Loader2, ChevronRight, RefreshCw } from 'lucide-react';
import Button from '../shared/Button';
import Card from '../shared/Card';
import { useSetup } from '../../contexts/SetupContext';

interface BluetoothDevice {
  id: string;
  name: string;
  type: 'headphones' | 'keyboard' | 'mouse' | 'speaker';
  status: 'available' | 'pairing' | 'entering-code' | 'connected';
  pairingCode?: string;
  batteryLevel?: number;
}

const BluetoothPairingScreen: React.FC = () => {
  const { dispatch } = useSetup();
  const [bluetoothEnabled, setBluetoothEnabled] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState<BluetoothDevice[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [enteredCode, setEnteredCode] = useState('');

  useEffect(() => {
    // Auto-enable Bluetooth
    setTimeout(() => {
      setBluetoothEnabled(true);
      startScanning();
    }, 1000);
  }, []);

  const startScanning = () => {
    setIsScanning(true);
    // Simulate device discovery
    setTimeout(() => {
      setDevices([
        { id: 'bt-1', name: 'Sony WH-1000XM5', type: 'headphones', status: 'available', batteryLevel: 85 },
        { id: 'bt-2', name: 'Magic Keyboard', type: 'keyboard', status: 'available' },
        { id: 'bt-3', name: 'MX Master 3', type: 'mouse', status: 'available', batteryLevel: 65 },
      ]);
      setIsScanning(false);
    }, 2000);
  };

  const handlePairDevice = (deviceId: string) => {
    setSelectedDevice(deviceId);
    setDevices(prev =>
      prev.map(d => d.id === deviceId ? { ...d, status: 'pairing' } : d)
    );

    // Simulate pairing process
    setTimeout(() => {
      const device = devices.find(d => d.id === deviceId);

      // Some devices need pairing code
      if (device?.type === 'keyboard') {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        setDevices(prev =>
          prev.map(d => d.id === deviceId ? { ...d, status: 'entering-code', pairingCode: code } : d)
        );
      } else {
        // Auto-pair
        setDevices(prev =>
          prev.map(d => d.id === deviceId ? { ...d, status: 'connected' } : d)
        );
        setSelectedDevice(null);
      }
    }, 1500);
  };

  const handleSubmitCode = () => {
    const device = devices.find(d => d.id === selectedDevice);
    if (device && enteredCode === device.pairingCode) {
      setDevices(prev =>
        prev.map(d => d.id === selectedDevice ? { ...d, status: 'connected' } : d)
      );
      setSelectedDevice(null);
      setEnteredCode('');
    }
  };

  const handleContinue = () => {
    dispatch({ type: 'SET_PHASE', payload: 'installation' });
  };

  const handleSkip = () => {
    dispatch({ type: 'SET_PHASE', payload: 'installation' });
  };

  const getDeviceIcon = (type: BluetoothDevice['type']) => {
    switch (type) {
      case 'headphones':
        return <Headphones className="w-6 h-6" />;
      case 'keyboard':
        return <Keyboard className="w-6 h-6" />;
      case 'mouse':
        return <Mouse className="w-6 h-6" />;
      case 'speaker':
        return <Speaker className="w-6 h-6" />;
    }
  };

  const connectedDevices = devices.filter(d => d.status === 'connected');
  const pairingDevice = devices.find(d => d.id === selectedDevice);

  return (
    <div className="h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50 flex overflow-hidden">
      <div className="flex-1 flex flex-col p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-2xl mb-4">
              <Bluetooth className="w-8 h-8 text-primary-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Connect Bluetooth Devices
            </h1>
            <p className="text-lg text-gray-600">
              {!bluetoothEnabled
                ? 'Enabling Bluetooth...'
                : 'Put your devices in pairing mode to connect'}
            </p>
          </div>

          {/* Bluetooth Status */}
          {bluetoothEnabled && (
            <Card variant="elevated" padding="md" className="mb-6 bg-blue-50 border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Bluetooth className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Bluetooth is On</h3>
                    <p className="text-sm text-gray-600">
                      {isScanning ? 'Scanning for devices...' : `${devices.length} device${devices.length !== 1 ? 's' : ''} found`}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={startScanning}
                  disabled={isScanning}
                  leftIcon={<RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />}
                >
                  Scan
                </Button>
              </div>
            </Card>
          )}

          {/* Pairing Code Input */}
          {pairingDevice?.status === 'entering-code' && (
            <Card variant="elevated" padding="lg" className="mb-6 border-2 border-primary-600">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-2xl mb-4">
                  {getDeviceIcon(pairingDevice.type)}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{pairingDevice.name}</h3>
                <p className="text-gray-600 mb-4">
                  Type this code on your {pairingDevice.type} and press Enter:
                </p>
                <div className="inline-block px-8 py-4 bg-gray-900 rounded-xl mb-6">
                  <span className="text-4xl font-mono font-bold text-white tracking-wider">
                    {pairingDevice.pairingCode}
                  </span>
                </div>
                <div className="max-w-xs mx-auto">
                  <input
                    type="text"
                    value={enteredCode}
                    onChange={(e) => setEnteredCode(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSubmitCode()}
                    placeholder="Enter code here"
                    className="w-full px-4 py-3 text-center text-lg font-mono border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    autoFocus
                  />
                  <Button
                    className="w-full mt-3"
                    onClick={handleSubmitCode}
                    disabled={enteredCode !== pairingDevice.pairingCode}
                  >
                    Confirm Pairing
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Available Devices */}
          {!pairingDevice && devices.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Available Devices
              </h2>
              <div className="space-y-3">
                {devices.filter(d => d.status !== 'connected').map((device) => (
                  <Card key={device.id} variant="outlined" padding="md" className="hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600">
                          {device.status === 'pairing' ? (
                            <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
                          ) : (
                            getDeviceIcon(device.type)
                          )}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{device.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-gray-600 capitalize">{device.type}</span>
                            {device.batteryLevel && (
                              <>
                                <span className="text-gray-400">•</span>
                                <span className="text-sm text-gray-600">{device.batteryLevel}% battery</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant={device.status === 'pairing' ? 'ghost' : 'secondary'}
                        onClick={() => handlePairDevice(device.id)}
                        disabled={device.status === 'pairing'}
                      >
                        {device.status === 'pairing' ? 'Pairing...' : 'Pair'}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Connected Devices */}
          {connectedDevices.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Connected Devices
              </h2>
              <div className="space-y-3">
                {connectedDevices.map((device) => (
                  <Card key={device.id} variant="outlined" padding="md" className="border-green-200 bg-green-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                          {getDeviceIcon(device.type)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{device.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-gray-600 capitalize">{device.type}</span>
                            {device.batteryLevel && (
                              <>
                                <span className="text-gray-400">•</span>
                                <span className="text-sm text-gray-600">{device.batteryLevel}% battery</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Scanning State */}
          {isScanning && devices.length === 0 && (
            <div className="text-center py-12">
              <BluetoothSearching className="w-16 h-16 text-primary-600 mx-auto mb-4 animate-pulse" />
              <p className="text-gray-600">
                Make sure your devices are in pairing mode and close to your computer
              </p>
            </div>
          )}

          {/* No Devices */}
          {!isScanning && devices.length === 0 && bluetoothEnabled && (
            <Card variant="outlined" padding="lg" className="text-center mb-6">
              <Bluetooth className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">No Devices Found</h3>
              <p className="text-sm text-gray-600 mb-4">
                Make sure your Bluetooth devices are turned on and in pairing mode
              </p>
              <Button variant="secondary" onClick={startScanning} leftIcon={<RefreshCw className="w-4 h-4" />}>
                Scan Again
              </Button>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={handleSkip}>
              Skip for now
            </Button>
            <Button
              size="lg"
              onClick={handleContinue}
              rightIcon={<ChevronRight className="w-5 h-5" />}
              disabled={connectedDevices.length === 0}
            >
              {connectedDevices.length > 0 ? 'Continue Setup' : 'Connect at least one device'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BluetoothPairingScreen;
