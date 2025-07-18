'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Types
interface LoginState {
  isLoading: boolean;
  error: string | null;
  showHelpModal: boolean;
  showPrivacyModal: boolean;
}

// Loading Dots Component
function LoadingDots() {
  return (
    <div className="flex space-x-1" aria-label="กำลังโหลด">
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

// Google Login Button Component
function GoogleLoginButton({ 
  onClick, 
  isLoading = false 
}: { 
  onClick: () => void; 
  isLoading?: boolean;
}) {
  return (
    <motion.button 
      onClick={onClick}
      disabled={isLoading}
      aria-label={isLoading ? "กำลังเข้าสู่ระบบ" : "เข้าสู่ระบบด้วย Google"}
      className="w-full flex items-center justify-center space-x-4 bg-white/80 backdrop-blur-sm border border-white/60 hover:border-blue-400/60 rounded-xl px-6 py-4 min-h-[56px] text-base font-medium text-gray-700 shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
      whileHover={!isLoading ? { scale: 1.02, y: -1 } : {}}
      whileTap={!isLoading ? { scale: 0.98 } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {isLoading ? (
        <motion.div 
          className="flex items-center space-x-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <LoadingDots />
          <span>กำลังเข้าสู่ระบบ...</span>
        </motion.div>
      ) : (
        <motion.div
          className="flex items-center space-x-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Google Logo */}
          <motion.svg 
            className="w-6 h-6 flex-shrink-0" 
            viewBox="0 0 24 24"
          >
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </motion.svg>
          <span className="text-lg select-none">เข้าสู่ระบบด้วย Google</span>
        </motion.div>
      )}
    </motion.button>
  );
}

// Modal Component
function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  title: string; 
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {/* Backdrop */}
          <motion.div 
            className="absolute inset-0 bg-black/50" 
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          />
          
          {/* Modal Content */}
          <motion.div 
            className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                  aria-label="ปิด"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                  </svg>
                </button>
              </div>
            </div>
            <div className="px-6 py-4">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Alert Components
function ErrorAlert({ message }: { message: string }) {
  return (
    <motion.div 
      className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6" 
      role="alert"
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <div className="flex items-start space-x-3">
        <motion.svg 
          className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-500" 
          fill="currentColor" 
          viewBox="0 0 20 20"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 20 }}
        >
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
        </motion.svg>
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
        >
          <h4 className="font-medium text-red-900 mb-1">เกิดข้อผิดพลาด</h4>
          <p className="text-red-700 text-sm">{message}</p>
        </motion.div>
      </div>
    </motion.div>
  );
}

function SuccessAlert() {
  return (
    <motion.div 
      className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6" 
      role="alert"
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <div className="flex items-start space-x-3">
        <motion.div 
          className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 400, damping: 20 }}
        >
          <motion.svg 
            className="w-4 h-4 text-white" 
            fill="currentColor" 
            viewBox="0 0 20 20"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 500, damping: 25 }}
          >
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
          </motion.svg>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
        >
          <h4 className="font-medium text-green-900 mb-1">เข้าสู่ระบบสำเร็จ!</h4>
          <div className="text-green-700 text-sm flex items-center space-x-2">
            <span>กำลังนำคุณไปยังหน้าหลัก</span>
            <LoadingDots />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// Main Login Page
