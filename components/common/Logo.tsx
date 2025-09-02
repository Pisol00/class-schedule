import { motion } from 'framer-motion';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  className?: string;
}

export default function Logo({ size = 'medium', showText = true, className = '' }: LogoProps) {
  const sizes = {
    small: { box: 'w-8 h-8', text: 'text-lg' },
    medium: { box: 'w-10 h-10', text: 'text-xl' },
    large: { box: 'w-12 h-12', text: 'text-2xl' }
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <motion.div 
        className={`${sizes[size].box} rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        IT
      </motion.div>
      {showText && (
        <div>
          <span className={`${sizes[size].text} font-semibold text-slate-900`}>IT KMITL</span>
          <div className="text-xs text-slate-500 -mt-1">ระบบตารางเรียนตารางสอน</div>
        </div>
      )}
    </div>
  );
}