"use client"

import { motion } from "framer-motion"
import { LeftIllustration, LoginForm } from "@/components/auth"

export default function LoginPage() {
  return (
    <div className="min-h-screen p-6 flex items-center justify-center">
      <div className="w-full max-w-[1000px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl overflow-hidden shadow-xl"
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="flex">
            {/* Left Section (Illustration) */}
            <div className="hidden md:block w-[480px] bg-gradient-to-b from-gray-800 to-gray-900">
              <LeftIllustration />
            </div>

            {/* Right Section (Login Form) */}
            <div className="bg-white  flex-1">
              <LoginForm />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
