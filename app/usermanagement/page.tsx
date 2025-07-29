"use client"
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Users, Shield, User, Calendar, Settings, Search, X, FileText, Info, AlertCircle, CheckCircle, XCircle, Edit3, Eye, Database, Clock, UserCheck, Cog, BarChart3, Users2, Globe } from 'lucide-react';
import UserPermissionsContainer from '@/components/modal/UserPermissionsContainer';
import Navbar from '@/components/layout/Header'
import Footer from '@/components/layout/Footer';

// ============== Types ==============
interface User {
  id: number;
  name: string;
  email: string;
  department: string;
  role: string;
  status: string;
}

interface TabConfig {
  id: string;
  label: string;
  count: number;
  color: string;
}

interface RoleConfig {
  role: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  permissions: string[];
}

interface RolePermission {
  id: string;
  label: string;
  description: string;
  category: 'data' | 'schedule' | 'user' | 'system';
}

interface RolePermissions {
  [roleId: string]: string[];
}

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
}

interface ConfirmDialog {
  isOpen: boolean;
  title: string;
  message: string;
  type: 'danger' | 'warning' | 'info';
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

type SectionKey = 'pending' | 'general' | 'schedule' | 'admin' | 'blocked';
type MainTabKey = 'users' | 'roles';

// ============== Constants ==============
const ITEMS_PER_PAGE = 10;
const MAX_VISIBLE_PAGES = 5;

const NAMES = ['สมชาย', 'สมหญิง', 'วิชัย', 'วิมล', 'ประยุทธ์', 'ปรียา', 'สมศักดิ์', 'สุมาลี'];
const SURNAMES = ['ใจดี', 'รักดี', 'มั่นคง', 'สุขใส', 'เจริญ', 'วิจิตร', 'ศรีสุข', 'กิติกุล'];
const DEPARTMENTS = ['hr', 'it', 'marketing', 'sales', 'accounting'];

const ROLE_CONFIGS: RoleConfig[] = [
  { role: 'ผู้ใช้งานทั่วไป', icon: User, color: 'blue', permissions: ['อ่าน', 'ความเห็น'] },
  { role: 'ผู้รับผิดชอบจัดตาราง', icon: Calendar, color: 'green', permissions: ['อ่าน', 'เขียน', 'จัดตาราง'] },
  { role: 'ผู้ดูแลระบบ', icon: Settings, color: 'purple', permissions: ['อ่าน', 'เขียน', 'ลบ', 'จัดการผู้ใช้'] },
  { role: 'บล็อกชั่วคราว', icon: XCircle, color: 'red', permissions: ['ไม่มีสิทธิ์'] }
];

// Available permissions that can be assigned to roles
const AVAILABLE_PERMISSIONS: RolePermission[] = [
  // Data permissions
  { id: 'read_data', label: 'อ่านข้อมูล', description: 'สามารถดูข้อมูลในระบบได้', category: 'data' },
  { id: 'write_data', label: 'เขียน/แก้ไขข้อมูล', description: 'สามารถสร้างและแก้ไขข้อมูลได้', category: 'data' },
  { id: 'delete_data', label: 'ลบข้อมูล', description: 'สามารถลบข้อมูลในระบบได้', category: 'data' },
  { id: 'export_data', label: 'ส่งออกข้อมูล', description: 'สามารถส่งออกข้อมูลเป็นไฟล์ได้', category: 'data' },
  
  // Schedule permissions
  { id: 'view_schedule', label: 'ดูตารางเรียน', description: 'สามารถดูตารางเรียนได้', category: 'schedule' },
  { id: 'manage_schedule', label: 'จัดการตารางเรียน', description: 'สามารถสร้างและแก้ไขตารางเรียนได้', category: 'schedule' },
  
  // User permissions
  { id: 'view_users', label: 'ดูข้อมูลผู้ใช้', description: 'สามารถดูรายชื่อผู้ใช้งานได้', category: 'user' },
  { id: 'manage_users', label: 'จัดการผู้ใช้งาน', description: 'สามารถเพิ่ม แก้ไข ลบผู้ใช้งานได้', category: 'user' },
  { id: 'manage_permissions', label: 'จัดการสิทธิ์ผู้ใช้', description: 'สามารถกำหนดสิทธิ์ให้ผู้ใช้งานได้', category: 'user' },
  
  // System permissions
  { id: 'view_reports', label: 'ดูรายงาน', description: 'สามารถดูรายงานของระบบได้', category: 'system' },
  { id: 'manage_system', label: 'จัดการระบบ', description: 'สามารถตั้งค่าระบบได้', category: 'system' },
  { id: 'view_logs', label: 'ดู System Logs', description: 'สามารถดู log การใช้งานระบบได้', category: 'system' }
];

// Default permissions for each role
const DEFAULT_ROLE_PERMISSIONS: RolePermissions = {
  teacher: ['read_data', 'view_schedule', 'view_users'],
  staff: ['read_data', 'write_data', 'view_schedule', 'manage_schedule', 'view_users'],
  admin: ['read_data', 'write_data', 'delete_data', 'export_data', 'view_schedule', 'manage_schedule','view_users', 'manage_users', 'manage_permissions']
};

// Roles for modal
const MODAL_ROLES = [
  {
    id: 'teacher',
    title: 'ผู้ใช้งานทั่วไป',
    icon: User,
    description: 'สามารถเข้าถึงระบบการเรียนการสอนพื้นฐาน'
  },
  {
    id: 'staff',
    title: 'ผู้รับผิดชอบจัดตารางสอน',
    icon: Calendar,
    description: 'สามารถจัดการข้อมูลการสอนและจัดตารางเรียน'
  },
  {
    id: 'admin',
    title: 'ผู้ดูแลระบบ',
    icon: Settings,
    description: 'สามารถจัดการระบบและสิทธิ์ผู้ใช้งานทั้งหมด'
  }
];

// ============== Utility Functions ==============
const generateUsers = (count: number, namePrefix: string = 'สมชาย'): User[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `${NAMES[i % NAMES.length]} ${SURNAMES[i % SURNAMES.length]}`,
    email: `${namePrefix.toLowerCase()}${i + 1}@company.com`,
    department: DEPARTMENTS[i % DEPARTMENTS.length],
    role: i % 4 === 0 ? 'admin' : i % 3 === 0 ? 'manager' : 'user',
    status: i % 10 === 0 ? 'blocked' : 'active'
  }));
};

const getRoleDisplayName = (roleId: string): string => {
  const roleMap: Record<string, string> = {
    teacher: 'ผู้ใช้งานทั่วไป',
    staff: 'ผู้รับผิดชอบจัดตารางสอน', 
    admin: 'ผู้ดูแลระบบ'
  };
  return roleMap[roleId] || roleId;
};