export default function LoginPage() {
  const [state, setState] = useState<LoginState>({
    isLoading: false,
    error: null,
    showHelpModal: false,
    showPrivacyModal: false
  });

  const updateState = (updates: Partial<LoginState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const handleGoogleLogin = async () => {
    updateState({ isLoading: true, error: null });
    
    try {
      console.log('Google authentication initiated');
      
      // Simulate loading
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate redirect
      setTimeout(() => {
        console.log('Redirecting to dashboard...');
        // window.location.href = '/dashboard';
      }, 500);
      
    } catch (err) {
      updateState({ error: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง' });
    } finally {
      updateState({ isLoading: false });
    }
  };

  return (
    <>
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden">

      </div>

      {/* Main Content */}
      <div className="fixed inset-0 flex items-center justify-center overflow-y-auto">
        <div className="w-full max-w-lg mx-auto relative z-10 px-6 py-8">
          <motion.div 
            className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8 md:p-10"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              duration: 0.5, 
              ease: "easeOut",
              type: "spring",
              stiffness: 200,
              damping: 20
            }}
          >
            
            {/* Logo */}
            <motion.div 
              className="flex justify-center mb-8"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 25 }}
            >
              <img 
                src="https://jlearn.it.kmitl.ac.th/_next/image/?url=%2Fit-kmitl.png&w=256&q=75" 
                alt="สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง" 
                width={80}
                height={80}
                className="object-contain"
              />
            </motion.div>

            {/* Header */}
            <motion.div 
              className="text-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <h1 className="text-3xl font-semibold text-gray-900 tracking-tight mb-4">
                ยินดีต้อนรับ
              </h1>
              <p className="text-gray-600 leading-relaxed">
                เข้าสู่ระบบเพื่อจัดตารางการสอน
              </p>
            </motion.div>

            {/* Error Alert */}
            <AnimatePresence>
              {state.error && <ErrorAlert message={state.error} />}
            </AnimatePresence>

            {/* Login Button */}
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              <GoogleLoginButton onClick={handleGoogleLogin} isLoading={state.isLoading} />
            </motion.div>

            {/* Footer Navigation */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <div className="flex justify-center">
                <nav className="flex items-center space-x-8 px-6 py-3 bg-slate-50/80 rounded-xl border border-slate-200/80 backdrop-blur-sm">
                  <button 
                    onClick={() => updateState({ showHelpModal: true })}
                    className="flex items-center space-x-2 text-slate-600 hover:text-blue-600 transition-colors duration-200 text-sm font-medium cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
                    </svg>
                    <span>ช่วยเหลือ</span>
                  </button>
                  
                  <div className="w-px h-4 bg-slate-300" />
                  
                  <button 
                    onClick={() => updateState({ showPrivacyModal: true })}
                    className="flex items-center space-x-2 text-slate-600 hover:text-blue-600 transition-colors duration-200 text-sm font-medium cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <span>ความเป็นส่วนตัว</span>
                  </button>
                </nav>
              </div>

              {/* Institution Info */}
              <div className="text-center space-y-3">
                <p className="text-slate-600 font-medium leading-relaxed">
                  สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง
                </p>
                <div className="flex items-center justify-center space-x-3 text-slate-400 text-sm">
                  <span>© 2025</span>
                  <div className="w-1 h-1 bg-slate-400 rounded-full" />
                  <span>All Rights Reserved</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Help Modal */}
      <Modal 
        isOpen={state.showHelpModal} 
        onClose={() => updateState({ showHelpModal: false })}
        title="ช่วยเหลือ"
      >
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">วิธีการเข้าสู่ระบบ</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              1. คลิกปุ่ม "เข้าสู่ระบบด้วย Google"<br/>
              2. เลือกบัญชี Google ของคุณ<br/>
              3. ยืนยันการเข้าสู่ระบบ
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">ติดต่อสอบถาม</h3>
            <p className="text-gray-600 text-sm">
              หากมีปัญหาในการเข้าสู่ระบบ กรุณาติดต่อ IT Support
            </p>
          </div>
        </div>
      </Modal>

      {/* Privacy Modal */}
      <Modal 
        isOpen={state.showPrivacyModal} 
        onClose={() => updateState({ showPrivacyModal: false })}
        title="นโยบายความเป็นส่วนตัว"
      >
        <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
          <p>
            เราใช้ข้อมูลของคุณเพื่อการจัดตารางการสอนและการจัดการระบบเท่านั้น
          </p>
          <p>
            ข้อมูลของคุณจะได้รับการปกป้องตามมาตรฐานความปลอดภัยของมหาวิทยาลัย
          </p>
          <p>
            เราไม่เปิดเผยข้อมูลส่วนบุคคลให้กับบุคคลที่สาม
          </p>
        </div>
      </Modal>

      {/* No JavaScript Fallback */}
      <noscript>
        <div className="fixed top-0 left-0 right-0 bg-yellow-400 text-yellow-800 p-3 text-center z-50 text-sm font-medium">
          กรุณาเปิดใช้งาน JavaScript เพื่อใช้ระบบได้อย่างสมบูรณ์
        </div>
      </noscript>
    </>
  );
}