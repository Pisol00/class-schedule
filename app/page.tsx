'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Users, ChevronRight } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Dropdown, { DropdownHeader, DropdownSection, DropdownItem } from '@/components/ui/Dropdown';
// AddProjectCard is now defined inline

// ============================================================================
// INTERFACES & TYPES
// ============================================================================

export interface ProjectMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  status: 'กำลังดำเนินการ' | 'เสร็จสิ้น'; // เหลือแค่ 2 สถานะ
  curriculum: number;
  subjects: number;
  schedules: number;
  conflicts: number;
  members: ProjectMember[];
  progress: number;
  lastUpdated: string;
  icon: string;
}

interface ProjectCardProps {
  project: Project;
  onClick?: (project: Project) => void;
  index?: number;
  config?: ProjectCardConfig;
}

// Configuration สำหรับ ProjectCard
interface ProjectCardConfig {
  statusStyles?: StatusStyleMap;
  iconMap?: IconMap;
  memberAvatarColors?: string[];
  showMembers?: boolean;
  showLastUpdated?: boolean;
  showConflicts?: boolean;
}

// Status styles configuration
interface StatusStyle {
  coverBg: string;
  progressBg: string;
  progressFill: string;
  textColor: string;
}

interface StatusStyleMap {
  [key: string]: StatusStyle;
}

// Icon mapping configuration  
interface IconMap {
  [key: string]: React.ReactNode;
}

interface FilterCount {
  [key: string]: number;
}

interface ProjectFiltersProps {
  currentFilter: string;
  setCurrentFilter: (filter: string) => void;
  projectCount: number;
  onReset: () => void;
  onQuickFilter: (term: string) => void;
  allProjects?: Project[];
  recentProjectIds?: string[];
}

interface ProjectGridProps {
  projects: Project[];
  onProjectClick: (project: Project) => void;
  onAddProject?: () => void;
  showAddCard?: boolean;
  cardConfig?: any;
  isFiltered?: boolean;
}

interface ProjectSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  allProjects?: Project[];
}

interface ViewAllProjectsButtonProps {
  onClick: () => void;
  isFiltered?: boolean;
}

// ============================================================================
// CONFIGURATIONS & CONSTANTS
// ============================================================================

// Default configuration
const defaultConfig: Required<ProjectCardConfig> = {
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
  showLastUpdated: false,
  showConflicts: true
};

// Demo data
const projectsData: Project[] = [
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
    description: 'ตารางเรียนตารางสอน ภาคการศึกษาที่ 2 ปีการศึกษา 2567',
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
    description: 'ตารางเรียนตารางสอน ภาคฤดูร้อน ปีการศึกษา 2566',
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
    description: 'ตารางเรียนตารางสอน ภาคการศึกษาที่ 2 ปีการศึกษา 2566',
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
    description: 'ตารางเรียนตารางสอน ภาคการศึกษาที่ 1 ปีการศึกษา 2566',
    status: 'เสร็จสิ้น',
    curriculum: 15,
    subjects: 267,
    schedules: 267,
    conflicts: 0,
    members: [
      { id: '1', name: 'อ.สมชาย ใจดี', role: 'หัวหน้าโครงการ' },
      { id: '2', name: 'อ.ประยุทธ มั่นคง', role: 'ที่ปรึกษา' },
      { id: '3', name: 'นายกิตติ', role: 'นักพัฒนา' },
      { id: '4', name: 'นางสาวปดิดา', role: 'ออกแบบ' },
      { id: '5', name: 'อ.วิชัย สมใจ', role: 'ผู้ตรวจสอบ' },
      { id: '6', name: 'นางสาวชนิดา', role: 'เลขานุการ' },
      { id: '7', name: 'นายสมศักดิ์', role: 'ผู้ช่วย' }
    ],
    progress: 100,
    lastUpdated: '6 เดือนที่แล้ว',
    icon: 'archive'
  }
];

// ============================================================================
// UTILITY COMPONENTS
// ============================================================================

// Progress Bar Component
interface ProgressBarProps {
  schedules: number;
  subjects: number;
  status: Project['status'];
  index: number;
  statusStyles: StatusStyleMap;
}

function ProgressBar({ schedules, subjects, status, index, statusStyles }: ProgressBarProps) {
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

// Stats Item Compact Component
interface StatsItemCompactProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}

