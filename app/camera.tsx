import { CameraView } from 'expo-camera';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { Header } from '../components/atoms/Header';
import { IconButton } from '../components/atoms/IconButton';
import { PermissionBlocker } from '../components/molecules/PermissionBlocker';
import { COLORS } from '../constants/theme';
import { useCameraLogic } from '../lib/modules/camera/useCameraLogic';
import { useGalleryStore } from '../lib/store/galleryStore';

export default function CameraScreen() {
  const router = useRouter();
  const { addPhoto } = useGalleryStore();
  
  const {
    permission,
    requestPermission,
    cameraRef,
    handleCameraReady,
    takePicture,
  } = useCameraLogic();

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <PermissionBlocker
        message="Necesitamos acceso a tu cámara para capturar fotos"
        onRequestPermission={requestPermission}
      />
    );
  }

  const handleCapture = async () => {
    const photoUri = await takePicture();
    if (photoUri) {
      addPhoto(photoUri);
      router.replace('/gallery');
    }
  };

  const handleDiscard = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Header title="Capturar" />
        
        <View style={styles.cameraContainer}>
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing="back"
            onCameraReady={handleCameraReady}
          />
        </View>

        <View style={styles.controls}>
          <IconButton icon="close" onPress={handleDiscard} color={COLORS.text} size={32} />
          <IconButton icon="camera" onPress={handleCapture} color={COLORS.primary} size={64} />
          <View style={styles.spacer} />
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
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 40,
    backgroundColor: COLORS.cardBackground,
  },
  spacer: {
    width: 48,
  },
});
