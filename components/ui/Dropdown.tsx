import { ReactNode, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DropdownProps {
  isOpen: boolean;
  onClose: () => void;
  trigger: ReactNode;
  children: ReactNode;
  align?: 'left' | 'right' | 'center';
  width?: string;
  className?: string;
}

const dropdownVariants = {
  initial: { opacity: 0, y: -10, scale: 0.95 },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.15 }
  },
  exit: { 
    opacity: 0, 
    y: -10, 
    scale: 0.95,
    transition: { duration: 0.1 }
  }
};

export default function Dropdown({
  isOpen,
  onClose,
  trigger,
  children,
  align = 'left',
  width = 'w-64',
  className = ''
}: DropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const alignmentClasses = {
    left: 'left-0',
    right: 'right-0',
    center: 'left-1/2 transform -translate-x-1/2'
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {trigger}
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className={`
              absolute top-full mt-2 ${width} py-2 bg-white border border-slate-200 
              rounded-xl shadow-lg z-50 ${alignmentClasses[align]} ${className}
            `}
            variants={dropdownVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Dropdown Header Component
export function DropdownHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="px-4 py-2 border-b border-slate-100">
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
    </div>
  );
}

// Dropdown Section Component
export function DropdownSection({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="py-2">
      {title && (
        <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {title}
        </div>
      )}
      {children}
    </div>
  );
}

// Dropdown Item Component
interface DropdownItemProps {
  icon?: ReactNode;
  label: string;
  badge?: string | number;
  onClick?: () => void;
  className?: string;
}

export function DropdownItem({ icon, label, badge, onClick, className = '' }: DropdownItemProps) {
  return (
    <motion.button 
      className={`
        w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 
        flex items-center justify-between transition-colors ${className}
      `}
      onClick={onClick}
      whileHover={{ x: 5 }}
    >
      <div className="flex items-center space-x-3">
        {icon && <div className="text-slate-500">{icon}</div>}
        <span>{label}</span>
      </div>
      {badge && (
        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
          {badge}
        </span>
      )}
    </motion.button>
  );
}