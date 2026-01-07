import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../constants/theme';
import { PrimaryButton } from '../atoms/PrimaryButton';

interface PermissionBlockerProps {
  message: string;
  onRequestPermission: () => Promise<boolean>;
}

export const PermissionBlocker: React.FC<PermissionBlockerProps> = ({
  message,
  onRequestPermission,
}) => {
  const [isRequesting, setIsRequesting] = React.useState(false);

  const handleRequest = async () => {
    setIsRequesting(true);
    await onRequestPermission();
    setIsRequesting(false);
  };

  return (
    <View style={styles.container}>
      <Ionicons name="camera-outline" size={64} color={COLORS.primary} />
      <Text style={styles.message}>{message}</Text>
      <PrimaryButton
        title={isRequesting ? 'Solicitando...' : 'Permitir Acceso'}
        onPress={handleRequest}
        disabled={isRequesting}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    backgroundColor: COLORS.background,
  },
  message: {
    fontSize: 16,
    color: COLORS.text,
    textAlign: 'center',
    marginVertical: 24,
    lineHeight: 24,
  },
});
