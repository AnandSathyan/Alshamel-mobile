"use client"

import type React from "react"
import { useState, useRef } from "react"
import { View, Text, TextInput, StyleSheet, Animated, TouchableOpacity, ScrollView, Platform } from "react-native"
import LinearGradient from "react-native-linear-gradient"
import { Icon } from "./Icon"
import { colors } from "../../constants/colors"
import { dimensions } from "../../constants/dimensions"

interface AnimatedInputProps {
  placeholder: string
  value: string
  onChangeText: (text: string) => void
  inputType?: "text" | "number" | "decimal" | "email"
  icon?: string
  suffix?: string
  error?: string
  multiline?: boolean
  numberOfLines?: number
  style?: any
  containerStyle?: any
  suggestions?: string[]
  onSuggestionPress?: (suggestion: string) => void
}

export const AnimatedInput: React.FC<AnimatedInputProps> = ({
  placeholder,
  value,
  onChangeText,
  inputType = "text",
  icon,
  suffix,
  error,
  multiline = false,
  numberOfLines = 1,
  style,
  containerStyle,
  suggestions = [],
  onSuggestionPress,
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const animatedValue = useRef(new Animated.Value(0)).current

  const handleFocus = () => {
    setIsFocused(true)
    setShowSuggestions(suggestions.length > 0)
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start()
  }

  const handleBlur = () => {
    setIsFocused(false)
    // Delay hiding suggestions to allow for suggestion press
    setTimeout(() => setShowSuggestions(false), 150)
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start()
  }

  const handleSuggestionPress = (suggestion: string) => {
    onSuggestionPress?.(suggestion)
    setShowSuggestions(false)
    setIsFocused(false)
  }

  const getKeyboardType = () => {
    switch (inputType) {
      case "number":
        return "numeric"
      case "decimal":
        return Platform.OS === "ios" ? "decimal-pad" : "numeric"
      case "email":
        return "email-address"
      default:
        return "default"
    }
  }

  const borderColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.glassBorder, colors.primary],
  })

  const glowOpacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.3],
  })

  return (
    <View style={[styles.container, containerStyle]}>
      <Animated.View style={[styles.inputContainer, { borderColor }]}>
        {/* Glow effect */}
        <Animated.View style={[styles.glow, { opacity: glowOpacity }]} />

        {/* Icon */}
        {icon && (
          <View style={styles.iconContainer}>
            <Icon name={icon} size={20} color={isFocused ? colors.primary : colors.textTertiary} />
          </View>
        )}

        {/* Input */}
        <TextInput
          style={[
            styles.input,
            multiline && styles.multilineInput,
            icon && styles.inputWithIcon,
            suffix && styles.inputWithSuffix,
            style,
          ]}
          placeholder={placeholder}
          placeholderTextColor={colors.textTertiary}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          keyboardType={getKeyboardType()}
          multiline={multiline}
          numberOfLines={numberOfLines}
          textAlignVertical={multiline ? "top" : "center"}
          selectionColor={colors.primary}
        />

        {/* Suffix */}
        {suffix && (
          <View style={styles.suffixContainer}>
            <Text style={styles.suffixText}>{suffix}</Text>
          </View>
        )}
      </Animated.View>

      {/* Error message */}
      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <LinearGradient colors={[colors.surface, colors.surfaceSecondary]} style={styles.suggestionsGradient}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.suggestionsContent}
              keyboardShouldPersistTaps="handled"
            >
              {suggestions.map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionButton}
                  onPress={() => handleSuggestionPress(suggestion)}
                  activeOpacity={0.7}
                >
                  <LinearGradient colors={colors.gradientPrimary} style={styles.suggestionGradient}>
                    <Text style={styles.suggestionText}>{suggestion}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </LinearGradient>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: dimensions.spacing.lg,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: dimensions.borderRadius.lg,
    borderWidth: 2,
    minHeight: 56,
    paddingHorizontal: dimensions.spacing.md,
    position: "relative",
    overflow: "hidden",
  },
  glow: {
    position: "absolute",
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    backgroundColor: colors.primaryGlow,
    borderRadius: dimensions.borderRadius.lg + 2,
    zIndex: -1,
  },
  iconContainer: {
    marginRight: dimensions.spacing.md,
  },
  input: {
    flex: 1,
    fontSize: dimensions.fontSize.bodyLarge,
    color: colors.textPrimary,
    paddingVertical: dimensions.spacing.md,
  },
  inputWithIcon: {
    marginLeft: 0,
  },
  inputWithSuffix: {
    marginRight: 0,
  },
  multilineInput: {
    minHeight: 120,
    paddingTop: dimensions.spacing.md,
  },
  suffixContainer: {
    marginLeft: dimensions.spacing.sm,
  },
  suffixText: {
    fontSize: dimensions.fontSize.body,
    color: colors.textTertiary,
    fontWeight: "500",
  },
  errorText: {
    fontSize: dimensions.fontSize.caption,
    color: colors.error,
    marginTop: dimensions.spacing.sm,
    marginLeft: dimensions.spacing.sm,
    fontWeight: "500",
  },
  suggestionsContainer: {
    marginTop: dimensions.spacing.sm,
    borderRadius: dimensions.borderRadius.lg,
    overflow: "hidden",
    ...dimensions.shadow.md,
  },
  suggestionsGradient: {
    padding: dimensions.spacing.md,
  },
  suggestionsContent: {
    gap: dimensions.spacing.sm,
  },
  suggestionButton: {
    borderRadius: dimensions.borderRadius.md,
    overflow: "hidden",
  },
  suggestionGradient: {
    paddingHorizontal: dimensions.spacing.md,
    paddingVertical: dimensions.spacing.sm,
  },
  suggestionText: {
    fontSize: dimensions.fontSize.body,
    color: colors.textPrimary,
    fontWeight: "500",
  },
})
