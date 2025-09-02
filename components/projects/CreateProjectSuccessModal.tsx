import { motion } from 'framer-motion';
import Modal from '../ui/Modal';
import { ProjectFormData } from './CreateProjectModal';

interface CreateProjectSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectData: ProjectFormData;
  onGoToProject: () => void;
}

export default function CreateProjectSuccessModal({ 
  isOpen, 
  onClose, 
  projectData,
  onGoToProject 
}: CreateProjectSuccessModalProps) {
  const icon = (
    <motion.svg 
      className="w-6 h-6 text-green-600" 
      fill="currentColor" 
      viewBox="0 0 20 20"
      initial={{ scale: 0 }}
      animate={{ scale: 1, rotate: 360 }}
      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
    >
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
    </motion.svg>
  );

  const importSummary = [
    { name: 'รายวิชา', count: 247, imported: projectData?.importData?.courses },
    { name: 'อาจารย์', count: 85, imported: projectData?.importData?.instructors },
    { name: 'ห้องเรียน', count: 42, imported: projectData?.importData?.rooms },
    { name: 'นักศึกษา', count: 1850, imported: projectData?.importData?.students },
    { name: 'ตารางสอนเดิม', count: 189, imported: projectData?.importData?.previousSchedule }
  ];

  const totalImported = importSummary.filter(item => item.imported).reduce((sum, item) => sum + item.count, 0);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="สร้างโครงการสำเร็จ!"
      subtitle={projectData?.title || `ภาคการศึกษา ${projectData?.semester}/${projectData?.academicYear}`}
      icon={icon}
      iconBgColor="bg-green-100"
      maxWidth="max-w-2xl"
    >
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {/* Success Animation */}
        <motion.div 
          className="flex justify-center mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        >
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
            </svg>
          </div>
        </motion.div>

        {/* Project Summary */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <h4 className="font-semibold text-gray-900 mb-3">รายละเอียดโครงการ</h4>
          
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-500">ระยะเวลา:</span>
              <p className="font-medium text-gray-900">
                {new Date(projectData?.startDate).toLocaleDateString('th-TH', { 
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })} - {new Date(projectData?.endDate).toLocaleDateString('th-TH', { 
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </p>
            </div>
            
            <div>
              <span className="text-gray-500">สมาชิก:</span>
              <p className="font-medium text-gray-900">{projectData?.members?.length || 0} คน</p>
            </div>
          </div>
        </div>

        {/* Import Summary */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">ข้อมูลที่นำเข้า</h4>
          <div className="space-y-2">
            {importSummary.filter(item => item.imported).map((item, index) => (
              <motion.div 
                key={item.name}
                className="flex items-center justify-between p-3 bg-green-50 rounded-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + (index * 0.1) }}
              >
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-gray-700">{item.name}</span>
                </div>
                <span className="font-medium text-gray-900">{item.count} รายการ</span>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-700">รวมข้อมูลที่นำเข้าทั้งหมด</span>
              <span className="text-lg font-semibold text-blue-900">{totalImported} รายการ</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <motion.button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            ปิด
          </motion.button>
          
          <motion.button
            onClick={onGoToProject}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>ไปยังโครงการ</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
            </svg>
          </motion.button>
        </div>
      </motion.div>
    </Modal>
  );
}