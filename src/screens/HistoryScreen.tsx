"use client"
import type React from "react"
import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import LinearGradient from "react-native-linear-gradient"
import { LineChart } from "react-native-chart-kit"
import { Icon } from "../components/common/Icon"
import { ProfessionalCard } from "../components/common/ProfessionalCard"
import { ProfessionalHeader } from "../components/common/ProfessionalHeader"
import { useHealthData } from "../hooks/useHealthData"
import { colors } from "../constants/colors"
import { dimensions } from "../constants/dimensions"
import type { ChartDataPoint } from "../types/health"
import { SimpleBarChart } from "../components/common/SimpleBarChart"

type MetricType = "steps" | "water" | "sleep" | "heartRate" | "weight" | "calories"

const { width: screenWidth } = Dimensions.get("window")

const HistoryScreen: React.FC = () => {
  const { useWeeklyLogs } = useHealthData()
  const { data: weeklyLogs, isLoading } = useWeeklyLogs()
  const [selectedMetric, setSelectedMetric] = useState<MetricType>("steps")

  const getChartData = (): ChartDataPoint[] => {
    if (!weeklyLogs) return []

    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      return date.toISOString().split("T")[0]
    })

    return last7Days.map((date) => {
      const log = weeklyLogs.find((log) => log.date === date)
      return {
        date,
        steps: log?.steps || 0,
        water: log?.waterIntake || 0,
        sleep: log?.sleepDuration || 0,
        heartRate: log?.heartRate || 0,
        weight: log?.weight || 0,
        calories: log?.calories || 0,
      }
    })
  }

  const getMetricConfig = (metric: MetricType) => {
    const configs = {
      steps: { title: "Daily Steps", icon: "footsteps", gradient: colors.gradientSuccess, unit: "" },
      water: { title: "Water Intake", icon: "water", gradient: colors.gradientInfo, unit: "L" },
      sleep: { title: "Sleep Duration", icon: "bed", gradient: colors.gradientPrimary, unit: "h" },
      heartRate: { title: "Heart Rate", icon: "heart", gradient: ["#EF4444", "#F87171"], unit: "BPM" },
      weight: { title: "Weight", icon: "fitness", gradient: colors.gradientWarning, unit: "kg" },
      calories: { title: "Calories", icon: "flame", gradient: colors.gradientSecondary, unit: "kcal" },
    }
    return configs[metric]
  }

  const chartData = getChartData()
  const metricConfig = getMetricConfig(selectedMetric)

  const chartConfig = {
    backgroundColor: colors.surface,
    backgroundGradientFrom: colors.surface,
    backgroundGradientTo: colors.surfaceSecondary,
    decimalPlaces: selectedMetric === "steps" || selectedMetric === "calories" ? 0 : 1,
    color: (opacity = 1) => metricConfig.gradient[0],
    labelColor: (opacity = 1) => colors.textSecondary,
    style: {
      borderRadius: dimensions.borderRadius.lg,
    },
    propsForDots: {
      r: "8",
      strokeWidth: "3",
      stroke: metricConfig.gradient[0],
    },
    propsForBackgroundLines: {
      strokeDasharray: "",
      stroke: colors.glassBorder,
      strokeWidth: 1,
    },
  }

  const chartDataFormatted = {
    labels: chartData.map((item) => {
      const date = new Date(item.date)
      return date.toLocaleDateString("en-US", { weekday: "short" })
    }),
    datasets: [
      {
        data: chartData.map((item) => item[selectedMetric]),
        color: (opacity = 1) => metricConfig.gradient[0],
        strokeWidth: 4,
      },
    ],
  }

  const calculateAverage = (data: ChartDataPoint[], metric: MetricType): number => {
    if (data.length === 0) return 0
    const validData = data.filter((item) => item[metric] > 0)
    if (validData.length === 0) return 0
    const sum = validData.reduce((acc, item) => acc + item[metric], 0)
    return sum / validData.length
  }

  const MetricSelector: React.FC = () => {
    const metrics: { key: MetricType; label: string; gradient: string[] }[] = [
      { key: "steps", label: "Steps", gradient: colors.gradientSuccess },
      { key: "water", label: "Water", gradient: colors.gradientInfo },
      { key: "sleep", label: "Sleep", gradient: colors.gradientPrimary },
      { key: "heartRate", label: "Heart", gradient: ["#EF4444", "#F87171"] },
      { key: "weight", label: "Weight", gradient: colors.gradientWarning },
      { key: "calories", label: "Calories", gradient: colors.gradientSecondary },
    ]

    return (
      <View style={styles.metricSelector}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.metricScrollContent}
        >
          {metrics.map((metric) => (
            <TouchableOpacity
              key={metric.key}
              onPress={() => setSelectedMetric(metric.key)}
              style={styles.metricButtonContainer}
            >
              <LinearGradient
                colors={selectedMetric === metric.key ? metric.gradient : [colors.surface, colors.surfaceSecondary]}
                style={[styles.metricButton, selectedMetric === metric.key && styles.metricButtonActive]}
              >
                <Text style={[styles.metricButtonText, selectedMetric === metric.key && styles.metricButtonTextActive]}>
                  {metric.label}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    )
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <LinearGradient colors={colors.gradientPrimary} style={styles.loadingIcon}>
            <Icon name="bar-chart" size={32} color={colors.textPrimary} />
          </LinearGradient>
          <Text style={styles.loadingText}>Loading your health history...</Text>
          <Text style={styles.loadingSubtext}>Analyzing your progress</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Professional Header */}
        <ProfessionalHeader
          title="Health Analytics"
          subtitle="Track your wellness journey over time"
          showNotifications={false}
        />

        {/* Simple Bar Chart - Required by specs */}
        <View style={styles.basicChartSection}>
          <SimpleBarChart data={chartData} />
        </View>

        {/* Metric Selector */}
        <View style={styles.chartSection}>
          <View style={styles.chartSectionHeader}>
            <Text style={styles.sectionTitle}>Detailed Analytics</Text>
            <Text style={styles.sectionSubtitle}>Select a metric to view trends</Text>
          </View>
          <MetricSelector />
        </View>

        {/* Professional Chart */}
        <ProfessionalCard style={styles.chartCard} glassEffect elevation="xl" shadowColor={colors.shadowPrimary}>
          <View style={styles.chartHeader}>
            <View style={styles.chartTitleContainer}>
              <View style={[styles.chartIcon, { backgroundColor: metricConfig.gradient[0] + "20" }]}>
                <Icon name={metricConfig.icon} size={24} color={metricConfig.gradient[0]} />
              </View>
              <View style={styles.chartTitleText}>
                <Text style={styles.chartTitle}>{metricConfig.title}</Text>
                <Text style={styles.chartSubtitle}>7-day trend analysis</Text>
              </View>
            </View>
            <View style={styles.chartStats}>
              <Text style={styles.chartAverage}>
                {calculateAverage(chartData, selectedMetric).toFixed(
                  selectedMetric === "steps" || selectedMetric === "calories" ? 0 : 1,
                )}
                {metricConfig.unit}
              </Text>
              <Text style={styles.chartAverageLabel}>avg</Text>
            </View>
          </View>

          {chartData.length > 0 && chartData.some((item) => item[selectedMetric] > 0) ? (
            <View style={styles.chartContainer}>
              <LineChart
                data={chartDataFormatted}
                width={screenWidth - 80}
                height={240}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
                withHorizontalLabels={true}
                withVerticalLabels={true}
                withDots={true}
                withShadow={false}
                withInnerLines={true}
                withOuterLines={false}
              />
            </View>
          ) : (
            <View style={styles.noDataContainer}>
              <LinearGradient colors={colors.gradientDark} style={styles.noDataIcon}>
                <Icon name="bar-chart-outline" size={32} color={colors.textSecondary} />
              </LinearGradient>
              <Text style={styles.noDataText}>No data available</Text>
              <Text style={styles.noDataSubtext}>Start logging your health metrics to see trends</Text>
            </View>
          )}
        </ProfessionalCard>

        {/* Weekly Summary - Only show if we have data */}
        {weeklyLogs && weeklyLogs.length > 0 && (
          <View style={styles.summarySection}>
            <Text style={styles.sectionTitle}>Weekly Summary</Text>
            <ProfessionalCard style={styles.summaryCard} glassEffect elevation="lg">
              <View style={styles.summaryGrid}>
                {[
                  {
                    title: "Avg Steps",
                    value: Math.round(calculateAverage(chartData, "steps")).toLocaleString(),
                    icon: "footsteps",
                    gradient: colors.gradientSuccess,
                    show: calculateAverage(chartData, "steps") > 0,
                  },
                  {
                    title: "Avg Water",
                    value: `${calculateAverage(chartData, "water").toFixed(1)}L`,
                    icon: "water",
                    gradient: colors.gradientInfo,
                    show: calculateAverage(chartData, "water") > 0,
                  },
                  {
                    title: "Avg Sleep",
                    value: `${calculateAverage(chartData, "sleep").toFixed(1)}h`,
                    icon: "bed",
                    gradient: colors.gradientPrimary,
                    show: calculateAverage(chartData, "sleep") > 0,
                  },
                  {
                    title: "Avg Heart Rate",
                    value: `${Math.round(calculateAverage(chartData, "heartRate"))} BPM`,
                    icon: "heart",
                    gradient: ["#EF4444", "#F87171"],
                    show: calculateAverage(chartData, "heartRate") > 0,
                  },
                ]
                  .filter((item) => item.show)
                  .map((item, index) => (
                    <View key={index} style={styles.summaryItem}>
                      <LinearGradient colors={item.gradient} style={styles.summaryItemGradient}>
                        <Icon name={item.icon} size={20} color={colors.textPrimary} />
                      </LinearGradient>
                      <View style={styles.summaryItemContent}>
                        <Text style={styles.summaryItemTitle}>{item.title}</Text>
                        <Text style={styles.summaryItemValue}>{item.value}</Text>
                      </View>
                    </View>
                  ))}
              </View>
            </ProfessionalCard>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: dimensions.layout.containerPadding,
  },
  loadingIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: dimensions.spacing.xl,
  },
  loadingText: {
    fontSize: dimensions.fontSize.title,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: dimensions.spacing.sm,
  },
  loadingSubtext: {
    fontSize: dimensions.fontSize.body,
    color: colors.textSecondary,
  },
  sectionTitle: {
    fontSize: dimensions.fontSize.titleLarge,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: dimensions.spacing.lg,
  },
  sectionSubtitle: {
    fontSize: dimensions.fontSize.body,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  chartSection: {
    paddingHorizontal: dimensions.layout.containerPadding,
    marginBottom: dimensions.spacing.xl,
  },
  chartSectionHeader: {
    marginBottom: dimensions.spacing.lg,
  },
  metricSelector: {
    marginBottom: dimensions.spacing.lg,
  },
  metricScrollContent: {
    paddingRight: dimensions.spacing.lg,
  },
  metricButtonContainer: {
    marginRight: dimensions.spacing.sm,
  },
  metricButton: {
    paddingVertical: dimensions.spacing.md,
    paddingHorizontal: dimensions.spacing.lg,
    borderRadius: dimensions.borderRadius.full,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  metricButtonActive: {
    transform: [{ scale: 1.05 }],
    ...dimensions.shadow.md,
  },
  metricButtonText: {
    fontSize: dimensions.fontSize.body,
    fontWeight: "600",
    color: colors.textSecondary,
    paddingBottom:22,
    paddingRight:32

  },
  metricButtonTextActive: {
    color: colors.textPrimary,
  },
  chartCard: {
    marginHorizontal: dimensions.layout.containerPadding,
    marginBottom: dimensions.layout.sectionSpacing,
    padding: dimensions.spacing.xl,
  },
  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: dimensions.spacing.xl,
  },
  chartTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  chartIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: dimensions.spacing.md,
  },
  chartTitleText: {
    flex: 1,
  },
  chartTitle: {
    fontSize: dimensions.fontSize.title,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: dimensions.spacing.xs,
  },
  chartSubtitle: {
    fontSize: dimensions.fontSize.body,
    color: colors.textSecondary,
  },
  chartStats: {
    alignItems: "flex-end",
  },
  chartAverage: {
    fontSize: dimensions.fontSize.titleLarge,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  chartAverageLabel: {
    fontSize: dimensions.fontSize.caption,
    color: colors.textSecondary,
    marginTop: dimensions.spacing.xs,
  },
  chartContainer: {
    alignItems: "center",
    borderRadius: dimensions.borderRadius.lg,
    overflow: "hidden",
  },
  chart: {
    borderRadius: dimensions.borderRadius.lg,
  },
  noDataContainer: {
    height: 240,
    justifyContent: "center",
    alignItems: "center",
  },
  noDataIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: dimensions.spacing.lg,
  },
  noDataText: {
    fontSize: dimensions.fontSize.bodyLarge,
    fontWeight: "600",
    color: colors.textSecondary,
    marginBottom: dimensions.spacing.sm,
  },
  noDataSubtext: {
    fontSize: dimensions.fontSize.body,
    color: colors.textTertiary,
    textAlign: "center",
  },
  summarySection: {
    paddingHorizontal: dimensions.layout.containerPadding,
    paddingBottom: dimensions.layout.scrollBottomPadding,
  },
  summaryCard: {
    padding: dimensions.spacing.xl,
  },
  summaryGrid: {
    gap: dimensions.spacing.lg,
  },
  summaryItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: dimensions.spacing.lg,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: dimensions.borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  summaryItemGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: dimensions.spacing.lg,
  },
  summaryItemContent: {
    flex: 1,
  },
  summaryItemTitle: {
    fontSize: dimensions.fontSize.body,
    color: colors.textSecondary,
    marginBottom: dimensions.spacing.xs,
  },
  summaryItemValue: {
    fontSize: dimensions.fontSize.titleLarge,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  basicChartSection: {
    paddingHorizontal: dimensions.layout.containerPadding,
    marginBottom: dimensions.layout.sectionSpacing,
  },
})

export default HistoryScreen
