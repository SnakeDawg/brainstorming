import React from 'react';
import { motion } from 'framer-motion';
import { Check, Download, HardDrive, Clock } from 'lucide-react';
import { App } from '../../types/apps';

interface AppCardProps {
  app: App;
  isSelected: boolean;
  onToggle: () => void;
}

const AppCard: React.FC<AppCardProps> = ({ app, isSelected, onToggle }) => {
  return (
    <motion.div
      className={`relative cursor-pointer rounded-xl border-2 transition-all ${
        isSelected
          ? 'border-primary-500 bg-primary-50 shadow-md'
          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
      }`}
      onClick={onToggle}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      layout
    >
      {/* Selection Checkbox */}
      <div
        className={`absolute top-3 right-3 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
          isSelected
            ? 'bg-primary-600 border-primary-600'
            : 'bg-white border-gray-300'
        }`}
      >
        {isSelected && <Check className="w-4 h-4 text-white" />}
      </div>

      <div className="p-4">
        {/* App Icon */}
        <div className="w-12 h-12 mb-3 rounded-lg bg-gradient-to-br from-primary-100 to-purple-100 flex items-center justify-center">
          <Download className="w-6 h-6 text-primary-600" />
        </div>

        {/* App Info */}
        <h3 className="font-semibold text-gray-900 mb-1">{app.name}</h3>
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">{app.description}</p>

        {/* Category Badge */}
        <div className="inline-block px-2 py-1 bg-gray-100 rounded text-xs text-gray-700 mb-3">
          {app.category}
        </div>

        {/* App Metadata */}
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <HardDrive className="w-3 h-3" />
            <span>{app.size}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{app.installTime}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AppCard;
