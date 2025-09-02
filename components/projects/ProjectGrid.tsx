import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';
import ProjectCard, { Project } from './ProjectCard';
import AddProjectCard from './AddProjectCard';

interface ProjectGridProps {
  projects: Project[];
  onProjectClick: (project: Project) => void;
  onAddProject?: () => void; // ทำให้เป็น optional
  showAddCard?: boolean;
  cardConfig?: any; // เพิ่ม cardConfig prop
  isFiltered?: boolean; // เพิ่ม prop สำหรับตรวจสอบการ filter/search
}

export default function ProjectGrid({ 
  projects, 
  onProjectClick, 
  onAddProject,
  showAddCard = true,
  cardConfig, // เพิ่มพารามิเตอร์นี้
  isFiltered = false // เพิ่มพารามิเตอร์นี้
}: ProjectGridProps) {
  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.7 }}
    >
      {/* Add New Project Card - แสดงเฉพาะเมื่อมี onAddProject และ showAddCard และมีโครงการอยู่ และไม่มีการ filter/search */}
      {onAddProject && showAddCard && projects.length > 0 && !isFiltered && (
        <AddProjectCard onClick={onAddProject} />
      )}
      
      {/* Project Cards */}
      <AnimatePresence>
        {projects.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            onClick={onProjectClick}
            index={index}
            config={cardConfig} // ส่ง config ไปให้ ProjectCard
          />
        ))}
      </AnimatePresence>

      {/* Empty State - แสดงเมื่อไม่มีโครงการ */}
      {projects.length === 0 && (
        <motion.div 
          className="col-span-full flex flex-col items-center justify-center py-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </motion.div>
          
          <motion.h3 
            className="text-xl font-medium text-slate-600 mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            ไม่พบโครงการ
          </motion.h3>
          
          <motion.p 
            className="text-slate-500 mb-6 max-w-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {isFiltered 
              ? "ลองเปลี่ยนคำค้นหาหรือตัวกรอง" 
              : "ลองเปลี่ยนคำค้นหาหรือตัวกรอง หรือสร้างโครงการใหม่"
            }
          </motion.p>

          {/* Show Create Button in Empty State - เฉพาะเมื่อไม่มีการ filter/search */}
          {onAddProject && !isFiltered && (
            <motion.button
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
              onClick={onAddProject}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
              </svg>
              สร้างโครงการใหม่
            </motion.button>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}