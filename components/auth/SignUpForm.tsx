"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { SignUp } from "@clerk/nextjs"


export function SignUpForm() {

  return (
    <motion.div
      className="w-full md:w-1/2 bg-white p-8 md:p-12 flex flex-col justify-center"
      transition={{ duration: 0.5 }}
    >
      <div className="w-full max-w-[400px] mx-auto space-y-6">
        <div className="text-center space-y-2">
          <Image 
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Voltaflow%20Isologotipo-J5rlITjDdVDQXdUQ9OjqU2TCbWmYYR.png"
            alt="Voltaflow Logo"
            className="h-12 mx-auto mb-6"
          />
        </div>

        <SignUp/>
      </div>
    </motion.div>
  )
}