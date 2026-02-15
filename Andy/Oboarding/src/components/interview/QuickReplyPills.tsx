import React from 'react';
import { motion } from 'framer-motion';

interface QuickReplyPillsProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
  disabled?: boolean;
}

const QuickReplyPills: React.FC<QuickReplyPillsProps> = ({ suggestions, onSelect, disabled }) => {
  if (suggestions.length === 0) return null;

  return (
    <motion.div
      className="flex flex-wrap gap-2 mb-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      {suggestions.map((suggestion, index) => (
        <motion.button
          key={index}
          onClick={() => onSelect(suggestion)}
          disabled={disabled}
          className="px-4 py-2 bg-white border-2 border-primary-200 text-primary-700 rounded-full text-sm font-medium hover:bg-primary-50 hover:border-primary-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 * index }}
          whileHover={{ scale: disabled ? 1 : 1.05 }}
          whileTap={{ scale: disabled ? 1 : 0.95 }}
        >
          {suggestion}
        </motion.button>
      ))}
    </motion.div>
  );
};

export default QuickReplyPills;