// ============== Toast & Dialog Components ==============
const ToastContainer: React.FC<{ toasts: Toast[]; onRemove: (id: string) => void }> = ({ toasts, onRemove }) => (
  <div className="fixed top-4 right-4 z-50 space-y-2">
    {toasts.map((toast) => {
      const icons = {
        success: <CheckCircle className="w-5 h-5 text-green-500" />,
        error: <XCircle className="w-5 h-5 text-red-500" />,
        warning: <AlertCircle className="w-5 h-5 text-yellow-500" />,
        info: <Info className="w-5 h-5 text-blue-500" />
      };
      
      const colors = {
        success: 'bg-green-50 border-green-200 text-green-800',
        error: 'bg-red-50 border-red-200 text-red-800',
        warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
        info: 'bg-blue-50 border-blue-200 text-blue-800'
      };

      return (
        <div
          key={toast.id}
          className={`${colors[toast.type]} border rounded-lg p-4 shadow-lg max-w-sm animate-in slide-in-from-right duration-300`}
        >
          <div className="flex items-start space-x-3">
            {icons[toast.type]}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">{toast.title}</p>
              <p className="text-sm opacity-90 mt-1">{toast.message}</p>
            </div>
            <button
              onClick={() => onRemove(toast.id)}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      );
    })}
  </div>
);

const ConfirmationDialog: React.FC<{ dialog: ConfirmDialog; isLoading?: boolean }> = ({ dialog, isLoading = false }) => {
  if (!dialog.isOpen) return null;

  const colors = {
    danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500 disabled:bg-red-400',
    warning: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500 disabled:bg-yellow-400',
    info: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-400'
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{dialog.title}</h3>
          <p className="text-gray-600 mb-6">{dialog.message}</p>
          <div className="flex space-x-3 justify-end">
            <button
              onClick={dialog.onCancel}
              disabled={isLoading}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {dialog.cancelText}
            </button>
            <button
              onClick={dialog.onConfirm}
              disabled={isLoading}
              className={`px-4 py-2 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed flex items-center space-x-2 ${colors[dialog.type]}`}
            >
              {isLoading && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              <span>{dialog.confirmText}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============== Custom Hooks ==============
const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { ...toast, id }]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return { toasts, addToast, removeToast };
};

const useConfirmDialog = () => {
  const [dialog, setDialog] = useState<ConfirmDialog>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    confirmText: 'ยืนยัน',
    cancelText: 'ยกเลิก',
    onConfirm: () => {},
    onCancel: () => {}
  });

  const showConfirm = useCallback((config: Partial<ConfirmDialog>) => {
    setDialog(prev => ({
      ...prev,
      ...config,
      isOpen: true,
      onCancel: () => {
        setDialog(prev => ({ ...prev, isOpen: false }));
        config.onCancel?.();
      }
    }));
  }, []);

  const hideConfirm = useCallback(() => {
    setDialog(prev => ({ ...prev, isOpen: false }));
  }, []);

  return { dialog, showConfirm, hideConfirm };
};

const useUserData = () => {
  const [usersData, setUsersData] = useState(() => ({
    pending: generateUsers(45, 'pending'),
    general: generateUsers(67, 'general'), 
    schedule: generateUsers(28, 'schedule'),
    admin: generateUsers(15, 'admin'),
    blocked: generateUsers(12, 'blocked')
  }));

  const moveUser = useCallback((userId: number, fromSection: SectionKey, toSection: SectionKey) => {
    setUsersData(prev => {
      const userToMove = prev[fromSection].find(user => user.id === userId);
      if (!userToMove) return prev;

      return {
        ...prev,
        [fromSection]: prev[fromSection].filter(user => user.id !== userId),
        [toSection]: [...prev[toSection], { ...userToMove, status: 'active' }]
      };
    });
  }, []);

  const moveUsers = useCallback((userIds: number[], fromSection: SectionKey, toSection: SectionKey) => {
    setUsersData(prev => {
      const usersToMove = prev[fromSection].filter(user => userIds.includes(user.id));
      if (usersToMove.length === 0) return prev;

      return {
        ...prev,
        [fromSection]: prev[fromSection].filter(user => !userIds.includes(user.id)),
        [toSection]: [...prev[toSection], ...usersToMove.map(user => ({ ...user, status: 'active' }))]
      };
    });
  }, []);

  const blockUser = useCallback((userId: number, fromSection: SectionKey) => {
    setUsersData(prev => {
      const userToBlock = prev[fromSection].find(user => user.id === userId);
      if (!userToBlock) return prev;

      return {
        ...prev,
        [fromSection]: prev[fromSection].filter(user => user.id !== userId),
        blocked: [...prev.blocked, { ...userToBlock, status: 'blocked' }]
      };
    });
  }, []);

  const blockUsers = useCallback((userIds: number[], fromSection: SectionKey) => {
    setUsersData(prev => {
      const usersToBlock = prev[fromSection].filter(user => userIds.includes(user.id));
      if (usersToBlock.length === 0) return prev;

      return {
        ...prev,
        [fromSection]: prev[fromSection].filter(user => !userIds.includes(user.id)),
        blocked: [...prev.blocked, ...usersToBlock.map(user => ({ ...user, status: 'blocked' }))]
      };
    });
  }, []);

  return { 
    usersData, 
    moveUser, 
    moveUsers, 
    blockUser, 
    blockUsers 
  };
};

const useUserSearch = (users: User[], searchTerm: string) => {
  return useMemo(() => {
    if (!searchTerm) return users;
    
    const term = searchTerm.toLowerCase();
    return users.filter(user => 
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term)
    );
  }, [users, searchTerm]);
};

const usePagination = (totalItems: number, currentPage: number, itemsPerPage: number = ITEMS_PER_PAGE) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  
  const getVisiblePages = useCallback(() => {
    const startPage = Math.max(1, currentPage - Math.floor(MAX_VISIBLE_PAGES / 2));
    const endPage = Math.min(totalPages, startPage + MAX_VISIBLE_PAGES - 1);
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }, [currentPage, totalPages]);

  return {
    totalPages,
    startIndex,
    endIndex,
    visiblePages: getVisiblePages()
  };
};

const useBulkSelection = (filteredUsers: User[]) => {
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [isSelectAllPages, setIsSelectAllPages] = useState(false);

  const selectUser = useCallback((userId: number) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  }, []);

  const selectCurrentPage = useCallback((pageUserIds: number[]) => {
    const allCurrentPageSelected = pageUserIds.every(id => selectedUsers.includes(id));
    
    if (allCurrentPageSelected) {
      setSelectedUsers(prev => prev.filter(id => !pageUserIds.includes(id)));
    } else {
      setSelectedUsers(prev => [...new Set([...prev, ...pageUserIds])]);
    }
  }, [selectedUsers]);

  const selectAllPages = useCallback(() => {
    if (isSelectAllPages) {
      setSelectedUsers([]);
      setIsSelectAllPages(false);
    } else {
      const allUserIds = filteredUsers.map(user => user.id);
      setSelectedUsers(allUserIds);
      setIsSelectAllPages(true);
    }
  }, [isSelectAllPages, filteredUsers]);

  const clearSelection = useCallback(() => {
    setSelectedUsers([]);
    setIsSelectAllPages(false);
  }, []);

  return {
    selectedUsers,
    isSelectAllPages,
    selectUser,
    selectCurrentPage,
    selectAllPages,
    clearSelection,
    setSelectedUsers,
    setIsSelectAllPages
  };
};

