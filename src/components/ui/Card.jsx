export default function Card({ children, className = '', hover = false, glow = false, animated = false, ...props }) {
  return (
    <div
      className={`
        bg-bg-surface border border-border rounded-2xl
        ${hover ? 'card-hover cursor-pointer' : ''}
        ${glow ? 'glow-primary' : ''}
        ${animated ? 'animate-in' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
