# Análisis y Documentación de Login con Google y Producción (Railway)

Este documento detalla el análisis de la comunicación entre el backend y frontend de BioSenseIoT, los problemas identificados y las correcciones necesarias para que el Login con Google funcione correctamente en la aplicación móvil de producción.

## 1. Análisis de la Comunicación Actual

### Backend (Railway)
*   **Estado:** El backend ya cuenta con la lógica de autenticación mediante Google en `AuthService.java`.
*   **Logro:** Se implementó un flujo de "Upsert": si el usuario no existe en la base de datos (PostgreSQL en Railway), se crea automáticamente al iniciar sesión con Google.
*   **Base de Datos:** El esquema de `schema.sql` es correcto y ya incluye el campo `google_id`.
*   **Problema Detectado:** No había una configuración explícita de CORS. Esto impedía que la aplicación móvil (Capacitor) se comunicara con el backend debido a restricciones de seguridad del navegador/WebView.
*   **Corrección Realizada:** Se añadió un `CorsWebFilter` en `SecurityConfig.java` para permitir peticiones desde cualquier origen (incluyendo `capacitor://localhost`).

### Frontend (Capacitor / Next.js)
*   **Estado:** Utiliza el plugin `@codetrix-studio/capacitor-google-auth`.
*   **Problema Detectado:** La `API_URL` estaba configurada hacia `localhost:8080`, lo que hacía que fallara en dispositivos móviles reales apuntando a producción.
*   **Corrección Realizada:** Se actualizó `AuthService.ts` para apuntar a la URL de producción: `https://biosense-iot-production.up.railway.app`.

---

## 2. Requisitos Críticos para que el Login Funcione en el Celular (Producción)

Para que el usuario pueda "ver las cuentas disponibles en el celular" y loguearse con éxito, se deben cumplir los siguientes pasos en la consola de Google Cloud:

### Paso 1: Configuración en Google Cloud Console (OAuth 2.0)
Debes tener **dos** Client IDs en el mismo proyecto:
1.  **Web Client ID:** Se usa como `serverClientId` en la app móvil. (Ya está configurado: `669903110693-3f1lt6ci39go17j1hsutaeabrt36utq0.apps.googleusercontent.com`).
2.  **Android Client ID:** Es OBLIGATORIO para que el diálogo nativo de Google aparezca en el celular.

**Cómo crear el Android Client ID:**
1.  Ir a [Google Cloud Console](https://console.cloud.google.com/).
2.  Sección **API y Servicios** > **Credenciales**.
3.  Click en **Crear credenciales** > **ID de cliente de OAuth**.
4.  Tipo de aplicación: **Android**.
5.  **Nombre del paquete:** `com.biosense.iot` (debe coincidir exactamente con `capacitor.config.ts`).
6.  **Huella digital SHA-1:** Debes obtenerla de tu PC donde generas el APK o de la Play Store (si ya está subida).
    *   Comando para obtener SHA-1 (debug): `keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android`

### Paso 2: Sincronización de `google-services.json`
Una vez creado el Android Client ID, debes descargar el archivo `google-services.json` actualizado y reemplazar el que está en `frontend/android/app/google-services.json`.

---

## 3. Lista de Tareas para Corrección Final

Si el login sigue fallando en el celular, verifica lo siguiente:

1.  **CORS en Backend:** (YA CORREGIDO en este paso) Asegúrate de que el backend en Railway tenga la última versión del código con `SecurityConfig.java` actualizado.
2.  **SHA-1 en Google Console:** El error más común es que el SHA-1 registrado en Google Cloud no coincide con el que se usó para firmar la aplicación.
3.  **Variables de Entorno en Railway:** Asegúrate de que Railway tenga configuradas estas variables:
    *   `GOOGLE_CLIENT_ID`: El mismo Client ID Web.
    *   `GOOGLE_CLIENT_SECRET`: El secreto del Client ID Web.
    *   `PGHOST`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`, `PGPORT`: Datos de la base de datos PostgreSQL.
    *   `JWT_SECRET`: Una clave segura para firmar tus tokens locales.

## 4. Enlace de "Crear Cuenta"
Se confirmó que el enlace "Crea una cuenta" en la pantalla de login utiliza el mismo flujo de Google. Esto es correcto, ya que el backend realiza el registro automáticamente en la base de datos de Railway tras la primera validación exitosa del token de Google. No es necesario un enlace de registro separado si se usa login social.
