import Card from '../common/Card';
import { HardDrive, ShieldCheck, Download, Zap, Activity } from 'lucide-react';
import mockSystemData from '../../data/mockSystemData.json';

const RecentActivity = () => {
  const { recentActivity } = mockSystemData;

  const getIcon = (iconName) => {
    const icons = {
      'hard-drive': HardDrive,
      'shield-check': ShieldCheck,
      'download': Download,
      'zap': Zap,
    };
    const Icon = icons[iconName] || Activity;
    return <Icon className="w-5 h-5" />;
  };

  return (
    <Card>
      <h3 className="font-semibold text-neutral-900 dark:text-white mb-4">What Changed Recently</h3>

      <div className="space-y-3">
        {recentActivity.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-3 p-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 flex-shrink-0">
              {getIcon(activity.icon)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-900 dark:text-white">{activity.title}</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{activity.time}</p>
              {activity.benefit && (
                <p className="text-xs text-success-600 mt-1 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 rounded-full bg-success-600"></span>
                  {activity.benefit}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default RecentActivity;
