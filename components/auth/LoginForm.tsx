"use client"

import { SignIn } from "@clerk/nextjs"
import Image from "next/image"

export function LoginForm() {

  return (
      <div className="w-full max-w-[400px] mx-auto space-y-6">
        <div className="text-center space-y-2">
          <Image 
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Voltaflow%20Isologotipo-J5rlITjDdVDQXdUQ9OjqU2TCbWmYYR.png"
            alt="Voltaflow Logo"
            className="h-12 mx-auto mb-6"
          />
        </div>

        <SignIn />
      </div>
  )
}