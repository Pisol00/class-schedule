import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Dropdown, { DropdownHeader, DropdownSection, DropdownItem } from '../ui/Dropdown';
import { Project } from './ProjectCard';

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

export default function ProjectFilters({
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
      <span className="text-sm text-slate-500">{projectCount} โครงการ</span>
      
      <div className="flex items-center space-x-2 flex-1 md:flex-none">
        {/* Filter Dropdown */}
        <Dropdown
          isOpen={showFilterDropdown}
          onClose={() => setShowFilterDropdown(false)}
          align="right"
          width="w-72"
          trigger={
            <motion.button 
              className="flex items-center justify-between px-4 py-2.5 border border-slate-300 rounded-lg bg-white hover:bg-slate-50 transition-colors w-full md:min-w-[140px]"
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.stopPropagation();
                setShowFilterDropdown(!showFilterDropdown);
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-sm font-medium text-slate-700">{currentFilter}</span>
              <motion.svg 
                className="w-4 h-4 text-slate-500 ml-2" 
                fill="currentColor" 
                viewBox="0 0 20 20"
                animate={{ rotate: showFilterDropdown ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
              </motion.svg>
            </motion.button>
          }
        >
          <DropdownHeader 
            title="กรองโครงการ" 
            subtitle="เลือกสถานะโครงการที่ต้องการดู" 
          />
          
          <DropdownSection title="สถานะ">
            {([
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
          
          {/* Quick Actions */}
          <div className="border-t border-slate-100 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {quickFilterTerms.map((term) => (
                  <motion.button 
                    key={term}
                    className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs rounded transition-colors"
                    onClick={() => {
                      onQuickFilter(term);
                      setShowFilterDropdown(false);
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {term}
                  </motion.button>
                ))}
              </div>
              <motion.button 
                className="px-2 py-1 text-xs text-slate-500 hover:text-slate-700 transition-colors"
                onClick={() => {
                  onReset();
                  setShowFilterDropdown(false);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                รีเซ็ต
              </motion.button>
            </div>
          </div>
        </Dropdown>
        
        {/* Quick Reset Button */}
        <motion.button 
          className="p-2.5 border border-slate-300 rounded-lg bg-white hover:bg-slate-50 transition-colors"
          title="รีเซ็ตตัวกรอง"
          onClick={onReset}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg className="w-4 h-4 text-slate-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"/>
          </svg>
        </motion.button>
      </div>
    </div>
  );
}