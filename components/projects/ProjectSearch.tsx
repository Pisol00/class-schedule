import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Project } from './ProjectCard';

interface ProjectSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  allProjects?: Project[]; // เพิ่ม prop สำหรับสร้าง quick search terms
}

export default function ProjectSearch({ 
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
    <motion.div 
      className="mb-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
    >
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
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 hidden sm:flex items-center space-x-1 text-xs text-slate-400">
            <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-xs border">⌘K</kbd>
          </div>
        </div>
        
        {/* Quick Search Suggestions */}
        {searchTerm === '' && quickSearchTerms.length > 0 && (
          <motion.div 
            className="mt-3 flex items-center justify-center space-x-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <span className="text-xs text-slate-500">ค้นหาด่วน:</span>
            {quickSearchTerms.map((term: string, index: number) => (
              <motion.button
                key={term}
                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs rounded transition-colors"
                onClick={() => setSearchTerm(term)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + (index * 0.1) }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {term}
              </motion.button>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}