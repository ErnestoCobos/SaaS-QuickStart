"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

import { LeftIllustration } from "@/components/auth/LeftIllustration" 
import { SignUpForm } from "@/components/auth/SignUpForm"
import { LoadingOverlay } from "@/components/auth/LoadingOverlay"

export default function SignUpPage() {
  const [isAnimating, setIsAnimating] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsAnimating(true)
    
    // Simula un proceso inicial (por ejemplo, validación local)
    await new Promise(resolve => setTimeout(resolve, 1000))

    setIsLoading(true)
    
    // Llamada asíncrona a la API, etc.
    await new Promise(resolve => setTimeout(resolve, 2000))

    setIsLoading(false)
    setIsAnimating(false)
    
    // Aquí podrías redireccionar al dashboard o página de confirmación
    // router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-[#1B1B1B] p-6 flex items-center justify-center overflow-hidden">
      <motion.div
        className="w-full max-w-[1200px] bg-white rounded-2xl flex overflow-hidden shadow-lg"
        animate={isAnimating ? { scale: 0.9 } : { scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Sección Izquierda (Ilustración) - se puede reutilizar la misma */}
        <LeftIllustration isAnimating={isAnimating} />

        {/* Sección Derecha (Formulario de Sign Up) */}
        <SignUpForm isAnimating={isAnimating} onSignUp={handleSignUp} />
      </motion.div>

      <AnimatePresence>
        {isLoading && (
          <LoadingOverlay />
        )}
      </AnimatePresence>
    </div>
  )
}