function StatsItemCompact({ icon, label, value, color }: StatsItemCompactProps) {
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

// Members Section Component
interface MembersSectionProps {
  members: ProjectMember[];
  colors: string[];
  index: number;
}

function MembersSection({ members, colors, index }: MembersSectionProps) {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider">ทีมงาน</h4>
        <span className="text-xs text-slate-500">{members.length} คน</span>
      </div>
      <div className="flex items-center -space-x-1.5">
        {members.slice(0, 5).map((member, memberIndex) => {
          const initials = member.name.split(' ').map(n => n.charAt(0)).join('').substring(0, 2);
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

// ============================================================================
// MAIN COMPONENTS
// ============================================================================

// Add Project Card Component
interface AddProjectCardProps {
  onClick: () => void;
}

function AddProjectCard({ onClick }: AddProjectCardProps) {
  return (
    <div 
      className="bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-dashed border-slate-300 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-300 hover:bg-gradient-to-br hover:from-blue-50 hover:to-blue-100 transition-all duration-300 group h-full min-h-[320px] hover:scale-105"
      onClick={onClick}
    >
      <div className="mb-4 text-slate-400 group-hover:text-blue-500 transition-colors">
        <svg 
          className="w-16 h-16" 
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
        </svg>
      </div>
      
      <h3 className="text-lg font-semibold text-slate-700 group-hover:text-blue-600 mb-2 transition-colors">
        สร้างโครงการใหม่
      </h3>
      
      <p className="text-sm text-slate-500 group-hover:text-blue-500 transition-colors">
        เริ่มต้นภาคการศึกษาใหม่
      </p>
    </div>
  );
}

// Statistics Section Component
function StatisticsSection() {
  const statisticsData = [
    {
      title: 'จำนวนหลักสูตร',
      value: '20'
    },
    {
      title: 'จำนวนรายวิชา',
      value: '120'
    },
    {
      title: 'จำนวนอาจารย์',
      value: '55'
    },
    {
      title: 'จำนวนห้องเรียน',
      value: '112'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto mb-12">
      {statisticsData.map((stat, index) => (
        <div
          key={stat.title}
          className="bg-blue-50 rounded-2xl p-6 flex items-center justify-between hover:scale-105 transition-transform duration-200"
        >
          {/* Left side - Text content */}
          <div className="flex-1">
            <h3 className="text-sm font-medium text-slate-600 mb-1 leading-tight">
              {stat.title}
            </h3>
            <p className="text-3xl font-bold text-blue-700">
              {stat.value}
            </p>
          </div>
          
          {/* Right side - Icon */}
          <div className="ml-4 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
            <Users className="w-6 h-6 text-white" strokeWidth={2} />
          </div>
        </div>
      ))}
    </div>
  );
}

// Project Search Component
function ProjectSearch({ 
  searchTerm, 
  setSearchTerm, 
  allProjects = [] 
}: ProjectSearchProps) {
  
  // สร้าง quick search terms จาก projects จริง
  const quickSearchTerms = useMemo(() => {
    // ถ้าไม่มี allProjects ให้ใช้ default terms
    if (!allProjects || allProjects.length === 0) {
      return ['2567'];
    }

    const terms = new Set<string>();
    
    allProjects.forEach((project: Project) => {
      // เพิ่มปีการศึกษาที่พบ
      const yearMatch: RegExpMatchArray | null = project.title.match(/(\d{4})/);
      if (yearMatch && yearMatch[1]) {
        terms.add(yearMatch[1]);
      }
      
      // เพิ่มภาคการศึกษาที่พบ (1, 2, 3)
      const semesterMatch: RegExpMatchArray | null = project.title.match(/(\d)\/\d{4}/);
      if (semesterMatch && semesterMatch[1]) {
        terms.add(`ภาค ${semesterMatch[1]}`);
      }
    });
    
    // เรียงลำดับและจำกัดจำนวน
    return Array.from(terms).sort().slice(0, 3);
  }, [allProjects]);

  return (
    <div className="mb-10">
      <div className="max-w-2xl mx-auto mb-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
            <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </div>
          <input 
            id="search-input"
            type="text" 
            placeholder="ค้นหาตามภาคการศึกษา ปีการศึกษา หรือชื่อโครงการ..." 
            className="w-full pl-12 pr-16 py-3.5 border border-slate-200 rounded-2xl text-slate-700 placeholder-slate-400 bg-white text-base shadow-sm focus:shadow-md focus:border-blue-500 transition-all focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

// Project Filters Component
function ProjectFilters({
  currentFilter,
  setCurrentFilter,
  projectCount,
  onReset,
  onQuickFilter,
  allProjects = [], // เพิ่ม default value
  recentProjectIds = []
}: ProjectFiltersProps) {
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // คำนวณจำนวนโครงการในแต่ละสถานะ
  const filterCounts: FilterCount = useMemo(() => {
    if (!allProjects || allProjects.length === 0) {
      return {
        'กำลังดำเนินการ': 0,
        'เสร็จสิ้น': 0
      };
    }

    return {
      'กำลังดำเนินการ': allProjects.filter(project => 
        project.status === 'กำลังดำเนินการ'
      ).length,
      'เสร็จสิ้น': allProjects.filter(project => 
        project.status === 'เสร็จสิ้น'
      ).length
    };
  }, [allProjects, projectCount]);

  const handleFilterSelect = (filter: string) => {
    setCurrentFilter(filter);
    setShowFilterDropdown(false);
  };

  // สร้าง quick filter terms จาก projects จริง
  const quickFilterTerms = useMemo(() => {
    // ถ้าไม่มี allProjects ให้ใช้ default terms
    if (!allProjects || allProjects.length === 0) {
      return ['2567'];
    }

    const terms = new Set<string>();
    
    allProjects.forEach((project: Project) => {
      // เพิ่มปีการศึกษาที่พบ
      const yearMatch: RegExpMatchArray | null = project.title.match(/(\d{4})/);
      if (yearMatch && yearMatch[1]) {
        terms.add(yearMatch[1]);
      }
    });
    
    return Array.from(terms).sort().slice(0, 3); // จำกัดไว้ 3 terms
  }, [allProjects]);

  return (
    <div className="flex items-center space-x-4 w-full md:w-auto">

      
      <div className="flex items-center space-x-2 flex-1 md:flex-none">
{/* Filter Dropdown */}
        <Dropdown
          isOpen={showFilterDropdown}
          onClose={() => setShowFilterDropdown(false)}
          align="right"
          width="w-72"
          trigger={
            <button 
              className="flex items-center justify-between px-4 py-2.5 border border-slate-300 rounded-lg bg-white hover:bg-slate-50 transition-colors w-full md:min-w-[140px] hover:scale-105"
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation();
                setShowFilterDropdown(!showFilterDropdown);
              }}
            >
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
                </svg>
                <span className="text-sm font-medium text-slate-700">{currentFilter}</span>
              </div>
              <svg 
                className={`w-4 h-4 text-slate-500 ml-2 transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`}
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
              </svg>
            </button>
          }
        >
          <DropdownHeader 
            title="กรองโครงการ" 
            subtitle="เลือกหมวดหมู่ที่ต้องการดู" 
          />
          
          <DropdownSection title="สถานะ">
            {([
              ['ทั้งหมด', allProjects?.length || 0, 'bg-slate-400'],
              ['กำลังดำเนินการ', filterCounts['กำลังดำเนินการ'], 'bg-green-400'],
              ['เสร็จสิ้น', filterCounts['เสร็จสิ้น'], 'bg-blue-400']
            ] as const).map(([filter, count, dotColor]) => (
              <DropdownItem
                key={filter}
                icon={<div className={`w-2 h-2 rounded-full ${dotColor}`} />}
                label={filter}
                badge={`${count} โครงการ`}
                onClick={() => handleFilterSelect(filter)}
              />
            ))}
          </DropdownSection>

          <DropdownSection title="ปีการศึกษา">
            {quickFilterTerms.filter(term => term.match(/^\d{4}$/)).map((year) => (
              <DropdownItem
                key={year}
                icon={<div className="w-2 h-2 rounded-full bg-purple-400" />}
                label={`ปีการศึกษา ${year}`}
                badge={`${allProjects?.filter(p => p.title.includes(year)).length || 0} โครงการ`}
                onClick={() => {
                  onQuickFilter(year);
                  setShowFilterDropdown(false);
                }}
              />
            ))}
          </DropdownSection>
          

        </Dropdown>
        
        {/* Quick Reset Button */}
        <button 
          className="p-2.5 border border-slate-300 rounded-lg bg-white hover:bg-slate-50 transition-colors hover:scale-105"
          title="รีเซ็ตตัวกรอง"
          onClick={onReset}
        >
          <svg className="w-4 h-4 text-slate-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

// Project Card Component
function ProjectCard({ 
  project, 
  onClick, 
  index = 0, 
  config = {} 
}: ProjectCardProps) {
  // Merge config with defaults
  const finalConfig = {
    ...defaultConfig,
    ...config,
    statusStyles: { ...defaultConfig.statusStyles, ...config.statusStyles },
    iconMap: { ...defaultConfig.iconMap, ...config.iconMap }
  };

  const statusStyle = finalConfig.statusStyles[project.status] || finalConfig.statusStyles['กำลังดำเนินการ'];
  const projectIcon = finalConfig.iconMap[project.icon] || finalConfig.iconMap['calendar'];

  return (
    <div 
      className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group hover:-translate-y-1.5"
      onClick={() => onClick?.(project)}
    >
      {/* Mini Cover Header */}
      <div className={`relative h-28 ${statusStyle.coverBg} overflow-hidden`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-15">
          <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id={`pattern-${project.id}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="1" fill="white" opacity="0.4"/>
                <circle cx="0" cy="0" r="0.5" fill="white" opacity="0.2"/>
                <circle cx="20" cy="20" r="0.5" fill="white" opacity="0.2"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#pattern-${project.id})`}/>
          </svg>
        </div>

        {/* Content Overlay */}
        <div className="absolute inset-0 p-4 flex flex-col justify-center items-center text-center">
          <h3 className="text-lg font-bold text-white leading-tight tracking-wide drop-shadow-lg line-clamp-2 group-hover:text-white/90 transition-colors">
            {project.title}
          </h3>
          
          {/* Last Updated - Show only if enabled */}
          {finalConfig.showLastUpdated && (
            <div className="absolute bottom-3 right-3">
              <div className="text-white/80 text-xs font-medium bg-white/10 px-2 py-1 rounded-full backdrop-blur-sm">
                {project.lastUpdated}
              </div>
            </div>
          )}
        </div>

        {/* Shine Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-15 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-500" style={{ width: '40%' }} />
      </div>

      <div className="p-5">
        {/* Project Description & Progress */}
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

        {/* Stats Grid */}
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
            {finalConfig.showConflicts && (
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
            )}
          </div>
        </div>

        {/* Members Section - Show only if enabled */}
        {finalConfig.showMembers && (
          <MembersSection 
            members={project.members}
            colors={finalConfig.memberAvatarColors}
            index={index}
          />
        )}

        {/* Quick Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <button 
            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1 hover:translate-x-0.5 transition-transform"
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation();
              alert(`เปิดรายละเอียด ${project.title}`);
            }}
          >
            <span>ดูรายละเอียด</span>
            <svg className="w-3 h-3 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// Project Grid Component
function ProjectGrid({ 
  projects, 
  onProjectClick, 
  onAddProject,
  showAddCard = true,
  cardConfig,
  isFiltered = false
}: ProjectGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Add New Project Card - แสดงเฉพาะเมื่อมี onAddProject และ showAddCard และมีโครงการอยู่ และไม่มีการ filter/search */}
      {onAddProject && showAddCard && projects.length > 0 && !isFiltered && (
        <AddProjectCard onClick={onAddProject} />
      )}
      
      {/* Project Cards */}
      {projects.map((project, index) => (
        <ProjectCard
          key={project.id}
          project={project}
          onClick={onProjectClick}
          index={index}
          config={cardConfig}
        />
      ))}

      {/* Empty State - แสดงเมื่อไม่มีโครงการ */}
      {projects.length === 0 && (
        <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
            <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          
          <h3 className="text-xl font-medium text-slate-600 mb-2">
            ไม่พบโครงการ
          </h3>
          
          <p className="text-slate-500 mb-6 max-w-md">
            {isFiltered 
              ? "ลองเปลี่ยนคำค้นหาหรือตัวกรอง" 
              : "ลองเปลี่ยนคำค้นหาหรือตัวกรอง หรือสร้างโครงการใหม่"
            }
          </p>

          {/* Show Create Button in Empty State - เฉพาะเมื่อไม่มีการ filter/search */}
          {onAddProject && !isFiltered && (
            <button
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg hover:scale-105"
              onClick={onAddProject}
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
              </svg>
              สร้างโครงการใหม่
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// View All Projects Button Component
function ViewAllProjectsButton({ onClick, isFiltered = false }: ViewAllProjectsButtonProps) {
  // ซ่อนปุ่มเมื่อมีการ filter
  if (isFiltered) {
    return null;
  }

  return (
    <div className="flex justify-center mt-8 mb-4">
      <button
        className="group relative inline-flex items-center px-8 py-4 border border-blue-600/10 rounded-2xl text-blue-700 font-semibold hover:from-blue-100 hover:to-blue-150 hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-lg overflow-hidden cursor-pointer hover:scale-105 hover:-translate-y-0.5"
        onClick={onClick}
      >
        {/* Background Animation */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Content */}
        <div className="relative flex items-center">
          <span className="mr-2">ดูเพิ่มเติมทั้งหมด</span>
          <div className="ml-3 group-hover:translate-x-1 transition-transform duration-300">
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 w-full" />
      </button>
    </div>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

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
        return 'โครงการที่สร้างล่าสุด';
    }
  };

  const isFiltered = searchTerm.length > 0 || currentFilter !== 'ทั้งหมด';

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Navigation */}
      <Header />

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2">
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
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-700 mb-4">
            ระบบจัดตารางสอน
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            เลือกโปรเจคจัดตารางสอนตามภาคเรียนและปีการศึกษา
          </p>
        </div>

        <StatisticsSection />

        {/* Search Section */}
        <ProjectSearch 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          allProjects={projectsData}
        />

        {/* Projects Section */}
        <div className="mb-8">
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
        </div>
      </main>

      {/* Floating Action Button */}
      <div
        className="fixed bottom-8 right-8 w-14 h-14 bg-blue-500 hover:bg-blue-600 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center cursor-pointer z-30 group"
        onClick={handleAddProject}
      >
        <svg
          className="w-6 h-6 text-white"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}