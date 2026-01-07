import { useEffect } from 'react';
import { loadPhotosFromStorage } from '../store/galleryStore';

let globalPhotos: any[] = [];
const listeners: Set<() => void> = new Set();

const notifyListeners = () => {
  listeners.forEach((listener) => listener());
};

export const useInitializeStore = () => {
  useEffect(() => {
    const initialize = async () => {
      try {
        const storedPhotos = await loadPhotosFromStorage();
        globalPhotos = storedPhotos;
        notifyListeners();
      } catch (error) {
        // Error al inicializar store
      }
    };
    initialize();
  }, []);
};

export const setGlobalPhotos = (photos: any[]) => {
  globalPhotos = photos;
};

export const getGlobalPhotos = () => globalPhotos;

export const addListener = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
