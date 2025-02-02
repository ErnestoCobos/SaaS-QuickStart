"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

import { SignUpIllustration } from "@/components/auth/SignUpIllustration" 
import { SignUpForm } from "@/components/auth/SignUpForm"

export default function SignUpPage() {

  return (
    <div className="min-h-screen p-6 flex items-center justify-center">
      <div className="w-full max-w-[1200px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl flex overflow-hidden shadow-lg"
          transition={{ duration: 0.5 }}
        >
          {/* Left Section (Sign Up Illustration) */}
          <div className="hidden md:block md:w-[60%]">
            <SignUpIllustration />
          </div>

          {/* Right Section (Sign Up Form) */}
          <SignUpForm />
        </motion.div>
      </div>
    </div>
  )
}
