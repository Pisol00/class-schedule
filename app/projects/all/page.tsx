'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProjectSearch from '@/components/projects/ProjectSearch';
import ProjectFilters from '@/components/projects/ProjectFilters';
import ProjectGrid from '@/components/projects/ProjectGrid';
import { Project } from '@/components/projects/ProjectCard';
import { ArrowLeft } from 'lucide-react';

// ข้อมูลโครงการทั้งหมด (รวมโครงการเก่าๆ ด้วย)
const allProjectsData: Project[] = [
    // โครงการปัจจุบัน
    {
        id: '2567-1',
        title: 'ภาคการศึกษา 1/2567',
        description: 'ตารางเรียนตารางสอนภาคการศึกษาที่ 1 ปีการศึกษา 2567',
        status: 'กำลังดำเนินการ',
        subjects: 247,
        curriculum: 10,
        schedules: 189,
        conflicts: 12,
        members: [
            { id: '1', name: 'อ.สมชาย ใจดี', role: 'หัวหน้าโครงการ' },
            { id: '2', name: 'อ.สุดา มานะ', role: 'ที่ปรึกษา' },
        ],
        progress: 77,
        lastUpdated: '2 ชั่วโมงที่แล้ว',
        icon: 'calendar'
    },
    {
        id: '2567-2',
        title: 'ภาคการศึกษา 2/2567',
        description: 'ตารางเรียนตารางสอนภาคการศึกษาที่ 2 ปีการศึกษา 2567',
        status: 'แบบร่าง',
        subjects: 203,
        curriculum: 10,
        schedules: 45,
        conflicts: 0,
        members: [
            { id: '1', name: 'อ.สมชาย ใจดี', role: 'หัวหน้าโครงการ' },
            { id: '2', name: 'อ.สุดา มานะ', role: 'ที่ปรึกษา' },
        ],
        progress: 22,
        lastUpdated: '3 วันที่แล้ว',
        icon: 'calendar'
    },
    // เพิ่มโครงการเก่าๆ
    {
        id: '2566-3',
        title: 'ภาคการศึกษา 3/2566',
        description: 'ตารางเรียนตารางสอนภาคฤดูร้อน ปีการศึกษา 2566',
        status: 'เสร็จสิ้น',
        subjects: 89,
        curriculum: 10,
        schedules: 89,
        conflicts: 0,
        members: [
            { id: '1', name: 'อ.สมชาย ใจดี', role: 'หัวหน้าโครงการ' },
        ],
        progress: 100,
        lastUpdated: '1 สัปดาห์ที่แล้ว',
        icon: 'check'
    },
    // เพิ่มโครงการอื่นๆ เพิ่มเติม...
    {
        id: '2565-1',
        title: 'ภาคการศึกษา 1/2565',
        description: 'ตารางเรียนตารางสอนภาคการศึกษาที่ 1 ปีการศึกษา 2565',
        status: 'เก็บถาวร',
        subjects: 234,
        curriculum: 10,
        schedules: 234,
        conflicts: 0,
        members: [
            { id: '1', name: 'อ.สมชาย ใจดี', role: 'หัวหน้าโครงการ' },
        ],
        progress: 100,
        lastUpdated: '1 ปีที่แล้ว',
        icon: 'archive'
    },
    {
        id: '2565-2',
        title: 'ภาคการศึกษา 2/2565',
        description: 'ตารางเรียนตารางสอนภาคการศึกษาที่ 2 ปีการศึกษา 2565',
        status: 'เก็บถาวร',
        subjects: 256,
        curriculum: 10,
        schedules: 256,
        conflicts: 0,
        members: [
            { id: '1', name: 'อ.สมชาย ใจดี', role: 'หัวหน้าโครงการ' },
        ],
        progress: 100,
        lastUpdated: '1 ปีที่แล้ว',
        icon: 'archive'
    }
];

export default function AllProjectsPage() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [currentFilter, setCurrentFilter] = useState('ทั้งหมด');
    const [filteredProjects, setFilteredProjects] = useState(allProjectsData);

    // Filter projects based on search term and current filter
    useEffect(() => {
        let filtered = allProjectsData;

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(project =>
                project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply category filter
        if (currentFilter !== 'ทั้งหมด') {
            switch (currentFilter) {
                case 'กำลังดำเนินการ':
                    filtered = filtered.filter(project =>
                        project.status === 'กำลังดำเนินการ' || project.status === 'แบบร่าง'
                    );
                    break;
                case 'เสร็จสิ้น':
                    filtered = filtered.filter(project => project.status === 'เสร็จสิ้น');
                    break;
                case 'เก็บถาวร':
                    filtered = filtered.filter(project => project.status === 'เก็บถาวร');
                    break;
            }
        }

        setFilteredProjects(filtered);
    }, [searchTerm, currentFilter]);

    const handleProjectClick = (project: Project) => {
        console.log('Opening project:', project.id, project.title);
        alert(`กำลังเปิด Dashboard สำหรับ ${project.title}`);
    };

    // ไม่มี function สร้างโครงการในหน้านี้

    const resetAllFilters = () => {
        setSearchTerm('');
        setCurrentFilter('ทั้งหมด');
    };

    const quickFilter = (term: string) => {
        setSearchTerm(term);
    };

    const getSectionTitle = () => {
        if (searchTerm && filteredProjects.length === 0) {
            return 'ไม่พบโครงการ';
        }
        if (searchTerm) {
            return `ผลการค้นหา (${filteredProjects.length} โครงการ)`;
        }
        switch (currentFilter) {
            case 'กำลังดำเนินการ':
                return `โครงการกำลังดำเนินการ (${filteredProjects.length} โครงการ)`;
            case 'เสร็จสิ้น':
                return `โครงการที่เสร็จสิ้น (${filteredProjects.length} โครงการ)`;
            case 'เก็บถาวร':
                return `โครงการที่เก็บถาวร (${filteredProjects.length} โครงการ)`;
            default:
                return `โครงการทั้งหมด (${filteredProjects.length} โครงการ)`;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header Navigation */}
            <Header />

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Back Button */}
                <motion.div
                    className="mb-6"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <button
                        onClick={() => router.back()}
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        กลับไปหน้าหลัก
                    </button>
                </motion.div>

                {/* Page Header */}
                <motion.div
                    className="text-center mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <motion.h1
                        className="text-3xl md:text-5xl font-bold text-blue-700 mb-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        โปรเจกต์ทั้งหมด
                    </motion.h1>
                    <motion.p
                        className="text-lg text-slate-600 max-w-2xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        รวมทุกโปรเจกต์จัดตารางสอนตามภาคเรียนและปีการศึกษา
                    </motion.p>
                </motion.div>

                {/* Search Section */}
                <ProjectSearch searchTerm={searchTerm}
                    allProjects={allProjectsData}
                    setSearchTerm={setSearchTerm}
                />

                {/* Projects Section */}
                <motion.div
                    className="mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                >
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 space-y-4 md:space-y-0">
                        <h2 className="text-xl font-semibold text-slate-900">{getSectionTitle()}</h2>

                        {/* Filter Section */}
                        <ProjectFilters
                            currentFilter={currentFilter}
                            setCurrentFilter={setCurrentFilter}
                            projectCount={filteredProjects.length}
                            onReset={resetAllFilters}
                            onQuickFilter={quickFilter}
                        />
                    </div>

                    {/* Projects Grid */}
                    <ProjectGrid
                        projects={filteredProjects}
                        onProjectClick={handleProjectClick}
                    />
                </motion.div>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
}