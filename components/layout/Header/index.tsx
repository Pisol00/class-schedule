'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Types
interface NavigationItem {
  name: string;
  icon: string;
  href: string;
}

interface User {
  name: string;
  role: string;
}

interface DropdownProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

// Constants
const NAVIGATION_ITEMS: NavigationItem[] = [
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

const CURRENT_USER: User = {
  name: 'อาจารย์สมชาย ใจดี',
  role: 'เจ้าหน้าที่ฝ่ายวิชาการ'
};

const MENU_ITEMS = [
  {
    icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    label: 'โปรไฟล์',
    href: '/userprofile'
  },
  {
    icon: 'M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1',
    label: 'ออกจากระบบ',
    href: '/login',
    className: 'text-red-600 hover:bg-red-50'
  }
];

// Custom Hooks
const useClickOutside = (callback: () => void) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown-container')) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [callback]);
};

const useKeyboardShortcuts = (onEscape: () => void) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onEscape();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onEscape]);
};

// UI Components
const Icon = ({ path, className = "w-4 h-4" }: { path: string; className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={path} />
  </svg>
);

const UserAvatar = ({ size = "w-10 h-10" }: { size?: string }) => (
  <div className={`${size} bg-slate-200 rounded-full flex items-center justify-center relative`}>
    <svg className="w-5 h-5 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full" />
  </div>
);

const Dropdown = ({ isOpen, onClose, children }: DropdownProps) => {
  useClickOutside(onClose);

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-full mt-2 w-64 py-2 bg-white border border-slate-200 rounded-xl shadow-lg z-50 animate-fadeIn dropdown-container">
      {children}
    </div>
  );
};

// Main Components
const Logo = () => (
  <Link href="/" className="flex items-center cursor-pointer hover:opacity-80 transition-opacity">
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
  </Link>
);

const NavigationLink = ({ item }: { item: NavigationItem }) => (
  <Link
    href={item.href}
    className="text-sm font-medium text-slate-600 hover:text-slate-900 px-4 py-2.5 rounded-lg transition-all duration-200 flex items-center space-x-2 relative group hover:bg-slate-50"
  >
    <Icon path={item.icon} className="w-4 h-4 transition-transform group-hover:scale-110" />
    <span>{item.name}</span>
    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-blue-500 group-hover:w-3/4 transition-all duration-200" />
  </Link>
);

const Navigation = () => (
  <nav className="flex items-center justify-center space-x-1">
    {NAVIGATION_ITEMS.map((item) => (
      <NavigationLink key={item.name} item={item} />
    ))}
  </nav>
);

const UserInfo = ({ user }: { user: User }) => (
  <div className="text-right">
    <div className="text-sm font-medium text-slate-900">{user.name}</div>
    <div className="text-xs text-slate-500">{user.role}</div>
  </div>
);

const MenuItem = ({ 
  icon, 
  label, 
  onClick, 
  className = "" 
}: { 
  icon: string; 
  label: string; 
  onClick: () => void; 
  className?: string; 
}) => (
  <button
    className={`flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer w-full text-left ${className}`}
    onClick={onClick}
  >
    <Icon path={icon} className="w-4 h-4 mr-3 text-slate-500" />
    {label}
  </button>
);

const ProfileDropdown = ({ user, onClose }: { user: User; onClose: () => void }) => {
  const router = useRouter();

  const handleMenuClick = (href: string) => {
    onClose();
    router.push(href);
  };

  return (
    <>
      {/* User Info Header */}
      <div className="px-4 py-3 border-b border-slate-100">
        <div className="flex items-center space-x-3">
          <UserAvatar />
          <div>
            <div className="text-sm font-medium text-slate-900">{user.name}</div>
            <div className="text-xs text-slate-500">{user.role}</div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="py-1">
        {MENU_ITEMS.map((item, index) => (
          <MenuItem
            key={index}
            icon={item.icon}
            label={item.label}
            onClick={() => handleMenuClick(item.href)}
            className={item.className}
          />
        ))}
      </div>
    </>
  );
};

const UserProfile = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const closeDropdown = () => setIsDropdownOpen(false);

  useKeyboardShortcuts(closeDropdown);

  return (
    <div className="relative">
      <button
        className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center hover:bg-slate-300 transition-colors relative cursor-pointer"
        onClick={toggleDropdown}
      >
        <svg className="w-5 h-5 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full" />
      </button>

      <Dropdown isOpen={isDropdownOpen} onClose={closeDropdown}>
        <ProfileDropdown user={CURRENT_USER} onClose={closeDropdown} />
      </Dropdown>
    </div>
  );
};

// Main Header Component
export default function Header() {
  return (
    <>
      <style jsx>{`
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
      `}</style>

      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Logo />
            <Navigation />
            <div className="flex items-center justify-end space-x-3">
              <UserInfo user={CURRENT_USER} />
              <UserProfile />
            </div>
          </div>
        </div>
      </header>
    </>
  );
}