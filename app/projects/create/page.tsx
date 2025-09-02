'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  FileText, 
  Copy, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown,
  Check,
  CheckCircle,
  Book,
  Users,
  Building,
  GraduationCap,
  UserCheck,
  Loader2,
  AlertCircle,
  Download,
  X
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface ProjectTemplate {
  id: string;
  title: string;
  semester: string;
  year: string;
  stats: {
    curriculum: number;
    subjects: number;
    schedules: number;
  };
  members: string[];
  status: 'active' | 'completed';
  lastUpdated: string;
}

interface ImportItem {
  id: string;
  name: string;
  year?: string;
  code?: string;
  department?: string;
  capacity?: number;
  type?: string;
}

interface ImportSection {
  id: string;
  name: string;
  icon: string;
  expanded: boolean;
  selected: boolean;
  items: ImportItem[];
  searchTerm: string;
  selectedItems: string[];
  loading: boolean;
}

// Mock data
const templateProjects: ProjectTemplate[] = [
  {
    id: '1',
    title: 'ภาคการศึกษา 1/2567',
    semester: '1',
    year: '2567',
    stats: { curriculum: 247, subjects: 247, schedules: 247 },
    members: ['blue', 'pink', 'red', 'orange', 'green', 'gray'],
    status: 'active',
    lastUpdated: '2 วันที่แล้ว'
  },
  {
    id: '2', 
    title: 'ภาคการศึกษา 2/2566',
    semester: '2',
    year: '2566',
    stats: { curriculum: 234, subjects: 234, schedules: 234 },
    members: ['blue', 'pink', 'red', 'orange', 'green', 'gray'],
    status: 'completed',
    lastUpdated: '2 เดือนที่แล้ว'
  },
  {
    id: '3',
    title: 'ภาคการศึกษา 1/2566', 
    semester: '1',
    year: '2566',
    stats: { curriculum: 267, subjects: 267, schedules: 267 },
    members: ['blue', 'pink', 'red', 'orange', 'green', 'gray'],
    status: 'completed',
    lastUpdated: '6 เดือนที่แล้ว'
  },
  {
    id: '4',
    title: 'ภาคการศึกษา 2/2565', 
    semester: '2',
    year: '2565',
    stats: { curriculum: 198, subjects: 198, schedules: 198 },
    members: ['blue', 'pink', 'red', 'orange'],
    status: 'completed',
    lastUpdated: '1 ปีที่แล้ว'
  }
];

const mockImportData = {
  curriculum: [
    { id: '1', name: 'หลักสูตรปริญญาตรี พ.ศ. 2565', year: '2565', code: 'CS-2565' },
    { id: '2', name: 'หลักสูตรปริญญาตรี พ.ศ. 2565', year: '2565', code: 'IT-2565' },
    { id: '3', name: 'หลักสูตรปริญญาตรี พ.ศ. 2565', year: '2565', code: 'SE-2565' },
    { id: '4', name: 'หลักสูตรปริญญาตรี พ.ศ. 2565', year: '2565', code: 'IS-2565' }
  ],
  subjects: [
    { id: '1', name: 'การเขียนโปรแกรม 1', code: 'CS101', department: 'วิทยาการคอมพิวเตอร์' },
    { id: '2', name: 'คณิตศาสตร์ดิสครีต', code: 'CS102', department: 'วิทยาการคอมพิวเตอร์' },
    { id: '3', name: 'โครงสร้างข้อมูล', code: 'CS201', department: 'วิทยาการคอมพิวเตอร์' },
    { id: '4', name: 'ฐานข้อมูล', code: 'CS301', department: 'วิทยาการคอมพิวเตอร์' }
  ],
  teachers: [
    { id: '1', name: 'อ.สมชาย ใจดี', department: 'วิทยาการคอมพิวเตอร์', type: 'อาจารย์ประจำ' },
    { id: '2', name: 'อ.สุดา มานะ', department: 'เทคโนโลยีสารสนเทศ', type: 'อาจารย์ประจำ' },
    { id: '3', name: 'อ.วิชัย สมใจ', department: 'วิศวกรรมซอฟต์แวร์', type: 'อาจารย์ประจำ' },
    { id: '4', name: 'อ.ประยุทธ มั่นคง', department: 'ระบบสารสนเทศ', type: 'อาจารย์พิเศษ' }
  ],
  rooms: [
    { id: '1', name: 'ห้อง CS-301', capacity: 40, type: 'ห้องปฏิบัติการ' },
    { id: '2', name: 'ห้อง CS-302', capacity: 35, type: 'ห้องเรียน' },
    { id: '3', name: 'ห้อง CS-401', capacity: 50, type: 'ห้องประชุม' },
    { id: '4', name: 'ห้อง CS-501', capacity: 30, type: 'ห้องปฏิบัติการ' }
  ],
  students: [
    { id: '1', name: 'นายสมศักดิ์ ใจดี', code: '65010001', department: 'วิทยาการคอมพิวเตอร์' },
    { id: '2', name: 'นางสาวสุดา สมหวัง', code: '65010002', department: 'เทคโนโลยีสารสนเทศ' },
    { id: '3', name: 'นายวิชัย เก่งมาก', code: '65010003', department: 'วิศวกรรมซอฟต์แวร์' },
    { id: '4', name: 'นางสาวมาลี ขยันเรียน', code: '65010004', department: 'ระบบสารสนเทศ' }
  ]
};

