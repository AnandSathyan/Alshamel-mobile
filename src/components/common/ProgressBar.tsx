import type React from "react"
import { View, Text, StyleSheet, type ViewStyle } from "react-native"
import { colors } from "../../constants/colors"
import { dimensions } from "../../constants/dimensions"

interface ProgressBarProps {
  progress: number // 0-100
  color?: string
  backgroundColor?: string
  height?: number
  showPercentage?: boolean
  label?: string
  style?: ViewStyle
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = colors.primary,
  backgroundColor = colors.borderLight,
  height = 8,
  showPercentage = false,
  label,
  style,
}) => {
  const clampedProgress = Math.max(0, Math.min(100, progress))

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.track, { backgroundColor, height }]}>
        <View
          style={[
            styles.fill,
            {
              width: `${clampedProgress}%`,
              backgroundColor: color,
              height,
            },
          ]}
        />
      </View>
      {showPercentage && <Text style={styles.percentage}>{Math.round(clampedProgress)}%</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: dimensions.spacing.xs,
  },
  label: {
    fontSize: dimensions.fontSize.caption,
    color: colors.textSecondary,
    marginBottom: dimensions.spacing.xs,
  },
  track: {
    borderRadius: dimensions.borderRadius.sm,
    overflow: "hidden",
  },
  fill: {
    borderRadius: dimensions.borderRadius.sm,
  },
  percentage: {
    fontSize: dimensions.fontSize.caption,
    color: colors.textSecondary,
    marginTop: dimensions.spacing.xs,
    textAlign: "right",
  },
})
