"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

import { LeftIllustration } from "@/components/auth/LeftIllustration" 
import { SignUpForm } from "@/components/auth/SignUpForm"

export default function SignUpPage() {

  return (
    <div className="min-h-screen bg-[#1B1B1B] p-6 flex items-center justify-center overflow-hidden">
      <motion.div
        className="w-full max-w-[1200px] bg-white rounded-2xl flex overflow-hidden shadow-lg"
        transition={{ duration: 0.5 }}
      >
        {/* Sección Izquierda (Ilustración) - se puede reutilizar la misma */}
        <LeftIllustration />

        {/* Sección Derecha (Formulario de Sign Up) */}
        <SignUpForm />
      </motion.div>
    </div>
  )
}