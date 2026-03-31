#!/bin/bash

# Variables de entorno
export KEYSTORE_PATH="/c/Users/alexi/Desktop/BioSenseIoT/biosense-final.keystore"
export KEYSTORE_PASSWORD="alexis2026"
export KEY_ALIAS="biosense-alias"
export KEY_PASSWORD="alexis2026"

# Ir al frontend
cd "$(dirname "$0")" || exit 1

# Sincronizar Capacitor
echo "Sincronizando Capacitor..."
npx cap sync android

# Generar APK firmado
echo "Generando APK firmado..."
cd android || exit 1
./gradlew assembleRelease \
  -Pandroid.injected.signing.store.file=$KEYSTORE_PATH \
  -Pandroid.injected.signing.store.password=$KEYSTORE_PASSWORD \
  -Pandroid.injected.signing.key.alias=$KEY_ALIAS \
  -Pandroid.injected.signing.key.password=$KEY_PASSWORD

echo "✅ APK generado en: android/app/build/outputs/apk/release/app-release.apk"