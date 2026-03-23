"use client"

import { Lightbulb } from "lucide-react"
import { cn } from "@/lib/utils"

interface FABButtonProps {
  onClick: () => void
  label?: string
  className?: string
}

export function FABButton({ onClick, label = "Recomendaciones IA", className }: FABButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "fixed bottom-24 right-4 z-30 flex items-center gap-2 px-4 py-3",
        "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground",
        "rounded-full shadow-lg shadow-primary/25",
        "hover:shadow-xl hover:shadow-primary/30 hover:scale-105",
        "active:scale-95 transition-all duration-300",
        "animate-float",
        className
      )}
    >
      <Lightbulb className="w-5 h-5" />
      <span className="text-sm font-medium pr-1">{label}</span>
    </button>
  )
}
