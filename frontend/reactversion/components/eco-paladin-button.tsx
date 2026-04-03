"use client"

import { Shield, Sparkles } from "lucide-react"

export function EcoPaladinButton() {
  return (
    <button className="group relative overflow-hidden rounded-full bg-white px-8 py-4 font-semibold text-emerald-700 shadow-xl shadow-emerald-900/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-900/30">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 via-white to-teal-50 opacity-0 transition-opacity group-hover:opacity-100" />
      
      {/* Shimmer effect */}
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      
      <span className="relative flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/30 transition-transform duration-300 group-hover:rotate-12">
          <Shield className="h-5 w-5 text-white" />
        </span>
        <span className="flex items-center gap-2 text-lg">
          Request ecoPaladin Score Assessment
          <Sparkles className="h-4 w-4 text-emerald-400 opacity-0 transition-opacity group-hover:opacity-100" />
        </span>
      </span>
    </button>
  )
}
