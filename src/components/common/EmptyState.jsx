/**
 * Empty state component for when there's no data
 */
export const EmptyState = ({
  icon,
  title,
  message,
  action,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      {icon && (
        <div className="mb-4 text-neutral-400">
          {icon}
        </div>
      )}
      {title && (
        <h3 className="text-lg font-semibold text-neutral-800 mb-2">{title}</h3>
      )}
      {message && (
        <p className="text-neutral-600 mb-6 max-w-md">{message}</p>
      )}
      {action && (
        <div>{action}</div>
      )}
    </div>
  );
};







