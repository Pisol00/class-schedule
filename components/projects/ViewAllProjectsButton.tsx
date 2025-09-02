import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

interface ViewAllProjectsButtonProps {
  onClick: () => void;
  isFiltered?: boolean; // เพิ่ม prop สำหรับตรวจสอบการ filter
}

const ViewAllProjectsButton = ({ onClick, isFiltered = false }: ViewAllProjectsButtonProps) => {
  // ซ่อนปุ่มเมื่อมีการ filter
  if (isFiltered) {
    return null;
  }

  return (
    <motion.div 
      className="flex justify-center mt-8 mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.8 }}
    >
      <motion.button
        className="group relative inline-flex items-center px-8 py-4 border border-blue-600/10 rounded-2xl text-blue-700 font-semibold hover:from-blue-100 hover:to-blue-150 hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-lg overflow-hidden cursor-pointer"
        onClick={onClick}
        whileHover={{ scale: 1.02, y: -1 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Background Animation */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.6 }}
        />
        
        {/* Content */}
        <div className="relative flex items-center">
          <span className="mr-2">ดูเพิ่มเติมทั้งหมด</span>
          <motion.div
            className="ml-3 group-hover:translate-x-1 transition-transform duration-300"
          >
            <ChevronRight className="w-4 h-4" />
          </motion.div>
        </div>

        {/* Shine effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"
          style={{ width: '100%' }}
        />
      </motion.button>
    </motion.div>
  );
};

export default ViewAllProjectsButton;