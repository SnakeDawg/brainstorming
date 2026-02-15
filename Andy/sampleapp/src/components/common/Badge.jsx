const Badge = ({ children, variant = 'default', size = 'medium', icon: Icon }) => {
  const baseStyles = 'inline-flex items-center font-medium rounded-full';

  const variants = {
    default: 'bg-neutral-100 text-neutral-700',
    primary: 'bg-primary-100 text-primary-700',
    success: 'bg-success-100 text-success-700',
    warning: 'bg-warning-100 text-warning-700',
    error: 'bg-error-100 text-error-700',
    critical: 'bg-error-600 text-white',
    recommended: 'bg-accent-600 text-white',
    optional: 'bg-neutral-400 text-white',
  };

  const sizes = {
    small: 'px-2 py-0.5 text-xs',
    medium: 'px-2.5 py-1 text-xs',
    large: 'px-3 py-1.5 text-sm',
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${sizes[size]}`}>
      {Icon && <Icon className="w-3 h-3 mr-1" />}
      {children}
    </span>
  );
};

export default Badge;
