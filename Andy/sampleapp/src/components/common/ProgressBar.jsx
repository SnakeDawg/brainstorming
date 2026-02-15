const ProgressBar = ({ value, max = 100, variant = 'primary', size = 'medium', showLabel = false }) => {
  const percentage = Math.min((value / max) * 100, 100);

  const variants = {
    primary: 'bg-primary-600',
    success: 'bg-success-600',
    warning: 'bg-warning-600',
    error: 'bg-error-600',
  };

  const sizes = {
    small: 'h-1',
    medium: 'h-2',
    large: 'h-3',
  };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between mb-1 text-sm text-neutral-600 dark:text-neutral-400">
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={`w-full bg-neutral-200 rounded-full overflow-hidden ${sizes[size]}`}>
        <div
          className={`${variants[variant]} ${sizes[size]} rounded-full transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export const CircularProgress = ({ value, max = 100, size = 120, strokeWidth = 8, variant = 'primary' }) => {
  const percentage = Math.min((value / max) * 100, 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  const variants = {
    primary: '#0076CE',
    success: '#6CC04A',
    warning: '#F5A623',
    error: '#E31C3D',
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="circular-progress">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E5E7E9"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={variants[variant]}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-neutral-900 dark:text-white">{value}</span>
        <span className="text-sm text-neutral-500 dark:text-neutral-400">/ {max}</span>
      </div>
    </div>
  );
};

export default ProgressBar;
