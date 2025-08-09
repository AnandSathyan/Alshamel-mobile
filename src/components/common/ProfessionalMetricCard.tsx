import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import LinearGradient from 'react-native-linear-gradient';
import { Icon } from "./Icon"
import { colors } from "../../constants/colors"
import { dimensions } from "../../constants/dimensions"

interface ProfessionalMetricCardProps {
  title: string
  value: string | number
  unit?: string
  icon: string
  gradient?: string[]
  target?: number
  subtitle?: string
  onPress?: () => void
  size?: "small" | "medium" | "large"
  trend?: "up" | "down" | "neutral"
  trendValue?: string
  glowEffect?: boolean
}

export const ProfessionalMetricCard: React.FC<ProfessionalMetricCardProps> = ({
  title,
  value,
  unit,
  icon,
  gradient = colors.gradientPrimary,
  target,
  subtitle,
  onPress,
  size = "medium",
  trend = "neutral",
  trendValue,
  glowEffect = false,
}) => {
  const progress = target ? (Number(value) / target) * 100 : 0
  const Component = onPress ? TouchableOpacity : View

  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return colors.success
      case "down":
        return colors.error
      default:
        return colors.textTertiary
    }
  }

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return "trending-up"
      case "down":
        return "trending-down"
      default:
        return "minus"
    }
  }

  return (
    <Component style={[styles.container, styles[size]]} onPress={onPress} activeOpacity={0.95}>
      <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gradient}>
        {glowEffect && <View style={[styles.glow, { backgroundColor: gradient[0] + "40" }]} />}

        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Icon name={icon} size={20} color={colors.textPrimary} />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.title}>{title}</Text>
              {trendValue && (
                <View style={styles.trendContainer}>
                  <Icon name={getTrendIcon()} size={12} color={getTrendColor()} />
                  <Text style={[styles.trendText, { color: getTrendColor() }]}>{trendValue}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Value */}
          <View style={styles.valueContainer}>
            <Text style={styles.value}>{value}</Text>
            {unit && <Text style={styles.unit}>{unit}</Text>}
          </View>

          {/* Progress */}
          {target && (
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${Math.min(progress, 100)}%` }]} />
                <View style={[styles.progressGlow, { width: `${Math.min(progress, 100)}%` }]} />
              </View>
              <Text style={styles.progressText}>
                {Math.round(progress)}% of {target}
                {unit}
              </Text>
            </View>
          )}

          {/* Subtitle */}
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

          {/* Decorative elements */}
          <View style={styles.decorativeCircle1} />
          <View style={styles.decorativeCircle2} />
        </View>
      </LinearGradient>
    </Component>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: dimensions.borderRadius.xxl,
    overflow: "hidden",
    marginBottom: dimensions.spacing.lg,
    ...dimensions.shadow.lg,
  },
  small: {
    minHeight: 140,
  },
  medium: {
    minHeight: 180,
  },
  large: {
    minHeight: 220,
  },
  gradient: {
    flex: 1,
    position: "relative",
  },
  glow: {
    position: "absolute",
    top: -20,
    left: -20,
    right: -20,
    bottom: -20,
    borderRadius: dimensions.borderRadius.xxl + 20,
    opacity: 0.3,
    zIndex: -1,
  },
  content: {
    padding: dimensions.spacing.xl,
    flex: 1,
    position: "relative",
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: dimensions.spacing.lg,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.glassStrong,
    alignItems: "center",
    justifyContent: "center",
    marginRight: dimensions.spacing.md,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: dimensions.fontSize.bodyLarge,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: dimensions.spacing.xs,
  },
  trendContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  trendText: {
    fontSize: dimensions.fontSize.caption,
    fontWeight: "600",
    marginLeft: dimensions.spacing.xs,
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: dimensions.spacing.md,
  },
  value: {
    fontSize: dimensions.fontSize.displayLarge,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: -1,
  },
  unit: {
    fontSize: dimensions.fontSize.title,
    fontWeight: "600",
    color: colors.textSecondary,
    marginLeft: dimensions.spacing.sm,
    opacity: 0.9,
  },
  progressContainer: {
    marginTop: dimensions.spacing.md,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.glass,
    borderRadius: 3,
    marginBottom: dimensions.spacing.sm,
    position: "relative",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.textPrimary,
    borderRadius: 3,
  },
  progressGlow: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    backgroundColor: colors.textPrimary,
    borderRadius: 3,
    opacity: 0.5,
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  progressText: {
    fontSize: dimensions.fontSize.caption,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  subtitle: {
    fontSize: dimensions.fontSize.caption,
    color: colors.textSecondary,
    opacity: 0.8,
    marginTop: dimensions.spacing.sm,
    lineHeight: 16,
  },
  decorativeCircle1: {
    position: "absolute",
    top: -20,
    right: -20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.glass,
    opacity: 0.3,
  },
  decorativeCircle2: {
    position: "absolute",
    bottom: -30,
    left: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.glass,
    opacity: 0.2,
  },
})
