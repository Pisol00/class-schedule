import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  type?: 'dots' | 'spinner' | 'pulse' | 'bounce';
  color?: 'blue' | 'green' | 'purple' | 'gray' | 'white';
  className?: string;
}

export default function LoadingSpinner({ 
  size = 'medium', 
  type = 'dots',
  color = 'blue',
  className = '' 
}: LoadingSpinnerProps) {
  
  // Size configurations
  const sizeConfig = {
    small: {
      dots: 'w-1.5 h-1.5',
      spinner: 'w-4 h-4',
      container: 'space-x-1'
    },
    medium: {
      dots: 'w-2 h-2',
      spinner: 'w-6 h-6',
      container: 'space-x-1.5'
    },
    large: {
      dots: 'w-3 h-3',
      spinner: 'w-8 h-8',
      container: 'space-x-2'
    }
  };

  // Color configurations
  const colorConfig = {
    blue: {
      dots: 'bg-blue-500',
      spinner: 'border-blue-500',
      pulse: 'bg-blue-400'
    },
    green: {
      dots: 'bg-green-500',
      spinner: 'border-green-500',
      pulse: 'bg-green-400'
    },
    purple: {
      dots: 'bg-purple-500',
      spinner: 'border-purple-500',
      pulse: 'bg-purple-400'
    },
    gray: {
      dots: 'bg-gray-500',
      spinner: 'border-gray-500',
      pulse: 'bg-gray-400'
    },
    white: {
      dots: 'bg-white',
      spinner: 'border-white',
      pulse: 'bg-white/80'
    }
  };

  // Animation variants
  const dotVariants = {
    animate: {
      scale: [1, 1.3, 1],
      opacity: [0.7, 1, 0.7]
    }
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [1, 0.5, 1]
    }
  };

  const bounceVariants = {
    animate: {
      y: [0, -8, 0],
      transition: {
        duration: 0.6,
        ease: "easeInOut"
      }
    }
  };

  if (type === 'spinner') {
    return (
      <motion.div
        className={`
          ${sizeConfig[size].spinner} 
          border-2 border-gray-200 border-t-2 
          ${colorConfig[color].spinner.replace('border-', 'border-t-')} 
          rounded-full 
          will-change-transform
          ${className}
        `}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{ transform: 'translate3d(0,0,0)' }}
      />
    );
  }

  if (type === 'pulse') {
    return (
      <div className={`flex ${sizeConfig[size].container} ${className}`}>
        {[0, 0.2, 0.4].map((delay, i) => (
          <motion.div
            key={i}
            className={`
              ${sizeConfig[size].dots} 
              ${colorConfig[color].pulse} 
              rounded-full 
              will-change-transform
            `}
            variants={pulseVariants}
            animate="animate"
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay,
              ease: "easeInOut"
            }}
            style={{ transform: 'translate3d(0,0,0)' }}
          />
        ))}
      </div>
    );
  }

  if (type === 'bounce') {
    return (
      <div className={`flex ${sizeConfig[size].container} items-end ${className}`}>
        {[0, 0.1, 0.2].map((delay, i) => (
          <motion.div
            key={i}
            className={`
              ${sizeConfig[size].dots} 
              ${colorConfig[color].dots} 
              rounded-full 
              will-change-transform
            `}
            variants={bounceVariants}
            animate="animate"
            transition={{
              repeat: Infinity,
              delay,
              repeatType: "reverse"
            }}
            style={{ transform: 'translate3d(0,0,0)' }}
          />
        ))}
      </div>
    );
  }

  // Default: dots
  return (
    <div className={`flex ${sizeConfig[size].container} ${className}`} aria-label="กำลังโหลด">
      {[0, 0.15, 0.3].map((delay, i) => (
        <motion.div
          key={i}
          className={`
            ${sizeConfig[size].dots} 
            ${colorConfig[color].dots} 
            rounded-full 
            will-change-transform
          `}
          variants={dotVariants}
          animate="animate"
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay,
            ease: "easeInOut"
          }}
          style={{ transform: 'translate3d(0,0,0)' }}
        />
      ))}
    </div>
  );
}