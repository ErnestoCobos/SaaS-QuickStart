"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

import { LeftIllustration } from "@/components/auth/LeftIllustration"
import { LoginForm } from "@/components/auth/LoginForm"
import { LoadingOverlay } from "@/components/auth/LoadingOverlay"

export default function LoginPage() {
  // Estados relacionados con la animación y el loading
  const [isAnimating, setIsAnimating] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Función de manejo de login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsAnimating(true)
    
    // Simulación de proceso previo
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(true)
    
    // Simula una llamada a API
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsLoading(false)
    setIsAnimating(false)
  }

  return (
    <div className="min-h-screen bg-[#1B1B1B] p-6 flex items-center justify-center overflow-hidden">
      {/* Contenedor principal con Scale Animation */}
      <motion.div
        className="w-full max-w-[1200px] bg-white rounded-2xl flex overflow-hidden shadow-lg"
        animate={isAnimating ? { scale: 0.9 } : { scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Sección Izquierda (Ilustración) */}
        <LeftIllustration isAnimating={isAnimating} />

        {/* Sección Derecha (Formulario) */}
        <LoginForm
          isAnimating={isAnimating}
          onLogin={handleLogin}
        />
      </motion.div>

      {/* Overlay de Cargando */}
      <AnimatePresence>
        {isLoading && (
          <LoadingOverlay />
        )}
      </AnimatePresence>
    </div>
  )
}