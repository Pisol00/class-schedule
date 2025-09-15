"use client";
import { MapPin, Phone } from 'lucide-react';

// Types
interface ContactItemProps {
  icon: React.ReactNode;
  text: string;
}

interface UniversityInfo {
  facultyName: string;
  universityName: string;
  logoSrc: string;
  logoAlt: string;
}

interface ContactInfo {
  address: string;
  phone: string;
}

// Constants
const UNIVERSITY_INFO: UniversityInfo = {
  facultyName: 'คณะเทคโนโลยีสารสนเทศ',
  universityName: 'สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง',
  logoSrc: '/logo.png',
  logoAlt: 'สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง'
};

const CONTACT_INFO: ContactInfo = {
  address: 'เลขที่ 1 ซอยฉลองกรุง 1 แขวงลาดกระบัง เขตลาดกระบัง กรุงเทพฯ 10520',
  phone: '02-723-4900'
};

const COPYRIGHT_YEAR = new Date().getFullYear();

// Components
const ContactItem = ({ icon, text }: ContactItemProps) => (
  <div className="flex items-start space-x-3 text-sm text-gray-600">
    <div className="text-gray-500 mt-0.5 flex-shrink-0">
      {icon}
    </div>
    <span className="leading-relaxed">{text}</span>
  </div>
);

const UniversitySection = ({ info }: { info: UniversityInfo }) => (
  <div className="flex-1">
    <div className="flex items-center">
      <img
        src={info.logoSrc}
        alt={info.logoAlt}
        width={80}
        className="object-contain"
      />
      <div>
        <h3 className="text-lg font-bold text-gray-900">
          {info.facultyName}
        </h3>
        <p className="text-sm text-gray-600">
          {info.universityName}
        </p>
      </div>
    </div>
  </div>
);

const ContactSection = ({ contact }: { contact: ContactInfo }) => (
  <div className="flex-1 lg:max-w-md">
    <div className="space-y-2">
      <ContactItem
        icon={<MapPin className="w-4 h-4" />}
        text={contact.address}
      />
      <ContactItem
        icon={<Phone className="w-4 h-4" />}
        text={contact.phone}
      />
    </div>
  </div>
);

const CopyrightSection = ({ year }: { year: number }) => (
  <div className="border-t border-gray-200 mt-8 pt-6">
    <div className="flex flex-col md:flex-row md:items-center md:justify-center">
      <div className="text-xs text-gray-600">
        <p>
          สงวนลิขสิทธิ์ © {year} คณะเทคโนโลยีสารสนเทศ สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง
        </p>
      </div>
    </div>
  </div>
);

// Main Footer Component
const Footer = () => {
  return (
    <footer className="bg-gray-50 text-gray-700 border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-8">
        {/* Main Content */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
          <UniversitySection info={UNIVERSITY_INFO} />
          <ContactSection contact={CONTACT_INFO} />
        </div>

        {/* Copyright */}
        <CopyrightSection year={COPYRIGHT_YEAR} />
      </div>
    </footer>
  );
};

export default Footer;