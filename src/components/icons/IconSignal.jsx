export const IconSignal = ({ className = "w-5 h-5", strength = 3, ...props }) => {
  const bars = [1, 2, 3, 4];
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" {...props}>
      {bars.map((bar, i) => (
        <rect
          key={bar}
          x={2 + i * 5}
          y={20 - bar * 3}
          width="3"
          height={bar * 3}
          fill={i < strength ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth={1}
        />
      ))}
    </svg>
  );
};







