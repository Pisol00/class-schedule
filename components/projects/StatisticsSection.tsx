import { motion } from 'framer-motion';
import { Users } from 'lucide-react';

const StatisticsSection = () => {
  const statisticsData = [
    {
      title: 'จำนวนหลักสูตร',
      value: '20'
    },
    {
      title: 'จำนวนรายวิชา',
      value: '120'
    },
    {
      title: 'จำนวนอาจารย์',
      value: '55'
    },
    {
      title: 'จำนวนห้องเรียน',
      value: '112'
    }
  ];

  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto mb-12"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
    >
      {statisticsData.map((stat, index) => (
        <motion.div
          key={stat.title}
          className="bg-blue-50 rounded-2xl p-6 flex items-center justify-between"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
          whileHover={{ 
            scale: 1.02,
            transition: { duration: 0.2 }
          }}
        >
          {/* Left side - Text content */}
          <div className="flex-1">
            <h3 className="text-sm font-medium text-slate-600 mb-1 leading-tight">
              {stat.title}
            </h3>
            <p className="text-3xl font-bold text-blue-700">
              {stat.value}
            </p>
          </div>
          
          {/* Right side - Icon */}
          <div className="ml-4 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
            <Users className="w-6 h-6 text-white" strokeWidth={2} />
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default StatisticsSection;