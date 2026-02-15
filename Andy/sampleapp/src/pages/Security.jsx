import { useState } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { CircularProgress } from '../components/common/ProgressBar';
import { Shield, ShieldCheck, ShieldAlert, Lock, Eye, Wifi, AlertTriangle } from 'lucide-react';

const Security = () => {
  const [scanning, setScanning] = useState(false);
  const [lastScan, setLastScan] = useState('06:12 PM');
  const [firewallEnabled, setFirewallEnabled] = useState(true);
  const [realTimeProtection, setRealTimeProtection] = useState(true);

  const [securityItems] = useState([
    { id: 1, name: 'Malware Scan', status: 'protected', lastCheck: '2 hours ago' },
    { id: 2, name: 'Firewall', status: 'protected', lastCheck: 'Active' },
    { id: 3, name: 'Suspicious Apps', status: 'warning', lastCheck: '1 issue found' },
    { id: 4, name: 'Unsafe Settings', status: 'warning', lastCheck: '1 setting needs attention' },
    { id: 5, name: 'Wi-Fi Security', status: 'protected', lastCheck: 'Secured' },
  ]);

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setLastScan(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
    }, 3000);
  };

  const getStatusIcon = (status) => {
    if (status === 'protected') return <ShieldCheck className="w-5 h-5 text-success-600" />;
    if (status === 'warning') return <AlertTriangle className="w-5 h-5 text-warning-600" />;
    return <ShieldAlert className="w-5 h-5 text-error-600" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Security</h1>
        <p className="text-neutral-600 dark:text-neutral-400 mt-1">Protect your PC from threats and vulnerabilities</p>
      </div>

      {/* Security Status */}
      <Card>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-6">
            <CircularProgress value={92} max={100} size={140} variant="success" />

            <div>
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Protected</h2>
                <Badge variant="success">
                  All Clear
                </Badge>
              </div>

              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Last scan: {lastScan}</p>

              <div className="mt-6 flex gap-3">
                <Button
                  variant="primary"
                  icon={Shield}
                  onClick={handleScan}
                  loading={scanning}
                >
                  {scanning ? 'Scanning...' : 'Quick Scan'}
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleScan}
                  loading={scanning}
                >
                  Full Scan
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Security Items */}
      <Card>
        <h3 className="font-semibold text-neutral-900 dark:text-white mb-4">Security Features</h3>
        <div className="space-y-3">
          {securityItems.map(item => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-700 rounded-lg"
            >
              <div className="flex items-center gap-3">
                {getStatusIcon(item.status)}
                <div>
                  <p className="font-medium text-neutral-900 dark:text-white">{item.name}</p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">{item.lastCheck}</p>
                </div>
              </div>
              {item.status === 'warning' && (
                <Button size="small" variant="secondary">Fix</Button>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary-600" />
              <h3 className="font-semibold text-neutral-900 dark:text-white">Firewall</h3>
            </div>
            <button
              onClick={() => setFirewallEnabled(!firewallEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                firewallEnabled ? 'bg-primary-600' : 'bg-neutral-300 dark:bg-neutral-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  firewallEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {firewallEnabled
              ? 'Your firewall is protecting your PC from unauthorized network access.'
              : 'Turn on firewall to protect your PC from unauthorized access.'}
          </p>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary-600" />
              <h3 className="font-semibold text-neutral-900 dark:text-white">Real-time Protection</h3>
            </div>
            <button
              onClick={() => setRealTimeProtection(!realTimeProtection)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                realTimeProtection ? 'bg-primary-600' : 'bg-neutral-300 dark:bg-neutral-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  realTimeProtection ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {realTimeProtection
              ? 'Continuously monitoring for threats and malware.'
              : 'Turn on to automatically detect and block threats.'}
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Security;
