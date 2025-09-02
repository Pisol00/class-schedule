'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProjectSearch from '@/components/projects/ProjectSearch';
import ProjectFilters from '@/components/projects/ProjectFilters';
import ProjectGrid from '@/components/projects/ProjectGrid';
import { Project } from '@/components/projects/ProjectCard';
import AcademicCalendar from '@/components/projects/AcademicCalendar';
import StatisticsSection from '@/components/projects/StatisticsSection';
import ViewAllProjectsButton from '@/components/projects/ViewAllProjectsButton';

// Demo data
const projectsData: Project[] = [
  {
    id: '2567-1',
    title: 'ภาคการศึกษา 1/2567',
    description: 'ตารางเรียนตารางสอนภาคการศึกษาที่ 1 ปีการศึกษา 2567',
    status: 'กำลังดำเนินการ',
    curriculum: 15,
    subjects: 247,
    schedules: 189,
    conflicts: 12,
    members: [
      { id: '1', name: 'อ.สมชาย ใจดี', role: 'หัวหน้าโครงการ' },
      { id: '2', name: 'อ.สุดา มานะ', role: 'ที่ปรึกษา' },
      { id: '3', name: 'พิศลย์ อ.', role: 'นักพัฒนา' },
      { id: '4', name: 'ภัทรภร จ.', role: 'ออกแบบ' },
      { id: '5', name: 'อ.วิชัย สมใจ', role: 'ผู้ตรวจสอบ' },
      { id: '6', name: 'นางสาวสิริ', role: 'เลขานุการ' },
      { id: '7', name: 'นายธนา', role: 'ผู้ช่วย' },
      { id: '8', name: 'นางสาวนิตยา', role: 'ผู้ช่วย' }
    ],
    progress: 77,
    lastUpdated: '2 ชั่วโมงที่แล้ว',
    icon: 'calendar'
  },
  {
    id: '2567-2',
    title: 'ภาคการศึกษา 2/2567',
    description: 'ตารางเรียนตารางสอนภาคการศึกษาที่ 2 ปีการศึกษา 2567',
    status: 'กำลังดำเนินการ',
    curriculum: 11,
    subjects: 203,
    schedules: 45,
    conflicts: 0,
    members: [
      { id: '1', name: 'อ.สมชาย ใจดี', role: 'หัวหน้าโครงการ' },
      { id: '2', name: 'อ.สุดา มานะ', role: 'ที่ปรึกษา' },
      { id: '3', name: 'พิศลย์ อ.', role: 'นักพัฒนา' },
      { id: '4', name: 'ภัทรภร จ.', role: 'ออกแบบ' },
      { id: '5', name: 'อ.วิชัย สมใจ', role: 'ผู้ตรวจสอบ' }
    ],
    progress: 22,
    lastUpdated: '3 วันที่แล้ว',
    icon: 'calendar'
  },
  {
    id: '2566-3',
    title: 'ภาคการศึกษา 3/2566',
    description: 'ตารางเรียนตารางสอนภาคฤดูร้อน ปีการศึกษา 2566',
    status: 'เสร็จสิ้น',
    curriculum: 11,
    subjects: 89,
    schedules: 89,
    conflicts: 0,
    members: [
      { id: '1', name: 'อ.สมชาย ใจดี', role: 'หัวหน้าโครงการ' },
      { id: '2', name: 'อ.ประยุทธ มั่นคง', role: 'ที่ปรึกษา' },
      { id: '3', name: 'นายอนันต์', role: 'นักพัฒนา' },
      { id: '4', name: 'นางสาวอริสา', role: 'ออกแบบ' }
    ],
    progress: 100,
    lastUpdated: '1 สัปดาห์ที่แล้ว',
    icon: 'check'
  },
  {
    id: '2566-2',
    title: 'ภาคการศึกษา 2/2566',
    description: 'ตารางเรียนตารางสอนภาคการศึกษาที่ 2 ปีการศึกษา 2566',
    status: 'เสร็จสิ้น',
    curriculum: 13,
    subjects: 234,
    schedules: 234,
    conflicts: 0,
    members: [
      { id: '1', name: 'อ.สมชาย ใจดี', role: 'หัวหน้าโครงการ' },
      { id: '2', name: 'อ.สุดา มานะ', role: 'ที่ปรึกษา' },
      { id: '3', name: 'นายธีรพงษ์', role: 'นักพัฒนา' },
      { id: '4', name: 'นางสาวมาลี', role: 'ออกแบบ' },
      { id: '5', name: 'อ.วิชัย สมใจ', role: 'ผู้ตรวจสอบ' },
      { id: '6', name: 'นางสาวสิริ', role: 'เลขานุการ' }
    ],
    progress: 100,
    lastUpdated: '2 เดือนที่แล้ว',
    icon: 'check'
  },
  {
    id: '2566-1',
    title: 'ภาคการศึกษา 1/2566',
    description: 'ตารางเรียนตารางสอนภาคการศึกษาที่ 1 ปีการศึกษา 2566',
    status: 'เสร็จสิ้น',
    curriculum: 15,
    subjects: 267,
    schedules: 267,
    conflicts: 0,
    members: [
      { id: '1', name: 'อ.สมชาย ใจดี', role: 'หัวหน้าโครงการ' },
      { id: '2', name: 'อ.ประยุทธ มั่นคง', role: 'ที่ปรึกษา' },
      { id: '3', name: 'นายกิตติ', role: 'นักพัฒนา' },
      { id: '4', name: 'นางสาวปณิดา', role: 'ออกแบบ' },
      { id: '5', name: 'อ.วิชัย สมใจ', role: 'ผู้ตรวจสอบ' },
      { id: '6', name: 'นางสาวชนิดา', role: 'เลขานุการ' },
      { id: '7', name: 'นายสมศักดิ์', role: 'ผู้ช่วย' }
    ],
    progress: 100,
    lastUpdated: '6 เดือนที่แล้ว',
    icon: 'archive'
  }
];

