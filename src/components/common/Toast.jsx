import { useEffect } from 'react';
import { IconClose } from '../icons';

/**
 * Toast notification component
 */
export const Toast = ({ toast, onClose }) => {
  useEffect(() => {
    if (toast.autoClose !== false) {
      const timer = setTimeout(() => {
        onClose();
      }, toast.duration || 5000);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  const variantClasses = {
    success: 'bg-primary-green text-white',
    error: 'bg-accent-danger text-white',
    warning: 'bg-accent-warning text-white',
    info: 'bg-primary-blue text-white',
  };

  return (
    <div
      className={`
        flex items-center gap-3 p-4 rounded-lg shadow-lg min-w-[300px] max-w-md
        transform transition-all duration-300 ease-in-out
        ${variantClasses[toast.variant || 'info']}
      `}
      role="alert"
      aria-live="polite"
    >
      <div className="flex-1">
        {toast.title && (
          <div className="font-semibold">{toast.title}</div>
        )}
        {toast.message && (
          <div className={toast.title ? 'text-sm mt-1' : ''}>{toast.message}</div>
        )}
      </div>
      <button
        onClick={onClose}
        className="hover:opacity-80 transition-opacity"
        aria-label="Close notification"
      >
        <IconClose className="w-5 h-5" />
      </button>
    </div>
  );
};

/**
 * Toast container component
 */
export const ToastContainer = ({ toasts, onClose }) => {
  return (
    <div
      className="fixed top-4 right-4 z-50 flex flex-col gap-2"
      aria-live="assertive"
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={() => onClose(toast.id)} />
      ))}
    </div>
  );
};







