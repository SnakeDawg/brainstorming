import Card from '../common/Card';
import ProgressBar from '../common/ProgressBar';
import { Battery, HardDrive, Cpu } from 'lucide-react';
import mockSystemData from '../../data/mockSystemData.json';

const DeviceEssentials = () => {
  const { deviceEssentials } = mockSystemData;

  const getVariant = (percentage) => {
    if (percentage >= 80) return 'error';
    if (percentage >= 60) return 'warning';
    return 'success';
  };

  return (
    <Card>
      <h3 className="font-semibold text-neutral-900 dark:text-white mb-4">Device Essentials</h3>

      <div className="space-y-4">
        {/* Battery */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Battery className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Battery</span>
            </div>
            <span className="text-sm font-semibold text-neutral-900 dark:text-white">
              {deviceEssentials.battery.percentage}%
            </span>
          </div>
          <ProgressBar
            value={deviceEssentials.battery.percentage}
            variant="success"
          />
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            ~{deviceEssentials.battery.timeRemaining} remaining
          </p>
        </div>

        {/* Storage */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Storage</span>
            </div>
            <span className="text-sm font-semibold text-neutral-900 dark:text-white">
              {deviceEssentials.storage.percentage}%
            </span>
          </div>
          <ProgressBar
            value={deviceEssentials.storage.percentage}
            variant={getVariant(deviceEssentials.storage.percentage)}
          />
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            {deviceEssentials.storage.used} of {deviceEssentials.storage.total} used
          </p>
        </div>

        {/* Memory */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Memory</span>
            </div>
            <span className="text-sm font-semibold text-neutral-900 dark:text-white">
              {deviceEssentials.memory.status}
            </span>
          </div>
          <ProgressBar
            value={deviceEssentials.memory.percentage}
            variant="success"
          />
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            {deviceEssentials.memory.used} of {deviceEssentials.memory.total}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default DeviceEssentials;
