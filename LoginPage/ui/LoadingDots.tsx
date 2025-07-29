// components/ui/LoadingDots.tsx
import React from 'react';

interface LoadingDotsProps {
  className?: string;
  'aria-label'?: string;
}

export default function LoadingDots({ 
  className = "flex space-x-1",
  'aria-label': ariaLabel = "กำลังโหลด"
}: LoadingDotsProps) {
  return (
    <div className={className} aria-label={ariaLabel}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"
          style={{
            animationDelay: `${i * 0.15}s`,
            animationDuration: '1.2s'
          }}
        />
      ))}
    </div>
  );
}