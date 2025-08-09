import type React from "react"
import { View, Text, StyleSheet } from "react-native"
import { ProfessionalCard } from "./ProfessionalCard"
import { colors } from "../../constants/colors"
import { dimensions } from "../../constants/dimensions"

interface BasicSummaryCardProps {
  steps: number
  waterIntake: number
  sleepDuration: number
}

export const BasicSummaryCard: React.FC<BasicSummaryCardProps> = ({ steps, waterIntake, sleepDuration }) => {
  return (
    <ProfessionalCard style={styles.container} glassEffect>
      <Text style={styles.title}>Daily Summary</Text>

      <View style={styles.metricsContainer}>
        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>Steps:</Text>
          <Text style={styles.metricValue}>{steps.toLocaleString()}</Text>
        </View>

        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>Water Intake:</Text>
          <Text style={styles.metricValue}>{waterIntake}L</Text>
        </View>

        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>Sleep:</Text>
          <Text style={styles.metricValue}>{sleepDuration} hrs</Text>
        </View>
      </View>
    </ProfessionalCard>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: dimensions.spacing.xl,
  },
  title: {
    fontSize: dimensions.fontSize.title,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: dimensions.spacing.lg,
    textAlign: "center",
  },
  metricsContainer: {
    gap: dimensions.spacing.md,
  },
  metricRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: dimensions.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.glassBorder,
  },
  metricLabel: {
    fontSize: dimensions.fontSize.bodyLarge,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  metricValue: {
    fontSize: dimensions.fontSize.bodyLarge,
    color: colors.textPrimary,
    fontWeight: "700",
  },
})
