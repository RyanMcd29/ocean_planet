import { useMemo } from "react";

interface CircularProgressProps {
  progress: number;
  completedCount: number;
  totalCount: number;
  className?: string;
}

export function CircularProgress({ 
  progress, 
  completedCount, 
  totalCount, 
  className = ""
}: CircularProgressProps) {
  const size = 200;
  const strokeWidth = 16;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = useMemo(() => circumference - (progress / 100) * circumference, [progress, circumference]);

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          <defs>
            <linearGradient id="oceanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0ea5e9" />
              <stop offset="50%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="url(#oceanGradient)"
            stroke="hsl(var(--border))"
            strokeWidth={strokeWidth}
            opacity="0.3"
          />
          
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="url(#progressGradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            filter="url(#glow)"
            style={{
              transition: 'stroke-dashoffset 0.8s ease-in-out',
            }}
          />
        </svg>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-4xl font-bold bg-gradient-to-br from-sky-400 to-blue-600 bg-clip-text text-transparent">
            {Math.round(progress)}%
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            {completedCount}/{totalCount}
          </div>
          <div className="text-xs text-muted-foreground">
            lessons
          </div>
        </div>
      </div>
      
      <div className="text-center">
        <h3 className="text-lg font-semibold bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">
          Ocean Explorer
        </h3>
        <p className="text-sm text-muted-foreground">
          {completedCount === 0 
            ? "Start your journey!" 
            : completedCount === totalCount 
            ? "Journey complete! 🌊" 
            : "Keep exploring!"}
        </p>
      </div>
    </div>
  );
}
