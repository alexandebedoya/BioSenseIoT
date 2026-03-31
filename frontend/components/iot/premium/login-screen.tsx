"use client"

import { useState, useEffect } from "react"
import { Wind, Mail, Lock, Eye, EyeOff, Loader2, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { AuthService } from "@/lib/auth-service"
import { toast } from "sonner"

interface LoginScreenProps {
  onLogin: () => void
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [mounted, setMounted] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")

  // Asegurar hidratación correcta en dispositivos móviles
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true)
    try {
      console.log("Iniciando Google Login...")
      await AuthService.loginWithGoogle()
      toast.success("Sesión iniciada correctamente")
      onLogin()
    } catch (error: any) {
      console.error("Error detallado:", error)
      toast.error(`Error Google: ${error.message || "Falla de comunicación"}`)
    } finally {
      setIsGoogleLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error("Por favor completa los campos")
      return
    }

    setIsLoading(true)
    try {
      if (isRegistering) {
        await AuthService.register(email, password, fullName)
        toast.success("Cuenta creada correctamente")
      } else {
        await AuthService.login(email, password)
        toast.success("Sesión iniciada")
      }
      onLogin()
    } catch (error: any) {
      toast.error(error.message || "Error en la operación")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
            <Wind className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isRegistering ? "Crear cuenta" : "Bienvenido a BioSense"}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {isRegistering ? "Completa tus datos" : "Ingresa tus credenciales"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <Input
              type="text"
              placeholder="Nombre completo"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="h-12 rounded-xl"
              required
            />
          )}
          <Input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 rounded-xl"
            required
          />
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 rounded-xl"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-slate-400"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 rounded-xl text-base font-semibold shadow-md"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : (isRegistering ? "Registrarse" : "Entrar")}
          </Button>
        </form>

        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400">O continuar con</span></div>
        </div>

        <Button
          type="button"
          variant="outline"
          disabled={isGoogleLoading}
          onClick={handleGoogleLogin}
          className="w-full h-12 rounded-xl border-slate-200 hover:bg-slate-50"
        >
          {isGoogleLoading ? <Loader2 className="animate-spin mr-2" /> : (
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115z" />
              <path fill="#FBBC05" d="M16.04 18.013c-1.09.693-2.43 1.078-3.84 1.078-2.618 0-4.836-1.745-5.618-4.135l-4.104 3.142C4.4 21.302 8.01 24 12 24c3.055 0 5.782-1.073 7.736-2.864l-3.696-3.123z" />
              <path fill="#4285F4" d="M19.736 21.136C22.25 18.823 24 15.532 24 12c0-.85-.09-1.68-.26-2.48H12v4.83h6.918a5.92 5.92 0 0 1-2.574 3.886l3.392 2.9z" />
              <path fill="#34A853" d="M1.24 6.65L5.266 9.765C5.72 8.414 6.845 7.36 8.21 6.883l3.79-2.9C9.79 3.018 7.6 2.305 5.266 2.305 3.323 2.305 1.545 3.15.24 4.54l1 2.11z" />
            </svg>
          )}
          Google
        </Button>

        <p className="text-center text-sm text-slate-500">
          {isRegistering ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}{" "}
          <button 
            type="button" 
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-primary font-bold hover:underline"
          >
            {isRegistering ? "Inicia sesión" : "Regístrate"}
          </button>
        </p>
      </div>
    </div>
  )
}