"use client";
import React, { createContext, useContext, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  BookOpen, Users, School, GraduationCap, Calendar, Shield, 
  FileOutput, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, LayoutDashboard
} from 'lucide-react';

// ===== TYPES =====
interface MenuItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  href?: string;
  subItems?: SubMenuItem[];
  category: string;
}

interface SubMenuItem {
  id: string;
  label: string;
  href: string;
}

interface User {
  name: string;
  role: string;
  initials: string;
}

interface SidebarContextType {
  isCollapsed: boolean;
  toggleCollapsed: () => void;
  expandedItems: Set<string>;
  toggleExpanded: (itemId: string) => void;
  activePath: string;
}

// ===== CONTEXT =====
const SidebarContext = createContext<SidebarContextType | null>(null);

const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within SidebarProvider');
  }
  return context;
};

// ===== CONFIGURATION =====
const SIDEBAR_CONFIG = {
  CATEGORIES: {
    OVERVIEW: 'ภาพรวมโปรเจกต์',
    DATA: 'จัดการข้อมูล',
    SCHEDULE: 'ตารางสอน',
    SETTINGS: 'การตั้งค่า'
  },
  ANIMATION: {
    COLLAPSE: 'duration-300',
    EXPAND: 'duration-200'
  },
  SIZES: {
    COLLAPSED: 'w-16',
    EXPANDED: 'w-64',
    LOGO: { collapsed: 32, expanded: 80 }
  }
} as const;

const MENU_DATA: MenuItem[] = [
  {
    id: 'dashboard',
    icon: <LayoutDashboard size={20} />,
    label: 'ภาพรวมโปรเจกต์',
    href: '/dashboard',
    category: SIDEBAR_CONFIG.CATEGORIES.OVERVIEW
  },
  {
    id: 'curriculum',
    icon: <BookOpen size={20} />,
    label: 'หลักสูตร',
    href: '/curriculum',
    category: SIDEBAR_CONFIG.CATEGORIES.DATA
  },
  {
    id: 'subjects',
    icon: <BookOpen size={20} />,
    label: 'รายวิชา',
    href: '/subjects',
    category: SIDEBAR_CONFIG.CATEGORIES.DATA
  },
  {
    id: 'instructors',
    icon: <Users size={20} />,
    label: 'อาจารย์ผู้สอน',
    href: '/instructors',
    category: SIDEBAR_CONFIG.CATEGORIES.DATA
  },
  {
    id: 'classrooms',
    icon: <School size={20} />,
    label: 'ห้องเรียน',
    href: '/classrooms',
    category: SIDEBAR_CONFIG.CATEGORIES.DATA
  },
  {
    id: 'students',
    icon: <GraduationCap size={20} />,
    label: 'นักศึกษา',
    href: '/students',
    category: SIDEBAR_CONFIG.CATEGORIES.DATA
  },
  {
    id: 'schedule',
    icon: <Calendar size={20} />,
    label: 'ตารางสอน',
    category: SIDEBAR_CONFIG.CATEGORIES.SCHEDULE,
    subItems: [
      { id: 'edit-schedule', label: 'แก้ไขตารางสอน', href: '/schedule/edit' },
      { id: 'view-schedule', label: 'ดูตารางสอน', href: '/schedule/view' }
    ]
  },
  {
    id: 'export-data',
    icon: <FileOutput size={20} />,
    label: 'ส่งออกข้อมูล',
    href: '/export-data',
    category: SIDEBAR_CONFIG.CATEGORIES.DATA
  },
  {
    id: 'general',
    icon: <Shield size={20} />,
    label: 'ตั้งค่าทั่วไป',
    href: '/settings',
    category: SIDEBAR_CONFIG.CATEGORIES.SETTINGS
  }
];

const USER_DATA: User = {
  name: 'นายสมชาย ใจดี',
  role: 'ผู้รับผิดชอบจัดตารางสอน',
  initials: 'ส'
};

// ===== CUSTOM HOOKS =====
const useNavigation = () => {
  const router = useRouter();
  
  const navigate = useCallback((href: string) => {
    router.push(href);
  }, [router]);

  return { navigate };
};

const useActiveItem = () => {
  const pathname = usePathname();
  
  const isItemActive = useCallback((item: MenuItem) => {
    if (item.href === pathname) return true;
    return item.subItems?.some(sub => sub.href === pathname) || false;
  }, [pathname]);

  return { isItemActive, pathname };
};

// ===== UTILITY FUNCTIONS =====
const groupMenuByCategory = (items: MenuItem[]) => {
  return items.reduce((groups, item) => {
    const category = item.category;
    if (!groups[category]) groups[category] = [];
    groups[category].push(item);
    return groups;
  }, {} as Record<string, MenuItem[]>);
};

const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

// ===== UI COMPONENTS =====
const Logo = () => {
  const { isCollapsed } = useSidebar();
  
  return (
    <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
      <img
        src="/logo.png"
        alt="KMITL Logo"
        width={isCollapsed ? SIDEBAR_CONFIG.SIZES.LOGO.collapsed : SIDEBAR_CONFIG.SIZES.LOGO.expanded}
        className="object-contain transition-all duration-300"
      />
      
      {!isCollapsed && (
        <div className="ml-2 animate-fadeIn">
          <div className="text-slate-800 font-semibold text-lg">KMITL</div>
          <div className="text-slate-500 font-medium text-xs">ระบบจัดตารางสอน</div>
        </div>
      )}
    </Link>
  );
};

