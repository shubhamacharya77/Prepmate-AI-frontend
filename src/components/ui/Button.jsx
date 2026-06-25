import { forwardRef } from 'react';

const variantClasses = {
  primary: 'bg-gradient-to-r from-primary to-accent text-white hover:opacity-90 glow-primary',
  secondary: 'bg-bg-surface-2 text-text-primary border border-border hover:border-primary hover:bg-bg-surface-3',
  ghost: 'text-text-secondary hover:text-text-primary hover:bg-bg-surface-2',
  danger: 'bg-danger/10 text-danger border border-danger/30 hover:bg-danger/20',
  outline: 'border border-primary text-primary hover:bg-primary/10',
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-5 py-2.5 text-sm rounded-xl',
  lg: 'px-7 py-3.5 text-base rounded-xl',
  xl: 'px-9 py-4 text-lg rounded-2xl font-semibold',
};

const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    disabled = false,
    loading = false,
    icon,
    ...props
  },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2
        font-medium transition-all duration-200
        btn-press cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-none focus:ring-2 focus:ring-primary/40
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <>
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {icon && <span className="flex-shrink-0">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
});

export default Button;
