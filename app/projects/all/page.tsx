'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, Filter, SortAsc } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Dropdown, { DropdownHeader, DropdownSection, DropdownItem } from '@/components/ui/Dropdown';

// ใช้ interfaces เดียวกันกับหน้าหลัก
interface ProjectMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  status: 'กำลังดำเนินการ' | 'เสร็จสิ้น';
  curriculum: number;
  subjects: number;
  schedules: number;
  conflicts: number;
  members: ProjectMember[];
  progress: number;
  lastUpdated: string;
  icon: string;
}

// ข้อมูลโครงการทั้งหมด (รวมข้อมูลเดิม + เพิ่มข้อมูลใหม่)
const allProjectsData: Project[] = [
  // ข้อมูลเดิมจากหน้าหลัก
  {
    id: '2567-1',
    title: 'ภาคการศึกษา 1/2567',
    description: 'ตารางเรียนตารางสอน ภาคการศึกษาที่ 1 ปีการศึกษา 2567',
    status: 'กำลังดำเนินการ',
    curriculum: 15,
    subjects: 247,
    schedules: 189,
    conflicts: 12,
    members: [
      { id: '1', name: 'อ.สมชาย ใจดี', role: 'หัวหน้าโครงการ' },
      { id: '2', name: 'อ.สุดา มานะ', role: 'ที่ปรึกษา' },
      { id: '3', name: 'พิศลย์ อ.', role: 'นักพัฒนา' },
      { id: '4', name: 'ภัทร ภร จ.', role: 'ออกแบบ' },
      { id: '5', name: 'อ.วิชัย สมใจ', role: 'ผู้ตรวจสอบ' }
    ],
    progress: 77,
    lastUpdated: '2 ชั่วโมงที่แล้ว',
    icon: 'calendar'
  },
  {
    id: '2567-2',
    title: 'ภาคการศึกษา 2/2567',
    description: 'ตารางเรียนตารางสอน ภาคการศึกษาที่ 2 ปีการศึกษา 2567',
    status: 'กำลังดำเนินการ',
    curriculum: 11,
    subjects: 203,
    schedules: 45,
    conflicts: 0,
    members: [
      { id: '1', name: 'อ.สมชาย ใจดี', role: 'หัวหน้าโครงการ' },
      { id: '2', name: 'อ.สุดา มานะ', role: 'ที่ปรึกษา' }
    ],
    progress: 22,
    lastUpdated: '3 วันที่แล้ว',
    icon: 'calendar'
  },
  // ข้อมูลเสร็จสิ้น
  {
    id: '2566-3',
    title: 'ภาคการศึกษา 3/2566',
    description: 'ตารางเรียนตารางสอน ภาคฤดูร้อน ปีการศึกษา 2566',
    status: 'เสร็จสิ้น',
    curriculum: 11,
    subjects: 89,
    schedules: 89,
    conflicts: 0,
    members: [
      { id: '1', name: 'อ.สมชาย ใจดี', role: 'หัวหน้าโครงการ' },
      { id: '2', name: 'อ.ประยุทธ มั่นคง', role: 'ที่ปรึกษา' }
    ],
    progress: 100,
    lastUpdated: '1 สัปดาห์ที่แล้ว',
    icon: 'check'
  },
  {
    id: '2566-2',
    title: 'ภาคการศึกษา 2/2566',
    description: 'ตารางเรียนตารางสอน ภาคการศึกษาที่ 2 ปีการศึกษา 2566',
    status: 'เสร็จสิ้น',
    curriculum: 13,
    subjects: 234,
    schedules: 234,
    conflicts: 0,
    members: [
      { id: '1', name: 'อ.สมชาย ใจดี', role: 'หัวหน้าโครงการ' },
      { id: '2', name: 'อ.สุดา มานะ', role: 'ที่ปรึกษา' }
    ],
    progress: 100,
    lastUpdated: '2 เดือนที่แล้ว',
    icon: 'check'
  },
  {
    id: '2566-1',
    title: 'ภาคการศึกษา 1/2566',
    description: 'ตารางเรียนตารางสอน ภาคการศึกษาที่ 1 ปีการศึกษา 2566',
    status: 'เสร็จสิ้น',
    curriculum: 15,
    subjects: 267,
    schedules: 267,
    conflicts: 0,
    members: [
      { id: '1', name: 'อ.สมชาย ใจดี', role: 'หัวหน้าโครงการ' },
      { id: '2', name: 'อ.ประยุทธ มั่นคง', role: 'ที่ปรึกษา' }
    ],
    progress: 100,
    lastUpdated: '6 เดือนที่แล้ว',
    icon: 'archive'
  },
  // เพิ่มข้อมูลปีเก่า
  {
    id: '2565-2',
    title: 'ภาคการศึกษา 2/2565',
    description: 'ตารางเรียนตารางสอน ภาคการศึกษาที่ 2 ปีการศึกษา 2565',
    status: 'เสร็จสิ้น',
    curriculum: 12,
    subjects: 198,
    schedules: 198,
    conflicts: 0,
    members: [
      { id: '1', name: 'อ.ประยุทธ มั่นคง', role: 'หัวหน้าโครงการ' },
      { id: '2', name: 'อ.มาลี สีใส', role: 'ที่ปรึกษา' }
    ],
    progress: 100,
    lastUpdated: '8 เดือนที่แล้ว',
    icon: 'archive'
  },
  {
    id: '2565-1',
    title: 'ภาคการศึกษา 1/2565',
    description: 'ตารางเรียนตารางสอน ภาคการศึกษาที่ 1 ปีการศึกษา 2565',
    status: 'เสร็จสิ้น',
    curriculum: 14,
    subjects: 289,
    schedules: 289,
    conflicts: 0,
    members: [
      { id: '1', name: 'อ.ประยุทธ มั่นคง', role: 'หัวหน้าโครงการ' },
      { id: '2', name: 'อ.วิไล ศรีใส', role: 'ที่ปรึกษา' }
    ],
    progress: 100,
    lastUpdated: '1 ปีที่แล้ว',
    icon: 'archive'
  },
  {
    id: '2564-3',
    title: 'ภาคการศึกษา 3/2564',
    description: 'ตารางเรียนตารางสอน ภาคฤดูร้อน ปีการศึกษา 2564',
    status: 'เสร็จสิ้น',
    curriculum: 8,
    subjects: 67,
    schedules: 67,
    conflicts: 0,
    members: [
      { id: '1', name: 'อ.วิไล ศรีใส', role: 'หัวหน้าโครงการ' },
      { id: '2', name: 'อ.สันติ ปัญญา', role: 'ที่ปรึกษา' }
    ],
    progress: 100,
    lastUpdated: '1 ปีที่แล้ว',
    icon: 'archive'
  }
];

