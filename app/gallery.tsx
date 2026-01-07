import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Header } from '../components/atoms/Header';
import { IconButton } from '../components/atoms/IconButton';
import { PrimaryButton } from '../components/atoms/PrimaryButton';
import { SwipeCard, SwipeCardRef } from '../components/molecules/SwipeCard';
import { GalleryGrid } from '../components/organisms/GalleryGrid';
import { COLORS } from '../constants/theme';
import { useSaveToGallery } from '../lib/modules/gallery/useSaveToGallery';
import { useGalleryStore } from '../lib/store/galleryStore';

type ViewMode = 'swipe' | 'grid';

export default function GalleryScreen() {
  const router = useRouter();
  const { photos, removePhoto } = useGalleryStore();
  // Hook para guardar fotos en la galería del dispositivo
  const { saveToGallery } = useSaveToGallery();
  
  const [viewMode, setViewMode] = useState<ViewMode>('swipe');
  const [currentIndex, setCurrentIndex] = useState(0);
  const cardRef = useRef<SwipeCardRef>(null);

  const currentPhoto = photos[currentIndex];

  /**
   * Cuando usuario da swipe derecha (like)
   * Guardar la foto en la galería del dispositivo
   */
  const handleSwipeRight = async () => {
    if (currentPhoto) {
      // Guardar foto en galería del dispositivo
      await saveToGallery(currentPhoto.uri);
    }
    moveToNext();
  };

  /**
   * Cuando usuario da swipe izquierda (nope)
   * Solo eliminar de la galería interna
   */
  const handleSwipeLeft = () => {
    if (currentPhoto) {
      removePhoto(currentPhoto.id);
    }
    
    // Si era la última foto después de eliminar, volver a grid
    if (photos.length === 1) {
      setViewMode('grid');
      setCurrentIndex(0);
    } else {
      moveToNext();
    }
  };

  const moveToNext = () => {
    if (currentIndex < photos.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Ya no hay más fotos, cambiar a vista grid
      setViewMode('grid');
      setCurrentIndex(0);
    }
  };

  /**
   * Abrir pantalla de cámara para capturar nuevas fotos
   */
  const handleCameraPress = () => {
    router.push('/camera');
  };

  /**
   * Alternar entre vista de swipe y vista de grid
   * - swipe: Una foto a la vez con gestos
   * - grid: Todas las fotos en una cuadrícula
   */
  const toggleViewMode = () => {
    setViewMode((prev) => (prev === 'swipe' ? 'grid' : 'swipe'));
  };

  /**
   * Cuando usuario selecciona una foto en la grid
   * Cambiar a modo swipe y mostrar esa foto
   */
  const handlePhotoPress = (photoId: string) => {
    const index = photos.findIndex((p) => p.id === photoId);
    if (index !== -1) {
      setCurrentIndex(index);
      setViewMode('swipe');
    }
  };

  if (photos.length === 0) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <Header title="Galería" subtitle="No hay fotos aún" />
          
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Captura tu primera foto</Text>
            <PrimaryButton title="Abrir Cámara" onPress={handleCameraPress} />
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Header
          title="Galería"
          subtitle={viewMode === 'swipe' ? `${currentIndex + 1} de ${photos.length}` : `${photos.length} fotos`}
        />

        <View style={styles.content}>
          {viewMode === 'swipe' && currentPhoto ? (
            <View style={styles.swipeContainer}>
              <SwipeCard
                ref={cardRef}
                imageUri={currentPhoto.uri}
                onSwipeLeft={handleSwipeLeft}
                onSwipeRight={handleSwipeRight}
              />
            </View>
          ) : (
            <GalleryGrid
              photos={photos}
              onPhotoPress={(photo) => handlePhotoPress(photo.id)}
            />
          )}
        </View>

        <View style={styles.controls}>
          <IconButton
            icon={viewMode === 'swipe' ? 'grid' : 'albums'}
            onPress={toggleViewMode}
            color={COLORS.text}
            size={28}
          />
          <IconButton
            icon="camera"
            onPress={handleCameraPress}
            color={COLORS.primary}
            size={32}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  swipeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    color: COLORS.textLight,
    marginBottom: 24,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 40,
    backgroundColor: COLORS.cardBackground,
    borderTopWidth: 1,
    borderTopColor: COLORS.primary,
  },
});
