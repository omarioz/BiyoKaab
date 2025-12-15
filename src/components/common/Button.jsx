/**
 * Button component with variants and states
 */
export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  const baseClasses = 'font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-sm hover:shadow-md';
  
  const variantClasses = {
    primary: 'bg-biyokaab-blue text-white hover:bg-opacity-90 active:bg-opacity-80 disabled:opacity-50 disabled:cursor-not-allowed rounded-full',
    secondary: 'bg-biyokaab-background text-biyokaab-navy hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-full',
    danger: 'bg-accent-danger text-white hover:bg-opacity-90 active:bg-opacity-80 disabled:opacity-50 disabled:cursor-not-allowed rounded-full',
    outline: 'border-2 border-biyokaab-blue text-biyokaab-blue hover:bg-biyokaab-blue hover:text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-full',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const focusClasses = {
    primary: 'focus:ring-biyokaab-blue',
    secondary: 'focus:ring-biyokaab-gray',
    danger: 'focus:ring-accent-danger',
    outline: 'focus:ring-biyokaab-blue',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${focusClasses[variant]} ${className}`}
      aria-disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};


