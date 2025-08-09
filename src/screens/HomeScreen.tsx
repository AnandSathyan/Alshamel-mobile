"use client"
import type React from "react"
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Dimensions } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import LinearGradient from "react-native-linear-gradient"
import { Icon } from "../components/common/Icon"
import { ProfessionalCard } from "../components/common/ProfessionalCard"
import { ProfessionalMetricCard } from "../components/common/ProfessionalMetricCard"
import { ProfessionalHeader } from "../components/common/ProfessionalHeader"
import { useHealthData } from "../hooks/useHealthData"
import { calculateOverallHealthScore } from "../utils/healthCalculations"
import { colors } from "../constants/colors"
import { dimensions } from "../constants/dimensions"
import { useNavigation } from "@react-navigation/native"
import { DateDisplay } from "../components/common/DateDisplay"
import { BasicSummaryCard } from "../components/common/BasicSummaryCard"

const { width } = Dimensions.get("window")

const HomeScreen: React.FC = () => {
  const { useTodaysLog, useAllLogs, useWeeklyLogs } = useHealthData()
  const { data: todaysLog, isLoading, refetch, isRefetching } = useTodaysLog()
  const { data: allLogs } = useAllLogs()
  const { data: weeklyLogs } = useWeeklyLogs()
  const navigation = useNavigation()

  const healthScore = allLogs ? calculateOverallHealthScore(allLogs) : null

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 17) return "Good afternoon"
    return "Good evening"
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    })
  }

  // Calculate trends from actual data
  const calculateTrend = (currentValue: number, metric: string) => {
    if (!weeklyLogs || weeklyLogs.length < 2) return { trend: "neutral", value: "±0%" }

    const sortedLogs = weeklyLogs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    const previousValue = sortedLogs[sortedLogs.length - 2]?.[metric] || 0

    if (previousValue === 0) return { trend: "neutral", value: "±0%" }

    const change = ((currentValue - previousValue) / previousValue) * 100

    if (change > 0) return { trend: "up", value: `+${Math.round(change)}%` }
    if (change < 0) return { trend: "down", value: `${Math.round(change)}%` }
    return { trend: "neutral", value: "±0%" }
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <LinearGradient colors={colors.gradientPrimary} style={styles.loadingIcon}>
            <Icon name="heart" size={32} color={colors.textPrimary} />
          </LinearGradient>
          <Text style={styles.loadingText}>Loading your health insights...</Text>
          <Text style={styles.loadingSubtext}>Analyzing your wellness data</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Professional Header */}
        <ProfessionalHeader
          title={getGreeting()}
          subtitle="Let's achieve your wellness goals today"
          showNotifications={false}
          gradient={[colors.background, colors.backgroundSecondary, colors.surface]}
        />

        {/* Date Display - Required by specs */}
        <View style={styles.dateSection}>
          <DateDisplay />
        </View>

        {/* Health Score Dashboard - Only show if we have data */}
        {healthScore && (
          <ProfessionalCard
            gradient={["#0F766E", "#14B8A6", "#22D3EE"]}
            style={styles.dashboardCard}
            glassEffect
            elevation="xl"
            shadowColor={colors.shadowPrimary}
          >
            <View style={styles.dashboardHeader}>
              <View style={styles.dashboardIconContainer}>
                <Icon name="analytics" size={24} color={colors.textPrimary} />
              </View>
              <View style={styles.dashboardTitleContainer}>
                <Text style={styles.dashboardTitle}>Health Dashboard</Text>
                <Text style={styles.dashboardSubtitle}>Your wellness overview</Text>
              </View>
              <View style={styles.dashboardBadge}>
                <Text style={styles.dashboardBadgeText}>{healthScore.category}</Text>
              </View>
            </View>

            <View style={styles.dashboardContent}>
              <View style={styles.scoreContainer}>
                <Text style={styles.scoreValue}>{healthScore.overall}</Text>
                <Text style={styles.scoreUnit}>%</Text>
              </View>
              <Text style={styles.scoreDate}>{formatDate(new Date())}</Text>
              <Text style={styles.scoreTime}>Updated now</Text>
            </View>
          </ProfessionalCard>
        )}

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity onPress={() => navigation.navigate("Log Data")} style={styles.quickActionButton}>
              <LinearGradient colors={colors.gradientPrimary} style={styles.quickActionGradient}>
                <Icon name="add-circle" size={24} color={colors.textPrimary} />
                <Text style={styles.quickActionLabel}>Log Data</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("History")} style={styles.quickActionButton}>
              <LinearGradient colors={colors.gradientInfo} style={styles.quickActionGradient}>
                <Icon name="analytics" size={24} color={colors.textPrimary} />
                <Text style={styles.quickActionLabel}>View Stats</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Today's Metrics - Only show if we have data */}
        {todaysLog ? (
          <View style={styles.metricsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Today's Metrics</Text>
              <TouchableOpacity onPress={() => navigation.navigate("History")}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>

            {/* Basic Summary Card - Required by specs */}
            <BasicSummaryCard
              steps={todaysLog.steps}
              waterIntake={todaysLog.waterIntake}
              sleepDuration={todaysLog.sleepDuration}
            />

            <View style={styles.metricsGrid}>
              <ProfessionalMetricCard
                title="Daily Steps"
                value={todaysLog.steps.toLocaleString()}
                icon="footsteps"
                gradient={colors.gradientSuccess}
                target={10000}
                trend={calculateTrend(todaysLog.steps, "steps").trend}
                trendValue={calculateTrend(todaysLog.steps, "steps").value}
                size="medium"
              />

              <ProfessionalMetricCard
                title="Water Intake"
                value={todaysLog.waterIntake.toFixed(1)}
                unit="L"
                icon="water"
                gradient={colors.gradientInfo}
                target={2.5}
                trend={calculateTrend(todaysLog.waterIntake, "waterIntake").trend}
                trendValue={calculateTrend(todaysLog.waterIntake, "waterIntake").value}
                size="medium"
              />

              <ProfessionalMetricCard
                title="Sleep Quality"
                value={todaysLog.sleepDuration.toFixed(1)}
                unit="h"
                icon="bed"
                gradient={colors.gradientPrimary}
                target={8}
                trend={calculateTrend(todaysLog.sleepDuration, "sleepDuration").trend}
                trendValue={calculateTrend(todaysLog.sleepDuration, "sleepDuration").value}
                size="medium"
              />

              {todaysLog.heartRate > 0 && (
                <ProfessionalMetricCard
                  title="Heart Rate"
                  value={todaysLog.heartRate}
                  unit="BPM"
                  icon="heart"
                  gradient={["#EF4444", "#F87171", "#FCA5A5"]}
                  trend={calculateTrend(todaysLog.heartRate, "heartRate").trend}
                  trendValue={calculateTrend(todaysLog.heartRate, "heartRate").value}
                  subtitle="Resting heart rate"
                  size="medium"
                />
              )}
            </View>

            {/* Compact Metrics Row - Only show if data exists */}
            {(todaysLog.weight > 0 || todaysLog.calories > 0) && (
              <View style={styles.compactMetricsRow}>
                {todaysLog.weight > 0 && (
                  <ProfessionalCard style={styles.compactMetric} glassEffect>
                    <View style={styles.compactMetricContent}>
                      <Icon name="fitness" size={20} color={colors.warning} />
                      <View style={styles.compactMetricText}>
                        <Text style={styles.compactMetricValue}>{todaysLog.weight} kg</Text>
                        <Text style={styles.compactMetricLabel}>Weight</Text>
                      </View>
                    </View>
                  </ProfessionalCard>
                )}

                {todaysLog.calories > 0 && (
                  <ProfessionalCard style={styles.compactMetric} glassEffect>
                    <View style={styles.compactMetricContent}>
                      <Icon name="flame" size={20} color={colors.accent} />
                      <View style={styles.compactMetricText}>
                        <Text style={styles.compactMetricValue}>{todaysLog.calories}</Text>
                        <Text style={styles.compactMetricLabel}>Calories</Text>
                      </View>
                    </View>
                  </ProfessionalCard>
                )}
              </View>
            )}
          </View>
        ) : (
          <ProfessionalCard gradient={colors.gradientPrimary} style={styles.noDataCard} glassEffect elevation="lg">
            <View style={styles.noDataContent}>
              <LinearGradient colors={colors.gradientSecondary} style={styles.noDataIcon}>
                <Icon name="analytics-outline" size={48} color={colors.textPrimary} />
              </LinearGradient>
              <Text style={styles.noDataTitle}>Start Your Wellness Journey</Text>
              <Text style={styles.noDataText}>
                Begin tracking your health metrics to unlock personalized insights and achieve your wellness goals.
              </Text>
              <TouchableOpacity style={styles.getStartedButton} onPress={() => navigation.navigate("Log Data")}>
                <LinearGradient colors={colors.gradientSecondary} style={styles.getStartedGradient}>
                  <Text style={styles.getStartedText}>Get Started</Text>
                  <Icon name="arrow-forward" size={16} color={colors.textPrimary} />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </ProfessionalCard>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

// Keep the same styles but remove unused ones
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
  dashboardCard: {
    marginHorizontal: dimensions.layout.containerPadding,
    marginTop: dimensions.spacing.md,
    marginBottom: dimensions.layout.sectionSpacing,
  },
  dashboardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: dimensions.spacing.xl,
  },
  dashboardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.glassStrong,
    alignItems: "center",
    justifyContent: "center",
    marginRight: dimensions.spacing.md,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  dashboardTitleContainer: {
    flex: 1,
  },
  dashboardTitle: {
    fontSize: dimensions.fontSize.title,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: dimensions.spacing.xs,
  },
  dashboardSubtitle: {
    fontSize: dimensions.fontSize.body,
    color: colors.textSecondary,
    opacity: 0.9,
  },
  dashboardBadge: {
    backgroundColor: colors.glassStrong,
    paddingHorizontal: dimensions.spacing.md,
    paddingVertical: dimensions.spacing.sm,
    borderRadius: dimensions.borderRadius.full,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  dashboardBadgeText: {
    fontSize: dimensions.fontSize.caption,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  dashboardContent: {
    alignItems: "flex-start",
  },
  scoreContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: dimensions.spacing.md,
  },
  scoreValue: {
    fontSize: dimensions.fontSize.displayLarge,
    fontWeight: "900",
    color: colors.textPrimary,
    letterSpacing: -2,
  },
  scoreUnit: {
    fontSize: dimensions.fontSize.headlineLarge,
    fontWeight: "700",
    color: colors.textSecondary,
    marginLeft: dimensions.spacing.sm,
  },
  scoreDate: {
    fontSize: dimensions.fontSize.bodyLarge,
    color: colors.textSecondary,
    marginBottom: dimensions.spacing.xs,
  },
  scoreTime: {
    fontSize: dimensions.fontSize.body,
    color: colors.textTertiary,
    marginBottom: dimensions.spacing.xl,
  },
  quickActionsSection: {
    paddingHorizontal: dimensions.layout.containerPadding,
    marginBottom: dimensions.layout.sectionSpacing,
  },
  sectionTitle: {
    fontSize: dimensions.fontSize.titleLarge,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: dimensions.spacing.lg,
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: dimensions.spacing.md,
  },
  quickActionButton: {
    width: (width - dimensions.layout.containerPadding * 2 - dimensions.spacing.md) / 2,
    borderRadius: dimensions.borderRadius.xl,
    overflow: "hidden",
  },
  quickActionGradient: {
    padding: dimensions.spacing.lg,
    alignItems: "center",
    minHeight: 80,
    justifyContent: "center",
  },
  quickActionLabel: {
    fontSize: dimensions.fontSize.body,
    fontWeight: "600",
    color: colors.textPrimary,
    marginTop: dimensions.spacing.sm,
  },
  metricsSection: {
    paddingHorizontal: dimensions.layout.containerPadding,
    marginBottom: dimensions.layout.sectionSpacing,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: dimensions.spacing.lg,
  },
  viewAllText: {
    fontSize: dimensions.fontSize.body,
    color: colors.primary,
    fontWeight: "600",
  },
  metricsGrid: {
    gap: dimensions.spacing.lg,
  },
  compactMetricsRow: {
    flexDirection: "row",
    gap: dimensions.spacing.md,
    marginTop: dimensions.spacing.lg,
  },
  compactMetric: {
    flex: 1,
  },
  compactMetricContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  compactMetricText: {
    flex: 1,
    marginLeft: dimensions.spacing.md,
  },
  compactMetricValue: {
    fontSize: dimensions.fontSize.bodyLarge,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  compactMetricLabel: {
    fontSize: dimensions.fontSize.caption,
    color: colors.textSecondary,
  },
  noDataCard: {
    marginHorizontal: dimensions.layout.containerPadding,
    marginTop: dimensions.spacing.md,
    marginBottom: dimensions.layout.sectionSpacing,
    alignItems: "center",
    paddingVertical: dimensions.spacing.massive,
  },
  noDataContent: {
    alignItems: "center",
  },
  noDataIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: dimensions.spacing.xl,
  },
  noDataTitle: {
    fontSize: dimensions.fontSize.headlineLarge,
    fontWeight: "800",
    color: colors.textPrimary,
    marginBottom: dimensions.spacing.md,
    textAlign: "center",
  },
  noDataText: {
    fontSize: dimensions.fontSize.bodyLarge,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: dimensions.spacing.xl,
    paddingHorizontal: dimensions.spacing.lg,
  },
  getStartedButton: {
    borderRadius: dimensions.borderRadius.full,
    overflow: "hidden",
  },
  getStartedGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: dimensions.spacing.xl,
    paddingVertical: dimensions.spacing.lg,
    gap: dimensions.spacing.sm,
  },
  getStartedText: {
    fontSize: dimensions.fontSize.bodyLarge,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  dateSection: {
    paddingHorizontal: dimensions.layout.containerPadding,
    marginTop: dimensions.spacing.md,
    marginBottom: dimensions.spacing.lg,
  },
})

export default HomeScreen
