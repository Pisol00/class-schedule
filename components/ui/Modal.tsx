import { ReactNode, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  iconBgColor?: string;
  children: ReactNode;
  maxWidth?: string;
}

const modalVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

const modalContentVariants = {
  initial: { opacity: 0, scale: 0.9, y: 20 },
  animate: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" }
  },
  exit: { 
    opacity: 0, 
    scale: 0.9, 
    y: 20,
    transition: { duration: 0.2, ease: "easeIn" }
  }
};

export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  iconBgColor = 'bg-blue-100',
  children,
  maxWidth = 'max-w-2xl'
}: ModalProps) {
  // Handle escape key and body scroll lock
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.body.classList.add('overflow-hidden');
      document.addEventListener('keydown', handleEscape);
    } else {
      document.body.classList.remove('overflow-hidden');
    }

    return () => {
      document.body.classList.remove('overflow-hidden');
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          variants={modalVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          onClick={handleBackdropClick}
        >
          <motion.div 
            className={`bg-white rounded-2xl shadow-xl ${maxWidth} w-full mx-4 max-h-[90vh] flex flex-col`}
            variants={modalContentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {/* Modal Header */}
            <div className="px-8 py-6 bg-slate-50 rounded-t-2xl border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {icon && (
                    <div className={`w-12 h-12 ${iconBgColor} rounded-full flex items-center justify-center`}>
                      {icon}
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
                    {subtitle && <p className="text-gray-500">{subtitle}</p>}
                  </div>
                </div>
                <motion.button 
                  onClick={onClose}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                  </svg>
                </motion.button>
              </div>
            </div>
            
            {/* Modal Body */}
            <div className="p-8 overflow-y-auto flex-1">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}