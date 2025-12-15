/**
 * Card component - reusable container with shadow and rounded corners
 */
export const Card = ({
  children,
  className = '',
  hover = false,
  padding = 'md',
  ...props
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  return (
    <div
      className={`
        bg-white rounded-2xl shadow-sm border border-gray-100
        ${paddingClasses[padding]}
        ${hover ? 'hover:shadow-lg transition-all' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};