export default function CreateProjectPage() {
  const router = useRouter();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [projectMode, setProjectMode] = useState<'create' | 'clone'>('create');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSelectAll, setShowSelectAll] = useState(false);
  
  const [formData, setFormData] = useState({
    title: 'ภาคการศึกษา 1/2568',
    semester: '1',
    year: '2568',
    selectedTemplate: '',
    cloneSearch: '',
    description: ''
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [importSections, setImportSections] = useState<ImportSection[]>([
    {
      id: 'curriculum',
      name: 'หลักสูตร',
      icon: 'Book',
      expanded: true,
      selected: true,
      items: mockImportData.curriculum,
      searchTerm: '',
      selectedItems: ['1', '2', '3', '4'],
      loading: false
    },
    {
      id: 'subjects',
      name: 'รายวิชา',
      icon: 'GraduationCap',
      expanded: false,
      selected: true,
      items: mockImportData.subjects,
      searchTerm: '',
      selectedItems: [],
      loading: false
    },
    {
      id: 'teachers',
      name: 'อาจารย์',
      icon: 'UserCheck',
      expanded: false,
      selected: true,
      items: mockImportData.teachers,
      searchTerm: '',
      selectedItems: [],
      loading: false
    },
    {
      id: 'rooms',
      name: 'ห้องเรียน',
      icon: 'Building',
      expanded: false,
      selected: true,
      items: mockImportData.rooms,
      searchTerm: '',
      selectedItems: [],
      loading: false
    },
    {
      id: 'students',
      name: 'นักศึกษา',
      icon: 'Users',
      expanded: false,
      selected: false,
      items: mockImportData.students,
      searchTerm: '',
      selectedItems: [],
      loading: false
    }
  ]);

  // Auto-generate title when semester or year changes
  useEffect(() => {
    if (projectMode === 'create') {
      setFormData(prev => ({
        ...prev,
        title: `ภาคการศึกษา ${prev.semester}/${prev.year}`
      }));
    }
  }, [formData.semester, formData.year, projectMode]);

  // Form validation
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      errors.title = 'กรุณาระบุชื่อโปรเจกต์';
    }
    
    if (!formData.semester) {
      errors.semester = 'กรุณาเลือกภาคการศึกษา';
    }
    
    if (!formData.year || !/^\d{4}$/.test(formData.year)) {
      errors.year = 'กรุณาระบุปีการศึกษาที่ถูกต้อง';
    }

    if (projectMode === 'clone' && !formData.selectedTemplate) {
      errors.selectedTemplate = 'กรุณาเลือกโปรเจกต์ที่ต้องการโคลน';
    }

    const hasSelectedData = importSections.some(section => section.selected);
    if (!hasSelectedData) {
      errors.importData = 'กรุณาเลือกข้อมูลที่ต้องการนำเข้าอย่างน้อย 1 รายการ';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCancel = () => {
    router.back();
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Creating project with data:', {
        formData,
        importSections: importSections.filter(s => s.selected),
        projectMode
      });
      
      router.push('/projects?created=true');
      
    } catch (error) {
      console.error('Error creating project:', error);
      setFormErrors({ submit: 'เกิดข้อผิดพลาดในการสร้างโปรเจกต์ กรุณาลองใหม่อีกครั้ง' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMemberColor = (color: string) => {
    const colors = {
      blue: 'bg-blue-500',
      pink: 'bg-pink-500', 
      red: 'bg-red-500',
      orange: 'bg-orange-500',
      green: 'bg-green-500',
      gray: 'bg-gray-400'
    };
    return colors[color as keyof typeof colors] || 'bg-gray-400';
  };

  const filteredTemplates = templateProjects.filter(template =>
    template.title.toLowerCase().includes(formData.cloneSearch.toLowerCase()) ||
    template.year.includes(formData.cloneSearch) ||
    template.semester.includes(formData.cloneSearch)
  );

  const toggleSection = (sectionId: string) => {
    setImportSections(prev => prev.map(section =>
      section.id === sectionId
        ? { ...section, expanded: !section.expanded }
        : section
    ));
  };

  const toggleSectionSelection = (sectionId: string) => {
    setImportSections(prev => prev.map(section =>
      section.id === sectionId
        ? { 
            ...section, 
            selected: !section.selected,
            selectedItems: !section.selected ? [] : section.selectedItems
          }
        : section
    ));
  };

  const updateSectionSearch = (sectionId: string, searchTerm: string) => {
    setImportSections(prev => prev.map(section =>
      section.id === sectionId
        ? { ...section, searchTerm }
        : section
    ));
  };

  const toggleItemSelection = (sectionId: string, itemId: string) => {
    setImportSections(prev => prev.map(section => {
      if (section.id === sectionId) {
        const selectedItems = section.selectedItems.includes(itemId)
          ? section.selectedItems.filter(id => id !== itemId)
          : [...section.selectedItems, itemId];
        return { ...section, selectedItems };
      }
      return section;
    }));
  };

  const toggleSelectAllItems = (sectionId: string) => {
    setImportSections(prev => prev.map(section => {
      if (section.id === sectionId) {
        const allItemIds = section.items.map(item => item.id);
        const selectedItems = section.selectedItems.length === section.items.length 
          ? [] 
          : allItemIds;
        return { ...section, selectedItems };
      }
      return section;
    }));
  };

  const importSectionData = async (sectionId: string) => {
    setImportSections(prev => prev.map(section =>
      section.id === sectionId
        ? { ...section, loading: true }
        : section
    ));

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    setImportSections(prev => prev.map(section =>
      section.id === sectionId
        ? { 
            ...section, 
            loading: false,
            selectedItems: section.items.map(item => item.id)
          }
        : section
    ));
  };

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 300;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const toggleSelectAllSections = () => {
    const allSelected = importSections.every(section => section.selected);
    setImportSections(prev => prev.map(section => ({
      ...section,
      selected: !allSelected
    })));
    setShowSelectAll(!allSelected);
  };

  const getSelectedCount = () => {
    return importSections.reduce((total, section) => {
      return total + (section.selected ? section.selectedItems.length : 0);
    }, 0);
  };

  const filteredItems = (section: ImportSection) => {
    return section.items.filter(item =>
      item.name.toLowerCase().includes(section.searchTerm.toLowerCase()) ||
      (item.code && item.code.toLowerCase().includes(section.searchTerm.toLowerCase()))
    );
  };

  const getIconComponent = (iconName: string) => {
    const iconProps = { className: "w-5 h-5" };
    switch (iconName) {
      case 'Book':
        return <Book {...iconProps} />;
      case 'GraduationCap':
        return <GraduationCap {...iconProps} />;
      case 'UserCheck':
        return <UserCheck {...iconProps} />;
      case 'Building':
        return <Building {...iconProps} />;
      case 'Users':
        return <Users {...iconProps} />;
      default:
        return <FileText {...iconProps} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center mb-2">
            <div className="w-1 h-12 bg-orange-500 rounded-full mr-4"></div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">สร้างโปรเจกต์ใหม่</h1>
              <p className="text-gray-800">เพิ่มรายละเอียดหลักสูตร</p>
            </div>
          </div>
          
          {/* Progress indicator */}
          <div className="mt-4 text-sm text-gray-800">
            ข้อมูลที่เลือก: <span className="font-medium text-blue-600">{getSelectedCount()} รายการ</span>
            {formData.selectedTemplate && (
              <span className="ml-4">
                Template: <span className="font-medium text-green-600">{templateProjects.find(t => t.id === formData.selectedTemplate)?.title}</span>
              </span>
            )}
          </div>
        </motion.div>

        {/* Project Mode Selection */}
        <motion.div 
          className="grid grid-cols-2 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <motion.div
            className={`relative p-8 rounded-2xl border-2 cursor-pointer transition-all ${
              projectMode === 'create' 
                ? 'border-blue-500 bg-blue-50 shadow-lg' 
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
            onClick={() => setProjectMode('create')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-center">
              <motion.div 
                className={`w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center transition-all ${
                  projectMode === 'create' ? 'bg-blue-500 shadow-lg' : 'bg-gray-300'
                }`}
                animate={{ 
                  scale: projectMode === 'create' ? 1.1 : 1,
                  rotate: projectMode === 'create' ? [0, 5, -5, 0] : 0
                }}
                transition={{ duration: 0.3 }}
              >
                <FileText className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className={`text-lg font-semibold mb-1 transition-colors ${
                projectMode === 'create' ? 'text-blue-700' : 'text-gray-800'
              }`}>
                สร้างโปรเจกต์
              </h3>
              <p className={`text-sm transition-colors ${
                projectMode === 'create' ? 'text-blue-600' : 'text-gray-700'
              }`}>
                เริ่มต้นโปรเจกต์ใหม่
              </p>
            </div>
            {projectMode === 'create' && (
              <motion.div
                className="absolute inset-0 rounded-2xl bg-blue-500 opacity-10"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </motion.div>

          <motion.div
            className={`relative p-8 rounded-2xl border-2 cursor-pointer transition-all ${
              projectMode === 'clone'
                ? 'border-blue-500 bg-blue-50 shadow-lg'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
            onClick={() => setProjectMode('clone')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-center">
              <motion.div 
                className={`w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center transition-all ${
                  projectMode === 'clone' ? 'bg-blue-500 shadow-lg' : 'bg-gray-300'
                }`}
                animate={{ 
                  scale: projectMode === 'clone' ? 1.1 : 1,
                  rotate: projectMode === 'clone' ? [0, 5, -5, 0] : 0
                }}
                transition={{ duration: 0.3 }}
              >
                <Copy className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className={`text-lg font-semibold mb-1 transition-colors ${
                projectMode === 'clone' ? 'text-blue-700' : 'text-gray-800'
              }`}>
                โคลนโปรเจกต์
              </h3>
              <p className={`text-sm transition-colors ${
                projectMode === 'clone' ? 'text-blue-600' : 'text-gray-700'
              }`}>
                ทำสำเนาจากโปรเจกต์เดิม
              </p>
            </div>
            {projectMode === 'clone' && (
              <motion.div
                className="absolute inset-0 rounded-2xl bg-blue-500 opacity-10"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </motion.div>
        </motion.div>

        {/* Clone Project Section - ย้ายขึ้นมาก่อน Form Fields */}
        <AnimatePresence>
          {projectMode === 'clone' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <label className="block text-sm font-medium text-gray-900 mb-3">
                ค้นหาเลือกโปรเจกต์ที่ต้องการโคลน
              </label>
              
              <div className="relative mb-6">
                <input
                  type="text"
                  placeholder="ค้นหาตามชื่อโปรเจกต์, ภาคเรียน, หรือปีการศึกษา..."
                  value={formData.cloneSearch}
                  onChange={(e) => setFormData(prev => ({ ...prev, cloneSearch: e.target.value }))}
                  className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-600"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Search className="w-5 h-5 text-gray-600" />
                </div>
              </div>

              {formErrors.selectedTemplate && (
                <motion.p 
                  className="mb-4 text-sm text-red-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {formErrors.selectedTemplate}
                </motion.p>
              )}

              {/* Template Projects */}
              <div className="relative">
                <div 
                  ref={carouselRef}
                  className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  <AnimatePresence>
                    {filteredTemplates.map((template, index) => (
                      <motion.div
                        key={template.id}
                        className={`flex-shrink-0 w-72 bg-white rounded-2xl border-2 cursor-pointer transition-all ${
                          formData.selectedTemplate === template.id
                            ? 'border-blue-500 shadow-lg transform scale-105'
                            : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                        }`}
                        onClick={() => setFormData(prev => ({ ...prev, selectedTemplate: template.id }))}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -4 }}
                        layout
                      >
                        {/* Green Header */}
                        <motion.div 
                          className={`text-white p-4 rounded-t-2xl text-center transition-colors ${
                            template.status === 'active' ? 'bg-green-500' : 'bg-gray-500'
                          }`}
                          animate={{ 
                            backgroundColor: formData.selectedTemplate === template.id 
                              ? '#10B981' 
                              : template.status === 'active' ? '#10B981' : '#6B7280'
                          }}
                        >
                          <h4 className="font-semibold">{template.title}</h4>
                          <p className="text-xs opacity-95 mt-1">{template.lastUpdated}</p>
                        </motion.div>
                        
                        {/* Stats */}
                        <div className="p-4">
                          <div className="grid grid-cols-3 gap-4 text-center mb-4">
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              transition={{ type: "spring", stiffness: 400 }}
                            >
                              <div className="text-xl font-bold text-gray-900">{template.stats.curriculum}</div>
                              <div className="text-xs text-gray-700">หลักสูตร</div>
                            </motion.div>
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              transition={{ type: "spring", stiffness: 400 }}
                            >
                              <div className="text-xl font-bold text-gray-900">{template.stats.subjects}</div>
                              <div className="text-xs text-gray-700">รายวิชา</div>
                            </motion.div>
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              transition={{ type: "spring", stiffness: 400 }}
                            >
                              <div className="text-xl font-bold text-gray-900">{template.stats.schedules}</div>
                              <div className="text-xs text-gray-700">ตารางสอน</div>
                            </motion.div>
                          </div>
                          
                          {/* Team Members */}
                          <div>
                            <div className="text-xs text-gray-700 mb-2">ทีมงาน</div>
                            <div className="flex space-x-1">
                              {template.members.map((color, idx) => (
                                <motion.div
                                  key={idx}
                                  className={`w-6 h-6 rounded-full ${getMemberColor(color)}`}
                                  whileHover={{ scale: 1.3, zIndex: 10 }}
                                  transition={{ type: "spring", stiffness: 400 }}
                                />
                              ))}
                            </div>
                          </div>
                          
                          {/* Status badge */}
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              template.status === 'active' 
                                ? 'bg-green-100 text-green-900' 
                                : 'bg-gray-100 text-gray-900'
                            }`}>
                              {template.status === 'active' ? 'กำลังดำเนินการ' : 'เสร็จสิ้นแล้ว'}
                            </span>
                          </div>
                        </div>

                        {/* Selection indicator */}
                        {formData.selectedTemplate === template.id && (
                          <motion.div
                            className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 400 }}
                          >
                            <Check className="w-4 h-4 text-white" />
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {filteredTemplates.length === 0 && (
                    <motion.div 
                      className="flex-shrink-0 w-full h-40 flex items-center justify-center text-gray-800"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      ไม่พบโปรเจกต์ที่ตรงกับการค้นหา
                    </motion.div>
                  )}
                </div>
                
                {/* Navigation Arrows */}
                {filteredTemplates.length > 1 && (
                  <>
                    <motion.button 
                      className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center border border-gray-200 hover:bg-gray-50 z-10"
                      onClick={() => scrollCarousel('left')}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-800" />
                    </motion.button>
                    <motion.button 
                      className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center border border-gray-200 hover:bg-gray-50 z-10"
                      onClick={() => scrollCarousel('right')}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ChevronRight className="w-5 h-5 text-gray-800" />
                    </motion.button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form Fields - ย้ายลงมาหลัง Clone Section */}
        <motion.div 
          className="grid grid-cols-3 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              ชื่อโปรเจกต์ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-600 ${
                formErrors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="ภาคการศึกษา 1/2568"
            />
            {formErrors.title && (
              <motion.p 
                className="mt-1 text-sm text-red-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {formErrors.title}
              </motion.p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              ภาคการศึกษา <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.semester}
              onChange={(e) => setFormData(prev => ({ ...prev, semester: e.target.value }))}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                formErrors.semester ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="1">1</option>
              <option value="2">2</option>
            </select>
            {formErrors.semester && (
              <motion.p 
                className="mt-1 text-sm text-red-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {formErrors.semester}
              </motion.p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              ปีการศึกษา <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.year}
              onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-600 ${
                formErrors.year ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="2568"
            />
            {formErrors.year && (
              <motion.p 
                className="mt-1 text-sm text-red-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {formErrors.year}
              </motion.p>
            )}
          </div>
        </motion.div>

        {/* Import Data Section */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">นำเข้าข้อมูล</h3>
            <motion.label 
              className="flex items-center space-x-2 text-sm text-gray-800 cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <input 
                type="checkbox" 
                className="rounded text-blue-600"
                checked={importSections.every(section => section.selected)}
                onChange={toggleSelectAllSections}
              />
              <span>เลือกทั้งหมด</span>
            </motion.label>
          </div>

          {formErrors.importData && (
            <motion.p 
              className="mb-4 text-sm text-red-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {formErrors.importData}
            </motion.p>
          )}

          <motion.div 
            className="space-y-4"
            layout
          >
            <AnimatePresence>
              {importSections.map((section, index) => (
                <motion.div
                  key={section.id}
                  className={`border rounded-lg transition-all ${
                    section.selected ? 'border-blue-300 bg-blue-50' : 'border-gray-200 bg-white'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  layout
                >
                  <motion.div 
                    className={`flex items-center p-4 rounded-t-lg cursor-pointer ${
                      section.selected ? 'bg-blue-100' : 'bg-gray-50'
                    }`}
                    onClick={() => toggleSectionSelection(section.id)}
                    whileHover={{ backgroundColor: section.selected ? '#DBEAFE' : '#F9FAFB' }}
                  >
                    <motion.input
                      type="checkbox"
                      checked={section.selected}
                      onChange={() => {}}
                      className="mr-3 w-4 h-4 text-blue-600 rounded"
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    />
                    <div className="flex items-center space-x-2 flex-1">
                      <motion.div
                        className={`transition-colors ${
                          section.selected ? 'text-blue-600' : 'text-gray-600'
                        }`}
                        whileHover={{ scale: 1.1 }}
                      >
                        {getIconComponent(section.icon)}
                      </motion.div>
                      <span className={`font-medium transition-colors ${
                        section.selected ? 'text-blue-700' : 'text-gray-800'
                      }`}>
                        {section.name}
                      </span>
                      {section.selectedItems.length > 0 && (
                        <motion.span 
                          className="ml-2 px-2 py-1 bg-blue-500 text-white text-xs rounded-full"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                        >
                          {section.selectedItems.length}
                        </motion.span>
                      )}
                    </div>
                    <motion.button 
                      className={`transition-colors ${
                        section.selected ? 'text-blue-600 hover:text-blue-700' : 'text-gray-400 hover:text-gray-600'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSection(section.id);
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <motion.div
                        animate={{ rotate: section.expanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </motion.div>
                    </motion.button>
                  </motion.div>
                  
                  <AnimatePresence>
                    {section.expanded && section.selected && (
                      <motion.div 
                        className="p-4 border-t border-gray-200"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex space-x-2 mb-3">
                          <div className="relative flex-1">
                            <input
                              type="text"
                              placeholder="ค้นหา..."
                              value={section.searchTerm}
                              onChange={(e) => updateSectionSearch(section.id, e.target.value)}
                              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-600"
                            />
                            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-600" />
                          </div>
                          <motion.button 
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700 transition-colors disabled:opacity-50"
                            onClick={() => importSectionData(section.id)}
                            disabled={section.loading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {section.loading ? (
                              <div className="flex items-center space-x-1">
                                <Loader2 className="w-3 h-3 animate-spin" />
                                <span>กำลังโหลด...</span>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-1">
                                <Download className="w-3 h-3" />
                                <span>นำเข้าข้อมูล</span>
                              </div>
                            )}
                          </motion.button>
                        </div>
                        
                        {/* Select All Items */}
                        <motion.div 
                          className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.1 }}
                        >
                          <label className="flex items-center space-x-2 text-sm font-medium">
                            <input 
                              type="checkbox" 
                              className="w-4 h-4 text-blue-600 rounded"
                              checked={section.selectedItems.length === section.items.length && section.items.length > 0}
                              onChange={() => toggleSelectAllItems(section.id)}
                            />
                            <span>เลือกทั้งหมด ({section.items.length} รายการ)</span>
                          </label>
                          <span className="text-xs text-gray-700">
                            เลือกแล้ว {section.selectedItems.length} รายการ
                          </span>
                        </motion.div>
                        
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          <AnimatePresence>
                            {filteredItems(section).map((item, itemIndex) => (
                              <motion.label 
                                key={item.id} 
                                className="flex items-center space-x-3 text-sm p-2 rounded hover:bg-gray-50 cursor-pointer"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ delay: itemIndex * 0.05 }}
                                whileHover={{ scale: 1.01, backgroundColor: '#F9FAFB' }}
                              >
                                <motion.input 
                                  type="checkbox" 
                                  className="w-4 h-4 text-blue-600 rounded"
                                  checked={section.selectedItems.includes(item.id)}
                                  onChange={() => toggleItemSelection(section.id, item.id)}
                                  whileHover={{ scale: 1.1 }}
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-gray-900 truncate">{item.name}</div>
                                  <div className="text-xs text-gray-700 flex items-center space-x-2">
                                    {item.code && <span>รหัส: {item.code}</span>}
                                    {item.department && <span>• {item.department}</span>}
                                    {item.capacity && <span>• ความจุ: {item.capacity} คน</span>}
                                    {item.type && <span>• {item.type}</span>}
                                  </div>
                                </div>
                              </motion.label>
                            ))}
                          </AnimatePresence>
                          
                          {filteredItems(section).length === 0 && (
                            <motion.div 
                              className="text-center py-4 text-gray-800 text-sm"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                            >
                              {section.searchTerm ? 'ไม่พบข้อมูลที่ค้นหา' : 'ไม่มีข้อมูล'}
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {/* Error message */}
        {formErrors.submit && (
          <motion.div
            className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-600 text-sm">{formErrors.submit}</p>
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div 
          className="flex justify-end space-x-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <motion.button
            onClick={handleCancel}
            className="px-6 py-3 text-gray-900 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isSubmitting}
          >
            ยกเลิก
          </motion.button>
          <motion.button
            onClick={handleSubmit}
            disabled={isSubmitting || getSelectedCount() === 0}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            whileHover={!isSubmitting ? { scale: 1.02 } : {}}
            whileTap={!isSubmitting ? { scale: 0.98 } : {}}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>กำลังสร้าง...</span>
              </>
            ) : (
              <>
                <Check className="w-5 h-5" />
                <span>ต่อไป</span>
              </>
            )}
          </motion.button>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}