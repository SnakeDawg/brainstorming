import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { CircularProgress } from '../common/ProgressBar';
import { Zap, TrendingUp, Info, ChevronRight, HelpCircle } from 'lucide-react';
import Modal from '../common/Modal';
import Tooltip from '../common/Tooltip';
import mockSystemData from '../../data/mockSystemData.json';

const PCHealthCard = () => {
  const navigate = useNavigate();
  const [showOptimizeModal, setShowOptimizeModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const { pcHealth } = mockSystemData;

  const handleOptimize = () => {
    setOptimizing(true);
    setTimeout(() => {
      setOptimizing(false);
      setShowOptimizeModal(false);
    }, 3000);
  };

  return (
    <>
      <Card>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-6">
            <CircularProgress value={pcHealth.score} max={pcHealth.maxScore} size={140} />

            <div>
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                  PC Health: {pcHealth.status}
                </h2>
                {pcHealth.improved && (
                  <Badge variant="success" icon={TrendingUp}>
                    Improved
                  </Badge>
                )}
              </div>

              <div className="mt-4">
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Top issues affecting your device:</p>
                <ul className="space-y-1">
                  {pcHealth.issues.map((issue, index) => (
                    <li key={index} className="text-sm text-neutral-700 dark:text-neutral-300">
                      • {issue}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 flex gap-3">
                <Button
                  variant="primary"
                  icon={Zap}
                  onClick={() => setShowOptimizeModal(true)}
                >
                  Optimize My PC
                </Button>
                <Button
                  variant="ghost"
                  icon={Info}
                  onClick={() => setShowDetailsModal(true)}
                >
                  View Details
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Modal
        isOpen={showOptimizeModal}
        onClose={() => !optimizing && setShowOptimizeModal(false)}
        title="Optimize Your PC"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setShowOptimizeModal(false)}
              disabled={optimizing}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleOptimize}
              loading={optimizing}
            >
              {optimizing ? 'Optimizing...' : 'Start Optimization'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-neutral-700 dark:text-neutral-300">
            The optimization process will:
          </p>
          <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
            <li className="flex items-start">
              <span className="text-primary-600 mr-2">✓</span>
              Clean temporary files and system cache
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 mr-2">✓</span>
              Disable unnecessary startup programs
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 mr-2">✓</span>
              Optimize system settings for better performance
            </li>
            <li className="flex items-start">
              <span className="text-primary-600 mr-2">✓</span>
              Update system drivers
            </li>
          </ul>
          {optimizing && (
            <div className="mt-4 p-4 bg-primary-50 dark:bg-primary-900/30 rounded-lg">
              <p className="text-sm text-primary-700 dark:text-primary-300 font-medium">
                Optimization in progress... This may take a few minutes.
              </p>
            </div>
          )}
        </div>
      </Modal>

      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="PC Health Details"
        size="large"
      >
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-neutral-900 dark:text-white mb-3">Health Score Breakdown</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-neutral-900 dark:text-white">Performance</p>
                    <Tooltip content="Score is reduced by 2 points due to moderate CPU usage during background processes.">
                      <HelpCircle className="w-4 h-4 text-neutral-400 cursor-help" />
                    </Tooltip>
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">CPU, Memory, and Disk usage</p>
                </div>
                <span className="text-lg font-bold text-success-600">28/30</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-neutral-900 dark:text-white">Storage Health</p>
                    <Tooltip content="Storage is 65% full (650GB/1TB). Score reduced by 7 points. Free up space by removing junk files (12.5GB), temporary files (8.3GB), and duplicates (4.2GB).">
                      <HelpCircle className="w-4 h-4 text-neutral-400 cursor-help" />
                    </Tooltip>
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">Available space and optimization</p>
                </div>
                <span className="text-lg font-bold text-warning-600">18/25</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-neutral-900 dark:text-white">Security</p>
                    <Tooltip content="3 critical updates pending (Security Update KB5034441, NVIDIA Graphics Driver, Intel Wi-Fi Driver). Score reduced by 4 points.">
                      <HelpCircle className="w-4 h-4 text-neutral-400 cursor-help" />
                    </Tooltip>
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">Updates and threat protection</p>
                </div>
                <span className="text-lg font-bold text-warning-600">21/25</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-neutral-900 dark:text-white">System Stability</p>
                    <Tooltip content="Score reduced by 1 point due to minor application crashes in the last 7 days.">
                      <HelpCircle className="w-4 h-4 text-neutral-400 cursor-help" />
                    </Tooltip>
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">Uptime and error logs</p>
                </div>
                <span className="text-lg font-bold text-success-600">19/20</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-neutral-900 dark:text-white mb-3">Detailed Issues</h3>
            <div className="space-y-2 text-sm">
              <div className="p-3 border-l-4 border-warning-500 bg-warning-50 dark:bg-warning-900/30 rounded">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="font-medium text-neutral-900 dark:text-white mb-1">3 Windows updates pending</p>
                    <p className="text-neutral-600 dark:text-neutral-400">Security Update KB5034441, NVIDIA Graphics Driver, Intel Wi-Fi Driver Update</p>
                  </div>
                  <Button
                    size="small"
                    variant="secondary"
                    onClick={() => {
                      setShowDetailsModal(false);
                      navigate('/device-updates');
                    }}
                  >
                    Update Now
                    <ChevronRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </div>
              <div className="p-3 border-l-4 border-warning-500 bg-warning-50 dark:bg-warning-900/30 rounded">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="font-medium text-neutral-900 dark:text-white mb-1">Storage 65% full</p>
                    <p className="text-neutral-600 dark:text-neutral-400">650 GB of 1 TB used. Consider cleaning up junk files (12.5 GB), temporary files (8.3 GB), and duplicates (4.2 GB).</p>
                  </div>
                  <Button
                    size="small"
                    variant="secondary"
                    onClick={() => {
                      setShowDetailsModal(false);
                      navigate('/system-optimization');
                    }}
                  >
                    Clean Up
                    <ChevronRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-neutral-900 dark:text-white">Recommendations</h3>
              <Button
                size="small"
                variant="primary"
                icon={Zap}
                onClick={() => {
                  setShowDetailsModal(false);
                  setShowOptimizeModal(true);
                }}
              >
                Fix All Autonomously
              </Button>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-start justify-between p-2 hover:bg-neutral-50 dark:hover:bg-neutral-700 rounded">
                <div className="flex items-start flex-1">
                  <span className="text-primary-600 mr-2">→</span>
                  <span className="text-neutral-700 dark:text-neutral-300">Install pending security updates to protect your system</span>
                </div>
                <Button
                  size="small"
                  variant="ghost"
                  onClick={() => {
                    setShowDetailsModal(false);
                    navigate('/device-updates');
                  }}
                >
                  Fix
                </Button>
              </div>
              <div className="flex items-start justify-between p-2 hover:bg-neutral-50 dark:hover:bg-neutral-700 rounded">
                <div className="flex items-start flex-1">
                  <span className="text-primary-600 mr-2">→</span>
                  <span className="text-neutral-700 dark:text-neutral-300">Run disk cleanup to free up 25 GB of storage space</span>
                </div>
                <Button
                  size="small"
                  variant="ghost"
                  onClick={() => {
                    setShowDetailsModal(false);
                    navigate('/system-optimization');
                  }}
                >
                  Fix
                </Button>
              </div>
              <div className="flex items-start justify-between p-2 hover:bg-neutral-50 dark:hover:bg-neutral-700 rounded">
                <div className="flex items-start flex-1">
                  <span className="text-primary-600 mr-2">→</span>
                  <span className="text-neutral-700 dark:text-neutral-300">Disable 3 high-impact startup programs to improve boot time</span>
                </div>
                <Button
                  size="small"
                  variant="ghost"
                  onClick={() => {
                    setShowDetailsModal(false);
                    navigate('/system-optimization');
                  }}
                >
                  Fix
                </Button>
              </div>
              <div className="flex items-start justify-between p-2 hover:bg-neutral-50 dark:hover:bg-neutral-700 rounded">
                <div className="flex items-start flex-1">
                  <span className="text-primary-600 mr-2">→</span>
                  <span className="text-neutral-700 dark:text-neutral-300">Enable Battery Saver mode when unplugged to extend battery life</span>
                </div>
                <Button
                  size="small"
                  variant="ghost"
                  onClick={() => {
                    setShowDetailsModal(false);
                    navigate('/system-optimization');
                  }}
                >
                  Fix
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default PCHealthCard;
