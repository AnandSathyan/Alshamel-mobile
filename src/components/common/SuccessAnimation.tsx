"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { View, Text, StyleSheet, Animated } from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"
import { colors } from "../../constants/colors"
import { dimensions } from "../../constants/dimensions"

interface SuccessAnimationProps {
  visible: boolean
  message: string
  onComplete?: () => void
}

export const SuccessAnimation: React.FC<SuccessAnimationProps> = ({ visible, message, onComplete }) => {
  const scaleValue = useRef(new Animated.Value(0)).current
  const opacityValue = useRef(new Animated.Value(0)).current
  const slideValue = useRef(new Animated.Value(50)).current

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.parallel([
          Animated.spring(scaleValue, {
            toValue: 1,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
          }),
          Animated.timing(opacityValue, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(slideValue, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
        Animated.delay(2000),
        Animated.parallel([
          Animated.timing(opacityValue, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(slideValue, {
            toValue: -50,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        scaleValue.setValue(0)
        onComplete?.()
      })
    }
  }, [visible])

  if (!visible) return null

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: opacityValue,
          transform: [{ scale: scaleValue }, { translateY: slideValue }],
        },
      ]}
    >
      <View style={styles.content}>
        <Ionicons name="checkmark-circle" size={32} color={colors.success} />
        <Text style={styles.message}>{message}</Text>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 100,
    left: 20,
    right: 20,
    zIndex: 1000,
    alignItems: "center",
  },
  content: {
    backgroundColor: colors.surface,
    paddingVertical: dimensions.spacing.lg,
    paddingHorizontal: dimensions.spacing.xl,
    borderRadius: dimensions.borderRadius.lg,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.success,
  },
  message: {
    fontSize: dimensions.fontSize.body,
    fontWeight: "600",
    color: colors.textPrimary,
    marginLeft: dimensions.spacing.md,
  },
})
