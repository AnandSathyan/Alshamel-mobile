import type React from "react"
import { Text, StyleSheet } from "react-native"

// Fallback icon component using Unicode symbols
interface IconProps {
  name: string
  size?: number
  color?: string
  style?: any
}

const iconMap: Record<string, string> = {
  // Activity icons
  footsteps: "👣",
  fitness: "💪",
  barbell: "🏋️",
  flame: "🔥",

  // Health icons
  heart: "❤️",
  pulse: "💓",
  water: "💧",
  bed: "🛏️",

  // UI icons
  home: "🏠",
  "add-circle": "➕",
  "bar-chart": "📊",
  person: "👤",
  "person-circle": "👤",
  today: "📅",
  "analytics-outline": "📈",
  "document-text": "📄",
  create: "✏️",
  happy: "😊",
  "checkmark-circle": "✅",
  "information-circle-outline": "ℹ️",
  "chevron-forward": "▶️",
  "ellipsis-horizontal": "⋯",
  refresh: "🔄",
  "trending-up": "📈",
  "trending-down": "📉",
  remove: "➖",
  "alert-circle": "⚠️",
  "checkmark-circle-outline": "✓",

  // Default fallback
  default: "●",
}

export const Icon: React.FC<IconProps> = ({ name, size = 24, color = "#000", style }) => {
  const iconSymbol = iconMap[name] || iconMap["default"]

  return <Text style={[styles.icon, { fontSize: size, color }, style]}>{iconSymbol}</Text>
}

const styles = StyleSheet.create({
  icon: {
    textAlign: "center",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
})
