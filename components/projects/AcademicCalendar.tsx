import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: 'exam' | 'holiday' | 'deadline' | 'semester' | 'registration';
  description?: string;
  priority: 'high' | 'medium' | 'low';
}

interface AcademicCalendarProps {
  className?: string;
}

// Mock data for academic events
const academicEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'สอบกลางภาค',
    date: new Date(2025, 6, 28), // July 28, 2025
    type: 'exam',
    description: 'การสอบกลางภาคการศึกษาที่ 1/2568',
    priority: 'high'
  },
  {
    id: '2',
    title: 'วันหยุดวันพ่อแห่งชาติ',
    date: new Date(2025, 6, 28), // July 28, 2025
    type: 'holiday',
    description: 'วันเฉลิมพระชนมพรรษาพระบาทสมเด็จพระเจ้าอยู่หัว',
    priority: 'medium'
  },
  {
    id: '3',
    title: 'กำหนดส่งตารางสอน',
    date: new Date(2025, 6, 30), // July 30, 2025
    type: 'deadline',
    description: 'ส่งตารางสอนฉบับสุดท้ายให้กับทางมหาวิทยาลัย',
    priority: 'high'
  },
  {
    id: '4',
    title: 'เปิดลงทะเบียนเรียน',
    date: new Date(2025, 7, 5), // August 5, 2025
    type: 'registration',
    description: 'เปิดระบบลงทะเบียนเรียนภาคการศึกษาที่ 1/2568',
    priority: 'medium'
  },
  {
    id: '5',
    title: 'เริ่มภาคการศึกษา 1/2568',
    date: new Date(2025, 7, 12), // August 12, 2025
    type: 'semester',
    description: 'วันเริ่มเรียนภาคการศึกษาที่ 1 ปีการศึกษา 2568',
    priority: 'high'
  },
  {
    id: '6',
    title: 'วันหยุดวันแม่แห่งชาติ',
    date: new Date(2025, 7, 12), // August 12, 2025
    type: 'holiday',
    description: 'วันเฉลิมพระชนมพรรษาสมเด็จพระนางเจ้าสิริกิติ์ พระบรมราชินีนาถ',
    priority: 'medium'
  }
];

