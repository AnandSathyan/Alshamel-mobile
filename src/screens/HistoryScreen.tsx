"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import Ionicons from "react-native-vector-icons/Ionicons"
import { LineChart } from "react-native-chart-kit"
import { Card } from "../components/common/Card"
import { useHealthData } from "../hooks/useHealthData"
import { colors } from "../constants/colors"
import { dimensions } from "../constants/dimensions"
import type { ChartDataPoint } from "../types/health"

type MetricType = "steps" | "water" | "sleep" | "heartRate" | "weight" | "calories"

const { width: screenWidth } = Dimensions.get("window")

const HistoryScreen: React.FC = () => {
  const { useWeeklyLogs } = useHealthData()
  const { data: weeklyLogs, isLoading } = useWeeklyLogs()
  const [selectedMetric, setSelectedMetric] = useState<MetricType>("steps")

  const getChartData = (): ChartDataPoint[] => {
    if (!weeklyLogs) return []

    // Create array for last 7 days
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
      steps: { title: "Daily Steps", icon: "footsteps", color: colors.chartSteps, unit: "" },
      water: { title: "Water Intake", icon: "water", color: colors.chartWater, unit: "L" },
      sleep: { title: "Sleep Duration", icon: "bed", color: colors.chartSleep, unit: "h" },
      heartRate: { title: "Heart Rate", icon: "heart", color: colors.chartHeartRate, unit: "BPM" },
      weight: { title: "Weight", icon: "fitness", color: colors.chartWeight, unit: "kg" },
      calories: { title: "Calories", icon: "flame", color: colors.chartCalories, unit: "kcal" },
    }
    return configs[metric]
  }

  const calculateAverage = (data: ChartDataPoint[], metric: MetricType): number => {
    if (data.length === 0) return 0
    const sum = data.reduce((acc, item) => acc + item[metric], 0)
    return sum / data.length
  }

  const chartData = getChartData()
  const metricConfig = getMetricConfig(selectedMetric)
  const average = calculateAverage(chartData, selectedMetric)

  const chartConfig = {
    backgroundColor: colors.surface,
    backgroundGradientFrom: colors.surface,
    backgroundGradientTo: colors.surface,
    decimalPlaces: selectedMetric === "steps" || selectedMetric === "calories" ? 0 : 1,
    color: (opacity = 1) => metricConfig.color,
    labelColor: (opacity = 1) => colors.textSecondary,
    style: {
      borderRadius: dimensions.borderRadius.md,
    },
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: metricConfig.color,
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
        color: (opacity = 1) => metricConfig.color,
        strokeWidth: 2,
      },
    ],
  }

  const MetricSelector: React.FC = () => {
    const metrics: { key: MetricType; label: string; color: string }[] = [
      { key: "steps", label: "Steps", color: colors.chartSteps },
      { key: "water", label: "Water", color: colors.chartWater },
      { key: "sleep", label: "Sleep", color: colors.chartSleep },
      { key: "heartRate", label: "Heart", color: colors.chartHeartRate },
      { key: "weight", label: "Weight", color: colors.chartWeight },
      { key: "calories", label: "Calories", color: colors.chartCalories },
    ]

    return (
      <View style={styles.metricSelector}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {metrics.map((metric) => (
            <TouchableOpacity
              key={metric.key}
              style={[
                styles.metricButton,
                selectedMetric === metric.key && {
                  backgroundColor: metric.color,
                },
              ]}
              onPress={() => setSelectedMetric(metric.key)}
            >
              <Text style={[styles.metricButtonText, selectedMetric === metric.key && styles.metricButtonTextActive]}>
                {metric.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    )
  }

  const WeeklySummary: React.FC = () => {
    const summaryData = [
      {
        title: "Avg Steps",
        value: Math.round(calculateAverage(chartData, "steps")).toLocaleString(),
        icon: "footsteps",
        color: colors.chartSteps,
      },
      {
        title: "Avg Water",
        value: `${calculateAverage(chartData, "water").toFixed(1)}L`,
        icon: "water",
        color: colors.chartWater,
      },
      {
        title: "Avg Sleep",
        value: `${calculateAverage(chartData, "sleep").toFixed(1)}h`,
        icon: "bed",
        color: colors.chartSleep,
      },
      {
        title: "Avg Heart Rate",
        value: `${Math.round(calculateAverage(chartData, "heartRate"))} BPM`,
        icon: "heart",
        color: colors.chartHeartRate,
      },
    ]

    return (
      <Card>
        <Text style={styles.sectionTitle}>📊 Weekly Summary</Text>
        <View style={styles.summaryGrid}>
          {summaryData.map((item, index) => (
            <View key={index} style={[styles.summaryCard, { borderLeftColor: item.color }]}>
              <View style={styles.summaryHeader}>
                <Ionicons name={item.icon} size={20} color={item.color} />
                <Text style={styles.summaryTitle}>{item.title}</Text>
              </View>
              <Text style={styles.summaryValue}>{item.value}</Text>
            </View>
          ))}
        </View>
      </Card>
    )
  }

  const DataList: React.FC<{ data: ChartDataPoint[] }> = ({ data }) => {
    return (
      <Card>
        <Text style={styles.sectionTitle}>📅 7-Day History</Text>
        {data.map((item, index) => {
          const date = new Date(item.date)
          const isToday = item.date === new Date().toISOString().split("T")[0]

          return (
            <View key={index} style={styles.dataRow}>
              <View style={styles.dateContainer}>
                <Text style={[styles.dayText, isToday && styles.todayText]}>
                  {date.toLocaleDateString("en-US", { weekday: "short" })}
                </Text>
                <Text style={[styles.dateText, isToday && styles.todayText]}>{date.getDate()}</Text>
              </View>
              <View style={styles.metricsContainer}>
                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>Steps</Text>
                  <Text style={styles.metricValue}>{item.steps.toLocaleString()}</Text>
                </View>
                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>Water</Text>
                  <Text style={styles.metricValue}>{item.water.toFixed(1)}L</Text>
                </View>
                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>Sleep</Text>
                  <Text style={styles.metricValue}>{item.sleep.toFixed(1)}h</Text>
                </View>
              </View>
            </View>
          )
        })}
      </Card>
    )
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Ionicons name="bar-chart" size={48} color={colors.primary} />
          <Text style={styles.loadingText}>Loading history...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Health History</Text>
          <Text style={styles.subtitle}>Your 7-day health metrics overview</Text>
        </View>

        {/* Metric Selector */}
        <MetricSelector />

        {/* Chart */}
        <Card style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <View style={styles.chartTitleContainer}>
              <Ionicons name={metricConfig.icon} size={24} color={metricConfig.color} />
              <Text style={styles.chartTitle}>{metricConfig.title}</Text>
            </View>
            <Text style={styles.averageText}>
              7-day avg: {average.toFixed(selectedMetric === "steps" || selectedMetric === "calories" ? 0 : 1)}
              {metricConfig.unit}
            </Text>
          </View>

          {chartData.length > 0 ? (
            <LineChart
              data={chartDataFormatted}
              width={screenWidth - 64}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          ) : (
            <View style={styles.noDataContainer}>
              <Ionicons name="bar-chart-outline" size={48} color={colors.textSecondary} />
              <Text style={styles.noDataText}>No data available for the selected period</Text>
            </View>
          )}
        </Card>

        {/* Weekly Summary */}
        <WeeklySummary />

        {/* Data List */}
        <DataList data={chartData} />
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
  },
  loadingText: {
    fontSize: dimensions.fontSize.body,
    color: colors.textSecondary,
    marginTop: dimensions.spacing.md,
  },
  header: {
    padding: dimensions.spacing.lg,
    paddingBottom: dimensions.spacing.md,
  },
  title: {
    fontSize: dimensions.fontSize.title,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: dimensions.spacing.xs,
  },
  subtitle: {
    fontSize: dimensions.fontSize.body,
    color: colors.textSecondary,
  },
  metricSelector: {
    marginHorizontal: dimensions.spacing.lg,
    marginBottom: dimensions.spacing.md,
  },
  metricButton: {
    paddingVertical: dimensions.spacing.sm,
    paddingHorizontal: dimensions.spacing.md,
    borderRadius: dimensions.borderRadius.full,
    backgroundColor: colors.surfaceSecondary,
    marginRight: dimensions.spacing.sm,
  },
  metricButtonText: {
    fontSize: dimensions.fontSize.body,
    fontWeight: "500",
    color: colors.textSecondary,
  },
  metricButtonTextActive: {
    color: colors.surface,
  },
  chartCard: {
    marginHorizontal: dimensions.spacing.lg,
    marginBottom: dimensions.spacing.md,
  },
  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: dimensions.spacing.md,
  },
  chartTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  chartTitle: {
    fontSize: dimensions.fontSize.body,
    fontWeight: "600",
    color: colors.textPrimary,
    marginLeft: dimensions.spacing.sm,
  },
  averageText: {
    fontSize: dimensions.fontSize.caption,
    color: colors.textSecondary,
  },
  chart: {
    marginVertical: dimensions.spacing.sm,
    borderRadius: dimensions.borderRadius.md,
  },
  noDataContainer: {
    height: 220,
    justifyContent: "center",
    alignItems: "center",
  },
  noDataText: {
    fontSize: dimensions.fontSize.body,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: dimensions.spacing.md,
  },
  sectionTitle: {
    fontSize: dimensions.fontSize.body,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: dimensions.spacing.md,
  },
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  summaryCard: {
    width: "48%",
    backgroundColor: colors.surfaceSecondary,
    borderRadius: dimensions.borderRadius.md,
    padding: dimensions.spacing.md,
    marginBottom: dimensions.spacing.sm,
    borderLeftWidth: 4,
  },
  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: dimensions.spacing.xs,
  },
  summaryTitle: {
    fontSize: dimensions.fontSize.caption,
    color: colors.textSecondary,
    marginLeft: dimensions.spacing.xs,
  },
  summaryValue: {
    fontSize: dimensions.fontSize.body,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  dataRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: dimensions.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  dateContainer: {
    width: 60,
    alignItems: "center",
    marginRight: dimensions.spacing.lg,
  },
  dayText: {
    fontSize: dimensions.fontSize.caption,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  dateText: {
    fontSize: dimensions.fontSize.body,
    color: colors.textPrimary,
    fontWeight: "600",
  },
  todayText: {
    color: colors.primary,
  },
  metricsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  metricItem: {
    flex: 1,
    alignItems: "center",
  },
  metricLabel: {
    fontSize: dimensions.fontSize.caption,
    color: colors.textSecondary,
    marginBottom: dimensions.spacing.xs,
  },
  metricValue: {
    fontSize: dimensions.fontSize.body,
    fontWeight: "600",
    color: colors.textPrimary,
  },
})

export default HistoryScreen
