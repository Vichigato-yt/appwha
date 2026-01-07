import { useRef } from 'react';
import { Animated, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const SWIPE_THRESHOLD = 100;
const ROTATION_ANGLE = 30;

export interface SwipeLogicReturn {
  translateX: Animated.Value;
  translateY: Animated.Value;
  resetPosition: () => void;
  dismissRight: (callback: () => void) => void;
  dismissLeft: (callback: () => void) => void;
  calculateRotation: (translationX: number) => string;
  SWIPE_THRESHOLD: number;
}

export const useSwipeLogic = (): SwipeLogicReturn => {
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  const resetPosition = () => {
    Animated.spring(translateX, {
      toValue: 0,
      useNativeDriver: true,
      friction: 8,
      tension: 40,
    }).start();
    
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      friction: 8,
      tension: 40,
    }).start();
  };

  const dismissRight = (callback: () => void) => {
    Animated.timing(translateX, {
      toValue: SCREEN_WIDTH * 1.5,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      callback();
      translateX.setValue(0);
      translateY.setValue(0);
    });
  };

  const dismissLeft = (callback: () => void) => {
    Animated.timing(translateX, {
      toValue: -SCREEN_WIDTH * 1.5,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      callback();
      translateX.setValue(0);
      translateY.setValue(0);
    });
  };

  const calculateRotation = (translationX: number): string => {
    const rotation = (translationX / SCREEN_WIDTH) * ROTATION_ANGLE;
    return `${rotation}deg`;
  };

  return {
    translateX,
    translateY,
    resetPosition,
    dismissRight,
    dismissLeft,
    calculateRotation,
    SWIPE_THRESHOLD,
  };
};
