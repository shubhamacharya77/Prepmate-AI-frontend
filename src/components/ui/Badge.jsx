const variantClasses = {
  primary: 'bg-primary/15 text-primary border border-primary/30',
  accent: 'bg-accent/15 text-accent border border-accent/30',
  success: 'bg-success/15 text-success border border-success/30',
  warning: 'bg-warning/15 text-warning border border-warning/30',
  danger: 'bg-danger/15 text-danger border border-danger/30',
  muted: 'bg-bg-surface-3 text-text-secondary border border-border',
};

export default function Badge({ children, variant = 'primary', className = '' }) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1
        text-xs font-semibold rounded-full
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
