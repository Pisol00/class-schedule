'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Home, ArrowLeft } from 'lucide-react';

export default function Custom404() {
    const router = useRouter();
    return (
        <div className="min-h-screen bg-white flex items-center justify-center px-4">
            <div className="max-w-md mx-auto text-center">
                {/* 404 */}
                <div className="mb-8">
                    <h1 className="text-8xl md:text-9xl font-bold text-blue-600 tracking-tight">
                        404
                    </h1>
                    <div className="w-16 h-1 bg-blue-600 mx-auto mt-4"></div>
                </div>
                {/* ข้อความ */}
                <div className="mb-8 space-y-3">
                    <h2 className="text-xl md:text-2xl font-medium text-gray-900">
                        ไม่พบหน้านี้
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                        หน้าที่คุณกำลังหาไม่มีอยู่ หรืออาจถูกย้ายไปแล้ว
                    </p>
                </div>

                {/* ปุ่ม */}
                <div className="space-y-4">
                    <button
                        onClick={() => router.push('/')}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 
                     bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 
                     transition-colors duration-200"
                    >
                        <Home className="w-4 h-4" />
                        กลับหน้าหลัก
                    </button>

                    <div className="text-center">
                        <button
                            onClick={() => router.back()}
                            className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200 
                       inline-flex items-center gap-1"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            กลับหน้าก่อน
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}