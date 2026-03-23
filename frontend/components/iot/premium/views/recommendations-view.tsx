"use client"

import { 
  Lightbulb, 
  Wind, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles,
  ArrowRight
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { SensorData } from "@/lib/types"

interface RecommendationsViewProps {
  data: SensorData
}

interface Recommendation {
  id: string
  type: "urgent" | "suggestion" | "info"
  title: string
  description: string
  action?: string
}

function getRecommendations(data: SensorData): Recommendation[] {
  const recommendations: Recommendation[] = []

  if (data.mq7.status === "danger" || data.mq7.value > 50) {
    recommendations.push({
      id: "co-danger",
      type: "urgent",
      title: "Nivel de CO Critico",
      description: "Se detectaron niveles peligrosos de monoxido de carbono. Abra ventanas inmediatamente y considere evacuar el area.",
      action: "Ventilar ahora"
    })
  } else if (data.mq7.status === "warning" || data.mq7.value > 30) {
    recommendations.push({
      id: "co-warning",
      type: "suggestion",
      title: "CO Elevado",
      description: "Los niveles de CO estan por encima de lo normal. Mejore la ventilacion en las proximas horas.",
      action: "Ver detalles"
    })
  }

  if (data.mq4.status === "warning" || data.mq4.value > 50) {
    recommendations.push({
      id: "ch4-warning",
      type: "suggestion",
      title: "Metano Detectado",
      description: "Niveles moderados de metano. Verifique las conexiones de gas y asegurese de que no haya fugas.",
      action: "Revisar"
    })
  }

  if (data.humidity > 70) {
    recommendations.push({
      id: "humidity",
      type: "info",
      title: "Humedad Alta",
      description: "La humedad esta elevada. Considere usar un deshumidificador para prevenir moho.",
      action: "Mas info"
    })
  }

  // Always show general tips
  recommendations.push({
    id: "general-1",
    type: "info",
    title: "Ventilacion Regular",
    description: "Se recomienda ventilar los espacios al menos 15 minutos al dia para mantener una buena calidad del aire.",
  })

  recommendations.push({
    id: "general-2",
    type: "info",
    title: "Mantenimiento de Sensores",
    description: "Recuerde calibrar los sensores cada 6 meses para mantener lecturas precisas.",
  })

  return recommendations
}

const typeConfig = {
  urgent: {
    icon: AlertTriangle,
    bg: "bg-status-danger/10",
    border: "border-status-danger/20",
    iconColor: "text-status-danger",
    badge: "bg-status-danger text-white"
  },
  suggestion: {
    icon: Lightbulb,
    bg: "bg-status-warning/10",
    border: "border-status-warning/20",
    iconColor: "text-status-warning",
    badge: "bg-status-warning text-white"
  },
  info: {
    icon: CheckCircle2,
    bg: "bg-status-info/10",
    border: "border-status-info/20",
    iconColor: "text-status-info",
    badge: "bg-status-info text-white"
  }
}

export function RecommendationsView({ data }: RecommendationsViewProps) {
  const recommendations = getRecommendations(data)
  const urgentCount = recommendations.filter(r => r.type === "urgent").length
  const suggestionCount = recommendations.filter(r => r.type === "suggestion").length

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="p-4 pb-0">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">Recomendaciones IA</h1>
        </div>
        <p className="text-muted-foreground text-sm mt-1">
          Analisis inteligente de tu calidad del aire
        </p>
      </div>

      {/* Summary Cards */}
      <div className="p-4 grid grid-cols-2 gap-3">
        <div className="bg-status-danger/10 rounded-2xl p-4 border border-status-danger/20 animate-fade-in-up">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-status-danger" />
            <span className="text-sm font-medium">Urgentes</span>
          </div>
          <p className="text-3xl font-bold text-status-danger">{urgentCount}</p>
        </div>
        <div className="bg-status-warning/10 rounded-2xl p-4 border border-status-warning/20 animate-fade-in-up" style={{ animationDelay: '50ms' }}>
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-5 h-5 text-status-warning" />
            <span className="text-sm font-medium">Sugerencias</span>
          </div>
          <p className="text-3xl font-bold text-status-warning">{suggestionCount}</p>
        </div>
      </div>

      {/* AI Analysis Card */}
      <div className="px-4">
        <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-4 border border-primary/20 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Wind className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Analisis General</h3>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                La calidad del aire en tu hogar es <span className={cn(
                  "font-medium",
                  data.mq7.status === "safe" && data.mq4.status === "safe" 
                    ? "text-status-safe" 
                    : data.mq7.status === "danger" || data.mq4.status === "danger"
                    ? "text-status-danger"
                    : "text-status-warning"
                )}>
                  {data.mq7.status === "safe" && data.mq4.status === "safe" 
                    ? "buena" 
                    : data.mq7.status === "danger" || data.mq4.status === "danger"
                    ? "preocupante"
                    : "moderada"}
                </span>. 
                {data.mq7.status === "safe" && data.mq4.status === "safe" 
                  ? " Continua con tus habitos de ventilacion actuales."
                  : " Te recomendamos seguir las sugerencias a continuacion."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations List */}
      <div className="p-4 space-y-3">
        <h2 className="font-semibold text-lg">Acciones Recomendadas</h2>
        
        {recommendations.map((rec, index) => {
          const config = typeConfig[rec.type]
          const Icon = config.icon

          return (
            <div
              key={rec.id}
              className={cn(
                "rounded-2xl p-4 border transition-all",
                config.bg, config.border,
                "animate-fade-in-up opacity-0"
              )}
              style={{ animationDelay: `${150 + index * 50}ms`, animationFillMode: 'forwards' }}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                  config.bg
                )}>
                  <Icon className={cn("w-5 h-5", config.iconColor)} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-sm">{rec.title}</h4>
                    {rec.type === "urgent" && (
                      <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", config.badge)}>
                        Urgente
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {rec.description}
                  </p>
                  
                  {rec.action && (
                    <button className="flex items-center gap-1 mt-3 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                      {rec.action}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
