"use client"
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Users, User, Calendar, Settings, Search, X, FileText, Info, AlertCircle, CheckCircle, XCircle, Edit3, Eye } from 'lucide-react';
import UserPermissionsContainer from '@/components/modal/UserPermissionsContainer';
import Navbar from '@/components/layout/Header';
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
type SelectionMode = 'none' | 'page' | 'partial' | 'all';

// ============== Constants ==============
const ITEMS_PER_PAGE = 10;
const MAX_VISIBLE_PAGES = 5;

const NAMES = ['สมชาย', 'สมหญิง', 'วิชัย', 'วิมล', 'ประยุทธ์', 'ปรียา', 'สมศักดิ์', 'สุมาลี'];
const SURNAMES = ['ใจดี', 'รักดี', 'มั่นคง', 'สุขใส', 'เจริญ', 'วิจิตร', 'ศรีสุข', 'กิติกุล'];
const DEPARTMENTS = ['hr', 'it', 'marketing', 'sales', 'accounting'];

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

// ============== Custom Hooks ==============
const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { ...toast, id }]);
    
    // Fixed memory leak
    const timer = setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
    
    return () => clearTimeout(timer);
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

// ============== NEW INDUSTRY STANDARD BULK SELECTION HOOK ==============
const useBulkSelection = (allItems: User[], currentPageItems: User[]) => {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [selectionMode, setSelectionMode] = useState<SelectionMode>('none');
  
  // คำนวณ derived states
  const currentPageIds = useMemo(() => new Set(currentPageItems.map(item => item.id)), [currentPageItems]);
  const selectedInCurrentPage = useMemo(() => 
    [...selectedIds].filter(id => currentPageIds.has(id)), 
    [selectedIds, currentPageIds]
  );
  
  const isCurrentPageFullySelected = currentPageItems.length > 0 && 
    currentPageItems.every(item => selectedIds.has(item.id));
  const isCurrentPagePartiallySelected = selectedInCurrentPage.length > 0 && 
    !isCurrentPageFullySelected;

  // Update selection mode based on current state
  const updateSelectionMode = useCallback((newSelectedIds: Set<number>) => {
    if (newSelectedIds.size === 0) {
      setSelectionMode('none');
    } else if (newSelectedIds.size === allItems.length) {
      setSelectionMode('all');
    } else if ([...newSelectedIds].every(id => currentPageIds.has(id)) && 
               newSelectedIds.size === currentPageItems.length) {
      setSelectionMode('page');
    } else {
      setSelectionMode('partial');
    }
  }, [allItems.length, currentPageIds, currentPageItems.length]);

  // Actions
  const selectItem = useCallback((id: number) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      
      updateSelectionMode(newSet);
      return newSet;
    });
  }, [updateSelectionMode]);

  const selectCurrentPage = useCallback(() => {
    if (selectionMode === 'all') {
      // Clear all selection
      setSelectedIds(new Set());
      setSelectionMode('none');
    } else if (isCurrentPageFullySelected) {
      // Deselect current page
      setSelectedIds(prev => {
        const newSet = new Set(prev);
        currentPageItems.forEach(item => newSet.delete(item.id));
        updateSelectionMode(newSet);
        return newSet;
      });
    } else {
      // Select current page
      setSelectedIds(prev => {
        const newSet = new Set(prev);
        currentPageItems.forEach(item => newSet.add(item.id));
        updateSelectionMode(newSet);
        return newSet;
      });
    }
  }, [selectionMode, isCurrentPageFullySelected, currentPageItems, updateSelectionMode]);

  const selectAll = useCallback(() => {
    if (selectionMode === 'all') {
      // Clear all
      setSelectedIds(new Set());
      setSelectionMode('none');
    } else {
      // Select all
      const allIds = new Set(allItems.map(item => item.id));
      setSelectedIds(allIds);
      setSelectionMode('all');
    }
  }, [selectionMode, allItems]);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
    setSelectionMode('none');
  }, []);

  return {
    selectedIds: [...selectedIds], // Convert to array for easier use
    selectedCount: selectedIds.size,
    selectionMode,
    isCurrentPageFullySelected,
    isCurrentPagePartiallySelected,
    selectedInCurrentPage,
    actions: {
      selectItem,
      selectCurrentPage,
      selectAll,
      clearSelection
    }
  };
};

// ============== UI Components ==============
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
          className={`${colors[toast.type]} border rounded-lg p-4 shadow-lg max-w-sm`}
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
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {dialog.cancelText}
            </button>
            <button
              onClick={dialog.onConfirm}
              disabled={isLoading}
              className={`px-4 py-2 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed flex items-center space-x-2 ${colors[dialog.type]}`}
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

