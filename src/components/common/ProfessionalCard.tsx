import type React from "react"
import { View, StyleSheet, type ViewStyle, TouchableOpacity } from "react-native"
import LinearGradient from 'react-native-linear-gradient';
import { colors } from "../../constants/colors"
import { dimensions } from "../../constants/dimensions"

interface ProfessionalCardProps {
  children: React.ReactNode
  gradient?: string[]
  style?: ViewStyle
  contentStyle?: ViewStyle
  onPress?: () => void
  glassEffect?: boolean
  shadowColor?: string
  elevation?: "sm" | "md" | "lg" | "xl"
}

export const ProfessionalCard: React.FC<ProfessionalCardProps> = ({
  children,
  gradient,
  style,
  contentStyle,
  onPress,
  glassEffect = false,
  shadowColor = colors.shadowDark,
  elevation = "md",
}) => {
  const Component = onPress ? TouchableOpacity : View

  const cardStyle = [styles.container, dimensions.shadow[elevation], { shadowColor }, style]

  if (gradient) {
    return (
      <Component style={cardStyle} onPress={onPress} activeOpacity={0.95}>
        <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gradient}>
          {glassEffect && <View style={styles.glassOverlay} />}
          <View style={[styles.content, contentStyle]}>{children}</View>
        </LinearGradient>
      </Component>
    )
  }

  return (
    <Component style={[cardStyle, styles.solidCard]} onPress={onPress} activeOpacity={0.95}>
      {glassEffect && <View style={styles.glassOverlay} />}
      <View style={[styles.content, contentStyle]}>{children}</View>
    </Component>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: dimensions.borderRadius.xl,
    overflow: "hidden",
  },
  gradient: {
    flex: 1,
    position: "relative",
  },
  solidCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  glassOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "50%",
    backgroundColor: colors.glassStrong,
  },
  content: {
    padding: dimensions.layout.cardPadding,
    flex: 1,
  },
})
