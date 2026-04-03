"use client"

import { EcoLeafIcon } from "@/components/eco-leaf-icon"
import { EcoPaladinButton } from "@/components/eco-paladin-button"
import {
  Leaf,
  Droplets,
  Zap,
  Recycle,
  Building2,
  MapPin,
  Globe,
  Shield,
  TrendingUp,
  Award,
  Users,
  TreePine,
} from "lucide-react"

export default function CompanyPage() {
  const company = {
    name: "Mackensy Hedge Fund",
    industry: "Financial Services",
    location: "New York, NY",
    website: "mackensyfund.com",
    verified: true,
  }

  const scores = {
    overall: 72,
    carbon: 68,
    water: 85,
    energy: 74,
    waste: 65,
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-500"
    if (score >= 60) return "text-lime-500"
    if (score >= 40) return "text-amber-500"
    return "text-red-500"
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Organic flowing background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-100 via-emerald-50 to-white" />
        <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(34, 197, 94, 0.08)" />
              <stop offset="100%" stopColor="rgba(16, 185, 129, 0.03)" />
            </linearGradient>
            <linearGradient id="wave2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(56, 189, 248, 0.06)" />
              <stop offset="100%" stopColor="rgba(34, 197, 94, 0.04)" />
            </linearGradient>
          </defs>
          <path
            d="M0,100 Q200,50 400,100 T800,100 T1200,100 T1600,100 L1600,400 Q1200,350 800,400 T0,400 Z"
            fill="url(#wave1)"
            className="animate-pulse"
            style={{ animationDuration: "8s" }}
          />
          <path
            d="M0,200 Q300,150 600,200 T1200,200 T1600,200 L1600,500 Q1000,450 500,500 T0,500 Z"
            fill="url(#wave2)"
            className="animate-pulse"
            style={{ animationDuration: "10s", animationDelay: "2s" }}
          />
        </svg>
        {/* Floating orbs */}
        <div className="absolute right-[10%] top-[15%] h-64 w-64 rounded-full bg-gradient-to-br from-emerald-200/40 to-transparent blur-3xl" />
        <div className="absolute left-[5%] top-[40%] h-48 w-48 rounded-full bg-gradient-to-tr from-sky-200/30 to-transparent blur-3xl" />
        <div className="absolute bottom-[20%] right-[20%] h-56 w-56 rounded-full bg-gradient-to-tl from-lime-200/30 to-transparent blur-3xl" />
        
        {/* Spring-style leaf - bottom left - matches Spring Framework logo */}
        <svg 
          className="absolute -bottom-4 -left-4 h-72 w-72 opacity-30" 
          viewBox="0 0 200 200" 
          fill="none"
        >
          <defs>
            <linearGradient id="springLeafMain" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#4ade80" />
            </linearGradient>
          </defs>
          {/* Outer swoosh - the curved wrapper shape */}
          <path 
            d="M160,40 
               C175,55 180,80 170,105 
               C155,145 110,175 60,165 
               C35,160 20,140 25,115
               C30,90 55,75 85,80
               C100,82 110,90 105,105
               C100,120 80,130 60,125
               C75,135 100,135 120,115
               C140,95 145,70 130,50
               C115,30 85,25 60,40
               C35,55 25,85 35,115
               C45,145 75,165 110,160
               C145,155 170,125 175,90
               C180,55 160,25 125,20
               C100,17 75,25 60,40
               C85,20 120,20 145,35
               C155,42 160,40 160,40Z" 
            fill="url(#springLeafMain)"
          />
          {/* Inner leaf shape */}
          <path 
            d="M140,50 
               C150,65 150,85 140,100 
               C125,125 95,140 65,130 
               C50,125 45,110 55,95
               C65,80 85,75 100,85
               C90,75 70,78 60,95
               C50,112 55,130 75,135
               C105,142 135,120 145,90
               C150,70 145,55 140,50Z" 
            fill="url(#springLeafMain)"
            opacity="0.6"
          />
        </svg>
      </div>

      {/* Floating nav */}
      <nav className="sticky top-4 z-50 mx-4 md:mx-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between rounded-full bg-white/70 px-6 py-3 shadow-lg shadow-emerald-900/5 backdrop-blur-xl">
            <div className="flex items-center gap-2">
              <EcoLeafIcon className="h-8 w-8" />
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">ecoScore</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden text-sm text-emerald-700/70 sm:block">Company Profile</span>
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500" />
            </div>
          </div>
        </div>
      </nav>

      <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-8 md:px-8">
        {/* Hero section - flowing organic shape */}
        <section className="relative mb-8">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-white/80 via-white/60 to-emerald-50/40 p-8 shadow-xl shadow-emerald-900/10 backdrop-blur-sm md:p-12">
            {/* Decorative leaf shapes */}
            <svg className="absolute -right-12 -top-12 h-48 w-48 text-emerald-500/10" viewBox="0 0 100 100">
              <path d="M50,5 Q80,25 75,55 Q70,85 50,95 Q30,85 25,55 Q20,25 50,5" fill="currentColor" />
            </svg>
            <svg className="absolute -bottom-8 -left-8 h-32 w-32 rotate-45 text-teal-500/10" viewBox="0 0 100 100">
              <path d="M50,5 Q80,25 75,55 Q70,85 50,95 Q30,85 25,55 Q20,25 50,5" fill="currentColor" />
            </svg>

            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-12">
              {/* Company info */}
              <div className="flex-1">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/30">
                    <Building2 className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-2xl font-bold text-emerald-900 md:text-3xl">{company.name}</h1>
                      {company.verified && (
                        <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                          <Shield className="h-3 w-3" /> Verified
                        </span>
                      )}
                    </div>
                    <p className="text-emerald-600/80">{company.industry}</p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-4 text-sm text-emerald-700/70">
                  <span className="flex items-center gap-1.5 rounded-full bg-white/60 px-3 py-1.5 backdrop-blur-sm">
                    <MapPin className="h-4 w-4" /> {company.location}
                  </span>
                  <span className="flex items-center gap-1.5 rounded-full bg-white/60 px-3 py-1.5 backdrop-blur-sm">
                    <Globe className="h-4 w-4" /> {company.website}
                  </span>
                </div>

                <p className="mt-6 max-w-xl text-emerald-800/70 leading-relaxed">
                  A leading asset management firm demonstrating strong environmental responsibility 
                  with 45% of AUM allocated to ESG-compliant investments and carbon-neutral operations since 2024.
                </p>
              </div>

              {/* Main score - organic circular design */}
              <div className="relative flex items-center justify-center">
                <div className="relative">
                  {/* Outer glow ring */}
                  <div className="absolute -inset-4 rounded-full bg-gradient-to-br from-emerald-200 via-teal-100 to-lime-100 blur-xl opacity-60" />
                  
                  {/* Score circle */}
                  <div className="relative flex h-44 w-44 flex-col items-center justify-center rounded-full bg-gradient-to-br from-white via-white to-emerald-50 shadow-2xl shadow-emerald-500/20">
                    <svg className="absolute inset-0 h-full w-full -rotate-90">
                      <defs>
                        <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#34d399" />
                          <stop offset="50%" stopColor="#22c55e" />
                          <stop offset="100%" stopColor="#16a34a" />
                        </linearGradient>
                      </defs>
                      <circle cx="88" cy="88" r="78" fill="none" stroke="#e5e7eb" strokeWidth="8" opacity="0.3" />
                      <circle
                        cx="88"
                        cy="88"
                        r="78"
                        fill="none"
                        stroke="url(#scoreGradient)"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 78 * 0.72} ${2 * Math.PI * 78 * 0.28}`}
                        className="drop-shadow-lg"
                      />
                    </svg>
                    <span className="text-5xl font-bold bg-gradient-to-br from-emerald-600 to-teal-600 bg-clip-text text-transparent">{scores.overall}</span>
                    <span className="text-sm font-medium text-emerald-600">Good</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Category scores - flowing horizontal band */}
        <section className="mb-8 overflow-hidden rounded-[2rem] bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 p-1 shadow-xl shadow-emerald-900/20">
          <div className="flex flex-wrap items-center justify-around gap-4 rounded-[1.8rem] bg-white/95 px-6 py-6 backdrop-blur-sm md:flex-nowrap md:gap-0 md:px-8">
            {[
              { label: "Carbon", score: scores.carbon, icon: Leaf },
              { label: "Water", score: scores.water, icon: Droplets },
              { label: "Energy", score: scores.energy, icon: Zap },
              { label: "Waste", score: scores.waste, icon: Recycle },
            ].map((item, i) => (
              <div key={item.label} className="flex items-center gap-6">
                {i > 0 && <div className="hidden h-12 w-px bg-gradient-to-b from-transparent via-emerald-200 to-transparent md:block" />}
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50">
                    <item.icon className="h-6 w-6 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-sm text-emerald-600/70">{item.label}</p>
                    <p className={`text-2xl font-bold ${getScoreColor(item.score)}`}>{item.score}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Paladin CTA - organic flowing shape */}
        <section className="mb-8">
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 p-8 shadow-xl shadow-emerald-900/20">
            {/* Organic background shapes */}
            <svg className="absolute inset-0 h-full w-full opacity-20" preserveAspectRatio="none">
              <path d="M0,0 Q100,50 200,20 T400,40 T600,20 T800,40 L800,200 Q600,180 400,200 T0,200 Z" fill="white" />
            </svg>
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-teal-300/20 blur-3xl" />

            <div className="relative flex flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left">
              <div className="max-w-lg">
                <h2 className="text-2xl font-bold text-white md:text-3xl">Unlock Your Full Potential</h2>
                <p className="mt-2 text-emerald-100/90">
                  Get a comprehensive environmental audit with actionable insights from our ecoPaladin experts.
                </p>
              </div>
              <EcoPaladinButton />
            </div>
          </div>
        </section>

        {/* Stats and details - organic flowing layout */}
        <section className="grid gap-6 md:grid-cols-3">
          {/* Left column - Stats */}
          <div className="space-y-4 md:col-span-1">
            {[
              { icon: Users, label: "Employees", value: "342", trend: "+12%" },
              { icon: TrendingUp, label: "ESG Allocation", value: "45%", trend: "+8%" },
              { icon: TreePine, label: "Green Projects", value: "12", trend: "+3" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="group relative overflow-hidden rounded-2xl bg-white/70 p-5 shadow-lg shadow-emerald-900/5 backdrop-blur-sm transition-all hover:bg-white/90 hover:shadow-xl"
              >
                <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br from-emerald-100 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-100 to-teal-50">
                      <stat.icon className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm text-emerald-600/70">{stat.label}</p>
                      <p className="text-2xl font-bold text-emerald-900">{stat.value}</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                    {stat.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Right column - Initiatives & Certs */}
          <div className="space-y-6 md:col-span-2">
            {/* Initiatives */}
            <div className="overflow-hidden rounded-[1.5rem] bg-white/70 shadow-lg shadow-emerald-900/5 backdrop-blur-sm">
              <div className="border-b border-emerald-100 bg-gradient-to-r from-emerald-50/80 to-transparent px-6 py-4">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-emerald-900">
                  <TreePine className="h-5 w-5 text-emerald-500" />
                  Sustainability Initiatives
                </h3>
              </div>
              <div className="divide-y divide-emerald-50">
                {[
                  { title: "Carbon Neutral Operations", desc: "Achieved through renewable energy credits", status: "Active" },
                  { title: "ESG Investment Portfolio", desc: "45% of AUM in ESG-compliant vehicles", status: "Active" },
                  { title: "LEED Gold Headquarters", desc: "Certified green building in Manhattan", status: "Certified" },
                ].map((item) => (
                  <div key={item.title} className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-emerald-50/50">
                    <div>
                      <p className="font-medium text-emerald-900">{item.title}</p>
                      <p className="text-sm text-emerald-600/70">{item.desc}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                      item.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-sky-100 text-sky-700"
                    }`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications - flowing pills */}
            <div className="rounded-[1.5rem] bg-white/70 p-6 shadow-lg shadow-emerald-900/5 backdrop-blur-sm">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-emerald-900">
                <Award className="h-5 w-5 text-emerald-500" />
                Certifications & Commitments
              </h3>
              <div className="flex flex-wrap gap-3">
                {[
                  "PRI Signatory",
                  "CDP Climate Disclosure",
                  "TCFD Reporting",
                  "UN Global Compact",
                  "SASB Aligned",
                ].map((cert) => (
                  <span
                    key={cert}
                    className="rounded-full bg-gradient-to-r from-emerald-50 to-teal-50 px-4 py-2 text-sm font-medium text-emerald-700 shadow-sm transition-all hover:shadow-md hover:from-emerald-100"
                  >
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
