'use client'
import React, { useState, useMemo } from 'react';
import { Search, FileText, ChevronDown, ChevronLeft, ChevronRight, Plus, Download, Upload, BookOpen } from 'lucide-react';
import Navbar from '@/components/layout/Header'
import Footer from '@/components/layout/Footer';

interface Course {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  credits: string;
  type: string;
  category: string;
  overview: {
    courseName: {
      thai: string;
      english: string;
    };
    degreeName: {
      fullThai: string;
      fullEnglish: string;
      shortThai: string;
      shortEnglish: string;
    };
    totalCredits: number;
    format: string;
    courseType: string[];
    admissionPlan: string;
  };
}

const Curriculum = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const [sortBy, setSortBy] = useState('default');
  const [itemsPerPage] = useState(6);
  const [isLoading, setIsLoading] = useState(false);

  // ข้อมูลหลักสูตรจาก IT KMITL
  const allCourses: Course[] = [
    {
      id: 1,
      title: 'หลักสูตรปริญญาตรี พ.ศ. 2565',
      subtitle: 'สาขาวิชาเทคโนโลยีสารสนเทศ',
      description: 'Bachelor of Science Program in Information Technology',
      credits: '129 หน่วยกิต',
      type: 'หลักสูตรปริญญาตรี',
      category: 'เทคโนโลยี',
      overview: {
        courseName: {
          thai: 'หลักสูตรวิทยาศาสตรบัณฑิต สาขาวิชาเทคโนโลยีสารสนเทศ',
          english: 'Bachelor of Science Program in Information Technology'
        },
        degreeName: {
          fullThai: 'วิทยาศาสตรบัณฑิต (เทคโนโลยีสารสนเทศ)',
          fullEnglish: 'Bachelor of Science (Information Technology)',
          shortThai: 'วท.บ. (เทคโนโลยีสารสนเทศ)',
          shortEnglish: 'B.Sc. (Information Technology)'
        },
        totalCredits: 129,
        format: 'หลักสูตรปริญญาตรี 4 ปี',
        courseType: ['หลักสูตรปริญญาตรีทางวิชาการ'],
        admissionPlan: 'ปีละ 210 คน'
      }
    },
    {
      id: 2,
      title: 'หลักสูตรปริญญาตรี พ.ศ. 2565',
      subtitle: 'สาขาวิชาวิทยาการข้อมูลและการวิเคราะห์เชิงธุรกิจ',
      description: 'Bachelor of Science Program in Data Science and Business Analytics',
      credits: '129 หน่วยกิต',
      type: 'หลักสูตรปริญญาตรี',
      category: 'วิทยาศาสตร์',
      overview: {
        courseName: {
          thai: 'หลักสูตรวิทยาศาสตรบัณฑิต สาขาวิชาวิทยาการข้อมูลและการวิเคราะห์เชิงธุรกิจ',
          english: 'Bachelor of Science Program in Data Science and Business Analytics'
        },
        degreeName: {
          fullThai: 'วิทยาศาสตรบัณฑิต (วิทยาการข้อมูลและการวิเคราะห์เชิงธุรกิจ)',
          fullEnglish: 'Bachelor of Science (Data Science and Business Analytics)',
          shortThai: 'วท.บ. (วิทยาการข้อมูลและการวิเคราะห์เชิงธุรกิจ)',
          shortEnglish: 'B.Sc. (Data Science and Business Analytics)'
        },
        totalCredits: 129,
        format: 'หลักสูตรปริญญาตรี 4 ปี',
        courseType: ['หลักสูตรปริญญาตรีทางวิชาการ'],
        admissionPlan: 'ปีละ 120 คน'
      }
    },
    {
      id: 3,
      title: 'หลักสูตรปริญญาตรี พ.ศ. 2565',
      subtitle: 'สาขาวิชาเทคโนโลยีปัญญาประดิษฐ์',
      description: 'Bachelor of Science Program in Artificial Intelligence Technology',
      credits: '129 หน่วยกิต',
      type: 'หลักสูตรปริญญาตรี',
      category: 'เทคโนโลยี',
      overview: {
        courseName: {
          thai: 'หลักสูตรวิทยาศาสตรบัณฑิต สาขาวิชาเทคโนโลยีปัญญาประดิษฐ์',
          english: 'Bachelor of Science Program in Artificial Intelligence Technology'
        },
        degreeName: {
          fullThai: 'วิทยาศาสตรบัณฑิต (เทคโนโลยีปัญญาประดิษฐ์)',
          fullEnglish: 'Bachelor of Science (Artificial Intelligence Technology)',
          shortThai: 'วท.บ. (เทคโนโลยีปัญญาประดิษฐ์)',
          shortEnglish: 'B.Sc. (Artificial Intelligence Technology)'
        },
        totalCredits: 129,
        format: 'หลักสูตรปริญญาตรี 4 ปี',
        courseType: ['หลักสูตรปริญญาตรีทางวิชาการ'],
        admissionPlan: 'ปีละ 90 คน'
      }
    },
    {
      id: 4,
      title: 'หลักสูตรปริญญาตรี พ.ศ. 2565',
      subtitle: 'สาขาวิชาเทคโนโลยีสารสนเทศทางธุรกิจ',
      description: 'Bachelor of Science Program in Business Information Technology (International Program)',
      credits: '129 หน่วยกิต',
      type: 'หลักสูตรปริญญาตรี',
      category: 'เทคโนโลยี',
      overview: {
        courseName: {
          thai: 'หลักสูตรวิทยาศาสตรบัณฑิต สาขาวิชาเทคโนโลยีสารสนเทศทางธุรกิจ (หลักสูตรนานาชาติ)',
          english: 'Bachelor of Science Program in Business Information Technology (International Program)'
        },
        degreeName: {
          fullThai: 'วิทยาศาสตรบัณฑิต (เทคโนโลยีสารสนเทศทางธุรกิจ)',
          fullEnglish: 'Bachelor of Science (Business Information Technology)',
          shortThai: 'วท.บ. (เทคโนโลยีสารสนเทศทางธุรกิจ)',
          shortEnglish: 'B.Sc. (Business Information Technology)'
        },
        totalCredits: 129,
        format: 'หลักสูตรปริญญาตรี 4 ปี',
        courseType: ['หลักสูตรปริญญาตรีทางวิชาการ', 'หลักสูตรนานาชาติ'],
        admissionPlan: 'ปีละ 60 คน'
      }
    },
    {
      id: 5,
      title: 'หลักสูตรปริญญาโท พ.ศ. 2565',
      subtitle: 'สาขาวิชาเทคโนโลยีสารสนเทศ',
      description: 'Master of Science Program in Information Technology',
      credits: '36 หน่วยกิต',
      type: 'หลักสูตรปริญญาโท',
      category: 'เทคโนโลยี',
      overview: {
        courseName: {
          thai: 'หลักสูตรวิทยาศาสตรมหาบัณฑิต สาขาวิชาเทคโนโลยีสารสนเทศ',
          english: 'Master of Science Program in Information Technology'
        },
        degreeName: {
          fullThai: 'วิทยาศาสตรมหาบัณฑิต (เทคโนโลยีสารสนเทศ)',
          fullEnglish: 'Master of Science (Information Technology)',
          shortThai: 'วท.ม. (เทคโนโลยีสารสนเทศ)',
          shortEnglish: 'M.Sc. (Information Technology)'
        },
        totalCredits: 36,
        format: 'หลักสูตรปริญญาโท 2 ปี',
        courseType: ['หลักสูตรปริญญาโททางวิชาการ', 'แผน ก แบบ ก2'],
        admissionPlan: 'ปีละ 30 คน'
      }
    },
    {
      id: 6,
      title: 'หลักสูตรปริญญาโท พ.ศ. 2565',
      subtitle: 'สาขาวิชาปัญญาประดิษฐ์เพื่อการวิเคราะห์เชิงธุรกิจ',
      description: 'Master of Science Program in Artificial Intelligence for Business Analytics',
      credits: '36 หน่วยกิต',
      type: 'หลักสูตรปริญญาโท',
      category: 'วิทยาศาสตร์',
      overview: {
        courseName: {
          thai: 'หลักสูตรวิทยาศาสตรมหาบัณฑิต สาขาวิชาปัญญาประดิษฐ์เพื่อการวิเคราะห์เชิงธุรกิจ',
          english: 'Master of Science Program in Artificial Intelligence for Business Analytics'
        },
        degreeName: {
          fullThai: 'วิทยาศาสตรมหาบัณฑิต (ปัญญาประดิษฐ์เพื่อการวิเคราะห์เชิงธุรกิจ)',
          fullEnglish: 'Master of Science (Artificial Intelligence for Business Analytics)',
          shortThai: 'วท.ม. (ปัญญาประดิษฐ์เพื่อการวิเคราะห์เชิงธุรกิจ)',
          shortEnglish: 'M.Sc. (Artificial Intelligence for Business Analytics)'
        },
        totalCredits: 36,
        format: 'หลักสูตรปริญญาโท 2 ปี',
        courseType: ['หลักสูตรปริญญาโททางวิชาการ', 'แผน ก แบบ ก2'],
        admissionPlan: 'ปีละ 25 คน'
      }
    },
    {
      id: 7,
      title: 'หลักสูตร Ph.D. พ.ศ. 2565',
      subtitle: 'สาขาวิชาเทคโนโลยีสารสนเทศ',
      description: 'Doctor of Philosophy Program in Information Technology (International Program)',
      credits: '48 หน่วยกิต',
      type: 'Ph.D.',
      category: 'เทคโนโลยี',
      overview: {
        courseName: {
          thai: 'หลักสูตรปรัชญาดุษฎีบัณฑิต สาขาวิชาเทคโนโลยีสารสนเทศ (หลักสูตรนานาชาติ)',
          english: 'Doctor of Philosophy Program in Information Technology (International Program)'
        },
        degreeName: {
          fullThai: 'ปรัชญาดุษฎีบัณฑิต (เทคโนโลยีสารสนเทศ)',
          fullEnglish: 'Doctor of Philosophy (Information Technology)',
          shortThai: 'ปร.ด. (เทคโนโลยีสารสนเทศ)',
          shortEnglish: 'Ph.D. (Information Technology)'
        },
        totalCredits: 48,
        format: 'หลักสูตรปริญญาเอก 3 ปี',
        courseType: ['หลักสูตรปริญญาเอกทางวิชาการ', 'หลักสูตรนานาชาติ', 'แบบ 1.1'],
        admissionPlan: 'ปีละ 10 คน'
      }
    },
    {
      id: 8,
      title: 'หลักสูตร Ph.D. พ.ศ. 2565',
      subtitle: 'สาขาวิชาปัญญาประดิษฐ์เพื่อการวิเคราะห์เชิงธุรกิจ',
      description: 'Doctor of Philosophy Program in Artificial Intelligence for Business Analytics (International Program)',
      credits: '48 หน่วยกิต',
      type: 'Ph.D.',
      category: 'วิทยาศาสตร์',
      overview: {
        courseName: {
          thai: 'หลักสูตรปรัชญาดุษฎีบัณฑิต สาขาวิชาปัญญาประดิษฐ์เพื่อการวิเคราะห์เชิงธุรกิจ (หลักสูตรนานาชาติ)',
          english: 'Doctor of Philosophy Program in Artificial Intelligence for Business Analytics (International Program)'
        },
        degreeName: {
          fullThai: 'ปรัชญาดุษฎีบัณฑิต (ปัญญาประดิษฐ์เพื่อการวิเคราะห์เชิงธุรกิจ)',
          fullEnglish: 'Doctor of Philosophy (Artificial Intelligence for Business Analytics)',
          shortThai: 'ปร.ด. (ปัญญาประดิษฐ์เพื่อการวิเคราะห์เชิงธุรกิจ)',
          shortEnglish: 'Ph.D. (Artificial Intelligence for Business Analytics)'
        },
        totalCredits: 48,
        format: 'หลักสูตรปริญญาเอก 3 ปี',
        courseType: ['หลักสูตรปริญญาเอกทางวิชาการ', 'หลักสูตรนานาชาติ', 'แบบ 1.1'],
        admissionPlan: 'ปีละ 8 คน'
      }
    }
  ];



  // ฟังก์ชันกรองและค้นหาหลักสูตร
  const filteredCourses = useMemo(() => {
    let filtered = allCourses;

    // ค้นหาตามคำค้นหา
    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // เรียงลำดับ
    switch (sortBy) {
      case 'name':
        filtered.sort((a, b) => a.subtitle.localeCompare(b.subtitle));
        break;
      case 'type':
        filtered.sort((a, b) => a.type.localeCompare(b.type));
        break;
      default:
        // เรียงตาม id (ลำดับเดิม)
        filtered.sort((a, b) => a.id - b.id);
        break;
    }

    return filtered;
  }, [searchTerm, sortBy]);

  // คำนวณข้อมูลสำหรับ pagination
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCourses = filteredCourses.slice(startIndex, startIndex + itemsPerPage);

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
    setCurrentPage(1); // รีเซ็ตไปหน้าแรก
  };

  // ฟังก์ชันจัดการ modal
  const openCourseDetail = (course: Course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const closeCourseDetail = () => {
    setSelectedCourse(null);
    setIsModalOpen(false);
  };
  const handleAddCourse = () => {
    alert('เปิดหน้าเพิ่มหลักสูตรใหม่');
  };

  const handleImportData = () => {
    setIsLoading(true);
    // จำลองการโหลดข้อมูล
    setTimeout(() => {
      setIsLoading(false);
      alert('นำเข้าข้อมูลสำเร็จ');
    }, 2000);
  };

  const handleExportData = () => {
    const data = JSON.stringify(filteredCourses, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'courses.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Component สำหรับแสดงการ์ดหลักสูตร
  const CourseCard = ({ course }: { course: Course }) => (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-300 border border-gray-100">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-100 p-2 rounded">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              course.type === 'หลักสูตรปริญญาตรี' 
                ? 'bg-blue-100 text-blue-800' 
                : course.type === 'หลักสูตรปริญญาโท'
                ? 'bg-purple-100 text-purple-800'
                : course.type === 'Ph.D.'
                ? 'bg-red-100 text-red-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {course.type}
            </span>
          </div>
        </div>

        {/* ชื่อหลักสูตร */}
        <div>
          <h3 className="text-base font-medium text-gray-900 mb-1 leading-tight">
            {course.overview.courseName.thai}
          </h3>
          <p className="text-sm text-gray-600 leading-tight">
            {course.overview.courseName.english}
          </p>
        </div>

        {/* ชื่อปริญญา */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm font-medium text-gray-800">{course.overview.degreeName.shortThai}</p>
          <p className="text-sm text-gray-600">{course.overview.degreeName.shortEnglish}</p>
        </div>

        {/* ข้อมูลหลักสูตร - Grid System */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50 p-3 rounded-lg text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-medium text-blue-700">หน่วยกิต</span>
            </div>
            <p className="text-lg font-bold text-blue-800">{course.overview.totalCredits}</p>
          </div>
          
          <div className="bg-green-50 p-3 rounded-lg text-center">
            <span className="text-xs font-medium text-green-700 block mb-1">แผนรับ</span>
            <p className="text-sm font-bold text-green-800">{course.overview.admissionPlan}</p>
          </div>
        </div>

        <div className="bg-orange-50 p-3 rounded-lg text-center">
          <span className="text-xs font-medium text-orange-700 block mb-1">รูปแบบ</span>
          <p className="text-sm font-bold text-orange-800">{course.overview.format}</p>
        </div>

        {/* ประเภทหลักสูตร */}
        <div className="border-t pt-3">
          <p className="text-sm font-medium text-gray-700 mb-2">ประเภทหลักสูตร:</p>
          <div className="space-y-1">
            {course.overview.courseType.map((type, index) => (
              <p key={index} className="text-sm text-gray-800 pl-4 relative">
                <span className="absolute left-0 top-2 w-1 h-1 bg-purple-400 rounded-full"></span>
                {type}
              </p>
            ))}
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
                  <div className="w-1 h-8 bg-orange-500 rounded-full"></div>
                  <h1 className="text-2xl font-bold text-gray-800">หลักสูตร</h1>
                </div>
                <p className="text-gray-600">ดูหลักสูตรทั้งหมด</p>
                <p className="text-sm text-gray-500 mt-1">
                  พบ {filteredCourses.length} หลักสูตรจากทั้งหมด {allCourses.length} หลักสูตร
                </p>
              </div>
              <div className="flex space-x-3">
                <button 
                  onClick={handleAddCourse}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>เพิ่มหลักสูตร</span>
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
                  placeholder="ค้นหาหลักสูตรหรือคำอธิบาย..."
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
                  <option value="type">ประเภท</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Course Grid */}
          {paginatedCourses.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6 mb-8">
              {paginatedCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="bg-gray-100 rounded-full p-8 inline-block mb-6">
                <FileText className="w-16 h-16 text-gray-300" />
              </div>
              <h3 className="text-xl font-medium text-gray-500 mb-2">ไม่พบหลักสูตรที่ตรงกับการค้นหา</h3>
              <p className="text-gray-400 mb-6">ลองเปลี่ยนคำค้นหาหรือเลือกหมวดหมู่อื่น</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSortBy('default');
                  setCurrentPage(1);
                }}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                แสดงหลักสูตรทั้งหมด
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
            แสดง {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredCourses.length)} 
            จาก {filteredCourses.length} หลักสูตร
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Curriculum;