'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  BookOpen, 
  FileText, 
  Users, 
  Building, 
  User, 
  Settings,
  LogOut,
  LucideIcon
} from 'lucide-react';

// Types
interface NavigationItem {
  name: string;
  icon: LucideIcon;
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

interface MenuItemType {
  icon: LucideIcon;
  label: string;
  href: string;
  className?: string;
}

// Constants
const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    name: 'หลักสูตร',
    icon: BookOpen,
    href: '/curriculum'
  },
  {
    name: 'รายวิชา',
    icon: FileText,
    href: '/subjects'
  },
  {
    name: 'อาจารย์',
    icon: Users,
    href: '/instructors'
  },
  {
    name: 'ห้องเรียน',
    icon: Building,
    href: '/rooms'
  }
];

const CURRENT_USER: User = {
  name: 'อาจารย์สมชาย ใจดี',
  role: 'เจ้าหน้าที่ฝ่ายวิชาการ'
};

const MENU_ITEMS: MenuItemType[] = [
  {
    icon: User,
    label: 'โปรไฟล์',
    href: '/userprofile'
  },
  {
    icon: Settings,
    label: 'จัดการผู้ใช้งาน',
    href: '/usermanagement'
  },
  {
    icon: LogOut,
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
const UserAvatar = ({ size = "w-10 h-10" }: { size?: string }) => (
  <div className={`${size} bg-slate-200 rounded-full flex items-center justify-center relative`}>
    <User className="w-5 h-5 text-slate-600" />
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

const NavigationLink = ({ item }: { item: NavigationItem }) => {
  const IconComponent = item.icon;
  
  return (
    <Link
      href={item.href}
      className="text-sm font-medium text-slate-600 hover:text-slate-900 px-4 py-2.5 rounded-lg transition-all duration-200 flex items-center space-x-2 relative group hover:bg-slate-50"
    >
      <IconComponent className="w-4 h-4 transition-transform group-hover:scale-110" />
      <span>{item.name}</span>
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-blue-500 group-hover:w-3/4 transition-all duration-200" />
    </Link>
  );
};

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
  icon: IconComponent, 
  label, 
  onClick, 
  className = "" 
}: { 
  icon: LucideIcon; 
  label: string; 
  onClick: () => void; 
  className?: string; 
}) => (
  <button
    className={`flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer w-full text-left ${className}`}
    onClick={onClick}
  >
    <IconComponent className="w-4 h-4 mr-3 text-slate-500" />
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
        <User className="w-5 h-5 text-slate-600" />
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