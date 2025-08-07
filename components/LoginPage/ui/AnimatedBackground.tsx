import { motion } from 'framer-motion';

// Animated Background Component
const AnimatedBackground = () => {
  // Fixed particles configuration - deterministic values
  const particles = [
    { id: 0, size: 80, initialX: 15, initialY: 25, duration: 18, delay: 0 },
    { id: 1, size: 120, initialX: 75, initialY: 60, duration: 25, delay: 3 },
    { id: 2, size: 65, initialX: 45, initialY: 80, duration: 22, delay: 7 },
    { id: 3, size: 95, initialX: 85, initialY: 20, duration: 28, delay: 2 },
    { id: 4, size: 75, initialX: 30, initialY: 70, duration: 20, delay: 5 },
    { id: 5, size: 110, initialX: 65, initialY: 40, duration: 24, delay: 8 },
    { id: 6, size: 85, initialX: 20, initialY: 90, duration: 26, delay: 1 },
    { id: 7, size: 100, initialX: 90, initialY: 10, duration: 30, delay: 4 }
  ];

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-blue-50" />
      
      {/* Animated mesh gradient overlay */}
      <motion.div 
        className="absolute inset-0 opacity-30"
        animate={{
          background: [
            'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(99, 102, 241, 0.1) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(99, 102, 241, 0.1) 0%, transparent 50%), radial-gradient(circle at 60% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 40% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 60% 80%, rgba(99, 102, 241, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(99, 102, 241, 0.1) 0%, transparent 50%), radial-gradient(circle at 40% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)'
          ]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Floating geometric shapes */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full opacity-10"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.initialX}%`,
            top: `${particle.initialY}%`,
          }}
          animate={{
            x: [0, 100, -50, 0],
            y: [0, -100, 50, 0],
            scale: [1, 1.2, 0.8, 1],
            opacity: [0.1, 0.2, 0.1, 0.1]
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut"
          }}
        >
          <div className={`w-full h-full ${
            particle.id % 3 === 0 
              ? 'bg-blue-400' 
              : particle.id % 3 === 1 
              ? 'bg-indigo-400' 
              : 'bg-purple-400'
          }`} style={{ borderRadius: particle.id % 2 === 0 ? '50%' : '20%' }} />
        </motion.div>
      ))}

      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'linear-gradient(rgba(99, 102, 241, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }}
      />

      {/* Animated light beams */}
      <motion.div
        className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-blue-300/20 via-transparent to-transparent"
        animate={{
          opacity: [0.2, 0.5, 0.2],
          scaleY: [1, 1.2, 1]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-indigo-300/20 via-transparent to-transparent"
        animate={{
          opacity: [0.5, 0.2, 0.5],
          scaleY: [1.2, 1, 1.2]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />
    </div>
  );
};

export default AnimatedBackground;