import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import LinearGradient from 'react-native-linear-gradient';

import { Icon } from "./Icon"
import { colors } from "../../constants/colors"
import { dimensions } from "../../constants/dimensions"

interface MetricCardProps {
  title: string
  value: string | number
  unit?: string
  icon: string
  gradient?: string[]
  target?: number
  subtitle?: string
  onPress?: () => void
  size?: "small" | "medium" | "large"
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  icon,
  gradient = colors.gradientPrimary,
  target,
  subtitle,
  onPress,
  size = "medium",
}) => {
  const progress = target ? (Number(value) / target) * 100 : 0

  const Component = onPress ? TouchableOpacity : View

  return (
    <Component style={[styles.container, styles[size]]} onPress={onPress}>
      <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gradient}>
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Icon name={icon} size={20} color={colors.textPrimary} />
            </View>
            <Text style={styles.title}>{title}</Text>
          </View>

          <View style={styles.valueContainer}>
            <Text style={styles.value}>{value}</Text>
            {unit && <Text style={styles.unit}>{unit}</Text>}
          </View>

          {target && (
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${Math.min(progress, 100)}%` }]} />
              </View>
              <Text style={styles.progressText}>
                {Math.round(progress)}% of {target}
                {unit}
              </Text>
            </View>
          )}

          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      </LinearGradient>
    </Component>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: dimensions.borderRadius.xl,
    overflow: "hidden",
    marginBottom: dimensions.spacing.md,
  },
  small: {
    minHeight: 120,
  },
  medium: {
    minHeight: 160,
  },
  large: {
    minHeight: 200,
  },
  gradient: {
    flex: 1,
  },
  content: {
    padding: dimensions.spacing.lg,
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: dimensions.spacing.md,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: dimensions.spacing.sm,
  },
  title: {
    fontSize: dimensions.fontSize.body,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: dimensions.spacing.sm,
  },
  value: {
    fontSize: dimensions.fontSize.display,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  unit: {
    fontSize: dimensions.fontSize.body,
    fontWeight: "600",
    color: colors.textPrimary,
    marginLeft: dimensions.spacing.xs,
    opacity: 0.8,
  },
  progressContainer: {
    marginTop: dimensions.spacing.sm,
  },
  progressBar: {
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 2,
    marginBottom: dimensions.spacing.xs,
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.textPrimary,
    borderRadius: 2,
  },
  progressText: {
    fontSize: dimensions.fontSize.caption,
    color: colors.textPrimary,
    opacity: 0.8,
  },
  subtitle: {
    fontSize: dimensions.fontSize.caption,
    color: colors.textPrimary,
    opacity: 0.7,
    marginTop: dimensions.spacing.xs,
  },
})
