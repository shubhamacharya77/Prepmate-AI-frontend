export default function Spinner({ size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
    xl: 'w-16 h-16 border-4',
  };

  return (
    <div
      className={`
        ${sizeClasses[size]}
        border-bg-surface-3 border-t-primary
        rounded-full animate-spin
        ${className}
      `}
      style={{ borderTopColor: '#6C63FF' }}
    />
  );
}
