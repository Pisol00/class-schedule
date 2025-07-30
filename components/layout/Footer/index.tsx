"use client";
import { MapPin, Phone } from 'lucide-react';

// Interface definitions
interface ContactItemProps {
  icon: React.ReactNode;
  text: string;
}

// Main Footer Component
const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 text-gray-700 border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-8">
        {/* Main Content */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">

          {/* University Info - Left Side */}
          <div className="flex-1">
            <div className="flex items-center">
                <img
                  src="/logo.png"
                  alt="สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง"
                  width={80}
                  className="object-contain"
                />

              <div>
                <h3 className="text-lg font-bold text-gray-900">คณะเทคโนโลยีสารสนเทศ</h3>
                <p className="text-sm text-gray-600">สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง</p>
              </div>
            </div>
          </div>

          {/* Contact Info - Right Side */}
          <div className="flex-1 lg:max-w-md">
            <div className="space-y-2">
              <ContactItem
                icon={<MapPin className="w-4 h-4" />}
                text="เลขที่ 1 ซอยฉลองกรุง 1 แขวงลาดกระบัง เขตลาดกระบัง กรุงเทพฯ 10520"
              />
              <ContactItem
                icon={<Phone className="w-4 h-4" />}
                text="02-723-4900"
              />
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 mt-8 pt-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-center">
            {/* Copyright */}
            <div className="text-sm text-gray-600">
              <p>© 2025 คณะเทคโนโลยีสารสนเทศ สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง - สงวนลิขสิทธิ์ทุกประการ</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Contact Item Component
const ContactItem: React.FC<ContactItemProps> = ({ icon, text }) => {
  return (
    <div className="flex items-start space-x-3 text-sm text-gray-600">
      <div className="text-gray-500 mt-0.5 flex-shrink-0">
        {icon}
      </div>
      <span className="leading-relaxed">{text}</span>
    </div>
  );
};

export default Footer;