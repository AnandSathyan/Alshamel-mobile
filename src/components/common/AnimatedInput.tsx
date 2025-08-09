"use client"

import type React from "react"
import { useState, useRef } from "react"
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Animated,
  TouchableOpacity,
  type TextInputProps,
  type ViewStyle,
} from "react-native"
import { Icon } from "./Icon"
import { colors } from "../../constants/colors"
import { dimensions } from "../../constants/dimensions"

interface AnimatedInputProps extends TextInputProps {
  label?: string
  error?: string
  containerStyle?: ViewStyle
  inputType?: "text" | "number" | "decimal" | "email"
  icon?: string
  suffix?: string
  suggestions?: string[]
  onSuggestionPress?: (suggestion: string) => void
}

export const AnimatedInput: React.FC<AnimatedInputProps> = ({
  label,
  error,
  containerStyle,
  inputType = "text",
  icon,
  suffix,
  suggestions = [],
  onSuggestionPress,
  value,
  onChangeText,
  style,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current
  const scaleValue = useRef(new Animated.Value(1)).current

  const getKeyboardType = () => {
    switch (inputType) {
      case "number":
      case "decimal":
        return "numeric"
      case "email":
        return "email-address"
      default:
        return "default"
    }
  }

  const handleFocus = () => {
    setIsFocused(true)
    setShowSuggestions(suggestions.length > 0)

    Animated.parallel([
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.spring(scaleValue, {
        toValue: 1.02,
        useNativeDriver: true,
      }),
    ]).start()
  }

  const handleBlur = () => {
    setIsFocused(false)
    setShowSuggestions(false)

    Animated.parallel([
      Animated.timing(animatedValue, {
        toValue: value ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.spring(scaleValue, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start()
  }

  const handleChangeText = (text: string) => {
    if (inputType === "decimal") {
      // Allow decimal numbers
      const numericText = text.replace(/[^0-9.]/g, "")
      const parts = numericText.split(".")
      if (parts.length > 2) {
        return // Don't allow multiple decimal points
      }
      onChangeText?.(numericText)
    } else if (inputType === "number") {
      // Allow only integers
      const numericText = text.replace(/[^0-9]/g, "")
      onChangeText?.(numericText)
    } else {
      onChangeText?.(text)
    }
  }

  const handleSuggestionPress = (suggestion: string) => {
    onSuggestionPress?.(suggestion)
    setShowSuggestions(false)
  }

  const labelStyle = {
    position: "absolute" as const,
    left: icon ? 45 : 16,
    top: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [18, 8],
    }),
    fontSize: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    color: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [colors.textSecondary, isFocused ? colors.primary : colors.textSecondary],
    }),
  }

  return (
    <View style={[styles.container, containerStyle]}>
      <Animated.View
        style={[
          styles.inputContainer,
          { transform: [{ scale: scaleValue }] },
          isFocused && styles.inputContainerFocused,
          error && styles.inputContainerError,
        ]}
      >
        {icon && (
          <View style={styles.iconContainer}>
            <Icon name={icon} size={20} color={isFocused ? colors.primary : colors.textSecondary} />
          </View>
        )}

        {label && <Animated.Text style={labelStyle}>{label}</Animated.Text>}

        <TextInput
          style={[styles.input, icon && styles.inputWithIcon, suffix && styles.inputWithSuffix, style]}
          value={value}
          onChangeText={handleChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          keyboardType={getKeyboardType()}
          placeholderTextColor={colors.textTertiary}
          {...props}
        />

        {suffix && (
          <View style={styles.suffixContainer}>
            <Text style={styles.suffixText}>{suffix}</Text>
          </View>
        )}
      </Animated.View>

      {showSuggestions && suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          {suggestions.map((suggestion, index) => (
            <TouchableOpacity
              key={index}
              style={styles.suggestionItem}
              onPress={() => handleSuggestionPress(suggestion)}
            >
              <Text style={styles.suggestionText}>{suggestion}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {error && (
        <Animated.View style={styles.errorContainer}>
          <Icon name="alert-circle" size={16} color={colors.error} />
          <Text style={styles.errorText}>{error}</Text>
        </Animated.View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: dimensions.spacing.lg,
  },
  inputContainer: {
    position: "relative",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: dimensions.borderRadius.lg,
    backgroundColor: colors.surface,
    minHeight: 56,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  inputContainerFocused: {
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  inputContainerError: {
    borderColor: colors.error,
  },
  iconContainer: {
    position: "absolute",
    left: 16,
    top: 18,
    zIndex: 1,
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 8,
    fontSize: dimensions.fontSize.body,
    color: colors.textPrimary,
    textAlignVertical: "top",
  },
  inputWithIcon: {
    paddingLeft: 48,
  },
  inputWithSuffix: {
    paddingRight: 48,
  },
  suffixContainer: {
    position: "absolute",
    right: 16,
    top: 18,
    justifyContent: "center",
  },
  suffixText: {
    fontSize: dimensions.fontSize.body,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  suggestionsContainer: {
    backgroundColor: colors.surface,
    borderRadius: dimensions.borderRadius.md,
    marginTop: dimensions.spacing.xs,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  suggestionItem: {
    paddingVertical: dimensions.spacing.md,
    paddingHorizontal: dimensions.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  suggestionText: {
    fontSize: dimensions.fontSize.body,
    color: colors.textPrimary,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: dimensions.spacing.sm,
    paddingHorizontal: dimensions.spacing.xs,
  },
  errorText: {
    fontSize: dimensions.fontSize.caption,
    color: colors.error,
    marginLeft: dimensions.spacing.xs,
    flex: 1,
  },
})