// Configuration สำหรับ ProjectCard (เหมือนหน้าหลัก)
const defaultConfig = {
  statusStyles: {
    'กำลังดำเนินการ': {
      coverBg: 'bg-green-500',
      progressBg: 'bg-green-100',
      progressFill: 'bg-gradient-to-r from-green-400 to-green-500',
      textColor: 'text-green-700'
    },
    'เสร็จสิ้น': {
      coverBg: 'bg-blue-500',
      progressBg: 'bg-blue-100',
      progressFill: 'bg-gradient-to-r from-blue-400 to-blue-500',
      textColor: 'text-blue-700'
    }
  },
  iconMap: {
    calendar: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
      </svg>
    ),
    check: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
    ),
    archive: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"/>
      </svg>
    )
  },
  memberAvatarColors: [
    'bg-blue-500 text-white',
    'bg-green-500 text-white', 
    'bg-purple-500 text-white',
    'bg-orange-500 text-white',
    'bg-pink-500 text-white',
    'bg-indigo-500 text-white',
    'bg-red-500 text-white',
    'bg-teal-500 text-white'
  ],
  showMembers: true,
  showLastUpdated: true,
  showConflicts: true
};

// Components (ใช้เดียวกันกับหน้าหลัก - ย่อๆ)
function ProgressBar({ schedules, subjects, status, index, statusStyles }: any) {
  const progressValue = subjects > 0 ? Math.round((schedules / subjects) * 100) : 0;
  const styles = statusStyles[status] || statusStyles['กำลังดำเนินการ'];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
          จัดตารางสอนแล้ว
        </span>
        <div className="flex items-center gap-1">
          <span className={`text-sm font-bold ${styles.textColor}`}>
            {schedules}
          </span>
          <span className="text-slate-400 text-sm">/</span>
          <span className="text-slate-600 text-sm font-medium">
            {subjects}
          </span>
          <span className={`text-xs ${styles.textColor} ml-1`}>
            ({progressValue}%)
          </span>
        </div>
      </div>
      
      <div className={`relative h-2 ${styles.progressBg} rounded-full overflow-hidden`}>
        <div 
          className={`h-full ${styles.progressFill} rounded-full relative overflow-hidden`}
          style={{ width: `${progressValue}%` }}
        >
          {status === 'กำลังดำเนินการ' && (
            <div className="absolute right-0 top-0 w-1 h-full bg-white/60 rounded-full" />
          )}
        </div>
      </div>
    </div>
  );
}

