'use client'
import React, { useState, useMemo } from 'react';
import { Search, Users, ChevronDown, ChevronLeft, ChevronRight, Plus, Download, Upload, BookOpen, Briefcase, Star, GraduationCap } from 'lucide-react';
import Navbar from '@/components/Navigation'
import Footer from '@/components/Footer';

interface Branch {
  id: number;
  name: string;
  nameEn: string;
  description: string;
  category: string;
  totalPrograms: number;
  undergrad: number;
  graduate: number;
  phd: number;
  keyFeatures: string[];
  careers: string[];
  highlight: string;
  admissionInfo: string;
}

const BranchCatalog = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [itemsPerPage] = useState(6);
  const [isLoading, setIsLoading] = useState(false);

  // ข้อมูลสาขาวิชาจาก IT KMITL
  const allBranches: Branch[] = [
    {
      id: 1,
      name: 'เทคโนโลยีสารสนเทศ',
      nameEn: 'Information Technology',
      description: 'สาขาวิชาที่ผสมผสานความรู้ด้านเทคโนโลยีสารสนเทศกับการประยุกต์ใช้ในธุรกิจ เน้นการพัฒนาระบบสารสนเทศ การจัดการข้อมูล และการแก้ปัญหาทางธุรกิจด้วยเทคโนโลยี',
      category: 'เทคโนโลยี',
      totalPrograms: 3,
      undergrad: 2,
      graduate: 1,
      phd: 1,
      keyFeatures: [
        'การพัฒนาซอฟต์แวร์และระบบสารสนเทศ',
        'การจัดการฐานข้อมูลและ Big Data',
        'ความมั่นคงปลอดภัยทางไซเบอร์',
        'การบริหารโครงการ IT',
        'Cloud Computing และ DevOps'
      ],
      careers: [
        'นักพัฒนาซอฟต์แวร์',
        'ผู้วิเคราะห์ระบบ',
        'ผู้จัดการโครงการ IT',
        'ผู้เชี่ยวชาญด้านความปลอดภัย',
        'สถาปนิกระบบ IT'
      ],
      highlight: 'หลักสูตรที่ได้รับการรับรองมาตรฐาน ACM และ IEEE',
      admissionInfo: 'เปิดรับนักศึกษาทุกภาคการศึกษา'
    },
    {
      id: 2,
      name: 'วิทยาการข้อมูลและการวิเคราะห์เชิงธุรกิจ',
      nameEn: 'Data Science and Business Analytics',
      description: 'สาขาวิชาที่เน้นการวิเคราะห์ข้อมูลขนาดใหญ่ การใช้สถิติและคณิตศาสตร์ในการวิเคราะห์ รวมถึงการประยุกต์ใช้ Machine Learning เพื่อสนับสนุนการตัดสินใจทางธุรกิจ',
      category: 'วิทยาศาสตร์',
      totalPrograms: 2,
      undergrad: 1,
      graduate: 1,
      phd: 0,
      keyFeatures: [
        'การวิเคราะห์ข้อมูลขนาดใหญ่ (Big Data)',
        'Machine Learning และ AI',
        'การสร้างแบบจำลองทางสถิติ',
        'Data Visualization',
        'Business Intelligence'
      ],
      careers: [
        'นักวิทยาการข้อมูล (Data Scientist)',
        'นักวิเคราะห์ข้อมูล (Data Analyst)',
        'วิศวกรข้อมูล (Data Engineer)',
        'ผู้เชี่ยวชาญ Business Intelligence',
        'นักวิเคราะห์เชิงธุรกิจ'
      ],
      highlight: 'หลักสูตรใหม่ที่ตอบโจทย์ยุค Digital Transformation',
      admissionInfo: 'รับนักศึกษาที่มีพื้นฐานคণิตศาสตร์และสถิติ'
    },
    {
      id: 3,
      name: 'เทคโนโลยีปัญญาประดิษฐ์',
      nameEn: 'Artificial Intelligence Technology',
      description: 'สาขาวิชาใหม่ที่เน้นการศึกษาและพัฒนาเทคโนโลยี AI, Machine Learning, Deep Learning รวมถึงการประยุกต์ใช้ในอุตสาหกรรมต่างๆ เพื่อสร้างนวัตกรรมที่ตอบโจทย์อนาคต',
      category: 'เทคโนโลยี',
      totalPrograms: 2,
      undergrad: 1,
      graduate: 1,
      phd: 1,
      keyFeatures: [
        'Machine Learning และ Deep Learning',
        'Computer Vision และ Image Processing',
        'Natural Language Processing',
        'Robotics และ IoT',
        'AI Ethics และ Responsible AI'
      ],
      careers: [
        'AI Engineer',
        'Machine Learning Engineer',
        'Computer Vision Specialist',
        'NLP Specialist',
        'AI Research Scientist'
      ],
      highlight: 'หลักสูตรแรกในไทยที่เน้น AI โดยเฉพาะ เริ่มเปิดสอน 2566',
      admissionInfo: 'เริ่มรับสมัครตั้งแต่ กรกฎาคม 2566'
    },
    {
      id: 4,
      name: 'เทคโนโลยีสารสนเทศทางธุรกิจ',
      nameEn: 'Business Information Technology',
      description: 'หลักสูตรนานาชาติที่เน้นการประยุกต์ใช้เทคโนโลยีสารสนเทศในการแก้ปัญหาทางธุรกิจ เรียนการสอนเป็นภาษาอังกฤษ เพื่อเตรียมบัณฑิตสู่เวทีโลก',
      category: 'เทคโนโลยี',
      totalPrograms: 1,
      undergrad: 1,
      graduate: 0,
      phd: 0,
      keyFeatures: [
        'การเรียนการสอนเป็นภาษาอังกฤษ',
        'Business Process Management',
        'Enterprise Systems (ERP, CRM)',
        'Digital Marketing และ E-Commerce',
        'UX/UI Design'
      ],
      careers: [
        'Business Analyst',
        'Digital Marketing Specialist',
        'UX/UI Designer',
        'Enterprise Systems Consultant',
        'International IT Manager'
      ],
      highlight: 'หลักสูตรนานาชาติเพียงหลักสูตรเดียวในคณะ',
      admissionInfo: 'ต้องมีผลคะแนนภาษาอังกฤษตามเกณฑ์ที่กำหนด'
    }
  ];

  // ฟังก์ชันกรองและค้นหาสาขา
  const filteredBranches = useMemo(() => {
    let filtered = allBranches;

    // ค้นหาตามคำค้นหา
    if (searchTerm) {
      filtered = filtered.filter(branch =>
        branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        branch.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        branch.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        branch.careers.some(career => career.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // เรียงลำดับ
    switch (sortBy) {
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'programs':
        filtered.sort((a, b) => b.totalPrograms - a.totalPrograms);
        break;
      default:
        // เรียงตาม id (ลำดับเดิม)
        filtered.sort((a, b) => a.id - b.id);
        break;
    }

    return filtered;
  }, [searchTerm, sortBy]);

  // คำนวณข้อมูลสำหรับ pagination
  const totalPages = Math.ceil(filteredBranches.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBranches = filteredBranches.slice(startIndex, startIndex + itemsPerPage);

  // ฟังก์ชันจัดการ pagination
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // ฟังก์ชันจัดการการค้นหา
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // ฟังก์ชันจัดการปุ่มต่างๆ
  const handleAddBranch = () => {
    alert('เปิดหน้าเพิ่มสาขาใหม่');
  };

  const handleImportData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert('นำเข้าข้อมูลสำเร็จ');
    }, 2000);
  };

  const handleExportData = () => {
    const data = JSON.stringify(filteredBranches, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'branches.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Component สำหรับแสดงการ์ดสาขา
  const BranchCard = ({ branch }: { branch: Branch }) => (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-300 border border-gray-100">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-100 p-2 rounded">
              <GraduationCap className="w-5 h-5 text-blue-600" />
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              branch.category === 'เทคโนโลยี' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-green-100 text-green-800'
            }`}>
              {branch.category}
            </span>
          </div>
          {branch.highlight.includes('ใหม่') && (
            <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
              ใหม่!
            </span>
          )}
        </div>

        {/* ชื่อสาขา */}
        <div>
          <h3 className="text-base font-medium text-gray-900 mb-1 leading-tight">
            {branch.name}
          </h3>
          <p className="text-sm text-gray-600 leading-tight">
            {branch.nameEn}
          </p>
        </div>

        {/* คำอธิบาย */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
            {branch.description}
          </p>
        </div>

        {/* สถิติหลักสูตร - Grid System */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-blue-50 p-2 rounded-lg text-center">
            <BookOpen className="w-4 h-4 text-blue-600 mx-auto mb-1" />
            <p className="text-xs font-medium text-blue-700">ปริญญาตรี</p>
            <p className="text-lg font-bold text-blue-800">{branch.undergrad}</p>
          </div>
          
          <div className="bg-purple-50 p-2 rounded-lg text-center">
            <Users className="w-4 h-4 text-purple-600 mx-auto mb-1" />
            <p className="text-xs font-medium text-purple-700">ปริญญาโท</p>
            <p className="text-lg font-bold text-purple-800">{branch.graduate}</p>
          </div>

          <div className="bg-red-50 p-2 rounded-lg text-center">
            <Star className="w-4 h-4 text-red-600 mx-auto mb-1" />
            <p className="text-xs font-medium text-red-700">Ph.D.</p>
            <p className="text-lg font-bold text-red-800">{branch.phd}</p>
          </div>
        </div>

        {/* จุดเด่น */}
        <div className="bg-yellow-50 p-3 rounded-lg">
          <div className="flex items-start space-x-2">
            <Star className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm font-medium text-yellow-800">{branch.highlight}</p>
          </div>
        </div>

        {/* อาชีพที่สามารถทำได้ */}
        <div className="border-t pt-3">
          <p className="text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Briefcase className="w-4 h-4 mr-1" />
            อาชีพที่สามารถประกอบได้:
          </p>
          <div className="space-y-1">
            {branch.careers.slice(0, 3).map((career, index) => (
              <p key={index} className="text-sm text-gray-600 pl-4 relative">
                <span className="absolute left-0 top-2 w-1 h-1 bg-blue-400 rounded-full"></span>
                {career}
              </p>
            ))}
            {branch.careers.length > 3 && (
              <p className="text-xs text-gray-500 pl-4">และอีก {branch.careers.length - 3} อาชีพ</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // สร้างปุ่ม pagination
  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisibleButtons = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisibleButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);
    
    if (endPage - startPage + 1 < maxVisibleButtons) {
      startPage = Math.max(1, endPage - maxVisibleButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`w-10 h-10 rounded-lg font-medium transition-colors ${
            i === currentPage
              ? 'bg-blue-600 text-white'
              : 'border border-gray-300 hover:bg-gray-50'
          }`}
        >
          {i}
        </button>
      );
    }

    return buttons;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navigation Bar */}
      <Navbar />
      
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">กำลังประมวลผล...</p>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-1 h-8 bg-green-500 rounded-full"></div>
                  <h1 className="text-2xl font-bold text-gray-800">สาขาวิชา</h1>
                </div>
                <p className="text-gray-600">สำรวจสาขาวิชาต่างๆ ในคณะเทคโนโลยีสารสนเทศ</p>
                <p className="text-sm text-gray-500 mt-1">
                  พบ {filteredBranches.length} สาขาจากทั้งหมด {allBranches.length} สาขา
                </p>
              </div>
              <div className="flex space-x-3">
                <button 
                  onClick={handleAddBranch}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>เพิ่มสาขา</span>
                </button>
                <button 
                  onClick={handleImportData}
                  disabled={isLoading}
                  className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-2 disabled:opacity-50"
                >
                  <Upload className="w-4 h-4" />
                  <span>นำเข้าข้อมูล</span>
                </button>
                <button 
                  onClick={handleExportData}
                  className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>ส่งออกข้อมูล</span>
                </button>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="ค้นหาสาขา, อาชีพ หรือคำอธิบาย..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="default">ลำดับเดิม</option>
                  <option value="name">ชื่อ A-Z</option>
                  <option value="programs">จำนวนหลักสูตรมาก</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Branch Grid */}
          {paginatedBranches.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8" style={{ gridTemplateRows: '1fr' }}>
              {paginatedBranches.map((branch) => (
                <BranchCard key={branch.id} branch={branch} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="bg-gray-100 rounded-full p-8 inline-block mb-6">
                <GraduationCap className="w-16 h-16 text-gray-300" />
              </div>
              <h3 className="text-xl font-medium text-gray-500 mb-2">ไม่พบสาขาที่ตรงกับการค้นหา</h3>
              <p className="text-gray-400 mb-6">ลองเปลี่ยนคำค้นหาหรือเลือกการเรียงลำดับอื่น</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSortBy('default');
                  setCurrentPage(1);
                }}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                แสดงสาขาทั้งหมด
              </button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2">
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              
              {renderPaginationButtons()}
              
              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          )}

          {/* Summary */}
          <div className="mt-6 text-center text-sm text-gray-500">
            แสดง {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredBranches.length)} 
            จาก {filteredBranches.length} สาขา
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default BranchCatalog;