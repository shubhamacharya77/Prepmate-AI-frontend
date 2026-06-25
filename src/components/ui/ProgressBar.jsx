export default function ProgressBar({ value = 0, max = 100, showLabel = false, className = '' }) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={`interview-progress ${className}`}>
      <div
        className="interview-progress-bar"
        style={{ width: `${percent}%` }}
      />
      {showLabel && (
        <span className="text-xs text-text-secondary mt-1">{Math.round(percent)}%</span>
      )}
    </div>
  );
}
