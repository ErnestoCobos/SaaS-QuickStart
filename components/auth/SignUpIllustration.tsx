"use client"

import { motion } from "framer-motion"

const floatAnimation = `
@keyframes float {
  0% { transform: translateX(0px); }
  50% { transform: translateX(20px); }
  100% { transform: translateX(0px); }
}
`

export function SignUpIllustration() {
  return (
    <motion.div 
      className="hidden md:flex w-full h-full bg-gradient-to-b from-[#ffd4d4] to-[#ffe8e0] items-center justify-center p-12 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <style jsx>{`
        ${floatAnimation}
        .cloud {
          position: absolute;
          background: white;
          border-radius: 999px;
          animation: float 20s infinite;
          z-index: 2;
          width: 80px;
          height: 50px;
        }
        .cloud:nth-child(1) { top: 10%; left: 10%; animation-duration: 23s; }
        .cloud:nth-child(2) { top: 20%; right: 15%; animation-duration: 26s; }
        .cloud:nth-child(3) { top: 35%; left: 25%; animation-duration: 22s; }
        .cloud:nth-child(4) { top: 15%; left: 60%; animation-duration: 28s; }
        .cloud:nth-child(5) { top: 40%; right: 20%; animation-duration: 25s; }

        .tower {
          position: absolute;
          bottom: 40px;
          left: 10%;
          width: 60px;
          height: 150px;
          z-index: 15;
          transform: rotate(-5deg);
        }

        .tower-main,
        .tower-top,
        .tower-roof {
          transform: rotate(5deg);
        }

        .tower-main {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 45px;
          height: 105px;
          background: #ffb5b5;
          border-radius: 8px 8px 0 0;
          box-shadow: inset -10px 0 15px -5px rgba(0,0,0,0.1);
        }

        .tower-main::after {
          content: '';
          position: absolute;
          top: -10px;
          left: 0;
          right: 0;
          height: 10px;
          background: #ffc2c2;
          border-radius: 5px 5px 0 0;
        }

        .tower-top {
          position: absolute;
          bottom: 105px;
          left: 50%;
          transform: translateX(-50%);
          width: 52px;
          height: 30px;
          background: #ffc2c2;
          border-radius: 8px 8px 0 0;
          box-shadow: inset -10px 0 15px -5px rgba(0,0,0,0.1);
        }

        .tower-top::after {
          content: '';
          position: absolute;
          top: -5px;
          left: -3px;
          right: -3px;
          height: 5px;
          background: #ffd4d4;
          border-radius: 5px 5px 0 0;
        }

        .tower-roof {
          position: absolute;
          bottom: 135px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 22px solid transparent;
          border-right: 22px solid transparent;
          border-bottom: 22px solid #ffd4d4;
        }

        .window {
          position: absolute;
          width: 12px;
          height: 16px;
          background: rgba(255,255,255,0.9);
          border-radius: 10px 10px 0 0;
          box-shadow: inset 0 -5px 10px -5px rgba(0,0,0,0.1);
          transform: rotate(5deg);
        }

        .window:nth-child(1) { top: 15px; left: 8px; }
        .window:nth-child(2) { top: 15px; right: 8px; }
        .window:nth-child(3) { top: 45px; left: 8px; }
        .window:nth-child(4) { top: 45px; right: 8px; }
        .window:nth-child(5) { top: 75px; left: 8px; }
        .window:nth-child(6) { top: 75px; right: 8px; }

        .tower-top .window {
          width: 10px;
          height: 14px;
          top: 8px;
          transform: rotate(5deg);
        }

        .tower-top .window:nth-child(1) { left: 10px; }
        .tower-top .window:nth-child(2) { right: 10px; }
      `}</style>

      {/* Clouds */}
      <div className="cloud"></div>
      <div className="cloud"></div>
      <div className="cloud"></div>
      <div className="cloud"></div>
      <div className="cloud"></div>

      {/* Tower */}
      <div className="tower">
        <div className="tower-roof"></div>
        <div className="tower-top">
          <div className="window"></div>
          <div className="window"></div>
        </div>
        <div className="tower-main">
          <div className="window"></div>
          <div className="window"></div>
          <div className="window"></div>
          <div className="window"></div>
          <div className="window"></div>
          <div className="window"></div>
        </div>
      </div>
      {/* Animated shapes */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-24 h-24 bg-[#8E44AD] rounded-lg"
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 10, -10, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute top-1/2 right-1/4 w-28 h-28 bg-[#F1C40F] rounded-full"
        animate={{
          y: [0, -20, 0],
          x: [0, 10, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-1/4 left-1/3 w-32 h-16 bg-[#3498DB] rounded-lg"
        animate={{
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute top-1/3 right-1/3 w-24 h-24 bg-[#E74C3C] rounded-full"
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Central icon */}
      <motion.div
        className="relative z-10 bg-white rounded-full p-12 shadow-lg"
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32 text-[#3498DB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </motion.div>
    </motion.div>
  )
}
