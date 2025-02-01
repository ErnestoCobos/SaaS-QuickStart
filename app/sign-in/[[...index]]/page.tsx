"use client"

import { LeftIllustration } from "@/components/auth/LeftIllustration"
import { LoginForm } from "@/components/auth/LoginForm"

export default function LoginPage() {

  return (
    <div className="min-h-screen bg-[#1B1B1B] p-6 flex items-center justify-center overflow-hidden">
        {/* Sección Izquierda (Ilustración) */}
        <LeftIllustration/>

        {/* Sección Derecha (Formulario) */}
        <LoginForm/>
    </div>
  )
}