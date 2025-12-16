/**
 * Toggle switch component
 */
export const Toggle = ({
  checked,
  onChange,
  label,
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <label className={`flex items-center gap-3 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
      <div className="relative inline-flex items-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only"
          {...props}
        />
        <div
          className={`
            w-11 h-6 rounded-full transition-colors duration-200 ease-in-out
            ${checked ? 'bg-primary-blue' : 'bg-neutral-300'}
            ${disabled ? 'opacity-50' : ''}
          `}
        >
          <div
            className={`
              absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full
              transition-transform duration-200 ease-in-out
              ${checked ? 'transform translate-x-5' : ''}
            `}
          />
        </div>
      </div>
      {label && (
        <span className="text-neutral-700 font-medium">{label}</span>
      )}
    </label>
  );
};







