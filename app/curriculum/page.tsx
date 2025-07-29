'use client'
import React, { useState } from 'react';
import { Search, FileText, Users, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from '@/components/layout/Header'
import Footer from '@/components/layout/Footer';

const CourseCatalog = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('หมวดหมู่ทั้งหมด');

  const courses = [
    {
      id: 1,
      title: 'หลักสูตรปริญญาตรี พ.ศ. 2565',
      subtitle: 'สาขาวิชาเทคโนโลยีสารสนเทศ',
      description: 'Bachelor of Science Program in Information Technology',
      duration: '4 ปี',
      credits: '130 หน่วยกิต',
      status: 'เปิดรับสมัคร'
    },
    {
      id: 2,
      title: 'หลักสูตรปริญญาตรี พ.ศ. 2565',
      subtitle: 'สาขาวิชาวิศวกรรมคอมพิวเตอร์',
      description: 'Bachelor of Science Program in Computer Engineering',
      duration: '4 ปี',
      credits: '130 หน่วยกิต',
      status: 'เปิดรับสมัคร'
    },
    {
      id: 3,
      title: 'หลักสูตรปริญญาตรี พ.ศ. 2565',
      subtitle: 'สาขาวิชาวิทยาการคอมพิวเตอร์',
      description: 'Bachelor of Science Program in Computer Science',
      duration: '4 ปี',
      credits: '130 หน่วยกิต',
      status: 'เปิดรับสมัคร'
    },
    {
      id: 4,
      title: 'หลักสูตรปริญญาตรี พ.ศ. 2565',
      subtitle: 'สาขาวิชาเทคโนโลยีสารสนเทศ',
      description: 'Bachelor of Science Program in Information Technology',
      duration: '4 ปี',
      credits: '130 หน่วยกิต',
      status: 'เปิดรับสมัคร'
    },
    {
      id: 5,
      title: 'หลักสูตรปริญญาตรี พ.ศ. 2565',
      subtitle: 'สาขาวิชาเทคโนโลยีสารสนเทศ',
      description: 'Bachelor of Science Program in Information Technology',
      duration: '4 ปี',
      credits: '130 หน่วยกิต',
      status: 'เปิดรับสมัคร'
    },
    {
      id: 6,
      title: 'หลักสูตรปริญญาตรี พ.ศ. 2565',
      subtitle: 'สาขาวิชาเทคโนโลยีสารสนเทศ',
      description: 'Bachelor of Science Program in Information Technology',
      duration: '4 ปี',
      credits: '130 หน่วยกิต',
      status: 'เปิดรับสมัคร'
    }
  ];

  const CourseCard = ({ course }) => (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start space-x-4">
        <div className="bg-blue-100 p-3 rounded-lg">
          <FileText className="w-8 h-8 text-blue-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            {course.title}
          </h3>
          <p className="text-gray-600 text-sm mb-2">
            {course.subtitle}
          </p>
          <p className="text-gray-500 text-sm mb-4">
            {course.description}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex space-x-4 text-sm text-gray-600">
              <span>{course.duration}</span>
              <span>{course.credits}</span>
            </div>
            <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              {course.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navigation Bar */}
      <Navbar />
      
      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-1 h-8 bg-orange-500 rounded-full"></div>
                  <h1 className="text-2xl font-bold text-gray-800">หลักสูตร</h1>
                </div>
                <p className="text-gray-600">ศูนย์กลางความรู้หนึ่งเดียว</p>
              </div>
              <div className="flex space-x-3">
                <button className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                  เพิ่มหลักสูตร
                </button>
                <button className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                  นำเข้าข้อมูล
                </button>
                <button className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                  ส่งออกข้อมูล
                </button>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="ค้นหาหลักสูตร..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option>หมวดหมู่ทั้งหมด</option>
                  <option>วิทยาศาสตร์</option>
                  <option>เทคโนโลยี</option>
                  <option>วิศวกรรม</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Course Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center space-x-2">
            <button className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button className="w-10 h-10 bg-blue-600 text-white rounded-lg font-medium">
              1
            </button>
            <button className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              2
            </button>
            <button className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              3
            </button>
            <span className="px-2 text-gray-500">...</span>
            <button className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              10
            </button>
            <button className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default CourseCatalog;