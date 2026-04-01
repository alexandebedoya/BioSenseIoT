'use client'

import { cn } from '@/lib/utils'
import { LayoutDashboard, Activity, Bell, BarChart3, User } from 'lucide-react'

type Tab = 'dashboard' | 'sensores' | 'alertas' | 'analisis' | 'perfil'

interface BottomNavProps {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
  alertCount?: number
}

const tabs = [
  { id: 'dashboard' as Tab, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'sensores' as Tab, label: 'Sensores', icon: Activity },
  { id: 'alertas' as Tab, label: 'Alertas', icon: Bell },
  { id: 'analisis' as Tab, label: 'Análisis', icon: BarChart3 },
  { id: 'perfil' as Tab, label: 'Perfil', icon: User },
]

export function BottomNav({ activeTab, onTabChange, alertCount = 0 }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-lg">
      <div className="mx-auto flex max-w-md items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'relative flex flex-1 flex-col items-center gap-1 py-3 transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <div className="relative">
                <Icon className={cn(
                  'h-5 w-5 transition-transform',
                  isActive && 'scale-110'
                )} />
                {tab.id === 'alertas' && alertCount > 0 && (
                  <span className="absolute -right-2 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    {alertCount > 9 ? '9+' : alertCount}
                  </span>
                )}
              </div>
              <span className={cn(
                'text-[10px] font-medium',
                isActive && 'text-primary'
              )}>
                {tab.label}
              </span>
              {isActive && (
                <div className="absolute -top-px left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-primary" />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
