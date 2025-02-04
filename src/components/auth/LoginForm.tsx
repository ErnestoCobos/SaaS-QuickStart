"use client"

import { motion } from "framer-motion"
import { SignIn } from "@clerk/nextjs"

export function LoginForm() {
  return (
    <motion.div
      className="w-full h-full p-6 md:p-10 flex flex-col justify-center"
      transition={{ duration: 0.5 }}
    >
      <div className="w-full max-w-[500px] mx-auto space-y-8">
        
        <SignIn />
      </div>
    </motion.div>
  )
}
