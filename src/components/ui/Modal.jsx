import { useEffect, useRef } from 'react';

export default function Modal({ isOpen, onClose, title, children, size = 'md', preventClose = false }) {
  const overlayRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape' && !preventClose) onClose?.();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose, preventClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current && !preventClose) {
      onClose?.();
    }
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(10, 10, 15, 0.85)', backdropFilter: 'blur(8px)' }}
      onClick={handleOverlayClick}
    >
      <div
        className={`
          w-full ${sizeClasses[size]}
          bg-bg-surface border border-border rounded-3xl
          shadow-2xl animate-in
        `}
      >
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-xl font-bold text-text-primary">{title}</h2>
            {!preventClose && (
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-bg-surface-2 hover:bg-bg-surface-3 text-text-secondary hover:text-text-primary transition-all flex items-center justify-center text-lg"
              >
                ×
              </button>
            )}
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
