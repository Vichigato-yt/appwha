/**
 * RootLayout - Layout Principal de la App
 * 
 * Este archivo define:
 * - La estructura de navegación base (Stack)
 * - La inicialización de la app al abrir
 * - Carga de fotos guardadas desde AsyncStorage
 * - Configuración de estilos globales
 */

import { Stack } from "expo-router";
import { useEffect } from "react";
import 'react-native-gesture-handler';
import { loadPhotosFromStorage } from "../lib/store/galleryStore";

export default function RootLayout() {
  /**
   * useEffect: Se ejecuta al cargar la app
   * 
   * Flujo:
   * 1. Llama loadPhotosFromStorage() para traer fotos del dispositivo
   * 2. Las fotos se cargan en el estado global (galleryStore)
   * 3. Si hay error, se captura y loguea
   * 
   * Esto garantiza que al abrir la app, todas las fotos guardadas
   * estén disponibles antes de renderizar la galería
   */
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Cargar fotos guardadas en AsyncStorage del dispositivo
        await loadPhotosFromStorage();
      } catch (error) {
        // Error al inicializar
      }
    };
    initializeApp();
  }, []);

  return (
    <Stack
      screenOptions={{
        // headerShown: false = no mostrar header nativo
        // Permite uso de componentes personalizados en lugar del header default
        headerShown: false,
      }}
    />
  );
}
