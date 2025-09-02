import { motion } from 'framer-motion';

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
  showMembers: true, // เปลี่ยนเป็น true เป็นค่า default
  showLastUpdated: false,
  showConflicts: true
};

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
    <motion.div 
      className="space-y-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + (index * 0.1) }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
          จัดตารางสอนแล้ว
        </span>
        <motion.div 
          className="flex items-center gap-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 + (index * 0.1) }}
        >
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
        </motion.div>
      </div>
      
      <div className={`relative h-2 ${styles.progressBg} rounded-full overflow-hidden`}>
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1 + (index * 0.2)
          }}
        />
        
        <motion.div 
          className={`h-full ${styles.progressFill} rounded-full relative overflow-hidden`}
          initial={{ width: "0%" }}
          animate={{ width: `${progressValue}%` }}
          transition={{ 
            duration: 1.2,
            delay: 0.5 + (index * 0.1),
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
        >
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.5 + (index * 0.3)
            }}
          />
          
          {status === 'กำลังดำเนินการ' && (
            <motion.div 
              className="absolute right-0 top-0 w-1 h-full bg-white/60 rounded-full"
              animate={{ 
                opacity: [0.5, 1, 0.5],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}
        </motion.div>
      </div>
    </motion.div>
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
            <motion.div
              key={member.id}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${colorClass} border-2 border-white shadow-sm relative z-${5-memberIndex}`}
              title={`${member.name} - ${member.role}`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.3 + (memberIndex * 0.1) }}
              whileHover={{ scale: 1.2, zIndex: 10 }}
            >
              {initials}
            </motion.div>
          );
        })}
        
        {members.length > 5 && (
          <motion.div
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-medium border-2 border-white shadow-sm hover:bg-slate-200 transition-colors"
            title={`และอีก ${members.length - 5} คน`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.8 }}
            whileHover={{ scale: 1.2, zIndex: 10 }}
          >
            +{members.length - 5}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function ProjectCard({ 
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
    <motion.div 
      className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group"
      onClick={() => onClick?.(project)}
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      transition={{ duration: 0.4, delay: 0.9 + (index * 0.1) }}
      whileHover={{ 
        y: -6,
        boxShadow: "0 25px 50px -10px rgba(0, 0, 0, 0.2)"
      }}
      layout
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
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-15 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-500"
          style={{ width: '40%' }}
        />
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
          <motion.button 
            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1"
            whileHover={{ x: 2 }}
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation();
              alert(`เปิดรายละเอียด ${project.title}`);
            }}
          >
            <span>ดูรายละเอียด</span>
            <svg className="w-3 h-3 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
            </svg>
          </motion.button>
          
          <motion.button 
            className="p-1.5 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation();
              alert(`แก้ไข ${project.title}`);
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
            </svg>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}