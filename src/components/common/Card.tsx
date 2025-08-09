import type React from "react"
import { View, StyleSheet, type ViewStyle } from "react-native"
import { colors } from "../../constants/colors"
import { dimensions } from "../../constants/dimensions"

interface CardProps {
  children: React.ReactNode
  style?: ViewStyle
  padding?: number
}

export const Card: React.FC<CardProps> = ({ children, style, padding = dimensions.cardPadding }) => {
  return <View style={[styles.card, { padding }, style]}>{children}</View>
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: dimensions.borderRadius.lg,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    marginHorizontal: dimensions.spacing.md,
    marginVertical: dimensions.spacing.sm,
  },
})
