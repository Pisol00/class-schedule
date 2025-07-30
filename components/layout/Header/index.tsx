'use client';
import { useState, useEffect } from 'react';

// Types
interface NavigationItem {
  name: string;
  icon: string;
  href: string;
}

interface UserProfileProps {
  showDropdown: boolean;
  setShowDropdown: (show: boolean) => void;
}

interface ProfileMenuItem {
  icon: string;
  label: string;
  className?: string;
  onClick?: () => void;
}

// Logo Component
const Logo = () => {
  return (
    <a 
      href="/" 
      className="flex items-center cursor-pointer hover:opacity-80 transition-opacity"
      onClick={(e) => {
        e.preventDefault();
        window.location.href = '/';
      }}
    >
      <img
        src="/logo.png"
        alt="สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง"
        width={80}
        className="object-contain"
      />

      <div className="flex flex-col">
        <span className="text-slate-800 font-semibold text-lg hidden sm:block">
          KMITL
        </span>
        <span className="text-slate-500 font-medium text-xs hidden sm:block">
          ระบบจัดตารางสอน
        </span>
      </div>
    </a>
  );
};


// Navigation Menu Items
const navMenuItems: NavigationItem[] = [
  {
    name: 'หลักสูตร',
    icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    href: '/curriculum'
  },
  {
    name: 'รายวิชา',
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    href: '/subjects'
  },
  {
    name: 'อาจารย์',
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
    href: '/instructors'
  },
  {
    name: 'ห้องเรียน',
    icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
    href: '/rooms'
  }
];

// Navigation Component
const Navigation = () => {
  return (
    <nav className="flex items-center justify-center space-x-1">
      {navMenuItems.map((item) => (
        <NavLink
          key={item.name}
          href={item.href}
          icon={item.icon}
          onClick={() => alert(`เปิดหน้า${item.name}`)}
        >
          {item.name}
        </NavLink>
      ))}
    </nav>
  );
};

// Navigation Link Component
const NavLink = ({
  href,
  icon,
  children,
  onClick
}: {
  href: string;
  icon: string;
  children: React.ReactNode;
  onClick?: () => void;
}) => {
  return (
    <a
      href={href}
      className="text-sm font-medium text-slate-600 hover:text-slate-900 px-4 py-2.5 rounded-lg transition-all duration-200 flex items-center space-x-2 relative group hover:bg-slate-50"
      onClick={(e) => {
        e.preventDefault();
        onClick?.();
      }}
    >
      <svg className="w-4 h-4 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon} />
      </svg>
      <span>{children}</span>
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-blue-500 group-hover:w-3/4 transition-all duration-200" />
    </a>
  );
};

// Profile Menu Item Component
const ProfileMenuItem = ({ icon, label, className = "", onClick }: ProfileMenuItem) => {
  return (
    <a
      href="#"
      className={`flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer ${className}`}
      onClick={(e) => {
        e.preventDefault();
        onClick?.();
      }}
    >
      <svg className="w-4 h-4 mr-3 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon} />
      </svg>
      {label}
    </a>
  );
};

// User Profile Component
const UserProfile = ({ showDropdown, setShowDropdown }: UserProfileProps) => {
  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.user-profile-container')) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown, setShowDropdown]);

  return (
    <div className="relative user-profile-container">
      <button
        className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center hover:bg-slate-300 transition-colors relative cursor-pointer"
        onClick={handleButtonClick}
      >
        <svg className="w-5 h-5 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
        {/* Online Status Indicator */}
        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
      </button>

      {/* Profile Dropdown */}
      {showDropdown && (
        <div className="absolute right-0 top-full mt-2 w-64 py-2 bg-white border border-slate-200 rounded-xl shadow-lg z-50 animate-fadeIn ">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-slate-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-medium text-slate-900">อาจารย์สมชาย ใจดี</div>
                <div className="text-xs text-slate-500">เจ้าหน้าที่ฝ่ายวิชาการ</div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <ProfileMenuItem
              icon="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              label="โปรไฟล์"
              onClick={() => {
                setShowDropdown(false);
                alert('เปิดหน้าโปรไฟล์');
              }}
            />

            <ProfileMenuItem
              icon="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              label="ตั้งค่า"
              onClick={() => {
                setShowDropdown(false);
                alert('เปิดหน้าตั้งค่า');
              }}
            />
          </div>

          <div className="border-t border-slate-100 py-1">
            <ProfileMenuItem
              icon="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              label="ออกจากระบบ"
              className="text-red-600 hover:bg-red-50"
              onClick={() => {
                setShowDropdown(false);
                if (confirm('ต้องการออกจากระบบหรือไม่?')) {
                  alert('ออกจากระบบสำเร็จ');
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Main Header Component
export default function Header() {
  const [showProfileDropdown, setShowProfileDropdown] = useState<boolean>(false);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <style>
        {`
          .animate-fadeIn {
            animation: fadeIn 0.15s ease-out;
          }
          
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(-8px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `}
      </style>

      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo Section */}
            <div className="flex items-center">
              <Logo/>
            </div>

            {/* Navigation Menu - Desktop */}
            <Navigation />

            {/* User Profile & Actions */}
            <div className="flex items-center justify-end space-x-3">
              {/* User Info - Desktop */}
              <div className="text-right">
                <div className="text-sm font-medium text-slate-900">อาจารย์สมชาย ใจดี</div>
                <div className="text-xs text-slate-500">เจ้าหน้าที่ฝ่ายวิชาการ</div>
              </div>

              {/* User Avatar & Dropdown */}
              <UserProfile
                showDropdown={showProfileDropdown}
                setShowDropdown={setShowProfileDropdown}
              />
            </div>
          </div>
        </div>
      </header>
    </>
  );
}