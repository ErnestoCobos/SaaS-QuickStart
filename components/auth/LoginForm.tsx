"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Eye, EyeOff } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { SignIn } from "@clerk/nextjs"

interface LoginFormProps {
  isAnimating: boolean
  onLogin: (e: React.FormEvent) => void
}

export function LoginForm({ isAnimating, onLogin }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [focusedInput, setFocusedInput] = useState<string | null>(null)
  const [eyesLookingUp, setEyesLookingUp] = useState(false)

  return (
    <motion.div 
      className="w-full md:w-1/2 bg-white p-8 md:p-12 flex flex-col justify-center"
      animate={isAnimating ? { x: "100%" } : { x: "0%" }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full max-w-[400px] mx-auto space-y-6">
        <div className="text-center space-y-2">
          <img 
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Voltaflow%20Isologotipo-J5rlITjDdVDQXdUQ9OjqU2TCbWmYYR.png"
            alt="Voltaflow Logo"
            className="h-12 mx-auto mb-6"
          />
        </div>

        <SignIn/>
      </div>
    </motion.div>
  )
}