function StatsItemCompact({ icon, label, value, color }: any) {
  return (
    <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
        {icon}
      </div>
      <div>
        <div className="text-lg font-semibold text-slate-900">{value}</div>
        <div className="text-xs text-slate-600">{label}</div>
      </div>
    </div>
  );
}

function MembersSection({ members, colors, index }: any) {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider">ทีมงาน</h4>
        <span className="text-xs text-slate-500">{members.length} คน</span>
      </div>
      <div className="flex items-center -space-x-1.5">
        {members.slice(0, 5).map((member: any, memberIndex: number) => {
          const initials = member.name.split(' ').map((n: string) => n.charAt(0)).join('').substring(0, 2);
          const colorClass = colors[memberIndex % colors.length];
          
          return (
            <div
              key={member.id}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${colorClass} border-2 border-white shadow-sm hover:scale-110 transition-transform cursor-pointer`}
              title={`${member.name} - ${member.role}`}
              style={{ zIndex: 5 - memberIndex }}
            >
              {initials}
            </div>
          );
        })}
        
        {members.length > 5 && (
          <div
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-medium border-2 border-white shadow-sm hover:bg-slate-200 hover:scale-110 transition-all cursor-pointer"
            title={`และอีก ${members.length - 5} คน`}
            style={{ zIndex: 10 }}
          >
            +{members.length - 5}
          </div>
        )}
      </div>
    </div>
  );
}

function ProjectCard({ project, onClick, index = 0, config = {} }: any) {
  const finalConfig = { ...defaultConfig, ...config };
  const statusStyle = finalConfig.statusStyles[project.status];
  const projectIcon = finalConfig.iconMap[project.icon];

  return (
    <div 
      className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group hover:-translate-y-1.5"
      onClick={() => onClick?.(project)}
    >
      {/* Mini Cover Header */}
      <div className={`relative h-28 ${statusStyle.coverBg} overflow-hidden`}>
        <div className="absolute inset-0 opacity-15">
          <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id={`pattern-${project.id}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="1" fill="white" opacity="0.4"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#pattern-${project.id})`}/>
          </svg>
        </div>

        <div className="absolute inset-0 p-4 flex flex-col justify-center items-center text-center">
          <h3 className="text-lg font-bold text-white leading-tight tracking-wide drop-shadow-lg line-clamp-2">
            {project.title}
          </h3>
          
          <div className="absolute bottom-3 right-3">
            <div className="text-white/80 text-xs font-medium bg-white/10 px-2 py-1 rounded-full backdrop-blur-sm">
              {project.lastUpdated}
            </div>
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-15 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-500" style={{ width: '40%' }} />
      </div>

      <div className="p-5">
        <div className="mb-5">
          <p className="text-sm text-slate-600 leading-relaxed line-clamp-2 mb-4">
            {project.description}
          </p>
          
          <ProgressBar 
            schedules={project.schedules}
            subjects={project.subjects} 
            status={project.status}
            index={index}
            statusStyles={finalConfig.statusStyles}
          />
        </div>

        <div className="mb-5">
          <div className="grid grid-cols-2 gap-3">
            <StatsItemCompact
              icon={
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.669 0-3.218.51-4.5 1.385V4.804z"/>
                </svg>
              }
              label="หลักสูตร"
              value={project.curriculum}
              color="text-blue-600 bg-blue-50"
            />
            <StatsItemCompact
              icon={
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.669 0-3.218.51-4.5 1.385V4.804z"/>
                </svg>
              }
              label="รายวิชา"
              value={project.subjects}
              color="text-blue-600 bg-blue-50"
            />
            <StatsItemCompact
              icon={
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                </svg>
              }
              label="ตารางสอน"
              value={project.schedules}
              color="text-green-600 bg-green-50"
            />
            <StatsItemCompact
              icon={
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                </svg>
              }
              label="ความขัดแย้ง"
              value={project.conflicts}
              color={project.conflicts > 0 ? "text-red-600 bg-red-50" : "text-slate-600 bg-slate-50"}
            />
          </div>
        </div>

        <MembersSection 
          members={project.members}
          colors={finalConfig.memberAvatarColors}
          index={index}
        />

        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <button 
            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1 hover:translate-x-0.5 transition-transform"
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation();
              alert(`เปิดรายละเอียด ${project.title}`);
            }}
          >
            <span>ดูรายละเอียด</span>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
          
          <button 
            className="p-1.5 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors hover:scale-110"
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation();
              alert(`แก้ไข ${project.title}`);
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// Main Component
export default function AllProjectsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [currentFilter, setCurrentFilter] = useState('ทั้งหมด');
  const [sortBy, setSortBy] = useState('ล่าสุด');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  
  const itemsPerPage = 12;

  // Filter และ Sort ข้อมูล
  const filteredAndSortedProjects = useMemo(() => {
    let filtered = allProjectsData;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.members.some(member => 
          member.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
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
        case '2567':
          filtered = filtered.filter(project => project.title.includes('2567'));
          break;
        case '2566':
          filtered = filtered.filter(project => project.title.includes('2566'));
          break;
        case '2565':
          filtered = filtered.filter(project => project.title.includes('2565'));
          break;
      }
    }

    // Apply sorting
    switch (sortBy) {
      case 'ล่าสุด':
        filtered.sort((a, b) => {
          // Simple sorting by ID (newer IDs first)
          return b.id.localeCompare(a.id);
        });
        break;
      case 'เก่าสุด':
        filtered.sort((a, b) => a.id.localeCompare(b.id));
        break;
      case 'ชื่อ A-Z':
        filtered.sort((a, b) => a.title.localeCompare(b.title, 'th'));
        break;
      case 'ชื่อ Z-A':
        filtered.sort((a, b) => b.title.localeCompare(a.title, 'th'));
        break;
      case 'ความคืบหน้า':
        filtered.sort((a, b) => b.progress - a.progress);
        break;
    }

    return filtered;
  }, [searchTerm, currentFilter, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedProjects.length / itemsPerPage);
  const currentProjects = filteredAndSortedProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleProjectClick = (project: Project) => {
    console.log('Opening project:', project.id, project.title);
    alert(`กำลังเปิด Dashboard สำหรับ ${project.title}`);
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  const resetFilters = () => {
    setSearchTerm('');
    setCurrentFilter('ทั้งหมด');
    setSortBy('ล่าสุด');
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb & Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBackToHome}
              className="flex items-center text-slate-600 hover:text-blue-600 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              <span className="font-medium">กลับ</span>
            </button>
            <div className="text-slate-400">/</div>
            <h1 className="text-2xl font-bold text-slate-900">โครงการทั้งหมด</h1>
          </div>
        </div>
        {/* Search Bar */}
        <div className="mb-8">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              </div>
              <input 
                type="text" 
                placeholder="ค้นหาตามภาคการศึกษา ปีการศึกษา หรือชื่อโครงการ..." 
                className="w-full pl-12 pr-16 py-3.5 border border-slate-200 rounded-2xl text-slate-700 placeholder-slate-400 bg-white text-base shadow-sm focus:shadow-md focus:border-blue-500 transition-all focus:outline-none focus:ring-2 focus:ring-blue-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Filter & Controls */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-end mb-8 space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4 w-full lg:w-auto justify-end">
            {/* Filter Dropdown */}
            <Dropdown
              isOpen={showFilterDropdown}
              onClose={() => setShowFilterDropdown(false)}
              align="right"
              width="w-64"
              trigger={
                <button 
                  className="flex items-center justify-between px-4 py-2.5 border border-slate-300 rounded-lg bg-white hover:bg-slate-50 transition-colors min-w-[140px] hover:scale-105"
                  onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                >
                  <div className="flex items-center">
                    <Filter className="w-4 h-4 mr-2 text-slate-500" />
                    <span className="text-sm font-medium text-slate-700">{currentFilter}</span>
                  </div>
                  <svg className={`w-4 h-4 text-slate-500 ml-2 transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
                  </svg>
                </button>
              }
            >
              <DropdownHeader title="กรองโครงการ" subtitle="เลือกหมวดหมู่ที่ต้องการดู" />
              
              <DropdownSection title="สถานะ">
                {[
                  ['ทั้งหมด', filteredAndSortedProjects.length],
                  ['กำลังดำเนินการ', allProjectsData.filter(p => p.status === 'กำลังดำเนินการ').length],
                  ['เสร็จสิ้น', allProjectsData.filter(p => p.status === 'เสร็จสิ้น').length]
                ].map(([filter, count]) => (
                  <DropdownItem
                    key={filter as string}
                    icon={<div className={`w-2 h-2 rounded-full ${
                      filter === 'กำลังดำเนินการ' ? 'bg-green-400' : 
                      filter === 'เสร็จสิ้น' ? 'bg-blue-400' : 'bg-slate-400'
                    }`} />}
                    label={filter as string}
                    badge={`${count} โครงการ`}
                    onClick={() => {
                      setCurrentFilter(filter as string);
                      setCurrentPage(1);
                      setShowFilterDropdown(false);
                    }}
                  />
                ))}
              </DropdownSection>

              <DropdownSection title="ปีการศึกษา">
                {['2567', '2566', '2565'].map((year) => (
                  <DropdownItem
                    key={year}
                    icon={<div className="w-2 h-2 rounded-full bg-purple-400" />}
                    label={`ปีการศึกษา ${year}`}
                    badge={`${allProjectsData.filter(p => p.title.includes(year)).length} โครงการ`}
                    onClick={() => {
                      setCurrentFilter(year);
                      setCurrentPage(1);
                      setShowFilterDropdown(false);
                    }}
                  />
                ))}
              </DropdownSection>
            </Dropdown>

            

            {/* Reset Button */}
            <button 
              className="p-2.5 border border-slate-300 rounded-lg bg-white hover:bg-slate-50 transition-colors hover:scale-105"
              title="รีเซ็ตตัวกรอง"
              onClick={resetFilters}
            >
              <svg className="w-4 h-4 text-slate-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Projects Grid */}
        {currentProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {currentProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={handleProjectClick}
                index={index}
                config={defaultConfig}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            
            <h3 className="text-xl font-medium text-slate-600 mb-2">
              ไม่พบโครงการ
            </h3>
            
            <p className="text-slate-500 mb-6">
              ลองเปลี่ยนคำค้นหาหรือตัวกรอง
            </p>

            <button
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg hover:scale-105"
              onClick={resetFilters}
            >
              รีเซ็ตตัวกรอง
            </button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-500">
              แสดง {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredAndSortedProjects.length)} 
              จาก {filteredAndSortedProjects.length} รายการ
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                className="px-4 py-2 border border-slate-300 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium hover:scale-105"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                ก่อนหน้า
              </button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors hover:scale-105 ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border border-slate-300 hover:bg-slate-50'
                      }`}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                className="px-4 py-2 border border-slate-300 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium hover:scale-105"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                ถัดไป
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}