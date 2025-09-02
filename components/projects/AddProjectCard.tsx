import { motion } from 'framer-motion';

interface AddProjectCardProps {
  onClick: () => void;
  config?: AddProjectCardConfig;
}

interface AddProjectCardConfig {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  minHeight?: string;
  colors?: {
    background?: string;
    border?: string;
    hoverBackground?: string;
    hoverBorder?: string;
    iconDefault?: string;
    iconHover?: string;
    titleDefault?: string;
    titleHover?: string;
    descriptionDefault?: string;
    descriptionHover?: string;
  };
  animation?: {
    duration?: number;
    delay?: number;
    hoverScale?: number;
    tapScale?: number;
    iconRotation?: number;
  };
}

// Default configuration
const defaultConfig: Required<AddProjectCardConfig> = {
  title: 'สร้างโครงการใหม่',
  description: 'เริ่มต้นภาคการศึกษาใหม่',
  icon: (
    <svg 
      className="w-16 h-16" 
      fill="currentColor" 
      viewBox="0 0 20 20"
    >
      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
    </svg>
  ),
  minHeight: 'min-h-[320px]',
  colors: {
    background: 'bg-gradient-to-br from-slate-50 to-slate-100',
    border: 'border-slate-300',
    hoverBackground: 'hover:bg-gradient-to-br hover:from-blue-50 hover:to-blue-100',
    hoverBorder: 'hover:border-blue-300',
    iconDefault: 'text-slate-400',
    iconHover: 'group-hover:text-blue-500',
    titleDefault: 'text-slate-700',
    titleHover: 'group-hover:text-blue-600',
    descriptionDefault: 'text-slate-500',
    descriptionHover: 'group-hover:text-blue-500'
  },
  animation: {
    duration: 0.5,
    delay: 0.8,
    hoverScale: 1.02,
    tapScale: 0.98,
    iconRotation: 90
  }
};

export default function AddProjectCard({ onClick, config = {} }: AddProjectCardProps) {
  // Merge config with defaults
  const finalConfig: Required<AddProjectCardConfig> = {
    ...defaultConfig,
    ...config,
    colors: { ...defaultConfig.colors, ...config.colors },
    animation: { ...defaultConfig.animation, ...config.animation }
  };

  return (
    <motion.div 
      className={`
        ${finalConfig.colors.background} 
        border-2 border-dashed ${finalConfig.colors.border} 
        rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer 
        ${finalConfig.colors.hoverBorder} ${finalConfig.colors.hoverBackground} 
        transition-all duration-300 group h-full ${finalConfig.minHeight}
      `}
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: finalConfig.animation.duration, delay: finalConfig.animation.delay }}
      whileHover={{ 
        scale: finalConfig.animation.hoverScale,
        boxShadow: "0 10px 30px -10px rgba(59, 130, 246, 0.2)"
      }}
      whileTap={{ scale: finalConfig.animation.tapScale }}
    >
      <motion.div 
        className={`mb-4 ${finalConfig.colors.iconDefault} ${finalConfig.colors.iconHover} transition-colors`}
        whileHover={{ rotate: finalConfig.animation.iconRotation }}
        transition={{ duration: 0.3 }}
      >
        {finalConfig.icon}
      </motion.div>
      
      <h3 className={`text-lg font-semibold ${finalConfig.colors.titleDefault} ${finalConfig.colors.titleHover} mb-2 transition-colors`}>
        {finalConfig.title}
      </h3>
      
      <p className={`text-sm ${finalConfig.colors.descriptionDefault} ${finalConfig.colors.descriptionHover} transition-colors`}>
        {finalConfig.description}
      </p>
    </motion.div>
  );
}