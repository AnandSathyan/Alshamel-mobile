import type React from "react"
import { View, Text, StyleSheet } from "react-native"
import { Icon } from "./Icon"
import { Card } from "./Card"
import { ProgressBar } from "./ProgressBar"
import { colors } from "../../constants/colors"
import { dimensions } from "../../constants/dimensions"

interface MetricCardProps {
  title: string
  value: string | number
  unit: string
  icon: string
  color: string
  target?: number
  progress?: number
  subtitle?: string
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  icon,
  color,
  target,
  progress,
  subtitle,
}) => {
  const displayProgress = progress !== undefined ? progress : target ? Math.min((Number(value) / target) * 100, 100) : 0

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
          <Icon name={icon} size={24} color={color} />
        </View>
        <Text style={styles.title}>{title}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.value}>
          {typeof value === "number" ? value.toLocaleString() : value}
          <Text style={styles.unit}> {unit}</Text>
        </Text>

        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

        {target && (
          <View style={styles.progressContainer}>
            <ProgressBar progress={displayProgress} color={color} height={6} />
            <Text style={styles.progressText}>
              {Math.round(displayProgress)}% of {target.toLocaleString()}
              {unit}
            </Text>
          </View>
        )}
      </View>
    </Card>
  )
}

const styles = StyleSheet.create({
  card: {
    marginBottom: dimensions.spacing.md,
    padding:10
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: dimensions.spacing.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: dimensions.spacing.md,
  },
  title: {
    fontSize: dimensions.fontSize.body,
    fontWeight: "500",
    color: colors.textPrimary,
  },
  content: {
    flex: 1,
  },
  value: {
    fontSize: dimensions.fontSize.headline,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: dimensions.spacing.sm,
  },
  unit: {
    fontSize: dimensions.fontSize.title,
    fontWeight: "400",
    color: colors.textSecondary,
  },
  subtitle: {
    fontSize: dimensions.fontSize.caption,
    color: colors.textSecondary,
    marginBottom: dimensions.spacing.sm,
  },
  progressContainer: {
    marginTop: dimensions.spacing.sm,
  },
  progressText: {
    fontSize: dimensions.fontSize.caption,
    color: colors.textSecondary,
    marginTop: dimensions.spacing.xs,
  },
})
