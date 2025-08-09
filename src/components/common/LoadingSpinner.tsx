import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { dimensions } from '../../constants/dimensions';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'large';
  color?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading...',
  size = 'large',
  color = colors.primary,
}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: dimensions.spacing.lg,
  },
  message: {
    marginTop: dimensions.spacing.md,
    fontSize: dimensions.fontSize.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