export default function AcademicCalendar({ className = '' }: AcademicCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [upcomingEvents, setUpcomingEvents] = useState<CalendarEvent[]>([]);

  // Get upcoming events (next 30 days)
  useEffect(() => {
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000));
    
    const upcoming = academicEvents
      .filter(event => event.date >= today && event.date <= thirtyDaysFromNow)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 5);
    
    setUpcomingEvents(upcoming);
  }, []);

  // Calendar utilities
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getEventsForDate = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return academicEvents.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  const isToday = (day: number) => {
    const today = new Date();
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return date.toDateString() === today.toDateString();
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('th-TH', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatDateShort = (date: Date) => {
    return date.toLocaleDateString('th-TH', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getEventTypeIcon = (type: CalendarEvent['type']) => {
    const icons = {
      exam: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M9 3a1 1 0 012 0v5.5a.5.5 0 001 0V4a1 1 0 112 0v4.5a.5.5 0 001 0V6a1 1 0 112 0v6a2.5 2.5 0 01-2.5 2.5h-1.086a3.5 3.5 0 01-.814 1.686L10.5 17.5a1 1 0 11-1.414 1.414L8.5 18.328A3.5 3.5 0 017.086 14.5H6A2.5 2.5 0 013.5 12V6a1 1 0 112 0v2.5a.5.5 0 001 0V4a1 1 0 112 0v4.5a.5.5 0 001 0V3z" clipRule="evenodd"/>
        </svg>
      ),
      holiday: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zM8 6V5a2 2 0 114 0v1H8zm2 3a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1z" clipRule="evenodd"/>
        </svg>
      ),
      deadline: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd"/>
        </svg>
      ),
      semester: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
        </svg>
      ),
      registration: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V8z" clipRule="evenodd"/>
        </svg>
      )
    };
    return icons[type];
  };

  const getEventTypeColor = (type: CalendarEvent['type']) => {
    const colors = {
      exam: 'text-red-600 bg-red-100',
      holiday: 'text-green-600 bg-green-100',
      deadline: 'text-orange-600 bg-orange-100',
      semester: 'text-blue-600 bg-blue-100',
      registration: 'text-purple-600 bg-purple-100'
    };
    return colors[type];
  };

  const calendarDays = generateCalendarDays();

  return (
    <motion.section 
      className={`bg-white rounded-2xl border border-slate-200 overflow-hidden ${className}`}
      style={{
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)'
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900" style={{ letterSpacing: '-0.025em' }}>
              ปฏิทินการศึกษา
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              เหตุการณ์สำคัญและกำหนดการ
            </p>
          </div>
          <motion.div 
            className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ duration: 0.2 }}
          >
            <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z" clipRule="evenodd"/>
            </svg>
          </motion.div>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mini Calendar */}
        <div className="space-y-4">
          {/* Calendar Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">
              {currentDate.toLocaleDateString('th-TH', { month: 'long', year: 'numeric' })}
            </h3>
            <div className="flex items-center space-x-2">
              <motion.button
                onClick={() => navigateMonth('prev')}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd"/>
                </svg>
              </motion.button>
              <motion.button
                onClick={() => navigateMonth('next')}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd"/>
                </svg>
              </motion.button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="bg-slate-50 rounded-xl p-4">
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'].map((day) => (
                <div key={day} className="text-center text-xs font-medium text-slate-500 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => {
                if (day === null) {
                  return <div key={index} className="h-8" />;
                }

                const events = getEventsForDate(day);
                const hasEvents = events.length > 0;
                const todayCheck = isToday(day);

                return (
                  <motion.div
                    key={day}
                    className={`h-8 flex items-center justify-center text-sm rounded-lg cursor-pointer relative ${
                      todayCheck 
                        ? 'bg-blue-500 text-white font-semibold' 
                        : hasEvents 
                          ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                          : 'hover:bg-white text-slate-700'
                    }`}
                    onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {day}
                    {hasEvents && (
                      <div className={`absolute bottom-0.5 right-0.5 w-1.5 h-1.5 rounded-full ${
                        todayCheck ? 'bg-white' : 'bg-blue-500'
                      }`} />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">เหตุการณ์ที่จะมาถึง</h3>
          
          <div className="space-y-3 max-h-80 overflow-y-auto">
            <AnimatePresence>
              {upcomingEvents.length === 0 ? (
                <motion.div 
                  className="text-center py-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <p className="text-sm text-slate-500">ไม่มีเหตุการณ์ที่จะมาถึงในช่วง 30 วันข้างหน้า</p>
                </motion.div>
              ) : (
                upcomingEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    className="p-4 bg-slate-50 rounded-xl border border-slate-200 hover:bg-white hover:shadow-sm transition-all duration-200 cursor-pointer"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    onClick={() => alert(`เปิดรายละเอียด: ${event.title}`)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getEventTypeColor(event.type)}`}>
                        {getEventTypeIcon(event.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm text-slate-900 truncate">
                              {event.title}
                            </h4>
                            <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                              {event.description}
                            </p>
                          </div>
                          <div className="text-right ml-3">
                            <p className="text-xs font-medium text-slate-700">
                              {formatDateShort(event.date)}
                            </p>
                            <div className={`text-xs px-2 py-1 rounded-full mt-1 ${
                              event.priority === 'high' ? 'bg-red-100 text-red-700' :
                              event.priority === 'medium' ? 'bg-orange-100 text-orange-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {event.priority === 'high' ? 'สำคัญ' :
                               event.priority === 'medium' ? 'ปานกลาง' : 'ทั่วไป'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          {/* Quick Links */}
          <div className="pt-4 border-t border-slate-200">
            <div className="grid grid-cols-2 gap-3">
              <motion.button
                className="p-3 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors text-sm font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => alert('เปิดปฏิทินแบบเต็ม')}
              >
                ดูปฏิทินเต็ม
              </motion.button>
              <motion.button
                className="p-3 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-colors text-sm font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => alert('เพิ่มเหตุการณ์ใหม่')}
              >
                เพิ่มเหตุการณ์
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}