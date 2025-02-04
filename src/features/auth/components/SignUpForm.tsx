"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { SignUp } from "@clerk/nextjs"

export function SignUpForm() {
  return (
    <motion.div
      className="bg-white  w-full h-full p-6 md:p-10 flex flex-col justify-center"
      transition={{ duration: 0.5 }}
    >
      <div className="w-full max-w-[550px] mx-auto space-y-6">
        <SignUp />
      </div>
    </motion.div>
  )
}
