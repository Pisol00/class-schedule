//refactor แล้ว
"use client"
import React, { useState, useMemo, useCallback } from 'react';
import {
    BookOpen,
    Users,
    School,
    GraduationCap,
    Calendar,
    UserCheck,
    Shield,
    FileOutput,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    ChevronUp,
    LayoutDashboard
} from 'lucide-react';

// ===== TYPES & INTERFACES =====
interface SubMenuItem {
    id: string;
    label: string;
    href: string;
}

interface MenuItem {
    id: string;
    icon: React.ReactNode;
    label: string;
    href?: string;
    subItems?: SubMenuItem[];
    category?: string;
}

interface SidebarProps {
    activePath?: string;
    onNavigate?: (href: string) => void;
    defaultCollapsed?: boolean;
}

interface User {
    name: string;
    role: string;
    initials: string;
}

// ===== CONSTANTS =====
const HIDE_SCROLLBAR_STYLES = `
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

const MENU_ITEMS: MenuItem[] = [
    //ภาพรวมโครงการ
    {
        id: 'dashboard',
        icon: <LayoutDashboard size={20} />,
        label: 'ภาพรวมโปรเจกต์',
        href: '/dashboard',
        category: 'ภาพรวมโปรเจกต์'
    },
    // จัดการข้อมูล
    {
        id: 'curriculum',
        icon: <BookOpen size={20} />,
        label: 'หลักสูตร',
        href: '/curriculum',
        category: 'จัดการข้อมูล'
    },
    {
        id: 'subjects',
        icon: <BookOpen size={20} />,
        label: 'รายวิชา',
        href: '/subjects',
        category: 'จัดการข้อมูล'
    },
    {
        id: 'instructors',
        icon: <Users size={20} />,
        label: 'อาจารย์ผู้สอน',
        href: '/instructors',
        category: 'จัดการข้อมูล'
    },
    {
        id: 'classrooms',
        icon: <School size={20} />,
        label: 'ห้องเรียน',
        href: '/classrooms',
        category: 'จัดการข้อมูล'
    },
    {
        id: 'students',
        icon: <GraduationCap size={20} />,
        label: 'นักศึกษา',
        href: '/students',
        category: 'จัดการข้อมูล'
    },
    // ตารางสอน
    {
        id: 'schedule',
        icon: <Calendar size={20} />,
        label: 'ตารางสอน',
        href: '/schedule',
        category: 'ตารางสอน',
        subItems: [
            { id: 'edit-schedule', label: 'แก้ไขตารางสอน', href: '/edit-schedule' },
            { id: 'view-schedule', label: 'ดูตารางสอน', href: '/view-schedule' }
        ]
    },
    // การจัดการ
    {
        id: 'general',
        icon: <Shield size={20} />,
        label: 'ตั้งค่าทั่วไป',
        href: '/general-seting',
        category: 'การตั้งค่า'
    },
    {
        id: 'export-data',
        icon: <FileOutput size={20} />,
        label: 'ส่งออกข้อมูล',
        href: '/export-data',
        category: 'จัดการข้อมูล'
    }
];

const DEFAULT_USER: User = {
    name: 'นายสมชาย ใจดี',
    role: 'ผู้รับผิดชอบจัดตารางสอน',
    initials: 'ส'
};

const SIDEBAR_CONFIG = {
    collapsedWidth: 'w-16',
    expandedWidth: 'w-64',
    transitionDuration: 'duration-300',
    logoSize: {
        collapsed: 32,
        expanded: 80
    }
};

// ===== UTILITY FUNCTIONS =====
const groupItemsByCategory = (items: MenuItem[]) => {
    const groups: { [key: string]: MenuItem[] } = {};
    items.forEach(item => {
        const category = item.category || 'อื่นๆ';
        if (!groups[category]) {
            groups[category] = [];
        }
        groups[category].push(item);
    });
    return groups;
};

const getNavigationClasses = (isCollapsed: boolean, isActive: boolean) => `
  relative flex items-center w-full h-9 rounded-l-lg mx-1
  transition-all duration-300 ease-in-out cursor-pointer
  ${isCollapsed ? 'justify-center px-0' : 'justify-start px-3'}
  ${isActive
        ? 'bg-blue-50 text-blue-600'
        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
    }