// ============== Sub Components ==============
const Header: React.FC<{ isEditMode: boolean; onToggleEditMode: () => void; isLoading?: boolean }> = ({ 
  isEditMode, 
  onToggleEditMode, 
  isLoading = false 
}) => (
  <div className="mb-6">
    <div className="flex items-center justify-between">
      <div className="border-l-4 border-orange-500 pl-4">
        <h1 className="text-xl font-semibold text-gray-900 mb-1">
          กำหนดสิทธิผู้ใช้งาน
        </h1>
        <p className="text-sm text-gray-600">
          จัดการและกำหนดสิทธิให้กับผู้ใช้งาน
        </p>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Toggle button */}
        <button
          onClick={onToggleEditMode}
          disabled={isLoading}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 cursor-pointer ${
            isEditMode
              ? 'bg-gray-600 hover:bg-gray-700 text-white shadow-md hover:shadow-lg'
              : 'bg-orange-600 hover:bg-orange-700 text-white shadow-md hover:shadow-lg'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              {isEditMode ? <Eye size={16} /> : <Edit3 size={16} />}
              <span>{isEditMode ? 'เปลี่ยนเป็นโหมดดู' : 'เริ่มแก้ไข'}</span>
            </>
          )}
        </button>
      </div>
    </div>
    
    {/* Edit mode warning */}
    {isEditMode && (
      <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg flex items-center space-x-2">
        <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0" />
        <div className="text-sm text-orange-800">
          <strong>โหมดแก้ไข:</strong> คุณสามารถเลือกผู้ใช้งานและดำเนินการต่างๆ ได้
        </div>
      </div>
    )}
    
    {/* View mode info */}
    {!isEditMode && (
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center space-x-2">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
        <div className="text-sm text-blue-800">
          <strong>โหมดดู:</strong> กำลังแสดงข้อมูลเพื่อการดูเท่านั้น กดปุ่ม "เริ่มแก้ไข" เพื่อทำการเปลี่ยนแปลง
        </div>
      </div>
    )}
  </div>
);

interface MainTabBarProps {
  activeTab: MainTabKey;
  onTabChange: (tab: MainTabKey) => void;
  isEditMode: boolean;
}

const MainTabBar: React.FC<MainTabBarProps> = ({ activeTab, onTabChange, isEditMode }) => {
  const tabs = [
    { id: 'users' as MainTabKey, label: 'กำหนดสิทธิผู้ใช้งาน', icon: Users },
    { id: 'roles' as MainTabKey, label: 'กำหนดสิทธิ์ให้แต่ละบทบาท', icon: Shield }
  ];

  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-4" aria-label="Main Tabs">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 cursor-pointer`}
              >
                <IconComponent size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  isEditMode: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearchChange, isEditMode }) => (
  <div className="p-4">
    <div className="relative max-w-md">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search size={16} className="text-gray-400" />
      </div>
      <input
        type="text"
        placeholder="ค้นหาชื่อหรืออีเมล..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
      />
      {searchTerm && (
        <button
          onClick={() => onSearchChange('')}
          className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
        >
          <X size={16} className="text-gray-400 hover:text-gray-600" />
        </button>
      )}
    </div>
  </div>
);

interface SectionTabBarProps {
  selectedSection: SectionKey;
  onSectionChange: (section: SectionKey) => void;
  allUsersData: Record<SectionKey, User[]>;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  isEditMode: boolean;
}

const SectionTabBar: React.FC<SectionTabBarProps> = ({ 
  selectedSection, 
  onSectionChange, 
  allUsersData,
  searchTerm,
  onSearchChange,
  isEditMode
}) => {
  const tabs: TabConfig[] = [
    { id: 'pending', label: 'รอกำหนดสิทธิ์', count: allUsersData.pending.length, color: 'yellow' },
    { id: 'general', label: 'ผู้ใช้งานทั่วไป', count: allUsersData.general.length, color: 'blue' },
    { id: 'schedule', label: 'ผู้รับผิดชอบจัดตาราง', count: allUsersData.schedule.length, color: 'green' },
    { id: 'admin', label: 'ผู้ดูแลระบบ', count: allUsersData.admin.length, color: 'purple' },
    { id: 'blocked', label: 'บล็อกชั่วคราว', count: allUsersData.blocked.length, color: 'red' }
  ];

  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-4" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onSectionChange(tab.id as SectionKey)}
              className={`${
                selectedSection === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 cursor-pointer`}
            >
              <span>{tab.label}</span>
              <span className={`${
                selectedSection === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
              } inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium`}>
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>
      <SearchBar searchTerm={searchTerm} onSearchChange={onSearchChange} isEditMode={isEditMode} />
    </div>
  );
};

interface UserCardProps {
  user: User;
  section: SectionKey;
  isSelected: boolean;
  onSelect: (userId: number) => void;
  onOpenModal: (user: User) => void;
  onBlockUser: (user: User) => void;
  onUnblockUser: (user: User) => void;
  isEditMode: boolean;
}

