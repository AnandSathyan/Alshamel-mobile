import type React from "react"
import { View, Text, TextInput, StyleSheet, type TextInputProps, type ViewStyle } from "react-native"
import { colors } from "../../constants/colors"
import { dimensions } from "../../constants/dimensions"

interface InputProps extends TextInputProps {
  label?: string
  error?: string
  containerStyle?: ViewStyle
  inputType?: "text" | "number" | "email"
}

export const Input: React.FC<InputProps> = ({ label, error, containerStyle, inputType = "text", style, ...props }) => {
  const getKeyboardType = () => {
    switch (inputType) {
      case "number":
        return "numeric"
      case "email":
        return "email-address"
      default:
        return "default"
    }
  }

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, error && styles.inputError, style]}
        keyboardType={getKeyboardType()}
        placeholderTextColor={colors.textTertiary}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: dimensions.spacing.md,
  },
  label: {
    fontSize: dimensions.fontSize.body,
    fontWeight: "500",
    color: colors.textPrimary,
    marginBottom: dimensions.spacing.xs,
  },
  input: {
    height: dimensions.inputHeight,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: dimensions.borderRadius.md,
    paddingHorizontal: dimensions.spacing.md,
    fontSize: dimensions.fontSize.body,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    fontSize: dimensions.fontSize.caption,
    color: colors.error,
    marginTop: dimensions.spacing.xs,
  },
})