`;


// ===== SUBCOMPONENTS =====
const Logo: React.FC<{ isCollapsed: boolean }> = ({ isCollapsed }) => (
    <a
        href="/"
        className="flex items-center cursor-pointer hover:opacity-80 transition-opacity overflow-hidden"
        onClick={(e) => {
            e.preventDefault();
            window.location.href = '/';
        }}
    >
        <img
            src="/logo.png"
            alt="สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง"
            width={isCollapsed ? SIDEBAR_CONFIG.logoSize.collapsed : SIDEBAR_CONFIG.logoSize.expanded}
            className="object-contain transition-all duration-300 flex-shrink-0"
        />
        <div className={`flex flex-col ml-2 transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'
            }`}>
            <span className="text-slate-800 font-semibold text-lg whitespace-nowrap">
                KMITL
            </span>
            <span className="text-slate-500 font-medium text-xs whitespace-nowrap">
                ระบบจัดตารางสอน
            </span>
        </div>
    </a>
);

const CollapseButton: React.FC<{
    isCollapsed: boolean;
    onClick: () => void
}> = ({ isCollapsed, onClick }) => (
    <button
        onClick={onClick}
        className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200 flex-shrink-0 cursor-pointer"
        aria-label={isCollapsed ? 'ขยาย' : 'ย่อ'}
    >
        {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
    </button>
);

const SidebarHeader: React.FC<{
    isCollapsed: boolean;
    onToggleCollapse: () => void;
}> = ({ isCollapsed, onToggleCollapse }) => (
    <div className="flex items-center justify-between h-16 border-b border-gray-200 px-4 overflow-hidden">
        <Logo isCollapsed={isCollapsed} />
        <CollapseButton isCollapsed={isCollapsed} onClick={onToggleCollapse} />
    </div>
);

const CategoryHeader: React.FC<{
    category: string;
    isCollapsed: boolean;
}> = ({ category, isCollapsed }) => {
    if (isCollapsed) return null;

    return (
        <div className="px-2 py-1">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                {category}
            </span>
        </div>
    );
};

const NavigationTooltip: React.FC<{
    item: MenuItem;
}> = ({ item }) => (
    <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 max-w-48">
        <div className="truncate">{item.label}</div>
        {item.subItems && item.subItems.length > 0 && (
            <div className="mt-1 border-t border-gray-700 pt-1">
                {item.subItems.map((subItem) => (
                    <div key={subItem.id} className="text-xs text-gray-300 truncate">
                        {subItem.label}
                    </div>
                ))}
            </div>
        )}
        <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 w-1 h-1 bg-gray-900 rotate-45" />
    </div>
);

const SubMenuItems: React.FC<{
    subItems: SubMenuItem[];
    isExpanded: boolean;
    isCollapsed: boolean;
    onSubItemClick: (href: string) => void;
}> = ({ subItems, isExpanded, isCollapsed, onSubItemClick }) => {
    if (!subItems.length || isCollapsed) return null;

    // Calculate max height based on number of items (each item is approximately 36px including spacing)
    const maxHeight = isExpanded ? `${subItems.length * 36}px` : '0px';

    return (
        <div 
            className="ml-8 overflow-hidden transition-all duration-300 ease-in-out px-1"
            style={{ 
                maxHeight,
                opacity: isExpanded ? 1 : 0
            }}
        >
            <div className={`mt-1 space-y-1 transition-all duration-300 ease-in-out ${
                isExpanded ? 'translate-y-0' : '-translate-y-2'
            }`}>
                {subItems.map((subItem) => (
                    <button
                        key={subItem.id}
                        onClick={() => onSubItemClick(subItem.href)}
                        className="flex items-center w-full h-8 px-3 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-200 overflow-hidden whitespace-nowrap cursor-pointer"
                    >
                        <span className="truncate">{subItem.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

const NavigationItem: React.FC<{
    item: MenuItem;
    isActive: boolean;
    isCollapsed: boolean;
    onClick: (href: string) => void;
}> = ({ item, isActive, isCollapsed, onClick }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleClick = useCallback(() => {
        if (item.subItems?.length) {
            setIsExpanded(prev => !prev);
        } else if (item.href) {
            onClick(item.href);
        }
    }, [item.href, item.subItems, onClick]);

    const handleSubItemClick = useCallback((href: string) => {
        onClick(href);
    }, [onClick]);

    const hasSubItems = Boolean(item.subItems?.length);

    return (
        <div className="relative group">
            <button
                onClick={handleClick}
                className={getNavigationClasses(isCollapsed, isActive)}
                aria-label={item.label}
            >
                {isCollapsed ? (
                    <div className="flex items-center justify-center w-full h-full">
                        {item.icon}
                    </div>
                ) : (
                    <>
                        <div className="relative flex-shrink-0">
                            {item.icon}
                        </div>
                        <span className="ml-3 text-sm font-medium whitespace-nowrap flex-1 text-left overflow-hidden">
                            {item.label}
                        </span>
                        {hasSubItems && (
                            <div className="flex-shrink-0 ml-2">
                                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </div>
                        )}
                    </>
                )}
            </button>

            <SubMenuItems
                subItems={item.subItems || []}
                isExpanded={isExpanded}
                isCollapsed={isCollapsed}
                onSubItemClick={handleSubItemClick}
            />

            {isCollapsed && <NavigationTooltip item={item} />}
        </div>
    );
};

const SidebarNavigation: React.FC<{
    items: MenuItem[];
    activePath: string;
    isCollapsed: boolean;
    onNavigate: (href: string) => void;
}> = ({ items, activePath, isCollapsed, onNavigate }) => {
    const groupedItems = useMemo(() => groupItemsByCategory(items), [items]);

    return (
        <nav className="flex-1 py-2 overflow-hidden">
            <div className="h-full overflow-y-auto overflow-x-hidden hide-scrollbar">
                <div className="space-y-3 px-1">
                    {Object.entries(groupedItems).map(([category, categoryItems]) => (
                        <div key={category} className="space-y-1">
                            <CategoryHeader category={category} isCollapsed={isCollapsed} />
                            {categoryItems.map((item) => (
                                <NavigationItem
                                    key={item.id}
                                    item={item}
                                    isActive={
                                        activePath === item.href ||
                                        Boolean(item.subItems?.some(subItem => activePath === subItem.href))
                                    }
                                    isCollapsed={isCollapsed}
                                    onClick={onNavigate}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </nav>
    );
};

const UserProfile: React.FC<{
    user: User;
    isCollapsed: boolean;
}> = ({ user, isCollapsed }) => (
    <div className="relative group">
        <div className={`
      relative flex items-center w-full h-9 rounded-lg mx-1
      transition-all duration-300 cursor-pointer
      ${isCollapsed ? 'justify-center px-0' : 'justify-start px-3'}
    `}>
            {isCollapsed ? (
                <div className="flex items-center justify-center w-full h-full">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-medium">{user.initials}</span>
                    </div>
                </div>
            ) : (
                <>
                    <div className="relative flex-shrink-0">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-medium">{user.initials}</span>
                        </div>
                    </div>
                    <div className="ml-3 min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-800 whitespace-nowrap truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 whitespace-nowrap truncate">{user.role}</p>
                    </div>
                </>
            )}
        </div>
    </div>
);

const SidebarFooter: React.FC<{
    user: User;
    isCollapsed: boolean;
}> = ({ user, isCollapsed }) => (
    <div className="flex-shrink-0 border-t border-gray-200 bg-white ">
        {/* User Profile Section */}
        <div className="p-2">
            <UserProfile user={user} isCollapsed={isCollapsed} />
        </div>
    </div>
);

// ===== MAIN COMPONENT =====
const Sidebar: React.FC<SidebarProps> = ({
    activePath = '/dashboard',
    onNavigate,
    defaultCollapsed = false
}) => {
    const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

    const handleNavigate = useCallback((href: string) => {
        onNavigate?.(href);
    }, [onNavigate]);

    const handleToggleCollapse = useCallback(() => {
        setIsCollapsed(prev => !prev);
    }, []);

    const containerClasses = useMemo(() => `
    flex flex-col h-screen bg-white border-r border-gray-200 shadow-sm 
    transition-all ${SIDEBAR_CONFIG.transitionDuration} relative overflow-hidden
    ${isCollapsed ? SIDEBAR_CONFIG.collapsedWidth : SIDEBAR_CONFIG.expandedWidth}
  `, [isCollapsed]);

    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: HIDE_SCROLLBAR_STYLES }} />
            <div
                className={containerClasses}
                style={{
                    minHeight: '100vh',
                    maxHeight: '100vh'
                }}
            >
                <SidebarHeader
                    isCollapsed={isCollapsed}
                    onToggleCollapse={handleToggleCollapse}
                />

                <SidebarNavigation
                    items={MENU_ITEMS}
                    activePath={activePath}
                    isCollapsed={isCollapsed}
                    onNavigate={handleNavigate}
                />

                <SidebarFooter
                    user={DEFAULT_USER}
                    isCollapsed={isCollapsed}
                />
            </div>
        </>
    );
};

export default Sidebar;
export type { SidebarProps, MenuItem, SubMenuItem, User };