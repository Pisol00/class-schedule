import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from '../ui/Modal';
import Badge from '../ui/Badge';
import LoadingSpinner from '../common/LoadingSpinner';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (projectData: ProjectFormData) => void;
}

export interface ProjectFormData {
  title: string;
  academicYear: string;
  semester: string;
  description: string;
  startDate: string;
  endDate: string;
  members: string[];
  importData: {
    courses: boolean;
    instructors: boolean;
    rooms: boolean;
    students: boolean;
    previousSchedule: boolean;
  };
}

// Enhanced Calendar Component
interface CalendarProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  highlightedDates?: Date[];
  className?: string;
  label?: string;
}

function EnhancedCalendar({ 
  selectedDate, 
  onDateSelect, 
  minDate, 
  maxDate, 
  highlightedDates = [], 
  className = '',
  label = ''
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());
  
  const today = new Date();
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const firstDayWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();
  
  const monthNames = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];
  
  const dayNames = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];
  
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };
  
  const isDateDisabled = (date: Date) => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };
  
  const isDateSelected = (date: Date) => {
    if (!selectedDate) return false;
    return date.toDateString() === selectedDate.toDateString();
  };
  
  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };
  
  const isHighlighted = (date: Date) => {
    return highlightedDates.some(hDate => hDate.toDateString() === date.toDateString());
  };
  
  const handleDateClick = (day: number) => {
    const date = new Date(year, month, day);
    if (!isDateDisabled(date)) {
      onDateSelect(date);
    }
  };
  
  // Generate calendar days
  const calendarDays = [];
  
  // Empty cells for days before first day of month
  for (let i = 0; i < firstDayWeek; i++) {
    calendarDays.push(null);
  }
  
  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }
  
  return (
    <motion.div 
      className={`bg-white rounded-2xl border border-slate-200 p-6 shadow-lg ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {label && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700">{label}</h4>
        </div>
      )}
      
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <motion.button
          onClick={() => navigateMonth('prev')}
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd"/>
          </svg>
        </motion.button>
        
        <motion.h3 
          className="text-lg font-semibold text-slate-900"
          key={`${month}-${year}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {monthNames[month]} {year + 543}
        </motion.h3>
        
        <motion.button
          onClick={() => navigateMonth('next')}
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd"/>
          </svg>
        </motion.button>
      </div>
      
      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-1 mb-3">
        {dayNames.map((day) => (
          <div key={day} className="text-center text-sm font-medium text-slate-500 py-2">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => {
          if (day === null) {
            return <div key={index} className="h-10" />;
          }
          
          const date = new Date(year, month, day);
          const disabled = isDateDisabled(date);
          const selected = isDateSelected(date);
          const todayFlag = isToday(date);
          const highlighted = isHighlighted(date);
          
          return (
            <motion.button
              key={day}
              onClick={() => handleDateClick(day)}
              disabled={disabled}
              className={`
                h-10 flex items-center justify-center text-sm rounded-lg cursor-pointer transition-all relative
                ${disabled 
                  ? 'text-slate-300 cursor-not-allowed' 
                  : selected 
                    ? 'bg-blue-500 text-white font-semibold shadow-lg' 
                    : todayFlag
                      ? 'bg-blue-100 text-blue-700 font-semibold border border-blue-300'
                      : highlighted
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'text-slate-700 hover:bg-slate-100'
                }
              `}
              whileHover={!disabled ? { scale: 1.1 } : {}}
              whileTap={!disabled ? { scale: 0.95 } : {}}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.01 }}
            >
              {day}
              {highlighted && !selected && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-green-500 rounded-full" />
              )}
            </motion.button>
          );
        })}
      </div>
      
      {/* Selected Date Info */}
      {selectedDate && (
        <motion.div 
          className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
            </svg>
            <span className="text-sm font-medium text-blue-800">
              {selectedDate.toLocaleDateString('th-TH', { 
                weekday: 'long',
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default function CreateProjectModal({ isOpen, onClose, onSubmit }: CreateProjectModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<ProjectFormData>>({});
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);
  
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    academicYear: new Date().getFullYear().toString(),
    semester: '1',
    description: '',
    startDate: '',
    endDate: '',
    members: [],
    importData: {
      courses: true,
      instructors: true,
      rooms: true,
      students: false,
      previousSchedule: false
    }
  });

  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  // Sample members list
  const availableMembers = [
    { id: '1', name: 'อ.สมชาย ใจดี', role: 'อาจารย์', department: 'วิทยาการคอมพิวเตอร์' },
    { id: '2', name: 'อ.สุดา มานะ', role: 'อาจารย์', department: 'เทคโนโลยีสารสนเทศ' },
    { id: '3', name: 'อ.วิชัย สมใจ', role: 'อาจารย์', department: 'วิศวกรรมซอฟต์แวร์' },
    { id: '4', name: 'อ.ประยุทธ มั่นคง', role: 'อาจารย์', department: 'ระบบสารสนเทศ' },
    { id: '5', name: 'พิศลย์ อ.', role: 'เจ้าหน้าที่', department: 'ฝ่ายวิชาการ' },
    { id: '6', name: 'ภัทรภร จ.', role: 'เจ้าหน้าที่', department: 'ฝ่ายวิชาการ' }
  ];

  const handleInputChange = (field: keyof ProjectFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors && errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleImportDataChange = (field: keyof typeof formData.importData, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      importData: {
        ...prev.importData,
        [field]: value
      }
    }));
  };

  const handleDateSelect = (field: 'startDate' | 'endDate', date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    setFormData(prev => ({ ...prev, [field]: dateString }));
    
    // Close calendar
    if (field === 'startDate') {
      setShowStartCalendar(false);
    } else {
      setShowEndCalendar(false);
    }
    
    // Clear errors
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateStep1 = () => {
    const newErrors: Partial<ProjectFormData> = {};
    
    if (!formData?.semester) {
      newErrors.semester = 'กรุณาเลือกภาคการศึกษา';
    }
    if (!formData?.academicYear) {
      newErrors.academicYear = 'กรุณาระบุปีการศึกษา';
    }
    if (!formData?.description?.trim()) {
      newErrors.description = 'กรุณาระบุคำอธิบาย';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Partial<ProjectFormData> = {};
    
    if (!formData?.startDate) {
      newErrors.startDate = 'กรุณาเลือกวันที่เริ่มต้น';
    }
    if (!formData?.endDate) {
      newErrors.endDate = 'กรุณาเลือกวันที่สิ้นสุด';
    }
    if (formData?.startDate && formData?.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = 'วันที่สิ้นสุดต้องมาหลังวันที่เริ่มต้น';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      // Auto-generate title if empty
      if (!formData?.title) {
        const title = `ภาคการศึกษา ${formData?.semester || '1'}/${formData?.academicYear || new Date().getFullYear()}`;
        setFormData(prev => ({ ...prev, title }));
      }
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setCurrentStep(4);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const toggleMember = (memberId: string) => {
    setSelectedMembers(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const projectData = {
        ...formData,
        members: selectedMembers
      };
      
      onSubmit(projectData);
      
      // Reset form
      setFormData({
        title: '',
        academicYear: new Date().getFullYear().toString(),
        semester: '1',
        description: '',
        startDate: '',
        endDate: '',
        members: [],
        importData: {
          courses: true,
          instructors: true,
          rooms: true,
          students: false,
          previousSchedule: false
        }
      });
      setSelectedMembers([]);
      setCurrentStep(1);
      onClose();
    } catch (error) {
      console.error('Error creating project:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const icon = (
    <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
    </svg>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="สร้างโครงการใหม่"
      subtitle="สร้างโครงการตารางเรียนตารางสอนสำหรับภาคการศึกษาใหม่"
      icon={icon}
      iconBgColor="bg-blue-100"
      maxWidth="max-w-5xl"
    >
      <div className="space-y-6">
        {/* Progress Steps */}
        <div className="flex items-center justify-center space-x-2">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <motion.div 
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm
                  ${currentStep >= step 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-500'
                  }
                `}
                initial={{ scale: 0.8 }}
                animate={{ scale: currentStep === step ? 1.1 : 1 }}
                transition={{ duration: 0.2 }}
              >
                {step}
              </motion.div>
              {step < 4 && (
                <div 
                  className={`
                    w-12 h-1 mx-2 rounded
                    ${currentStep > step ? 'bg-blue-500' : 'bg-gray-200'}
                  `}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {currentStep === 1 && (
            <Step1 
              formData={formData} 
              errors={errors}
              onChange={handleInputChange}
            />
          )}
          
          {currentStep === 2 && (
            <Step2
              formData={formData}
              errors={errors}
              onChange={handleInputChange}
              onDateSelect={handleDateSelect}
              showStartCalendar={showStartCalendar}
              setShowStartCalendar={setShowStartCalendar}
              showEndCalendar={showEndCalendar}
              setShowEndCalendar={setShowEndCalendar}
            />
          )}
          
          {currentStep === 3 && (
            <Step3
              formData={formData}
              onImportDataChange={handleImportDataChange}
            />
          )}
          
          {currentStep === 4 && (
            <Step4 
              formData={formData}
              availableMembers={availableMembers}
              selectedMembers={selectedMembers}
              onToggleMember={toggleMember}
            />
          )}
        </motion.div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-4 border-t">
          <div>
            {currentStep > 1 && (
              <motion.button
                onClick={handleBack}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                whileHover={{ x: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                ← กลับ
              </motion.button>
            )}
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              ยกเลิก
            </button>
            
            {currentStep < 4 ? (
              <motion.button
                onClick={handleNext}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                ถัดไป →
              </motion.button>
            ) : (
              <motion.button
                onClick={handleSubmit}
                disabled={isSubmitting || selectedMembers?.length === 0}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                whileTap={!isSubmitting ? { scale: 0.98 } : {}}
              >
                {isSubmitting ? (
                  <>
                    <LoadingSpinner size="small" />
                    <span>กำลังสร้าง...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    <span>สร้างโครงการ</span>
                  </>
                )}
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}

// Step 1: Basic Information Only
function Step1({ 
  formData = {}, 
  errors = {}, 
  onChange
}: { 
  formData: ProjectFormData; 
  errors?: Partial<ProjectFormData>;
  onChange: (field: keyof ProjectFormData, value: string) => void;
}) {
  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Basic Information */}
      <div>
        <h3 className="text-lg font-semibold mb-4">ข้อมูลพื้นฐาน</h3>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ภาคการศึกษา <span className="text-red-500">*</span>
            </label>
            <select
              value={formData?.semester || '1'}
              onChange={(e) => onChange('semester', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors?.semester ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="1">ภาคการศึกษาที่ 1</option>
              <option value="2">ภาคการศึกษาที่ 2</option>
              <option value="3">ภาคฤดูร้อน</option>
            </select>
            {errors?.semester && (
              <p className="mt-1 text-sm text-red-500">{errors.semester}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ปีการศึกษา <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData?.academicYear || new Date().getFullYear().toString()}
              onChange={(e) => onChange('academicYear', e.target.value)}
              placeholder="2567"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors?.academicYear ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors?.academicYear && (
              <p className="mt-1 text-sm text-red-500">{errors.academicYear}</p>
            )}
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ชื่อโครงการ (ไม่ระบุจะใช้ชื่ออัตโนมัติ)
          </label>
          <input
            type="text"
            value={formData?.title || ''}
            onChange={(e) => onChange('title', e.target.value)}
            placeholder="เช่น ตารางสอนภาค 1/2567"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="mt-1 text-sm text-gray-500">
            หากไม่ระบุ ระบบจะสร้างชื่อเป็น "ภาคการศึกษา {formData?.semester || '1'}/{formData?.academicYear || new Date().getFullYear()}"
          </p>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            คำอธิบาย <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData?.description || ''}
            onChange={(e) => onChange('description', e.target.value)}
            rows={3}
            placeholder="อธิบายรายละเอียดของโครงการ..."
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-500">{errors.description}</p>
          )}
        </div>
      </div>

      {/* Preview */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">ตัวอย่างชื่อโครงการ</h4>
        <p className="text-lg font-semibold text-blue-900">
          {formData?.title || `ภาคการศึกษา ${formData?.semester || '1'}/${formData?.academicYear || new Date().getFullYear()}`}
        </p>
        <p className="text-sm text-gray-600 mt-1">
          {formData?.description || 'คำอธิบายโครงการ...'}
        </p>
      </div>
    </div>
  );
}

// Step 2: Schedule/ระยะเวลาโครงการ
function Step2({ 
  formData = {}, 
  errors = {}, 
  onChange,
  onDateSelect,
  showStartCalendar,
  setShowStartCalendar,
  showEndCalendar,
  setShowEndCalendar
}: { 
  formData: ProjectFormData; 
  errors?: Partial<ProjectFormData>;
  onChange: (field: keyof ProjectFormData, value: string) => void;
  onDateSelect: (field: 'startDate' | 'endDate', date: Date) => void;
  showStartCalendar: boolean;
  setShowStartCalendar: (show: boolean) => void;
  showEndCalendar: boolean;
  setShowEndCalendar: (show: boolean) => void;
}) {
  // Generate some highlighted dates for better UX
  const highlightedDates = [
    new Date(2025, 7, 12), // Start of semester
    new Date(2025, 11, 20), // End of semester
    new Date(2025, 9, 15), // Mid-term
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Column - Form */}
      <div className="space-y-6">
        {/* Project Summary */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">โครงการที่กำลังสร้าง</h4>
          <p className="text-lg font-semibold text-blue-900">
            {formData?.title || `ภาคการศึกษา ${formData?.semester || '1'}/${formData?.academicYear || new Date().getFullYear()}`}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {formData?.description || 'คำอธิบายโครงการ...'}
          </p>
        </div>

        {/* Date Selection with Buttons */}
        <div>
          <h3 className="text-lg font-semibold mb-4">ระยะเวลาโครงการ</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                วันที่เริ่มต้น <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setShowStartCalendar(!showStartCalendar)}
                className={`w-full px-4 py-2 border rounded-lg text-left focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between ${
                  errors?.startDate ? 'border-red-500' : 'border-gray-300'
                } ${formData?.startDate ? 'text-gray-900' : 'text-gray-500'}`}
              >
                <span>
                  {formData?.startDate 
                    ? new Date(formData.startDate).toLocaleDateString('th-TH', { 
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })
                    : 'เลือกวันที่เริ่มต้น'
                  }
                </span>
                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                </svg>
              </button>
              {errors?.startDate && (
                <p className="mt-1 text-sm text-red-500">{errors.startDate}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                วันที่สิ้นสุด <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setShowEndCalendar(!showEndCalendar)}
                className={`w-full px-4 py-2 border rounded-lg text-left focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between ${
                  errors?.endDate ? 'border-red-500' : 'border-gray-300'
                } ${formData?.endDate ? 'text-gray-900' : 'text-gray-500'}`}
              >
                <span>
                  {formData?.endDate 
                    ? new Date(formData.endDate).toLocaleDateString('th-TH', { 
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })
                    : 'เลือกวันที่สิ้นสุด'
                  }
                </span>
                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                </svg>
              </button>
              {errors?.endDate && (
                <p className="mt-1 text-sm text-red-500">{errors.endDate}</p>
              )}
            </div>
          </div>

          {/* Duration Summary */}
          {formData?.startDate && formData?.endDate && (
            <motion.div 
              className="mt-6 p-4 bg-gray-50 rounded-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h4 className="text-sm font-medium text-gray-700 mb-2">ภาพรวมระยะเวลา</h4>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                  </svg>
                  <span>
                    {new Date(formData.startDate).toLocaleDateString('th-TH', { 
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                
                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                </svg>
                
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                  </svg>
                  <span>
                    {new Date(formData.endDate).toLocaleDateString('th-TH', { 
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                
                <Badge variant="info">
                  {Math.ceil((new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) / (1000 * 60 * 60 * 24))} วัน
                </Badge>
              </div>
            </motion.div>
          )}

          {/* Schedule Tips */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="text-sm font-semibold text-yellow-800 mb-2 flex items-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
              คำแนะนำในการเลือกระยะเวลา
            </h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• ภาคการศึกษาปกติ: ประมาณ 16-18 สัปดาห์</li>
              <li>• ภาคฤดูร้อน: ประมาณ 8-10 สัปดาห์</li>
              <li>• ควรเพิ่มเวลาสำหรับเตรียมการก่อนเปิดเรียน 2-3 สัปดาห์</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Right Column - Calendar */}
      <div className="space-y-4">
        <AnimatePresence mode="wait">
          {showStartCalendar && (
            <EnhancedCalendar
              key="start-calendar"
              selectedDate={formData?.startDate ? new Date(formData.startDate) : null}
              onDateSelect={(date) => onDateSelect('startDate', date)}
              minDate={new Date()}
              maxDate={formData?.endDate ? new Date(formData.endDate) : undefined}
              highlightedDates={highlightedDates}
              label="เลือกวันที่เริ่มต้น"
            />
          )}
          
          {showEndCalendar && (
            <EnhancedCalendar
              key="end-calendar"
              selectedDate={formData?.endDate ? new Date(formData.endDate) : null}
              onDateSelect={(date) => onDateSelect('endDate', date)}
              minDate={formData?.startDate ? new Date(formData.startDate) : new Date()}
              highlightedDates={highlightedDates}
              label="เลือกวันที่สิ้นสุด"
            />
          )}
          
          {!showStartCalendar && !showEndCalendar && (
            <motion.div
              key="calendar-placeholder"
              className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-dashed border-blue-200 rounded-2xl p-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-blue-900 mb-2">เลือกวันที่</h4>
              <p className="text-blue-700 text-sm">
                คลิกที่ปุ่มวันที่เพื่อเปิดปฏิทินและเลือกวันที่เริ่มต้นและสิ้นสุดโครงการ
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Step 3: Import Data (เดิมเป็น Step 2)
function Step3({ 
  formData = {}, 
  onImportDataChange 
}: { 
  formData: ProjectFormData;
  onImportDataChange: (field: keyof ProjectFormData['importData'], value: boolean) => void;
}) {
  const importOptions = [
    {
      id: 'courses',
      name: 'รายวิชา',
      description: 'นำเข้าข้อมูลรายวิชาทั้งหมดในภาคการศึกษานี้',
      icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
      count: 247,
      defaultChecked: true
    },
    {
      id: 'instructors',
      name: 'อาจารย์ผู้สอน',
      description: 'นำเข้าข้อมูลอาจารย์และภาระงานสอน',
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
      count: 85,
      defaultChecked: true
    },
    {
      id: 'rooms',
      name: 'ห้องเรียน',
      description: 'นำเข้าข้อมูลห้องเรียนและห้องปฏิบัติการ',
      icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
      count: 42,
      defaultChecked: true
    },
    {
      id: 'students',
      name: 'นักศึกษา',
      description: 'นำเข้าข้อมูลนักศึกษาและการลงทะเบียน',
      icon: 'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z',
      count: 1850,
      defaultChecked: false
    },
    {
      id: 'previousSchedule',
      name: 'ตารางสอนเดิม',
      description: 'นำเข้าตารางสอนจากภาคการศึกษาที่ผ่านมาเป็นต้นแบบ',
      icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
      count: 189,
      defaultChecked: false
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">นำเข้าข้อมูลจากระบบ</h3>
        <p className="text-sm text-gray-600 mb-6">
          เลือกข้อมูลที่ต้องการนำเข้าสู่โครงการ ข้อมูลเหล่านี้จะถูกคัดลอกมาจากฐานข้อมูลหลักของระบบ
        </p>
        
        <div className="space-y-3">
          {importOptions.map((option) => (
            <motion.div
              key={option.id}
              className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
              whileHover={{ scale: 1.01 }}
            >
              <label className="flex items-start cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData?.importData?.[option.id as keyof typeof formData.importData] ?? option.defaultChecked}
                  onChange={(e) => onImportDataChange(option.id as keyof typeof formData.importData, e.target.checked)}
                  className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                
                <div className="ml-4 flex-1">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={option.icon}/>
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{option.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                      </div>
                    </div>
                    <Badge variant="info">{option.count} รายการ</Badge>
                  </div>
                </div>
              </label>
            </motion.div>
          ))}
        </div>
        
        {/* Import Summary */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-semibold text-blue-900 mb-3">สิ่งที่จะถูกนำเข้า</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {importOptions.filter(opt => 
              formData?.importData?.[opt.id as keyof typeof formData.importData] ?? opt.defaultChecked
            ).map(opt => (
              <div key={opt.id} className="flex items-center space-x-2 text-blue-700">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span>{opt.name} ({opt.count})</span>
              </div>
            ))}
          </div>
          
          <div className="mt-3 pt-3 border-t border-blue-200">
            <p className="text-xs text-blue-600">
              <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
              </svg>
              ข้อมูลจะถูกคัดลอกไปยังโครงการใหม่ การแก้ไขจะไม่กระทบกับข้อมูลต้นฉบับ
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Step 4: Team Members (เดิมเป็น Step 3)
function Step4({ 
  formData = {}, 
  availableMembers = [], 
  selectedMembers = [], 
  onToggleMember 
}: { 
  formData: ProjectFormData;
  availableMembers: any[];
  selectedMembers: string[];
  onToggleMember: (id: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">เลือกสมาชิกโครงการ</h3>
        <p className="text-sm text-gray-600 mb-4">
          เลือกอาจารย์และเจ้าหน้าที่ที่จะร่วมในโครงการนี้ ({selectedMembers?.length || 0} คน)
        </p>
        
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {availableMembers?.map(member => (
            <motion.div
              key={member.id}
              className={`
                p-3 rounded-lg border cursor-pointer transition-all
                ${selectedMembers?.includes(member.id) 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:bg-gray-50'
                }
              `}
              onClick={() => onToggleMember(member.id)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                    ${selectedMembers?.includes(member.id) 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-600'
                    }
                  `}>
                    {member.name.split(' ').map(n => n.charAt(0)).join('').substring(0, 2)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{member.name}</p>
                    <p className="text-sm text-gray-500">{member.role} - {member.department}</p>
                  </div>
                </div>
                
                <div className={`
                  w-5 h-5 rounded border-2 flex items-center justify-center
                  ${selectedMembers?.includes(member.id) 
                    ? 'bg-blue-500 border-blue-500' 
                    : 'border-gray-300'
                  }
                `}>
                  {selectedMembers?.includes(member.id) && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Summary */}
      <div className="p-4 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">สรุปข้อมูลโครงการ</h4>
        <div className="space-y-1 text-sm text-blue-700">
          <p><span className="font-medium">ชื่อ:</span> {formData?.title || `ภาคการศึกษา ${formData?.semester || '1'}/${formData?.academicYear || new Date().getFullYear()}`}</p>
          <p><span className="font-medium">ระยะเวลา:</span> {formData?.startDate || '-'} ถึง {formData?.endDate || '-'}</p>
          <p><span className="font-medium">สมาชิก:</span> {selectedMembers?.length || 0} คน</p>
        </div>
      </div>
    </div>
  );
}