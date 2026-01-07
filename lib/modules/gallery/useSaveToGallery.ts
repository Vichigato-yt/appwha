/**
 * useSaveToGallery.ts - Hook para guardar fotos en la galería del dispositivo
 * 
 * Responsabilidades:
 * - Solicitar permisos para acceder a la galería
 * - Guardar fotos en el almacenamiento de la galería del dispositivo
 * - Manejar errores de permisos y guardado
 */

import * as MediaLibrary from 'expo-media-library';
import { useCallback } from 'react';

/**
 * Interfaz de retorno del hook
 */
export interface SaveToGalleryReturn {
  permission: MediaLibrary.PermissionResponse | null;
  requestPermission: () => Promise<boolean>;
  saveToGallery: (imageUri: string) => Promise<boolean>;
}

/**
 * Hook useSaveToGallery
 * 
 * Maneja toda la lógica para guardar fotos en la galería del dispositivo
 * 
 * Uso en gallery.tsx:
 * ```
 * const { saveToGallery } = useSaveToGallery();
 * 
 * const handleSaveLike = async (photoUri: string) => {
 *   const saved = await saveToGallery(photoUri);
 *   if (saved) {
 *     console.log('Foto guardada en galería');
 *   }
 * };
 * ```
 * 
 * @returns {SaveToGalleryReturn} Funciones para manejar guardado en galería
 */
export const useSaveToGallery = (): SaveToGalleryReturn => {
  /**
   * Solicitar permiso para acceder a la galería
   * En iOS/Android, se necesita permiso para guardar fotos
   * 
   * @returns {Promise<boolean>} true si permiso granted, false si denied
   */
  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      // writeOnly = true: solo pedir permisos de escritura (guardar fotos)
      // Esto evita pedir permiso de AUDIO que causa el error
      const { status } = await MediaLibrary.requestPermissionsAsync(true);
      return status === 'granted';
    } catch (error) {
      return false;
    }
  }, []);

  /**
   * Guardar foto en la galería del dispositivo
   * 
   * Flujo:
   * 1. Verificar que tenemos permiso
   * 2. Si no tenemos permiso, solicitarlo
   * 3. Guardar la foto usando MediaLibrary.saveToLibraryAsync()
   * 4. Retornar true si exitoso, false si error
   * 
   * @param imageUri - URI de la foto a guardar (local file path)
   * @returns {Promise<boolean>} true si se guardó exitosamente
   */
  const saveToGallery = useCallback(async (imageUri: string): Promise<boolean> => {
    try {
      // Primero verificar permisos actuales
      // writeOnly = true: solo verificar permisos de escritura (sin audio)
      const { canAskAgain, status } = await MediaLibrary.getPermissionsAsync(true);

      // Si no tenemos permiso granted
      if (status !== 'granted') {
        // Si podemos preguntar de nuevo, solicitar permiso
        if (canAskAgain) {
          const permitted = await requestPermission();
          if (!permitted) {
            return false;
          }
        } else {
          return false;
        }
      }

      // Guardar la foto en la galería
      // saveToLibraryAsync copia la foto al álbum de fotos del dispositivo
      await MediaLibrary.saveToLibraryAsync(imageUri);
      
      return true;
    } catch (error) {
      return false;
    }
  }, [requestPermission]);

  return {
    permission: null,
    requestPermission,
    saveToGallery,
  };
};
