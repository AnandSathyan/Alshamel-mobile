import type React from "react"
import { View, StyleSheet, type ViewStyle } from "react-native"
import LinearGradient from 'react-native-linear-gradient';
import { colors } from "../../constants/colors"
import { dimensions } from "../../constants/dimensions"

interface GradientCardProps {
  children: React.ReactNode
  gradient?: string[]
  style?: ViewStyle
  contentStyle?: ViewStyle
}

export const GradientCard: React.FC<GradientCardProps> = ({
  children,
  gradient = colors.gradientPrimary,
  style,
  contentStyle,
}) => {
  return (
    <View style={[styles.container, style]}>
      <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gradient}>
        <View style={[styles.content, contentStyle]}>{children}</View>
      </LinearGradient>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: dimensions.borderRadius.xl,
    overflow: "hidden",
  },
  gradient: {
    flex: 1,
  },
  content: {
    padding: dimensions.spacing.lg,
  },
})
