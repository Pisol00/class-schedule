import React from 'react';
import { User, Mail } from 'lucide-react';
import Navbar from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// Profile Header Component
const ProfileHeader = ({ name, title }) => (
  <header className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-2xl px-12 py-12 text-center shadow-lg">
    {/* Avatar */}
    <div className="inline-block mb-8">
      <div className="w-24 h-24 bg-white rounded-full mx-auto flex items-center justify-center shadow-lg border-4 border-white">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
          <User className="w-8 h-8 text-gray-400" />
        </div>
      </div>
    </div>
    
    {/* User Info */}
    <div>
      <h1 className="text-white text-2xl font-semibold mb-3">{name}</h1>
      <p className="text-blue-100 text-base opacity-90">{title}</p>
    </div>
  </header>
);

// Info Field Component
const InfoField = ({ label, value, icon: Icon }) => (
  <div className="space-y-3">
    <label className="block text-sm font-medium text-gray-600">{label}</label>
    <div className="flex items-center px-5 py-4 border border-gray-200 rounded-xl bg-gray-50">
      <Icon className="w-5 h-5 text-gray-400 mr-4 flex-shrink-0" />
      <span className="text-gray-700 text-base">{value}</span>
    </div>
  </div>
);

// Profile Content Component
const ProfileContent = ({ userData }) => (
  <section className="bg-white rounded-b-2xl shadow-lg">
    <div className="px-12 py-10">
      <h2 className="text-gray-800 font-semibold text-xl mb-10">
        ข้อมูลส่วนตัว
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <InfoField
          label="ชื่อ-นามสกุล" 
          value={userData.name}
          icon={User}
        />
        <InfoField
          label="อีเมล"
          value={userData.email}
          icon={Mail}
        />
      </div>
    </div>
  </section>
);

// Main Profile Card Component
const ProfileCard = ({ userData }) => (
  <article className="w-full max-w-4xl mx-auto">
    <ProfileHeader name={userData.name} title={userData.title} />
    <ProfileContent userData={userData} />
  </article>
);

// Main Page Component
export default function ProfilePage() {
  // User data - could come from props, context, or API
  const userData = {
    name: "อาจารย์สมชาย ใจดี",
    title: "เจ้าหน้าที่ฝ่ายวิชาการ",
    email: "example@it.kmitl.ac.th"
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center py-8">
        <div className="container mx-auto px-4">
          <ProfileCard userData={userData} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}