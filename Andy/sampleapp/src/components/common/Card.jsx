const Card = ({
  children,
  className = '',
  hover = false,
  padding = 'normal',
  variant = 'default',
  onClick
}) => {
  const baseStyles = 'bg-white dark:bg-neutral-800 rounded-lg shadow-soft';
  const hoverStyles = hover ? 'card-hover cursor-pointer' : '';

  const paddings = {
    none: '',
    small: 'p-4',
    normal: 'p-6',
    large: 'p-8',
  };

  const variants = {
    default: '',
    error: 'card-error',
    warning: 'card-warning',
    success: 'card-success',
    info: 'card-info',
  };

  return (
    <div
      className={`${baseStyles} ${paddings[padding]} ${variants[variant]} ${hoverStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
