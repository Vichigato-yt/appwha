/**
 * galleryStore.ts - Estado Global de la Galería
 * 
 * PATRÓN: Listeners globales (alternativa a Redux/Context)
 * ========================================================
 * 
 * Cómo funciona:
 * 1. globalPhotos es un array que almacena TODAS las fotos
 * 2. listeners es un Set de funciones que se ejecutan cuando hay cambios
 * 3. Cada componente que usa useGalleryStore() se suscribe con un listener
 * 4. Cuando algo cambia (add/remove/clear), notifyListeners() llama todos los listeners
 * 5. Los listeners actualizan el estado local de cada componente
 * 6. Cada cambio se guarda automáticamente en AsyncStorage (persistencia)
 * 
 * Ventajas:
 * ✅ Código simple (sin boilerplate de Redux)
 * ✅ Persistencia automática
 * ✅ Actualizaciones reactivas
 * ✅ Fácil de entender y mantener
 */

import { useCallback, useEffect, useState } from 'react';

// Intentar cargar AsyncStorage, si falla usa mock (fallback)
let AsyncStorage: any;

try {
  AsyncStorage = require('@react-native-async-storage/async-storage').default;
} catch {
  // Si no está instalado, usar mock (no debería ocurrir en producción)
  AsyncStorage = {
    setItem: async (key: string, value: string) => console.log('Mock setItem:', key),
    getItem: async (key: string) => null,
  };
}

/**
 * Interfaz Photo - Estructura de cada foto guardada
 * 
 * @property id - Identificador único (formato: photo-timestamp-random)
 * @property uri - Ruta del archivo de imagen en el dispositivo
 * @property timestamp - Cuándo se tomó la foto (milisegundos desde epoch)
 */
export interface Photo {
  id: string;
  uri: string;
  timestamp: number;
}

// Clave bajo la que se guardan las fotos en AsyncStorage del dispositivo
const STORAGE_KEY = '@appwha_gallery';

// ========== ESTADO GLOBAL ==========
// Array global único que almacena todas las fotos
// TODO esto leen y escriben todos los componentes
let globalPhotos: Photo[] = [];

// Set de listeners (funciones) que se ejecutan cuando hay cambios
// Cada componente que usa useGalleryStore() agrega su listener aquí
const listeners: Set<() => void> = new Set();

/**
 * Ejecuta todos los listeners
 * Usado cuando: addPhoto(), removePhoto(), clearPhotos()
 * Efecto: todos los componentes que escuchan se re-renderizan
 */
const notifyListeners = () => {
  listeners.forEach((listener) => listener());
};

/**
 * Guarda las fotos en AsyncStorage (almacenamiento del dispositivo)
 * 
 * Se ejecuta automáticamente después de:
 * - addPhoto() - nueva foto capturada
 * - removePhoto() - foto eliminada
 * - clearPhotos() - todas borradas
 * 
 * Esto garantiza que las fotos NO se pierdan al cerrar la app
 * 
 * @param photos - Array de fotos a guardar/persistir
 * @returns {Promise<void>}
 */
export const savePhotosToStorage = async (photos: Photo[]) => {
  try {
    // Convertir array a JSON y guardar con la clave STORAGE_KEY
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(photos));
  } catch (error) {
    // Error al guardar fotos
  }
};

/**
 * Carga las fotos guardadas del dispositivo (AsyncStorage)
 * 
 * Se ejecuta en _layout.tsx al abrir la app
 * Esto asegura que todas las fotos previas estén disponibles
 * 
 * @returns {Promise<Photo[]>} Array de fotos guardadas o array vacío
 */
export const loadPhotosFromStorage = async (): Promise<Photo[]> => {
  try {
    // Obtener valor guardado con clave STORAGE_KEY
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    // Si existe, parsear JSON; si no, retornar array vacío
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    return [];
  }
};

export const useGalleryStore = () => {
  /**
   * Estado local del componente sincronizado con globalPhotos
   * Se actualiza cada vez que un listener se ejecuta
   */
  const [photos, setPhotos] = useState<Photo[]>(globalPhotos);

  /**
   * Se ejecuta al montar el componente
   * 
   * Qué hace:
   * 1. Crea una función listener que actualiza el estado local
   * 2. Agrega el listener al Set global de listeners
   * 3. Ahora, cuando globalPhotos cambia, este componente se actualiza
   * 4. Cuando el componente se desmonta, el listener se elimina del Set
   * 
   * Resultado: este componente siempre tiene las fotos sincronizadas
   */
  useEffect(() => {
    // Función que se ejecutará cuando globalPhotos cambie
    const listener = () => {
      // Crea nueva referencia [...] para que React lo detecte como cambio
      setPhotos([...globalPhotos]);
    };
    // Agregar este listener al Set global
    listeners.add(listener);
    // Cleanup: eliminar listener cuando el componente se desmonta
    return () => {
      listeners.delete(listener);
    };
  }, []);

  /**
   * Agregar nueva foto al inicio del array
   * 
   * Flujo:
   * 1. Crear objeto Photo con ID único, URI y timestamp
   * 2. Agregar al inicio de globalPhotos (foto más reciente primero)
   * 3. Guardar en AsyncStorage (persistencia en dispositivo)
   * 4. Ejecutar notifyListeners() para actualizar todos los componentes
   * 
   * @param uri - Ruta de la imagen en el dispositivo (file://...)
   * @returns void
   */
  const addPhoto = useCallback((uri: string) => {
    // Crear foto nueva con ID único usando timestamp + random
    const newPhoto: Photo = {
      id: `photo-${Date.now()}-${Math.random()}`,
      uri,
      timestamp: Date.now(),
    };
    // Agregar al INICIO del array [nueva, ...fotos_existentes]
    // Así la foto más reciente aparece primero
    globalPhotos = [newPhoto, ...globalPhotos];
    // Persistir cambios en el almacenamiento del dispositivo
    savePhotosToStorage(globalPhotos);
    // Notificar a todos los listeners para que se actualicen
    notifyListeners();
  }, []);

  /**
   * Eliminar foto por ID
   * 
   * @param id - ID de la foto a eliminar (ej: "photo-1704621234567-0.5247")
   * @returns void
   */
  const removePhoto = useCallback((id: string) => {
    // Filtrar removiendo la foto con ese ID
    // filter() retorna array con todas EXCEPTO la que cumple la condición
    globalPhotos = globalPhotos.filter((p) => p.id !== id);
    // Guardar cambios
    savePhotosToStorage(globalPhotos);
    // Notificar cambios
    notifyListeners();
  }, []);

  /**
   * Limpiar todas las fotos (vaciar galería)
   * 
   * @returns void
   */
  const clearPhotos = useCallback(() => {
    // Vaciar array completamente
    globalPhotos = [];
    // Guardar array vacío
    savePhotosToStorage(globalPhotos);
    // Notificar
    notifyListeners();
  }, []);

  return {
    photos,              // Array actual de fotos
    addPhoto,            // Función para agregar
    removePhoto,         // Función para eliminar por ID
    clearPhotos,         // Función para limpiar todas
  };
};
