"use client"
import React, { useState } from 'react';
import { X, User, Check, Settings, GraduationCap, Calendar } from 'lucide-react';

// Types
interface Role {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  description: string;
}

interface UserPermissionsModalProps {
  userName: string;
  userAvatar?: string;
  roles?: Role[];
  onSavePermissions: (roleId: string) => Promise<void>;
  onClose?: () => void;
  initialRole?: string;
  isBulkMode?: boolean;
  bulkCount?: number;
}

interface UserPermissionsContainerProps {
  userName?: string;
  userAvatar?: string;
  roles?: Role[];
  onSavePermissions?: (roleId: string) => Promise<void>;
  onClose?: () => void;
  initialRole?: string;
  isBulkMode?: boolean;
  bulkCount?: number;
}

// Default roles data
const defaultRoles: Role[] = [
  {
    id: 'teacher',
    title: 'ผู้ใช้งานทั่วไป',
    icon: GraduationCap,
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

// Default save function
const defaultSavePermissions = async (roleId: string): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      alert(`บันทึกสิทธิ์สำเร็จ! ได้รับสิทธิ์: ${roleId}`);
      resolve();
    }, 1500);
  });
};

// Modal Component
const UserPermissionsModal: React.FC<UserPermissionsModalProps> = ({
  userName,
  userAvatar,
  roles = defaultRoles,
  onSavePermissions,
  onClose,
  initialRole,
  isBulkMode = false,
  bulkCount = 0
}) => {
  const [selectedRole, setSelectedRole] = useState<string | null>(initialRole || null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedRole) return;

    setIsSubmitting(true);
    try {
      await onSavePermissions(selectedRole);
      // Modal will be closed by parent component after successful save
    } catch (error) {
      console.error('Error saving permissions:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting && onClose) {
      onClose();
    }
  };

  const getHeaderTitle = () => {
    if (isBulkMode) {
      return `กำหนดสิทธิ์สำหรับ ${bulkCount} ผู้ใช้งาน`;
    }
    return `กำหนดสิทธิ์สำหรับ ${userName}`;
  };

  const getHeaderDescription = () => {
    if (isBulkMode) {
      return `กำหนดสิทธิ์ให้กับผู้ใช้งาน ${bulkCount} คนที่เลือกไว้`;
    }
    return 'กำหนดสิทธิ์ในระบบสำหรับผู้ใช้งานที่เลือก';
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg max-w-4xl w-full animate-in zoom-in-95 duration-300">
      {/* Header */}
      <div className="flex items-start justify-between p-6 pb-4">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center overflow-hidden transition-all duration-200 hover:scale-105">
            {!isBulkMode && userAvatar ? (
              <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
            ) : isBulkMode ? (
              <div className="text-blue-600 font-bold text-lg">{bulkCount}</div>
            ) : (
              <User className="w-6 h-6 text-gray-600" />
            )}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1 transition-colors duration-200">
              {getHeaderTitle()}
            </h2>
            <p className="text-gray-500 text-sm transition-colors duration-200">
              {getHeaderDescription()}
            </p>
          </div>
        </div>
        <button
          onClick={handleClose}
          className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200 cursor-pointer hover:scale-110"
          disabled={isSubmitting}
          title="ปิด"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="px-6 py-6 animate-in slide-in-from-top duration-300 delay-100">
        <div className="mb-4">
          <p className="text-sm text-gray-600 transition-colors duration-200">
            {isBulkMode ? 'เลือกบทบาทที่ต้องการกำหนดให้กับผู้ใช้งานทั้งหมด:' : 'เลือกบทบาทที่เหมาะสม:'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roles.map((role) => {
            const IconComponent = role.icon;
            const isSelected = selectedRole === role.id;

            return (
              <div
                key={role.id}
                onClick={() => !isSubmitting && setSelectedRole(role.id)}
                className={`
                  relative border-2 rounded-lg p-6 text-center cursor-pointer transition-all duration-300 group h-40 flex flex-col justify-center items-center transform hover:scale-105 hover:shadow-lg
                  ${isSelected
                    ? 'border-blue-500 bg-blue-50 shadow-md scale-105'
                    : 'border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                  }
                  ${isSubmitting ? 'cursor-not-allowed opacity-60' : ''}
                `}
              >
                {/* Selection indicator */}
                {isSelected && (
                  <div className="absolute top-3 right-3 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center animate-in zoom-in-95 duration-200">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}

                <div className="flex justify-center mb-3">
                  <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 transform
                    ${isSelected
                      ? 'bg-blue-100 scale-110'
                      : 'bg-gray-200 group-hover:bg-gray-300 group-hover:scale-105'
                    }
                  `}>
                    <IconComponent className={`
                      w-6 h-6 transition-all duration-300
                      ${isSelected
                        ? 'text-blue-600 scale-110'
                        : 'text-gray-600 group-hover:text-gray-700'
                      }
                    `} />
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className={`
                    font-semibold transition-all duration-300 text-sm transform
                    ${isSelected ? 'text-blue-900 scale-105' : 'text-gray-900'}
                  `}>
                    {role.title}
                  </h3>

                  <div className={`overflow-hidden transition-all duration-300 ${isSelected ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <p className="text-xs text-blue-600 pt-1">
                      {role.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end space-x-3 p-6 pt-2 border-t border-gray-100">
        <button
          onClick={handleClose}
          className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transform hover:scale-105 hover:shadow-md"
          disabled={isSubmitting}
        >
          ยกเลิก
        </button>
        <button
          onClick={handleSubmit}
          disabled={!selectedRole || isSubmitting}
          className={`
            px-6 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 transform hover:scale-105 cursor-pointer
            ${selectedRole && !isSubmitting
              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-lg'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>กำลังบันทึก...</span>
            </>
          ) : (
            <span>{isBulkMode ? `ยืนยันสำหรับ ${bulkCount} คน` : 'ยืนยัน'}</span>
          )}
        </button>
      </div>
    </div>
  );
};

// Container Component
const UserPermissionsContainer: React.FC<UserPermissionsContainerProps> = ({
  userName = "สมชาย ใจดี",
  userAvatar,
  roles = defaultRoles,
  onSavePermissions = defaultSavePermissions,
  onClose,
  initialRole,
  isBulkMode = false,
  bulkCount = 0
}) => {
  return (
    <UserPermissionsModal
      userName={userName}
      userAvatar={userAvatar}
      roles={roles}
      onSavePermissions={onSavePermissions}
      onClose={onClose}
      initialRole={initialRole}
      isBulkMode={isBulkMode}
      bulkCount={bulkCount}
    />
  );
};

export default UserPermissionsContainer;