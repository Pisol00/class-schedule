import { ReactNode } from 'react';

export type BadgeVariant = 'success' | 'warning' | 'info' | 'default' | 'danger';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: 'small' | 'medium';
  className?: string;
}

export default function Badge({ 
  children, 
  variant = 'default', 
  size = 'medium',
  className = '' 
}: BadgeProps) {
  const variants = {
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    info: 'bg-blue-100 text-blue-700',
    default: 'bg-gray-100 text-gray-700',
    danger: 'bg-red-100 text-red-700'
  };

  const sizes = {
    small: 'px-2 py-0.5 text-xs',
    medium: 'px-3 py-1 text-xs'
  };

  return (
    <span className={`
      inline-flex items-center rounded-full font-medium
      ${variants[variant]}
      ${sizes[size]}
      ${className}
    `}>
      {children}
    </span>
  );
}