const CollapseToggle = () => {
  const { isCollapsed, toggleCollapsed } = useSidebar();
  
  return (
    <button
      onClick={toggleCollapsed}
      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
      aria-label={isCollapsed ? 'ขยาย' : 'ย่อ'}
    >
      {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
    </button>
  );
};

const CategoryLabel = ({ category }: { category: string }) => {
  const { isCollapsed } = useSidebar();
  
  if (isCollapsed) return null;
  
  return (
    <div className="px-2 py-1">
      <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
        {category}
      </span>
    </div>
  );
};

const NavigationTooltip = ({ children, content }: { children: React.ReactNode; content: string }) => {
  const { isCollapsed } = useSidebar();
  
  if (!isCollapsed) return <>{children}</>;
  
  return (
    <div className="group relative">
      {children}
      <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
        {content}
      </div>
    </div>
  );
};

const SubMenu = ({ items, isExpanded }: { items: SubMenuItem[]; isExpanded: boolean }) => {
  const { navigate } = useNavigation();
  const { isCollapsed } = useSidebar();
  
  if (isCollapsed || !items.length) return null;
  
  return (
    <div 
      className="ml-8 overflow-hidden transition-all duration-200"
      style={{ maxHeight: isExpanded ? `${items.length * 36}px` : '0px' }}
    >
      <div className="py-1 space-y-1">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.href)}
            className="flex items-center w-full px-3 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};

const NavigationItem = ({ item }: { item: MenuItem }) => {
  const { isCollapsed, expandedItems, toggleExpanded } = useSidebar();
  const { isItemActive } = useActiveItem();
  const { navigate } = useNavigation();
  
  const isActive = isItemActive(item);
  const isExpanded = expandedItems.has(item.id);
  const hasSubItems = Boolean(item.subItems?.length);
  
  const handleClick = () => {
    if (hasSubItems) {
      toggleExpanded(item.id);
    } else if (item.href) {
      navigate(item.href);
    }
  };
  
  const buttonClass = cn(
    'flex items-center w-full h-10 px-3 rounded-lg transition-colors',
    isCollapsed && 'justify-center px-0',
    isActive 
      ? 'bg-blue-50 text-blue-600' 
      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
  );
  
  return (
    <div>
      <NavigationTooltip content={item.label}>
        <button onClick={handleClick} className={buttonClass}>
          {isCollapsed ? (
            item.icon
          ) : (
            <>
              {item.icon}
              <span className="ml-3 flex-1 text-left text-sm font-medium">{item.label}</span>
              {hasSubItems && (
                <div className="ml-2">
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              )}
            </>
          )}
        </button>
      </NavigationTooltip>
      
      {hasSubItems && (
        <SubMenu items={item.subItems || []} isExpanded={isExpanded} />
      )}
    </div>
  );
};

const Navigation = () => {
  const groupedItems = groupMenuByCategory(MENU_DATA);
  
  return (
    <nav className="flex-1 py-4 px-2">
      <div className="space-y-6">
        {Object.entries(groupedItems).map(([category, items]) => (
          <div key={category} className="space-y-1">
            <CategoryLabel category={category} />
            {items.map((item) => (
              <NavigationItem key={item.id} item={item} />
            ))}
          </div>
        ))}
      </div>
    </nav>
  );
};

const UserProfile = () => {
  const { isCollapsed } = useSidebar();
  
  return (
    <div className="border-t border-gray-200 p-4">
      <div className="flex items-center">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white text-xs font-medium">{USER_DATA.initials}</span>
        </div>
        
        {!isCollapsed && (
          <div className="ml-3 min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-800 truncate">{USER_DATA.name}</p>
            <p className="text-xs text-gray-500 truncate">{USER_DATA.role}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ===== PROVIDER COMPONENT =====
const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState(new Set<string>());
  const pathname = usePathname();
  
  const toggleCollapsed = useCallback(() => {
    setIsCollapsed(prev => !prev);
  }, []);
  
  const toggleExpanded = useCallback((itemId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  }, []);
  
  const contextValue: SidebarContextType = {
    isCollapsed,
    toggleCollapsed,
    expandedItems,
    toggleExpanded,
    activePath: pathname
  };
  
  return (
    <SidebarContext.Provider value={contextValue}>
      {children}
    </SidebarContext.Provider>
  );
};

// ===== MAIN COMPONENT =====
const Sidebar = () => {
  const { isCollapsed } = useSidebar();
  
  const sidebarClass = cn(
    'flex flex-col h-screen bg-white border-r border-gray-200 shadow-sm transition-all',
    SIDEBAR_CONFIG.ANIMATION.COLLAPSE,
    isCollapsed ? SIDEBAR_CONFIG.SIZES.COLLAPSED : SIDEBAR_CONFIG.SIZES.EXPANDED
  );
  
  return (
    <>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
      
      <aside className={sidebarClass}>
        {/* Header */}
        <div className="flex items-center justify-between h-16 border-b border-gray-200 px-4">
          <Logo />
          <CollapseToggle />
        </div>
        
        {/* Navigation */}
        <Navigation />
        
        {/* User Profile */}
        <UserProfile />
      </aside>
    </>
  );
};

// ===== EXPORTS =====
const SidebarWithProvider = () => (
  <SidebarProvider>
    <Sidebar />
  </SidebarProvider>
);

export default SidebarWithProvider;
export { useSidebar, SidebarProvider };
export type { MenuItem, SubMenuItem, User };