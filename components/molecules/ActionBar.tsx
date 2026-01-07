import React from 'react';
import { StyleSheet, View } from 'react-native';
import { COLORS } from '../../constants/theme';
import { IconButton } from '../atoms/IconButton';

interface ActionBarProps {
  onDiscard: () => void;
  onSave: () => void;
}

export const ActionBar: React.FC<ActionBarProps> = ({ onDiscard, onSave }) => {
  return (
    <View style={styles.container}>
      <IconButton
        icon="close-circle"
        onPress={onDiscard}
        color={COLORS.nope}
        size={56}
        style={styles.button}
      />
      <IconButton
        icon="checkmark-circle"
        onPress={onSave}
        color={COLORS.like}
        size={56}
        style={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 40,
    backgroundColor: COLORS.cardBackground,
  },
  button: {
    padding: 0,
  },
});
