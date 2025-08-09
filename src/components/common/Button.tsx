import type React from "react"
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, type ViewStyle, type TextStyle } from "react-native"
import { colors } from "../../constants/colors"
import { dimensions } from "../../constants/dimensions"

interface ButtonProps {
  title: string
  onPress: () => void
  loading?: boolean
  disabled?: boolean
  variant?: "primary" | "secondary" | "outline"
  size?: "small" | "medium" | "large"
  style?: ViewStyle
  textStyle?: TextStyle
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = "primary",
  size = "medium",
  style,
  textStyle,
}) => {
  const getButtonStyle = () => {
    const baseStyle = [styles.button, styles[size]]

    switch (variant) {
      case "secondary":
        return [...baseStyle, styles.secondaryButton]
      case "outline":
        return [...baseStyle, styles.outlineButton]
      default:
        return [...baseStyle, styles.primaryButton]
    }
  }

  const getTextStyle = () => {
    const baseStyle = [styles.buttonText, styles[`${size}Text`]]

    switch (variant) {
      case "secondary":
        return [...baseStyle, styles.secondaryButtonText]
      case "outline":
        return [...baseStyle, styles.outlineButtonText]
      default:
        return [...baseStyle, styles.primaryButtonText]
    }
  }

  return (
    <TouchableOpacity
      style={[...getButtonStyle(), (disabled || loading) && styles.disabledButton, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={variant === "primary" ? colors.surface : colors.primary} />
      ) : (
        <Text style={[...getTextStyle(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius: dimensions.borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },

  // Sizes
  small: {
    height: 36,
    paddingHorizontal: dimensions.spacing.md,
  },
  medium: {
    height: dimensions.buttonHeight,
    paddingHorizontal: dimensions.spacing.lg,
  },
  large: {
    height: 56,
    paddingHorizontal: dimensions.spacing.xl,
  },

  // Variants
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: colors.surfaceSecondary,
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.primary,
  },

  disabledButton: {
    opacity: 0.5,
  },

  // Text styles
  buttonText: {
    fontWeight: "600",
  },
  smallText: {
    fontSize: dimensions.fontSize.caption,
  },
  mediumText: {
    fontSize: dimensions.fontSize.body,
  },
  largeText: {
    fontSize: dimensions.fontSize.subtitle,
  },

  primaryButtonText: {
    color: colors.surface,
  },
  secondaryButtonText: {
    color: colors.textPrimary,
  },
  outlineButtonText: {
    color: colors.primary,
  },
})
