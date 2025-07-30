"use client"
import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

// Types
interface UnsavedChangesModalProps {
  message: string;
  subMessage?: string;
  showDontShowAgain?: boolean;
  confirmText?: string;
  cancelText?: string;
  onConfirm: (dontShowAgain?: boolean) => Promise<void>;
  onClose?: () => void;
  isDestructive?: boolean;
}

interface UnsavedChangesContainerProps {
  message?: string;
  subMessage?: string;
  showDontShowAgain?: boolean;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: (dontShowAgain?: boolean) => Promise<void>;
  onClose?: () => void;
  isDestructive?: boolean;
}

// Default confirm function
const defaultOnConfirm = async (dontShowAgain?: boolean): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      alert(`บันทึกสำเร็จ! ${dontShowAgain ? '(ไม่แสดงอีก)' : ''}`);
      resolve();
    }, 1000);
  });
};

// Modal Component
const UnsavedChangesModal: React.FC<UnsavedChangesModalProps> = ({
  message,
  subMessage,
  showDontShowAgain = true,
  confirmText = "ยืนยัน",
  cancelText = "ยกเลิก",
  onConfirm,
  onClose,
  isDestructive = false
}) => {
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm(showDontShowAgain ? dontShowAgain : undefined);
    } catch (error) {
      console.error('Error confirming action:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting && onClose) {
      onClose();
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <div className="bg-white rounded-3xl shadow-lg max-w-2xl w-full p-8 animate-in zoom-in-95 duration-300">
      {/* Header with icon, text, and close button */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-start space-x-6">
          {/* Icon */}
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1 transition-all duration-200 hover:scale-105">
            <Save className="w-8 h-8 text-orange-600 transition-all duration-300" />
          </div>
          
          {/* Text content */}
          <div className="flex-1 pt-2 animate-in slide-in-from-left duration-300 delay-100">
            <h3 className="text-gray-900 text-xl font-semibold mb-3 leading-relaxed transition-colors duration-200">
              {message}
            </h3>
            
            {subMessage && (
              <p className="text-gray-600 text-base leading-relaxed transition-colors duration-200">
                {subMessage}
              </p>
            )}
          </div>
        </div>
        
        {/* Close button */}
        <button
          onClick={handleClose}
          className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200 flex-shrink-0 ml-4 cursor-pointer hover:scale-110 transform"
          disabled={isSubmitting}
          title="ปิด"
        >
          <X className="w-6 h-6 transition-all duration-200" />
        </button>
      </div>

      {/* Footer with checkbox and buttons */}
      <div className="flex items-center justify-between animate-in slide-in-from-bottom duration-300 delay-200">
        {/* Checkbox */}
        {showDontShowAgain ? (
          <div className="flex items-center transition-all duration-200 hover:scale-105">
            <input
              type="checkbox"
              id="dontShow"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 mr-3 cursor-pointer transition-all duration-200"
              disabled={isSubmitting}
            />
            <label 
              htmlFor="dontShow" 
              className="text-gray-700 text-base cursor-pointer hover:text-gray-900 transition-colors duration-200"
            >
              ไม่ต้องแสดงอีก
            </label>
          </div>
        ) : (
          <div></div>
        )}

        {/* Buttons */}
        <div className="flex items-center space-x-4">
          <button
            onClick={handleClose}
            className="px-8 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium text-base cursor-pointer transform hover:scale-105 hover:shadow-md"
            disabled={isSubmitting}
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            disabled={isSubmitting}
            className={`
              px-8 py-3 rounded-xl font-medium text-base transition-all duration-300 flex items-center space-x-2 cursor-pointer transform hover:scale-105
              ${isSubmitting
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed scale-100'
                : isDestructive
                ? 'bg-red-600 text-white hover:bg-red-700 shadow-sm hover:shadow-lg'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-lg'
              }
            `}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span className="animate-pulse">กำลังบันทึก...</span>
              </>
            ) : (
              <span className="transform transition-transform duration-200 group-hover:scale-105">{confirmText}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Container Component
const UnsavedChangesContainer: React.FC<UnsavedChangesContainerProps> = ({
  message = "การเปลี่ยนแปลงยังไม่ถูกบันทึก",
  subMessage = "คุณต้องการบันทึกการเปลี่ยนแปลงก่อนหรือไม่ หรือจะยกเลิก?",
  showDontShowAgain = false,
  confirmText = "ยืนยัน",
  cancelText = "ยกเลิก",
  onConfirm = defaultOnConfirm,
  onClose,
  isDestructive = false
}) => {
  return (
    <UnsavedChangesModal
      message={message}
      subMessage={subMessage}
      showDontShowAgain={showDontShowAgain}
      confirmText={confirmText}
      cancelText={cancelText}
      onConfirm={onConfirm}
      onClose={onClose}
      isDestructive={isDestructive}
    />
  );
};

export default UnsavedChangesContainer;