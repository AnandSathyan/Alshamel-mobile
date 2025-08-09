import type React from "react"
import { View, Text, StyleSheet, Dimensions } from "react-native"
import { ProfessionalCard } from "./ProfessionalCard"
import { colors } from "../../constants/colors"
import { dimensions } from "../../constants/dimensions"

const { width } = Dimensions.get("window")

interface ChartData {
  date: string
  steps: number
  water: number
  sleep: number
}

interface SimpleBarChartProps {
  data: ChartData[]
}

export const SimpleBarChart: React.FC<SimpleBarChartProps> = ({ data }) => {
  const maxSteps = Math.max(...data.map((d) => d.steps))
  const maxWater = Math.max(...data.map((d) => d.water))
  const maxSleep = Math.max(...data.map((d) => d.sleep))

  const normalizeValue = (value: number, max: number) => {
    return max > 0 ? (value / max) * 100 : 0
  }

  return (
    <ProfessionalCard style={styles.container} glassEffect>
      <Text style={styles.title}>Past 7 Days Overview</Text>

      <View style={styles.chartContainer}>
        {data.map((item, index) => {
          const date = new Date(item.date)
          const dayName = date.toLocaleDateString("en-US", { weekday: "short" })

          return (
            <View key={index} style={styles.dayContainer}>
              <View style={styles.barsContainer}>
                {/* Steps Bar */}
                <View style={styles.barGroup}>
                  <View style={[styles.bar, styles.stepsBar, { height: `${normalizeValue(item.steps, maxSteps)}%` }]} />
                  <Text style={styles.barLabel}>S</Text>
                </View>

                {/* Water Bar */}
                <View style={styles.barGroup}>
                  <View style={[styles.bar, styles.waterBar, { height: `${normalizeValue(item.water, maxWater)}%` }]} />
                  <Text style={styles.barLabel}>W</Text>
                </View>

                {/* Sleep Bar */}
                <View style={styles.barGroup}>
                  <View style={[styles.bar, styles.sleepBar, { height: `${normalizeValue(item.sleep, maxSleep)}%` }]} />
                  <Text style={styles.barLabel}>Sl</Text>
                </View>
              </View>

              <Text style={styles.dayLabel}>{dayName}</Text>
            </View>
          )
        })}
      </View>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, styles.stepsBar]} />
          <Text style={styles.legendText}>Steps</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, styles.waterBar]} />
          <Text style={styles.legendText}>Water</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, styles.sleepBar]} />
          <Text style={styles.legendText}>Sleep</Text>
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
    marginBottom: dimensions.spacing.xl,
    textAlign: "center",
  },
  chartContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 150,
    marginBottom: dimensions.spacing.lg,
    paddingHorizontal: dimensions.spacing.sm,
  },
  dayContainer: {
    alignItems: "center",
    flex: 1,
  },
  barsContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: 120,
    marginBottom: dimensions.spacing.sm,
  },
  barGroup: {
    alignItems: "center",
    marginHorizontal: 1,
  },
  bar: {
    width: 8,
    minHeight: 4,
    borderRadius: 4,
    marginBottom: 2,
  },
  stepsBar: {
    backgroundColor: colors.chartSteps,
  },
  waterBar: {
    backgroundColor: colors.chartWater,
  },
  sleepBar: {
    backgroundColor: colors.chartSleep,
  },
  barLabel: {
    fontSize: 8,
    color: colors.textTertiary,
    fontWeight: "500",
  },
  dayLabel: {
    fontSize: dimensions.fontSize.caption,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    gap: dimensions.spacing.lg,
    paddingTop: dimensions.spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.glassBorder,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: dimensions.spacing.xs,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: dimensions.fontSize.caption,
    color: colors.textSecondary,
    fontWeight: "500",
  },
})
