/**
 * SwipeCard.tsx - Tarjeta Deslizable (Componente Core)
 * 
 * Responsabilidades:
 * - Mostrar una foto en una tarjeta
 * - Detectar gestos de swipe del usuario
 * - Animar la tarjeta saliendo de pantalla
 * - Volver a posición si no alcanza umbral
 */

import React, { forwardRef, useImperativeHandle } from 'react';
import { Animated, Dimensions, Image, PanResponder, StyleSheet, Text } from 'react-native';
import { COLORS } from '../../constants/theme';
import { useSwipeLogic } from '../../lib/modules/ui/useSwipeLogic';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.9;
const CARD_HEIGHT = SCREEN_HEIGHT * 0.65;

export interface SwipeCardRef {
  reset: () => void;
}

interface SwipeCardProps {
  imageUri: string;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

export const SwipeCard = forwardRef<SwipeCardRef, SwipeCardProps>(
  ({ imageUri, onSwipeLeft, onSwipeRight }, ref) => {
    const {
      translateX,
      translateY,
      resetPosition,
      dismissRight,
      dismissLeft,
      calculateRotation,
      SWIPE_THRESHOLD,
    } = useSwipeLogic();

    useImperativeHandle(ref, () => ({
      reset: resetPosition,
    }));

    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        translateX.setValue(gesture.dx);
        translateY.setValue(gesture.dy);
      },
      onPanResponderRelease: (_, gesture) => {
        const absTranslateX = Math.abs(gesture.dx);
        
        if (gesture.vx > 0.5 || gesture.dx > SWIPE_THRESHOLD) {
          dismissRight(onSwipeRight);
        } else if (gesture.vx < -0.5 || gesture.dx < -SWIPE_THRESHOLD) {
          dismissLeft(onSwipeLeft);
        } else {
          resetPosition();
        }
      },
    });

    const rotation = translateX.interpolate({
      inputRange: [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
      outputRange: ['-30deg', '0deg', '30deg'],
      extrapolate: 'clamp',
    });

    const likeOpacity = translateX.interpolate({
      inputRange: [0, SWIPE_THRESHOLD],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });

    const nopeOpacity = translateX.interpolate({
      inputRange: [-SWIPE_THRESHOLD, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.card,
          {
            transform: [
              { translateX },
              { translateY },
              { rotate: rotation },
            ],
          },
        ]}
      >
        <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
        
        <Animated.View style={[styles.label, styles.likeLabel, { opacity: likeOpacity }]}>
          <Text style={styles.labelText}>LIKE</Text>
        </Animated.View>

        <Animated.View style={[styles.label, styles.nopeLabel, { opacity: nopeOpacity }]}>
          <Text style={styles.labelText}>NOPE</Text>
        </Animated.View>
      </Animated.View>
    );
  }
);

SwipeCard.displayName = 'SwipeCard';

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    backgroundColor: COLORS.cardBackground,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  label: {
    position: 'absolute',
    top: 50,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 4,
  },
  likeLabel: {
    right: 30,
    borderColor: COLORS.like,
    transform: [{ rotate: '15deg' }],
  },
  nopeLabel: {
    left: 30,
    borderColor: COLORS.nope,
    transform: [{ rotate: '-15deg' }],
  },
  labelText: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.text,
  },
});
