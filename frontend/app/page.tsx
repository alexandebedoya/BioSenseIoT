"use client"

import { useState } from "react"
import { LoginScreen } from "@/components/iot/premium/login-screen"
import { AppHeader } from "@/components/iot/premium/app-header"
import { AppSidebar } from "@/components/iot/premium/app-sidebar"
import { BottomNavigation } from "@/components/iot/premium/bottom-navigation"
import { DashboardView } from "@/components/iot/premium/views/dashboard-view"
import { MonitoringView } from "@/components/iot/premium/views/monitoring-view"
import { AlertsView } from "@/components/iot/premium/views/alerts-view"
import { AnalysisView } from "@/components/iot/premium/views/analysis-view"
import { SensorsView } from "@/components/iot/premium/views/sensors-view"
import { RecommendationsView } from "@/components/iot/premium/views/recommendations-view"
import { ProfileView } from "@/components/iot/premium/views/profile-view"
import { useSensorData } from "@/hooks/use-sensor-data"

type ViewType = "dashboard" | "monitoreo" | "analisis" | "alertas" | "sensores" | "recomendaciones" | "perfil"

export default function AirQualityApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentView, setCurrentView] = useState<ViewType>("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { data } = useSensorData()

  // Login handler
  const handleLogin = () => {
    setIsAuthenticated(true)
  }

  // Logout handler
  const handleLogout = () => {
    setIsAuthenticated(false)
    setSidebarOpen(false)
  }

  // If not authenticated, show login
  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />
  }

  // Render current view
  const renderView = () => {
    switch (currentView) {
      case "dashboard":
        return (
          <DashboardView 
            data={data} 
            onNavigateToAlerts={() => setCurrentView("alertas")}
            onNavigateToRecommendations={() => setCurrentView("recomendaciones")}
          />
        )
      case "monitoreo":
        return <MonitoringView data={data} />
      case "alertas":
        return <AlertsView />
      case "analisis":
        return <AnalysisView />
      case "sensores":
        return <SensorsView />
      case "recomendaciones":
        return <RecommendationsView data={data} />
      case "perfil":
        return <ProfileView />
      default:
        return <DashboardView data={data} onNavigateToAlerts={() => setCurrentView("alertas")} onNavigateToRecommendations={() => setCurrentView("recomendaciones")} />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <AppHeader 
        title="Monitoreo Ambiental IoT" 
        onMenuClick={() => setSidebarOpen(true)}
        notificationCount={3}
      />

      {/* Sidebar */}
      <AppSidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentView={currentView}
        onNavigate={setCurrentView}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main className="min-h-[calc(100vh-4rem)] max-w-lg mx-auto">
        {renderView()}
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation 
        currentView={currentView}
        onNavigate={setCurrentView}
        alertCount={3}
      />
    </div>
  )
}
