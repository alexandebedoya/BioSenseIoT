# BioSense IoT Monorepo

Sistema de monitoreo de calidad del aire interior con arquitectura escalable.

## Estructura del Proyecto

- `backend/`: Spring Boot 3.3 (Java 21) - Arquitectura Hexagonal.
- `frontend/`: Next.js 15 + Tailwind + Ionic + Capacitor.
- `hardware/`: Firmware para ESP32 (PlatformIO).
- `shared/`: Contratos API (OpenAPI) y tipos TypeScript compartidos.
- `docs/`: Documentación técnica y ADRs.

## Quick Start (Local)

1. **Infraestructura:**
   ```bash
   docker-compose up -d
   ```

2. **Backend:**
   ```bash
   cd backend
   mvn spring-boot:run
   ```

3. **Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Despliegue
Configurado para **Railway.app** mediante GitHub Actions en `.github/workflows/`.
