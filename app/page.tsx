"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <motion.h1
        className="text-3xl font-bold mb-8 text-[#ADFF00] text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Zero1 By Zerodha Excel Sheet Calculator Combined
      </motion.h1>
      <div className="space-y-4 w-full max-w-md">
        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
          <Button
            onClick={() => router.push("/car-afford")}
            className="w-full bg-[#ADFF00] text-black hover:bg-[#88CC00]"
          >
            Can You Afford A Car?
          </Button>
        </motion.div>
        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
          <Button onClick={() => router.push("/fire")} className="w-full bg-[#ADFF00] text-black hover:bg-[#88CC00]">
            Calculate Fire
          </Button>
        </motion.div>
        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
          <Button
            onClick={() => router.push("/income-tax")}
            className="w-full bg-[#ADFF00] text-black hover:bg-[#88CC00]"
          >
            Calculate Income Tax
          </Button>
        </motion.div>
        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
          <Button
            onClick={() => router.push("/save-to-buy")}
            className="w-full bg-[#ADFF00] text-black hover:bg-[#88CC00]"
          >
            How to save to Buy something?
          </Button>
        </motion.div>
      </div>
    </div>
  )
}