export default function ProjectsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentFilter, setCurrentFilter] = useState('ทั้งหมด');
  const [filteredProjects, setFilteredProjects] = useState(projectsData);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Check for success message from create page
  useEffect(() => {
    if (searchParams.get('created') === 'true') {
      setShowSuccessToast(true);
      // Remove the query parameter
      router.replace('/projects', { scroll: false });
      
      // Hide toast after 5 seconds
      setTimeout(() => {
        setShowSuccessToast(false);
      }, 5000);
    }
  }, [searchParams, router]);

  // Filter projects based on search term and current filter
  useEffect(() => {
    let filtered = projectsData;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (currentFilter !== 'ทั้งหมด') {
      switch (currentFilter) {
        case 'กำลังดำเนินการ':
          filtered = filtered.filter(project => project.status === 'กำลังดำเนินการ');
          break;
        case 'เสร็จสิ้น':
          filtered = filtered.filter(project => project.status === 'เสร็จสิ้น');
          break;
      }
    }

    setFilteredProjects(filtered);
  }, [searchTerm, currentFilter]);

  const handleViewAllProjects = () => {
    router.push('/projects/all');
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('search-input')?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleProjectClick = (project: Project) => {
    console.log('Opening project:', project.id, project.title);
    alert(`กำลังเปิด Dashboard สำหรับ ${project.title}`);
  };

  const handleAddProject = () => {
    router.push('/projects/create');
  };

  const resetAllFilters = () => {
    setSearchTerm('');
    setCurrentFilter('ทั้งหมด');
  };

  const quickFilter = (term: string) => {
    setSearchTerm(term);
  };

  const getSectionTitle = () => {
    if (searchTerm && filteredProjects.length === 0) {
      return 'ไม่พบโครงการ';
    }
    if (searchTerm) {
      return 'ผลการค้นหา';
    }
    switch (currentFilter) {
      case 'กำลังดำเนินการ':
        return 'โครงการกำลังดำเนินการ';
      case 'เสร็จสิ้น':
        return 'โครงการที่เสร็จสิ้น';
      default:
        return 'โครงการทั้งหมด';
    }
  };

  const isFiltered = searchTerm.length > 0 || currentFilter !== 'ทั้งหมด';

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Navigation */}
      <Header />

      {/* Success Toast */}
      {showSuccessToast && (
        <motion.div
          className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
          </svg>
          <span>สร้างโครงการสำเร็จ!</span>
          <button
            onClick={() => setShowSuccessToast(false)}
            className="ml-2 text-white hover:text-gray-200"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
            </svg>
          </button>
        </motion.div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.h1
            className="text-4xl md:text-5xl font-bold text-blue-700 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            ระบบจัดตารางสอน
          </motion.h1>
          <motion.p
            className="text-lg text-slate-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            เลือกโปรเจกต์จัดตารางสอนตามภาคเรียนและปีการศึกษา
          </motion.p>
        </motion.div>

        <StatisticsSection />

        {/* Search Section */}
        <ProjectSearch 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          allProjects={projectsData}
        />

        {/* Projects Section */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 space-y-4 md:space-y-0">
            <h2 className="text-xl font-semibold text-slate-900">{getSectionTitle()}</h2>

            {/* Filter Section */}
            <ProjectFilters
              currentFilter={currentFilter}
              setCurrentFilter={setCurrentFilter}
              projectCount={filteredProjects.length}
              onReset={resetAllFilters}
              onQuickFilter={quickFilter}
              allProjects={projectsData}
            />
          </div>

          {/* Projects Grid */}
          <ProjectGrid
            projects={filteredProjects}
            onProjectClick={handleProjectClick}
            onAddProject={handleAddProject}
            showAddCard={true}
            isFiltered={isFiltered}
          />

          <ViewAllProjectsButton
            onClick={handleViewAllProjects}
            isFiltered={isFiltered}
          />
        </motion.div>
      </main>

      {/* Floating Action Button */}
      <motion.div
        className="fixed bottom-8 right-8 w-14 h-14 bg-blue-500 hover:bg-blue-600 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center cursor-pointer z-30 group"
        onClick={handleAddProject}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 1.5 }}
        whileHover={{
          scale: 1.1,
          boxShadow: "0 20px 30px -10px rgba(59, 130, 246, 0.3)"
        }}
        whileTap={{ scale: 0.9 }}
      >
        <motion.svg
          className="w-6 h-6 text-white"
          fill="currentColor"
          viewBox="0 0 20 20"
          whileHover={{ rotate: 90 }}
          transition={{ duration: 0.2 }}
        >
          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </motion.svg>
      </motion.div>

      {/* Footer */}
      <Footer />
    </div>
  );
}