const Header: React.FC = () => (
  <div className="mb-6">
    <div className="border-l-4 border-orange-500 pl-4">
      <h1 className="text-xl font-semibold text-gray-900 mb-1">
        กำหนดสิทธิ์ผู้ใช้งาน
      </h1>
      <p className="text-sm text-gray-600">
        จัดการและกำหนดสิทธิ์ให้กับผู้ใช้งาน
      </p>
    </div>
  </div>
);

const SearchBar: React.FC<{ 
  searchTerm: string; 
  onSearchChange: (term: string) => void; 
  isEditMode: boolean;
  onToggleEditMode: () => void;
  isLoading?: boolean;
}> = ({ 
  searchTerm, 
  onSearchChange, 
  isEditMode,
  onToggleEditMode,
  isLoading = false
}) => (
  <div className="p-4">
    <div className="flex items-center justify-between">
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
      
      <button
        onClick={onToggleEditMode}
        disabled={isLoading}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium cursor-pointer ${
          isEditMode
            ? 'bg-slate-600 hover:bg-slate-700 text-white border border-slate-600'
            : 'bg-blue-600 hover:bg-blue-700 text-white border border-blue-600'
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
    
    {isEditMode && (
      <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg flex items-center space-x-2">
        <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0" />
        <div className="text-sm text-orange-800">
          <strong>โหมดแก้ไข:</strong> คุณสามารถเลือกผู้ใช้งานและดำเนินการต่างๆ ได้
        </div>
      </div>
    )}
    
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

const SectionTabBar: React.FC<{ 
  selectedSection: SectionKey; 
  onSectionChange: (section: SectionKey) => void; 
  allUsersData: Record<SectionKey, User[]>;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  isEditMode: boolean;
  onToggleEditMode: () => void;
  isLoading?: boolean;
}> = ({ 
  selectedSection, 
  onSectionChange, 
  allUsersData,
  searchTerm,
  onSearchChange,
  isEditMode,
  onToggleEditMode,
  isLoading = false
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
      <SearchBar 
        searchTerm={searchTerm} 
        onSearchChange={onSearchChange} 
        isEditMode={isEditMode}
        onToggleEditMode={onToggleEditMode}
        isLoading={isLoading}
      />
    </div>
  );
};

const UserCard: React.FC<{
  user: User;
  section: SectionKey;
  isSelected: boolean;
  onSelect: (userId: number) => void;
  onOpenModal: (user: User) => void;
  onBlockUser: (user: User) => void;
  onUnblockUser: (user: User) => void;
  isEditMode: boolean;
}> = ({ 
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
    
    const buttonClass = "px-3 py-1 text-xs text-white rounded hover:opacity-90 cursor-pointer";
    
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

const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  visiblePages: number[];
  startIndex: number;
  endIndex: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}> = ({
  currentPage,
  totalPages,
  visiblePages,
  startIndex,
  endIndex,
  totalItems,
  onPageChange
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

// ============== UPDATED USER LIST HEADER ==============
const UserListHeader: React.FC<{
  selectedSection: SectionKey;
  filteredUsersCount: number;
  searchTerm: string;
  currentPage: number;
  totalPages: number;
  bulkSelection: ReturnType<typeof useBulkSelection>;
  currentPageUsers: User[];
  onOpenBulkModal: () => void;
  onBulkBlock: () => void;
  onBulkUnblock: () => void;
  isLoading?: boolean;
  isEditMode: boolean;
}> = ({
  selectedSection,
  filteredUsersCount,
  searchTerm,
  currentPage,
  totalPages,
  bulkSelection,
  currentPageUsers,
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

  // Fixed checkbox state - ใช้ pattern เดียวกับ Gmail
  const getCheckboxState = () => {
    if (bulkSelection.selectionMode === 'all') {
      return { checked: true, indeterminate: false };
    }
    if (bulkSelection.isCurrentPageFullySelected) {
      return { checked: true, indeterminate: false };
    }
    if (bulkSelection.isCurrentPagePartiallySelected) {
      return { checked: false, indeterminate: true };
    }
    return { checked: false, indeterminate: false };
  };

  const checkboxState = getCheckboxState();

  const renderSelectionSummary = () => {
    if (!isEditMode || bulkSelection.selectedCount === 0) return null;

    return (
      <div className="text-xs text-gray-500 mt-1">
        <span className="text-indigo-600 font-medium">
          เลือกแล้ว {bulkSelection.selectedCount} คน
        </span>
        
        {/* แสดง selection mode แบบ Gmail style */}
        {bulkSelection.selectionMode === 'all' && (
          <span className="text-green-600 ml-2 font-medium">
            (ทุกหน้า)
          </span>
        )}
        
        {bulkSelection.selectionMode === 'page' && (
          <span className="text-blue-600 ml-2 font-medium">
            (หน้านี้ทั้งหมด)
          </span>
        )}
        
        {(bulkSelection.selectionMode === 'partial' || bulkSelection.selectionMode === 'none') && 
         bulkSelection.selectedCount > 0 && (
          <span className="text-gray-600 ml-2">
            (บางรายการ)
          </span>
        )}
      </div>
    );
  };

  const renderSelectionActions = () => {
    if (!isEditMode || bulkSelection.selectedCount === 0) return null;

    return (
      <div className="flex items-center space-x-3 mt-2">
        {/* แสดงปุ่ม "เลือกทุกหน้า" เหมือน Gmail */}
        {bulkSelection.selectionMode !== 'all' && 
         bulkSelection.selectedCount > 0 && 
         filteredUsersCount > currentPageUsers.length && (
          <button 
            onClick={bulkSelection.actions.selectAll}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center space-x-1 cursor-pointer"
          >
            <span>เลือกทั้งหมด {filteredUsersCount} คน</span>
          </button>
        )}
        
        <button 
          onClick={bulkSelection.actions.clearSelection}
          className="text-xs text-slate-500 hover:text-slate-700 font-medium flex items-center space-x-1 cursor-pointer"
        >
          <X size={12} />
          <span>ล้างการเลือก</span>
        </button>
      </div>
    );
  };

  const renderBulkActions = () => {
    if (!isEditMode || bulkSelection.selectedCount === 0) return null;

    const baseButtonClass = "group relative px-3 py-2 text-sm font-medium rounded-md flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1";
    
    switch (selectedSection) {
      case 'pending':
        return (
          <div className="flex items-center gap-2">
            <button 
              onClick={onOpenBulkModal}
              disabled={isLoading}
              className={`${baseButtonClass}  hover:bg-blue-500/10 text-blue-700 border border-blue-200/60 hover:border-blue-300/80 focus:ring-blue-500/30`}
            >
              <Settings size={14} className="text-blue-600" />
              <span>มอบสิทธิ์</span>
              <div className="ml-1 px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                {bulkSelection.selectedCount}
              </div>
            </button>
            <button 
              onClick={onBulkBlock}
              disabled={isLoading}
              className={`${baseButtonClass}  hover:bg-red-500/10 text-red-700 border border-red-200/60 hover:border-red-300/80 focus:ring-red-500/30`}
            >
              {isLoading ? (
                <div className="w-3.5 h-3.5 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <XCircle size={14} className="text-red-600" />
              )}
              <span>บล็อก</span>
              <div className="ml-1 px-1.5 py-0.5 bg-red-100 text-red-700 rounded text-xs font-medium">
                {bulkSelection.selectedCount}
              </div>
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
            className={`${baseButtonClass}  hover:bg-slate-500/10 text-slate-700 border border-slate-200/60 hover:border-slate-300/80 focus:ring-slate-500/30`}
          >
            <Settings size={14} className="text-slate-600" />
            <span>แก้ไขสิทธิ์</span>
            <div className="ml-1 px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded text-xs font-medium">
              {bulkSelection.selectedCount}
            </div>
          </button>
        );
      case 'blocked':
        return (
          <button 
            onClick={onBulkUnblock}
            className={`${baseButtonClass} bg-green-500/10 hover:bg-green-500/20 text-green-700 border border-green-200/60 hover:border-green-300/80 focus:ring-green-500/30`}
          >
            <CheckCircle size={14} className="text-green-600" />
            <span>ปลดบล็อก</span>
            <div className="ml-1 px-1.5 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">
              {bulkSelection.selectedCount}
            </div>
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
                checked={checkboxState.checked}
                ref={(el) => {
                  if (el) el.indeterminate = checkboxState.indeterminate;
                }}
                onChange={bulkSelection.actions.selectCurrentPage}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
              />
              
              {/* แสดง dot indicator เหมือน Gmail เมื่อมี selection ข้าม page */}
              {bulkSelection.selectionMode === 'all' && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></div>
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
            
            {renderSelectionSummary()}
            {renderSelectionActions()}
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {renderBulkActions()}
          

        </div>
      </div>
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

// ============== Main Component ==============
const UserPermissionDashboard: React.FC = () => {
  // Main states
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

  // Custom hooks
  const { toasts, addToast, removeToast } = useToast();
  const { dialog, showConfirm, hideConfirm } = useConfirmDialog();
  const { usersData: allUsersData, moveUser, moveUsers, blockUser, blockUsers } = useUserData();
  
  // Data processing
  const currentUsers = allUsersData[selectedSection] || [];
  const filteredUsers = useUserSearch(currentUsers, searchTerm);
  const pagination = usePagination(filteredUsers.length, currentPage, ITEMS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(pagination.startIndex, pagination.startIndex + ITEMS_PER_PAGE);
  
  // NEW BULK SELECTION - using industry standard hook
  const bulkSelection = useBulkSelection(filteredUsers, paginatedUsers);

  // Effects
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedSection]);

  useEffect(() => {
    bulkSelection.actions.clearSelection();
  }, [selectedSection]);

  useEffect(() => {
    if (!isEditMode) {
      bulkSelection.actions.clearSelection();
      setSearchTerm('');
    }
  }, [isEditMode]);

  // Event handlers
  const handleToggleEditMode = useCallback(() => {
    if (isEditMode && bulkSelection.selectedCount > 0) {
      showConfirm({
        type: 'warning',
        title: 'ยกเลิกการแก้ไข',
        message: 'คุณได้เลือกผู้ใช้งานไว้ การออกจากโหมดแก้ไขจะยกเลิกการเลือกทั้งหมด',
        confirmText: 'ออกจากโหมดแก้ไข',
        cancelText: 'ยกเลิก',
        onConfirm: () => {
          setIsEditMode(false);
          bulkSelection.actions.clearSelection();
          hideConfirm();
        }
      });
    } else {
      setIsEditMode(!isEditMode);
    }
  }, [isEditMode, bulkSelection.selectedCount, bulkSelection.actions.clearSelection, showConfirm, hideConfirm]);

  const handleSectionChange = useCallback((section: SectionKey) => {
    setSelectedSection(section);
  }, []);

  // Modal handlers
  const openSingleUserModal = useCallback((user: User) => {
    setModalUser(user);
    setModalMode('single');
    setShowModal(true);
  }, []);

  const openBulkModal = useCallback(() => {
    const selectedUsersData = filteredUsers.filter(user => 
      bulkSelection.selectedIds.includes(user.id)
    );
    setBulkUsers(selectedUsersData);
    setModalMode('bulk');
    setShowModal(true);
  }, [filteredUsers, bulkSelection.selectedIds]);

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
        bulkSelection.actions.clearSelection();
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
  }, [modalMode, modalUser, bulkUsers, bulkSelection.actions, closeModal, addToast, selectedSection, moveUser, moveUsers]);

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
      bulkSelection.selectedIds.includes(user.id)
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
      bulkSelection.actions.clearSelection();
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
      bulkSelection.selectedIds.includes(user.id)
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
          bulkSelection.actions.clearSelection();
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
        <Header />
        
        <SectionTabBar
          selectedSection={selectedSection}
          onSectionChange={handleSectionChange}
          allUsersData={allUsersData}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          isEditMode={isEditMode}
          onToggleEditMode={handleToggleEditMode}
          isLoading={isLoading}
        />

        <div className="bg-white rounded-lg shadow mb-6">
          <UserListHeader
            selectedSection={selectedSection}
            filteredUsersCount={filteredUsers.length}
            searchTerm={searchTerm}
            currentPage={currentPage}
            totalPages={pagination.totalPages}
            bulkSelection={bulkSelection}
            currentPageUsers={paginatedUsers}
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
                  isSelected={bulkSelection.selectedIds.includes(user.id)}
                  onSelect={bulkSelection.actions.selectItem}
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
            />
          )}
        </div>
        
        <ToastContainer toasts={toasts} onRemove={removeToast} />
        <ConfirmationDialog dialog={dialog} isLoading={isLoading} />
        
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
              <div className="w-16 h-16 text-red-500 mx-auto">⚠️</div>
            </div>
            <h1 className="text-xl font-semibold text-gray-900 mb-2">เกิดข้อผิดพลาด</h1>
            <p className="text-gray-600 mb-4">ขออภัย เกิดข้อผิดพลาดที่ไม่คาดคิด</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
    <Navbar />
    <main className="flex-1">
      <UserPermissionDashboard />
    </main>
    <Footer />
  </ErrorBoundary>
);

export default DashboardWithErrorBoundary;