const UserCard: React.FC<UserCardProps> = ({ 
  user, 
  section, 
  isSelected, 
  onSelect, 
  onOpenModal, 
  onBlockUser, 
  onUnblockUser, 
  isEditMode 
}) => {
  const isBlocked = section === 'blocked';
  
  const renderActionButtons = () => {
    if (!isEditMode) return null;
    
    const buttonClass = "px-3 py-1 text-xs text-white rounded hover:opacity-90 cursor-pointer transition-colors";
    
    switch (section) {
      case 'pending':
        return (
          <div className="flex space-x-2">
            <button 
              onClick={() => onOpenModal(user)}
              className={`${buttonClass} bg-blue-600 hover:bg-blue-700`}
            >
              มอบสิทธิ์
            </button>
            <button 
              onClick={() => onBlockUser(user)}
              className={`${buttonClass} bg-red-600 hover:bg-red-700`}
            >
              บล็อกชั่วคราว
            </button>
          </div>
        );
      case 'general':
      case 'schedule':
      case 'admin':
        return (
          <button 
            onClick={() => onOpenModal(user)}
            className={`${buttonClass} bg-blue-600 hover:bg-blue-700`}
          >
            แก้ไขสิทธิ์
          </button>
        );
      case 'blocked':
        return (
          <button 
            onClick={() => onUnblockUser(user)}
            className={`${buttonClass} bg-green-600 hover:bg-green-700`}
          >
            ปลดบล็อก
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`flex items-center justify-between py-3 px-4 cursor-pointer ${
      isBlocked ? 'bg-red-50' : ''
    } ${isSelected ? 'bg-blue-50 border-l-4 border-blue-500' : ''} hover:bg-gray-50`}>
      <div className="flex items-center space-x-3">
        {isEditMode && (
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(user.id)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
          />
        )}
        <div className={`w-10 h-10 ${isBlocked ? 'bg-gray-400' : 'bg-blue-600'} rounded-full flex items-center justify-center`}>
          <span className="text-white text-sm font-medium">
            {user.name.charAt(0)}
          </span>
        </div>
        <div>
          <div className={`text-sm font-medium ${isBlocked ? 'text-gray-500' : 'text-gray-900'}`}>
            {user.name}
          </div>
          <div className={`text-xs ${isBlocked ? 'text-gray-400' : 'text-gray-500'}`}>
            {user.email}
          </div>
        </div>
      </div>
      
      {renderActionButtons()}
    </div>
  );
};

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  visiblePages: number[];
  startIndex: number;
  endIndex: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  isEditMode: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  visiblePages,
  startIndex,
  endIndex,
  totalItems,
  onPageChange,
  isEditMode
}) => (
  <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200">
    <div className="flex items-center text-sm text-gray-700">
      แสดง {startIndex + 1}-{endIndex} จาก {totalItems} รายการ
    </div>
    
    <div className="flex items-center space-x-2">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="px-3 py-1 text-sm text-gray-400 border rounded hover:bg-gray-50 disabled:cursor-not-allowed cursor-pointer"
      >
        ก่อนหน้า
      </button>
      
      {visiblePages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 text-sm border rounded cursor-pointer ${
            currentPage === page 
              ? 'bg-blue-600 text-white' 
              : 'text-gray-400 hover:bg-gray-50'
          }`}
        >
          {page}
        </button>
      ))}
      
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="px-3 py-1 text-gray-400 text-sm border rounded hover:bg-gray-50 disabled:cursor-not-allowed cursor-pointer"
      >
        ถัดไป
      </button>
    </div>
  </div>
);

interface UserListHeaderProps {
  selectedSection: SectionKey;
  filteredUsersCount: number;
  searchTerm: string;
  currentPage: number;
  totalPages: number;
  selectedUsers: number[];
  selectedInCurrentPage: number[];
  currentPageUserIds: number[];
  isCurrentPageFullySelected: boolean;
  isCurrentPagePartiallySelected: boolean;
  onSelectCurrentPage: () => void;
  onSelectAllPages: () => void;
  onClearSelection: () => void;
  isSelectAllPages: boolean;
  onOpenBulkModal: () => void;
  onBulkBlock: () => void;
  onBulkUnblock: () => void;
  isLoading?: boolean;
  isEditMode: boolean;
}

const UserListHeader: React.FC<UserListHeaderProps> = ({
  selectedSection,
  filteredUsersCount,
  searchTerm,
  currentPage,
  totalPages,
  selectedUsers,
  selectedInCurrentPage,
  currentPageUserIds,
  isCurrentPageFullySelected,
  isCurrentPagePartiallySelected,
  onSelectCurrentPage,
  onSelectAllPages,
  onClearSelection,
  isSelectAllPages,
  onOpenBulkModal,
  onBulkBlock,
  onBulkUnblock,
  isLoading = false,
  isEditMode
}) => {
  const getSectionTitle = (section: SectionKey): string => {
    const titles = {
      pending: 'รอกำหนดสิทธิ์',
      general: 'ผู้ใช้งานทั่วไป',
      schedule: 'ผู้รับผิดชอบจัดตารางสอน',
      admin: 'ผู้ดูแลระบบ',
      blocked: 'บล็อกชั่วคราว'
    };
    return titles[section];
  };

  const renderBulkActions = () => {
    if (!isEditMode || selectedUsers.length === 0) return null;

    const baseButtonClass = "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md";
    
    switch (selectedSection) {
      case 'pending':
        return (
          <div className="flex space-x-2">
            <button 
              onClick={onOpenBulkModal}
              disabled={isLoading}
              className={`${baseButtonClass} bg-indigo-600 hover:bg-indigo-700 text-white border border-indigo-600 cursor-pointer`}
            >
              <Settings size={16} />
              <span>มอบสิทธิ์ {selectedUsers.length} คน</span>
            </button>
            <button 
              onClick={onBulkBlock}
              disabled={isLoading}
              className={`${baseButtonClass} bg-red-600 hover:bg-red-700 text-white border border-red-600 cursor-pointer`}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <XCircle size={16} />
              )}
              <span>บล็อก {selectedUsers.length} คน</span>
            </button>
          </div>
        );
      case 'general':
      case 'schedule':
      case 'admin':
        return (
          <button 
            onClick={onOpenBulkModal}
            disabled={isLoading}
            className={`${baseButtonClass} bg-slate-600 hover:bg-slate-700 text-white border border-slate-600`}
          >
            <Settings size={16} />
            <span>แก้ไขสิทธิ์ {selectedUsers.length} คน</span>
          </button>
        );
      case 'blocked':
        return (
          <button 
            onClick={onBulkUnblock}
            className={`${baseButtonClass} bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-600`}
          >
            <CheckCircle size={16} />
            <span>ปลดบล็อก {selectedUsers.length} คน</span>
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="px-4 py-3 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {isEditMode && (
            <div className="relative">
              <input
                type="checkbox"
                checked={isCurrentPageFullySelected}
                ref={(el) => {
                  if (el) el.indeterminate = isCurrentPagePartiallySelected;
                }}
                onChange={onSelectCurrentPage}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
              />
              {(isCurrentPagePartiallySelected || selectedUsers.length > selectedInCurrentPage.length) && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full"></div>
              )}
            </div>
          )}
          <div>
            <h2 className="text-sm font-medium text-gray-900 flex items-center">
              {getSectionTitle(selectedSection)}
              <span className="text-blue-600 ml-2">
                {filteredUsersCount} คน
              </span>
              {searchTerm && (
                <span className="text-gray-500 text-xs ml-2">
                  (ค้นหา: "{searchTerm}")
                </span>
              )}
            </h2>
            
            {/* Selection info */}
            {selectedUsers.length > 0 && isEditMode && (
              <div className="text-xs text-gray-500 mt-1">
                <span className="text-indigo-600 font-medium">เลือกแล้ว {selectedUsers.length} คน</span>
                {selectedInCurrentPage.length > 0 && (
                  <span className="ml-2">
                    (หน้านี้: {selectedInCurrentPage.length}/{currentPageUserIds.length})
                  </span>
                )}
                {selectedUsers.length > selectedInCurrentPage.length && (
                  <span className="text-orange-600 ml-1">
                    (+{selectedUsers.length - selectedInCurrentPage.length} จากหน้าอื่น)
                  </span>
                )}
              </div>
            )}
            
            {/* Selection controls */}
            {selectedUsers.length > 0 && isEditMode && (
              <div className="flex items-center space-x-3 mt-1">
                {!isSelectAllPages && selectedUsers.length < filteredUsersCount && (
                  <button 
                    onClick={onSelectAllPages}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center space-x-1 transition-colors cursor-pointer"
                  >
                    <span>เลือกทั้งหมดทุกหน้า ({filteredUsersCount} คน)</span>
                  </button>
                )}
                <button 
                  onClick={onClearSelection}
                  className="text-xs text-slate-500 hover:text-slate-700 font-medium flex items-center space-x-1 transition-colors cursor-pointer"
                >
                  <X size={12} />
                  <span>ยกเลิกทั้งหมด</span>
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Bulk actions */}
          {renderBulkActions()}
          
          {/* Page info */}
          <div className="text-xs text-gray-500">
            หน้า {currentPage} จาก {totalPages}
            {totalPages > 1 && selectedUsers.length > 0 && isEditMode && (
              <div className="flex items-center space-x-1 text-orange-600 mt-1">
                <Info size={12} />
                <span>เลือกข้ามหน้าได้</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Warning when users selected from other pages */}
      {selectedUsers.length > selectedInCurrentPage.length && isEditMode && (
        <div className="mt-3 pt-3 border-t border-slate-200">
          <div className="flex items-center space-x-2 text-sm text-amber-700 bg-amber-50 px-3 py-2 rounded-lg">
            <Info size={16} />
            <span>คุณได้เลือกผู้ใช้จากหน้าอื่นๆ ด้วย (หน้านี้: {selectedInCurrentPage.length}/{currentPageUserIds.length})</span>
          </div>
        </div>
      )}
    </div>
  );
};

const EmptyState: React.FC<{ searchTerm: string }> = ({ searchTerm }) => (
  <div className="py-12 text-center">
    <div className="flex justify-center mb-4">
      <FileText size={48} className="text-gray-400" />
    </div>
    <h3 className="mt-2 text-sm font-medium text-gray-900">ไม่พบข้อมูล</h3>
    <p className="mt-1 text-sm text-gray-500">
      {searchTerm ? `ไม่พบผู้ใช้งานที่ตรงกับ "${searchTerm}"` : 'ไม่มีข้อมูลในหมวดนี้'}
    </p>
  </div>
);

const RoleManagementTab: React.FC<{ isEditMode: boolean; addToast: (toast: Omit<Toast, 'id'>) => void }> = ({ isEditMode, addToast }) => {
  const [rolePermissions, setRolePermissions] = useState<RolePermissions>(DEFAULT_ROLE_PERMISSIONS);
  const [hasChanges, setHasChanges] = useState(false);

  const togglePermission = useCallback((roleId: string, permissionId: string) => {
    if (!isEditMode) return;

    setRolePermissions(prev => {
      const currentPermissions = prev[roleId] || [];
      const newPermissions = currentPermissions.includes(permissionId)
        ? currentPermissions.filter(p => p !== permissionId)
        : [...currentPermissions, permissionId];
      
      const updated = { ...prev, [roleId]: newPermissions };
      setHasChanges(JSON.stringify(updated) !== JSON.stringify(DEFAULT_ROLE_PERMISSIONS));
      return updated;
    });
  }, [isEditMode]);

  const toggleAllPermissions = useCallback((roleId: string) => {
    if (!isEditMode) return;

    setRolePermissions(prev => {
      const currentPermissions = prev[roleId] || [];
      const allPermissionIds = AVAILABLE_PERMISSIONS.map(p => p.id);
      const hasAllPermissions = allPermissionIds.every(id => currentPermissions.includes(id));
      
      const newPermissions = hasAllPermissions ? [] : allPermissionIds;
      const updated = { ...prev, [roleId]: newPermissions };
      setHasChanges(JSON.stringify(updated) !== JSON.stringify(DEFAULT_ROLE_PERMISSIONS));
      return updated;
    });
  }, [isEditMode]);

  const toggleCategoryPermissions = useCallback((roleId: string, category: string) => {
    if (!isEditMode) return;

    setRolePermissions(prev => {
      const currentPermissions = prev[roleId] || [];
      const categoryPermissions = getPermissionsByCategory(category);
      const categoryPermissionIds = categoryPermissions.map(p => p.id);
      const hasAllCategoryPermissions = categoryPermissionIds.every(id => currentPermissions.includes(id));
      
      let newPermissions;
      if (hasAllCategoryPermissions) {
        // Remove all category permissions
        newPermissions = currentPermissions.filter(id => !categoryPermissionIds.includes(id));
      } else {
        // Add all category permissions
        newPermissions = [...new Set([...currentPermissions, ...categoryPermissionIds])];
      }
      
      const updated = { ...prev, [roleId]: newPermissions };
      setHasChanges(JSON.stringify(updated) !== JSON.stringify(DEFAULT_ROLE_PERMISSIONS));
      return updated;
    });
  }, [isEditMode]);

  const saveChanges = useCallback(async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Saving role permissions:', rolePermissions);
      addToast({
        type: 'success',
        title: 'บันทึกสิทธิ์สำเร็จ!',
        message: 'การกำหนดสิทธิ์บทบาทได้รับการอัพเดทแล้ว'
      });
      setHasChanges(false);
    } catch (error) {
      addToast({
        type: 'error',
        title: 'เกิดข้อผิดพลาด',
        message: 'ไม่สามารถบันทึกการเปลี่ยนแปลงได้'
      });
    }
  }, [rolePermissions, addToast]);

  const resetChanges = useCallback(() => {
    setRolePermissions(DEFAULT_ROLE_PERMISSIONS);
    setHasChanges(false);
  }, []);

  const getPermissionsByCategory = (category: string) => {
    return AVAILABLE_PERMISSIONS.filter(p => p.category === category);
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      data: 'การจัดการข้อมูล',
      schedule: 'การจัดการตารางเรียน',
      user: 'การจัดการผู้ใช้งาน',
      system: 'การจัดการระบบ'
    };
    return labels[category as keyof typeof labels] || category;
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      data: BarChart3,
      schedule: Calendar,
      user: Users2,
      system: Cog
    };
    return icons[category as keyof typeof icons] || FileText;
  };

  const roles = [
    { id: 'teacher', title: 'ผู้ใช้งานทั่วไป', icon: User, color: 'blue' },
    { id: 'staff', title: 'ผู้รับผิดชอบจัดตารางสอน', icon: Calendar, color: 'green' },
    { id: 'admin', title: 'ผู้ดูแลระบบ', icon: Settings, color: 'purple' }
  ];

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">กำหนดสิทธิ์ให้แต่ละบทบาท</h2>
            <p className="text-gray-600">จัดการสิทธิ์การเข้าถึงแต่ละฟีเจอร์สำหรับแต่ละบทบาท</p>
          </div>
          
          
          {hasChanges && isEditMode && (
            <div className="flex space-x-3">
              <button
                onClick={resetChanges}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center space-x-2"
              >
                <X size={16} />
                <span>ยกเลิก</span>
              </button>
              <button
                onClick={saveChanges}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center space-x-2"
              >
                <CheckCircle size={16} />
                <span>บันทึกการเปลี่ยนแปลง</span>
              </button>
            </div>
          )}
        </div>

        {hasChanges && isEditMode && (
          <div className="mb-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center space-x-2 text-orange-800">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <div className="text-sm">
                <strong>มีการเปลี่ยนแปลง:</strong> คุณได้ทำการเปลี่ยนแปลงสิทธิ์ อย่าลืมกดปุ่ม "บันทึกการเปลี่ยนแปลง" เพื่อยืนยัน
              </div>
            </div>
          </div>
        )}


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {roles.map((role) => {
            const roleColor = role.color === 'blue' ? 'blue' : role.color === 'green' ? 'green' : 'purple';
            const colorClasses = {
              blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', button: 'bg-blue-600 hover:bg-blue-700' },
              green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800', button: 'bg-green-600 hover:bg-green-700' },
              purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-800', button: 'bg-purple-600 hover:bg-purple-700' }
            };
            const colors = colorClasses[roleColor];

            return (
              <div key={role.id} className={`${colors.bg} ${colors.border} border rounded-lg p-4`}>
                <div className="text-center mb-4">
                  <div className="flex justify-center mb-2">
                    <role.icon size={32} className={colors.text} />
                  </div>
                  <h3 className={`font-semibold ${colors.text} text-lg`}>{role.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {(rolePermissions[role.id] || []).length} สิทธิ์ที่ได้รับ
                  </p>
                </div>

                {/* Select All Section */}
                {isEditMode && (
                  <div className="bg-white rounded-lg p-3 mb-4 border-2 border-dashed border-gray-200">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={AVAILABLE_PERMISSIONS.every(p => (rolePermissions[role.id] || []).includes(p.id))}
                        ref={(el) => {
                          if (el) {
                            const currentPermissions = rolePermissions[role.id] || [];
                            const hasAllPermissions = AVAILABLE_PERMISSIONS.every(p => currentPermissions.includes(p.id));
                            const hasSomePermissions = AVAILABLE_PERMISSIONS.some(p => currentPermissions.includes(p.id));
                            el.indeterminate = hasSomePermissions && !hasAllPermissions;
                          }
                        }}
                        onChange={() => toggleAllPermissions(role.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                      />
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-gray-900 flex items-center space-x-2">
                          <span>เลือกทั้งหมด</span>
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            {AVAILABLE_PERMISSIONS.length} สิทธิ์
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          เลือกหรือยกเลิกสิทธิ์ทั้งหมดในบทบาทนี้
                        </div>
                      </div>
                    </label>
                  </div>
                )}

                <div className="space-y-4">
                  {['data', 'schedule', 'user'].map(category => {
                    const categoryPermissions = getPermissionsByCategory(category);
                    const hasPermissionsInCategory = categoryPermissions.some(p => 
                      (rolePermissions[role.id] || []).includes(p.id)
                    );

                    return (
                      <div key={category} className="bg-white rounded-lg p-3">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            {React.createElement(getCategoryIcon(category), { size: 18, className: "text-gray-600" })}
                            <h4 className="font-medium text-gray-900 text-sm">{getCategoryLabel(category)}</h4>
                            {hasPermissionsInCategory && (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                {categoryPermissions.filter(p => (rolePermissions[role.id] || []).includes(p.id)).length}
                              </span>
                            )}
                          </div>
                          
                          {/* Category Select All */}
                          {isEditMode && (
                            <label className="flex items-center space-x-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={categoryPermissions.every(p => (rolePermissions[role.id] || []).includes(p.id))}
                                ref={(el) => {
                                  if (el) {
                                    const currentPermissions = rolePermissions[role.id] || [];
                                    const hasAllCategoryPermissions = categoryPermissions.every(p => currentPermissions.includes(p.id));
                                    const hasSomeCategoryPermissions = categoryPermissions.some(p => currentPermissions.includes(p.id));
                                    el.indeterminate = hasSomeCategoryPermissions && !hasAllCategoryPermissions;
                                  }
                                }}
                                onChange={() => toggleCategoryPermissions(role.id, category)}
                                className="h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                              />
                              <span className="text-xs text-gray-600 font-medium">ทั้งหมด</span>
                            </label>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          {categoryPermissions.map(permission => {
                            const isChecked = (rolePermissions[role.id] || []).includes(permission.id);
                            return (
                              <label 
                                key={permission.id} 
                                className={`flex items-start space-x-3 p-2 rounded cursor-pointer transition-colors ${
                                  isEditMode ? 'hover:bg-gray-50' : 'cursor-default'
                                } ${isChecked ? 'bg-blue-50' : ''}`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => togglePermission(role.id, permission.id)}
                                  disabled={!isEditMode}
                                  className={`mt-0.5 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ${
                                    isEditMode ? 'cursor-pointer' : 'cursor-default'
                                  }`}
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium text-gray-900">{permission.label}</div>
                                  <div className="text-xs text-gray-500 mt-1">{permission.description}</div>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        
      </div>
    </div>
  );
};

// ============== Main Component ==============
const UserPermissionDashboard: React.FC = () => {
  // Main states
  const [activeMainTab, setActiveMainTab] = useState<MainTabKey>('users');
  const [selectedSection, setSelectedSection] = useState<SectionKey>('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalUser, setModalUser] = useState<User | null>(null);
  const [modalMode, setModalMode] = useState<'single' | 'bulk'>('single');
  const [bulkUsers, setBulkUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Toast and dialog hooks
  const { toasts, addToast, removeToast } = useToast();
  const { dialog, showConfirm, hideConfirm } = useConfirmDialog();

  // Data and derived states
  const { usersData: allUsersData, moveUser, moveUsers, blockUser, blockUsers } = useUserData();
  const currentUsers = allUsersData[selectedSection] || [];
  const filteredUsers = useUserSearch(currentUsers, searchTerm);
  const pagination = usePagination(filteredUsers.length, currentPage);
  const paginatedUsers = filteredUsers.slice(pagination.startIndex, pagination.startIndex + ITEMS_PER_PAGE);
  
  // Bulk selection
  const bulkSelection = useBulkSelection(filteredUsers);
  
  // Derived states for current page selection
  const currentPageUserIds = paginatedUsers.map(user => user.id);
  const selectedInCurrentPage = currentPageUserIds.filter(id => bulkSelection.selectedUsers.includes(id));
  const isCurrentPageFullySelected = currentPageUserIds.length > 0 && 
    currentPageUserIds.every(id => bulkSelection.selectedUsers.includes(id));
  const isCurrentPagePartiallySelected = selectedInCurrentPage.length > 0 && 
    !isCurrentPageFullySelected;

  // Effects
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedSection]);

  // Separate effect for handling search clear with selected users
  useEffect(() => {
    // Only run when search is cleared (not when users are selected/deselected)
    if (searchTerm === '' && bulkSelection.selectedUsers.length > 0) {
      const currentUsers = allUsersData[selectedSection] || [];
      const firstSelectedUser = currentUsers.find(user => 
        bulkSelection.selectedUsers.includes(user.id)
      );
      
      if (firstSelectedUser) {
        const userIndex = currentUsers.findIndex(user => user.id === firstSelectedUser.id);
        const pageContainingUser = Math.ceil((userIndex + 1) / ITEMS_PER_PAGE);
        setCurrentPage(pageContainingUser);
      }
    }
  }, [searchTerm]); // Only depend on searchTerm, not selectedUsers

  useEffect(() => {
    bulkSelection.clearSelection();
  }, [selectedSection, bulkSelection.clearSelection]);

  useEffect(() => {
    if (!isEditMode) {
      bulkSelection.clearSelection();
      setSearchTerm('');
    }
  }, [isEditMode, bulkSelection.clearSelection]);

  // Event handlers
  const handleToggleEditMode = useCallback(() => {
    if (isEditMode && bulkSelection.selectedUsers.length > 0) {
      showConfirm({
        type: 'warning',
        title: 'ยกเลิกการแก้ไข',
        message: 'คุณได้เลือกผู้ใช้งานไว้ การออกจากโหมดแก้ไขจะยกเลิกการเลือกทั้งหมด',
        confirmText: 'ออกจากโหมดแก้ไข',
        cancelText: 'ยกเลิก',
        onConfirm: () => {
          setIsEditMode(false);
          bulkSelection.clearSelection();
          hideConfirm();
        }
      });
    } else {
      setIsEditMode(!isEditMode);
    }
  }, [isEditMode, bulkSelection.selectedUsers.length, bulkSelection.clearSelection, showConfirm, hideConfirm]);

  const handleMainTabChange = useCallback((tab: MainTabKey) => {
    setActiveMainTab(tab);
    setSelectedSection('pending');
    setSearchTerm('');
    setCurrentPage(1);
    bulkSelection.clearSelection();
  }, [bulkSelection.clearSelection]);

  const handleSectionChange = useCallback((section: SectionKey) => {
    setSelectedSection(section);
    bulkSelection.clearSelection();
  }, [bulkSelection.clearSelection]);

  const handleSelectCurrentPage = useCallback(() => {
    bulkSelection.selectCurrentPage(currentPageUserIds);
  }, [bulkSelection.selectCurrentPage, currentPageUserIds]);

  // Modal handlers
  const openSingleUserModal = useCallback((user: User) => {
    setModalUser(user);
    setModalMode('single');
    setShowModal(true);
  }, []);

  const openBulkModal = useCallback(() => {
    const selectedUsersData = filteredUsers.filter(user => 
      bulkSelection.selectedUsers.includes(user.id)
    );
    setBulkUsers(selectedUsersData);
    setModalMode('bulk');
    setShowModal(true);
  }, [filteredUsers, bulkSelection.selectedUsers]);

  const closeModal = useCallback(() => {
    setShowModal(false);
    setModalUser(null);
    setBulkUsers([]);
    setTimeout(() => setModalMode('single'), 300);
  }, []);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showModal) {
        closeModal();
      }
    };
    
    if (showModal) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'auto';
    };
  }, [showModal, closeModal]);

  const handleSavePermissions = useCallback(async (roleId: string) => {
    try {
      const roleDisplayName = getRoleDisplayName(roleId);
      
      if (modalMode === 'single' && modalUser) {
        console.log(`Setting role ${roleId} for user:`, modalUser.name);
        
        if (selectedSection === 'pending') {
          const targetSection = roleId === 'admin' ? 'admin' : roleId === 'staff' ? 'schedule' : 'general';
          moveUser(modalUser.id, 'pending', targetSection);
          addToast({
            type: 'success',
            title: 'บันทึกสิทธิ์สำเร็จ!',
            message: `${modalUser.name} ได้รับสิทธิ์: ${roleDisplayName}`
          });
        } else {
          const targetSection = roleId === 'admin' ? 'admin' : roleId === 'staff' ? 'schedule' : 'general';
          if (targetSection !== selectedSection) {
            moveUser(modalUser.id, selectedSection, targetSection);
          }
          addToast({
            type: 'success',
            title: 'แก้ไขสิทธิ์สำเร็จ!',
            message: `${modalUser.name} ได้รับสิทธิ์: ${roleDisplayName}`
          });
        }
      } else if (modalMode === 'bulk' && bulkUsers.length > 0) {
        const userIds = bulkUsers.map(user => user.id);
        console.log(`Setting role ${roleId} for ${bulkUsers.length} users`);
        
        if (selectedSection === 'pending') {
          const targetSection = roleId === 'admin' ? 'admin' : roleId === 'staff' ? 'schedule' : 'general';
          moveUsers(userIds, 'pending', targetSection);
          addToast({
            type: 'success',
            title: 'บันทึกสิทธิ์สำเร็จ!',
            message: `${bulkUsers.length} คน ได้รับสิทธิ์: ${roleDisplayName}`
          });
        } else {
          const targetSection = roleId === 'admin' ? 'admin' : roleId === 'staff' ? 'schedule' : 'general';
          if (targetSection !== selectedSection) {
            moveUsers(userIds, selectedSection, targetSection);
          }
          addToast({
            type: 'success',
            title: 'แก้ไขสิทธิ์สำเร็จ!',
            message: `${bulkUsers.length} คน ได้รับสิทธิ์: ${roleDisplayName}`
          });
        }
        bulkSelection.clearSelection();
      }
      closeModal();
    } catch (error) {
      console.error('Error saving permissions:', error);
      addToast({
        type: 'error',
        title: 'เกิดข้อผิดพลาด',
        message: 'ไม่สามารถบันทึกสิทธิ์ได้ กรุณาลองใหม่อีกครั้ง'
      });
    }
  }, [modalMode, modalUser, bulkUsers, bulkSelection.clearSelection, closeModal, addToast, selectedSection, moveUser, moveUsers]);

  // Unblock user functions
  const handleUnblockUser = useCallback(async (user: User) => {
    try {
      moveUser(user.id, 'blocked', 'pending');
      console.log('Unblocking user:', user.name);
      addToast({
        type: 'success',
        title: 'ปลดบล็อกสำเร็จ!',
        message: `${user.name} ได้รับการปลดบล็อกและย้ายไปยังรอกำหนดสิทธิ์แล้ว`
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'เกิดข้อผิดพลาด',
        message: 'ไม่สามารถปลดบล็อกผู้ใช้งานได้'
      });
    }
  }, [moveUser, addToast]);

  const handleBulkUnblock = useCallback(async () => {
    const selectedUsersData = filteredUsers.filter(user => 
      bulkSelection.selectedUsers.includes(user.id)
    );
    
    try {
      const userIds = selectedUsersData.map(user => user.id);
      moveUsers(userIds, 'blocked', 'pending');
      console.log('Unblocking users:', selectedUsersData.length);
      addToast({
        type: 'success',
        title: 'ปลดบล็อกสำเร็จ!',
        message: `ปลดบล็อก ${selectedUsersData.length} คน และย้ายไปยังรอกำหนดสิทธิ์แล้ว`
      });
      bulkSelection.clearSelection();
    } catch (error) {
      addToast({
        type: 'error',
        title: 'เกิดข้อผิดพลาด',
        message: 'ไม่สามารถปลดบล็อกผู้ใช้งานได้'
      });
    }
  }, [filteredUsers, bulkSelection, moveUsers, addToast]);

  // Block user functions
  const handleBlockUser = useCallback((user: User) => {
    showConfirm({
      type: 'danger',
      title: 'ยืนยันการบล็อกผู้ใช้งาน',
      message: `คุณต้องการบล็อก "${user.name}" ใช่หรือไม่?`,
      confirmText: 'บล็อก',
      cancelText: 'ยกเลิก',
      onConfirm: async () => {
        setIsLoading(true);
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          blockUser(user.id, selectedSection);
          console.log('Blocking user:', user.name);
          addToast({
            type: 'success',
            title: 'บล็อกผู้ใช้งานสำเร็จ',
            message: `${user.name} ถูกบล็อกเรียบร้อยแล้ว`
          });
        } catch (error) {
          addToast({
            type: 'error',
            title: 'เกิดข้อผิดพลาด',
            message: 'ไม่สามารถบล็อกผู้ใช้งานได้'
          });
        } finally {
          setIsLoading(false);
          hideConfirm();
        }
      }
    });
  }, [showConfirm, addToast, hideConfirm, setIsLoading, blockUser, selectedSection]);

  const handleBulkBlock = useCallback(() => {
    const selectedUsersData = filteredUsers.filter(user => 
      bulkSelection.selectedUsers.includes(user.id)
    );
    
    showConfirm({
      type: 'danger',
      title: 'ยืนยันการบล็อกผู้ใช้งาน',
      message: `คุณต้องการบล็อกผู้ใช้งาน ${selectedUsersData.length} คน ใช่หรือไม่?`,
      confirmText: `บล็อก ${selectedUsersData.length} คน`,
      cancelText: 'ยกเลิก',
      onConfirm: async () => {
        setIsLoading(true);
        try {
          await new Promise(resolve => setTimeout(resolve, 1500));
          const userIds = selectedUsersData.map(user => user.id);
          blockUsers(userIds, selectedSection);
          console.log('Blocking users:', selectedUsersData.length);
          addToast({
            type: 'success',
            title: 'บล็อกผู้ใช้งานสำเร็จ',
            message: `บล็อกผู้ใช้งาน ${selectedUsersData.length} คน เรียบร้อยแล้ว`
          });
          bulkSelection.clearSelection();
        } catch (error) {
          addToast({
            type: 'error',
            title: 'เกิดข้อผิดพลาด',
            message: 'ไม่สามารถบล็อกผู้ใช้งานได้'
          });
        } finally {
          setIsLoading(false);
          hideConfirm();
        }
      }
    });
  }, [filteredUsers, bulkSelection, showConfirm, addToast, hideConfirm, setIsLoading, blockUsers, selectedSection]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <Header 
          isEditMode={isEditMode} 
          onToggleEditMode={handleToggleEditMode}
          isLoading={isLoading}
        />
        
        <MainTabBar 
          activeTab={activeMainTab} 
          onTabChange={handleMainTabChange}
          isEditMode={isEditMode}
        />

        {activeMainTab === 'users' && (
          <>
            <SectionTabBar
              selectedSection={selectedSection}
              onSectionChange={handleSectionChange}
              allUsersData={allUsersData}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              isEditMode={isEditMode}
            />

            <div className="bg-white rounded-lg shadow mb-6">
              <UserListHeader
                selectedSection={selectedSection}
                filteredUsersCount={filteredUsers.length}
                searchTerm={searchTerm}
                currentPage={currentPage}
                totalPages={pagination.totalPages}
                selectedUsers={bulkSelection.selectedUsers}
                selectedInCurrentPage={selectedInCurrentPage}
                currentPageUserIds={currentPageUserIds}
                isCurrentPageFullySelected={isCurrentPageFullySelected}
                isCurrentPagePartiallySelected={isCurrentPagePartiallySelected}
                onSelectCurrentPage={handleSelectCurrentPage}
                onSelectAllPages={bulkSelection.selectAllPages}
                onClearSelection={bulkSelection.clearSelection}
                isSelectAllPages={bulkSelection.isSelectAllPages}
                onOpenBulkModal={openBulkModal}
                onBulkBlock={handleBulkBlock}
                onBulkUnblock={handleBulkUnblock}
                isLoading={isLoading}
                isEditMode={isEditMode}
              />
              
              <div className="divide-y divide-gray-200">
                {paginatedUsers.length > 0 ? (
                  paginatedUsers.map((user) => (
                    <UserCard 
                      key={user.id} 
                      user={user} 
                      section={selectedSection}
                      isSelected={bulkSelection.selectedUsers.includes(user.id)}
                      onSelect={bulkSelection.selectUser}
                      onOpenModal={openSingleUserModal}
                      onBlockUser={handleBlockUser}
                      onUnblockUser={handleUnblockUser}
                      isEditMode={isEditMode}
                    />
                  ))
                ) : (
                  <EmptyState searchTerm={searchTerm} />
                )}
              </div>

              {pagination.totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={pagination.totalPages}
                  visiblePages={pagination.visiblePages}
                  startIndex={pagination.startIndex}
                  endIndex={pagination.endIndex}
                  totalItems={filteredUsers.length}
                  onPageChange={setCurrentPage}
                  isEditMode={isEditMode}
                />
              )}
            </div>
          </>
        )}

        {activeMainTab === 'roles' && <RoleManagementTab isEditMode={isEditMode} addToast={addToast} />}
        
        {/* Toast Notifications */}
        <ToastContainer toasts={toasts} onRemove={removeToast} />
        
        {/* Confirmation Dialog */}
        <ConfirmationDialog dialog={dialog} isLoading={isLoading} />
        
        {/* Modal - only render in edit mode */}
        {showModal && isEditMode && (
          <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                closeModal();
              }
            }}
          >
            <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <UserPermissionsContainer
                userName={
                  modalMode === 'single' 
                    ? modalUser?.name || 'ผู้ใช้งาน'
                    : `${bulkUsers.length} ผู้ใช้งานที่เลือก`
                }
                roles={MODAL_ROLES}
                onSavePermissions={handleSavePermissions}
                onClose={closeModal}
                initialRole={
                  modalMode === 'single' && modalUser
                    ? modalUser.role === 'admin' ? 'admin' 
                      : modalUser.role === 'manager' ? 'staff' 
                      : 'teacher'
                    : undefined
                }
                isBulkMode={modalMode === 'bulk'}
                bulkCount={bulkUsers.length}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ============== Error Boundary ==============
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Dashboard Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
          <div className="text-center">
            <div className="mb-4">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900 mb-2">เกิดข้อผิดพลาด</h1>
            <p className="text-gray-600 mb-4">ขออภัย เกิดข้อผิดพลาดที่ไม่คาดคิด</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              รีเฟรชหน้าเว็บ
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// ============== Main Component Wrapper ==============
const DashboardWithErrorBoundary: React.FC = () => (
  <ErrorBoundary>
      {/* เพิ่ม Navbar ที่ด้านบน */}
      <Navbar />
      
      {/* เนื้อหาหลัก */}
      <main className="flex-1">
        <UserPermissionDashboard />
      </main>
      
      {/* เพิ่ม Footer ที่ด้านล่าง */}
      <Footer />
  </ErrorBoundary>
);


export default DashboardWithErrorBoundary;