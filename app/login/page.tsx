// page.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

// คอมโพเนนต์
import {
  Modal,
  GoogleLoginButton,
  HelpModalContent,
  PrivacyModalContent,
  AnimatedBackground
} from '@/components/LoginPage';

// ประเภทข้อมูล
import { LoginState } from '@/types/login';

export default function LoginPage() {
  const [state, setState] = useState<LoginState>({
    isLoading: false,
    showHelpModal: false,
    showPrivacyModal: false
  });

  const updateState = (updates: Partial<LoginState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const handleGoogleLogin = async () => {
    updateState({ isLoading: true });

    console.log('Google authentication initiated');

    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate redirect
    setTimeout(() => {
      console.log('Redirecting to dashboard...');
      // window.location.href = '/dashboard';
    }, 500);

    updateState({ isLoading: false });
  };

  return (
    <>
      {/* พื้นหลัง */}
      <AnimatedBackground />

      {/* เนื้อหาหลัก */}
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

            {/* โลโก้ */}
            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 25 }}
            >
              <img
                src="/logo.png"
                alt="สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง"
                width={120}
                height={120}
                className="object-contain"
              />
            </motion.div>

            {/* หัวข้อ */}
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
                เข้าสู่ระบบจัดตารางการสอน
              </p>
            </motion.div>

            {/* ปุ่มเข้าสู่ระบบ */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              <GoogleLoginButton onClick={handleGoogleLogin} isLoading={state.isLoading} />
            </motion.div>

            {/* เมนูท้ายหน้า */}
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
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                    <span>ช่วยเหลือ</span>
                  </button>

                  <div className="w-px h-4 bg-slate-300" />

                  <button
                    onClick={() => updateState({ showPrivacyModal: true })}
                    className="flex items-center space-x-2 text-slate-600 hover:text-blue-600 transition-colors duration-200 text-sm font-medium cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>ความเป็นส่วนตัว</span>
                  </button>
                </nav>
              </div>

              {/* ข้อมูลสถาบัน */}
              <div className="text-center space-y-3">
                <p className="text-slate-600 leading-relaxed text-sm">
                  คณะเทคโนโลยีสารสนเทศ <br /> สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง
                </p>
                <div className="flex items-center justify-center space-x-2 text-slate-400 text-sm">
                  <span>© 2025</span>
                  <div className="w-1 h-1 bg-slate-400 rounded-full" />
                  <span>สงวนลิขสิทธิ์</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* หน้าต่างช่วยเหลือ */}
      <Modal
        isOpen={state.showHelpModal}
        onClose={() => updateState({ showHelpModal: false })}
        title="ช่วยเหลือ"
      >
        <HelpModalContent />
      </Modal>

      {/* หน้าต่างนโยบายความเป็นส่วนตัว */}
      <Modal
        isOpen={state.showPrivacyModal}
        onClose={() => updateState({ showPrivacyModal: false })}
        title="นโยบายความเป็นส่วนตัว"
      >
        <PrivacyModalContent />
      </Modal>
    </>
  );
}