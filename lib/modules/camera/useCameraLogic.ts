/**
 * useCameraLogic.ts - Hook para Lógica de Cámara
 * 
 * Responsabilidades:
 * - Solicitar y gestionar permisos de cámara
 * - Mantener referencia a la cámara (CameraView)
 * - Capturar fotos
 * - Verificar que la cámara está lista antes de capturar
 */

import { CameraView, useCameraPermissions } from 'expo-camera';
import { useCallback, useRef, useState } from 'react';

/**
 * Interfaz de retorno del hook
 * Define qué valores y funciones proporciona este hook
 */
export interface CameraLogicReturn {
  permission: ReturnType<typeof useCameraPermissions>[0];     // Estado del permiso
  requestPermission: () => Promise<boolean>;                  // Solicitar permiso
  cameraRef: React.RefObject<CameraView | null>;            // Referencia a CameraView
  isReady: boolean;                                           // ¿Cámara lista?
  handleCameraReady: () => void;                             // Callback cuando cámara abre
  takePicture: () => Promise<string | null>;                 // Capturar foto
}

/**
 * Hook useCameraLogic
 * 
 * Uso en camera.tsx:
 * ```
 * const {
 *   permission,
 *   requestPermission,
 *   cameraRef,
 *   takePicture,
 * } = useCameraLogic();
 * ```
 * 
 * @returns {CameraLogicReturn} Objeto con funciones y estado
 */
export const useCameraLogic = (): CameraLogicReturn => {
  /**
   * useCameraPermissions() - Hook de Expo
   * Retorna: [permission, requestPermission]
   * - permission: estado del permiso (granted/denied/undetermined)
   * - requestPermission: función para solicitar permisos
   */
  const [permission, requestPermission] = useCameraPermissions();

  /**
   * isReady - ¿La cámara ha cargado completamente?
   * Se pone true cuando CameraView dispara onCameraReady
   */
  const [isReady, setIsReady] = useState(false);

  /**
   * cameraRef - Referencia a la instancia de CameraView
   * Usada para:
   * - Capturar fotos: cameraRef.current.takePictureAsync()
   * - Acceder a métodos nativos de la cámara
   */
  const cameraRef = useRef<CameraView>(null);

  /**
   * Callback cuando CameraView está lista
   * Se ejecuta cuando el componente CameraView monta y carga
   */
  const handleCameraReady = useCallback(() => {
    setIsReady(true);
  }, []);

  /**
   * Capturar foto desde la cámara
   * 
   * Flujo:
   * 1. Verificar que cameraRef existe y está lista
   * 2. Llamar takePictureAsync con opciones
   * 3. Retornar URI de la foto capturada
   * 4. Si error, retornar null
   * 
   * Parámetros:
   * - quality: 0.8 = 80% de calidad (reduce tamaño)
   * - base64: false = no retornar foto en base64 (muy pesado)
   * 
   * @returns {Promise<string | null>} URI de foto o null si falla
   */
  const takePicture = useCallback(async (): Promise<string | null> => {
    // Verificar que podemos capturar: ref existe y cámara está lista
    if (!cameraRef.current || !isReady) {
      return null;
    }

    try {
      // Capturar foto de forma asíncrona
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,      // Calidad 80% (balance entre tamaño y calidad)
        base64: false,     // No incluir base64 (demasiado pesado)
      });
      // Retornar URI de la foto capturada
      return photo?.uri || null;
    } catch (error) {
      // Si hay error, retornar null
      return null;
    }
  }, [isReady]);

  /**
   * Wrapper para requestPermission
   * Retorna boolean en lugar del objeto completo
   * 
   * @returns {Promise<boolean>} true si permiso granted, false si denied
   */
  const handleRequestPermission = useCallback(async (): Promise<boolean> => {
    const result = await requestPermission();
    return result.granted;
  }, [requestPermission]);

  return {
    permission,                              // Estado permiso
    requestPermission: handleRequestPermission,  // Solicitar permiso
    cameraRef,                              // Referencia a CameraView
    isReady,                                // ¿Está lista?
    handleCameraReady,                      // Callback al cargar
    takePicture,                            // Capturar foto
  };
};
