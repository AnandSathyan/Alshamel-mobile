"use client"
import type React from "react"
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Dimensions } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import LinearGradient from 'react-native-linear-gradient';
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
  const { useTodaysLog, useAllLogs } = useHealthData()
  const { data: todaysLog, isLoading, refetch, isRefetching } = useTodaysLog()
  const { data: allLogs } = useAllLogs()
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
          title={`${getGreeting()}, James`}
          subtitle="Let's achieve your wellness goals today"
          notificationCount={3}
          gradient={[colors.background, colors.backgroundSecondary, colors.surface]}
        />

        {/* Date Display - Required by specs */}
        <View style={styles.dateSection}>
          <DateDisplay />
        </View>

        {/* Health Score Dashboard */}
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
              <Text style={styles.scoreTime}>Updated at 12:00 PM</Text>

              {/* Mini visualization */}
              <View style={styles.miniVisualization}>
                <View style={styles.visualizationBar} />
                <View style={[styles.visualizationBar, { height: 8, opacity: 0.7 }]} />
                <View style={[styles.visualizationBar, { height: 12, opacity: 0.5 }]} />
                <View style={[styles.visualizationBar, { height: 6, opacity: 0.3 }]} />
              </View>
            </View>
          </ProfessionalCard>
        )}

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {[
              {
                icon: "add-circle",
                label: "Log Data",
                gradient: colors.gradientPrimary,
                action: () => navigation.navigate("Log Data"),
              },
              {
                icon: "analytics",
                label: "View Stats",
                gradient: colors.gradientInfo,
                action: () => navigation.navigate("History"),
              },
              { icon: "medical", label: "AI Health", gradient: colors.gradientSecondary },
              { icon: "fitness", label: "Workout", gradient: colors.gradientSuccess },
            ].map((action, index) => (
              <TouchableOpacity key={index} onPress={action.action} style={styles.quickActionButton}>
                <LinearGradient colors={action.gradient} style={styles.quickActionGradient}>
                  <Icon name={action.icon} size={24} color={colors.textPrimary} />
                  <Text style={styles.quickActionLabel}>{action.label}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Today's Metrics */}
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
                trend="up"
                trendValue="+12%"
                glowEffect
                size="medium"
              />

              <ProfessionalMetricCard
                title="Water Intake"
                value={todaysLog.waterIntake.toFixed(1)}
                unit="L"
                icon="water"
                gradient={colors.gradientInfo}
                target={2.5}
                trend="up"
                trendValue="+8%"
                size="medium"
              />

              <ProfessionalMetricCard
                title="Sleep Quality"
                value={todaysLog.sleepDuration.toFixed(1)}
                unit="h"
                icon="bed"
                gradient={colors.gradientPrimary}
                target={8}
                trend="neutral"
                trendValue="±0%"
                size="medium"
              />

              <ProfessionalMetricCard
                title="Heart Rate"
                value={todaysLog.heartRate}
                unit="BPM"
                icon="heart"
                gradient={["#EF4444", "#F87171", "#FCA5A5"]}
                trend="down"
                trendValue="-3%"
                subtitle="Resting heart rate"
                size="medium"
              />
            </View>

            {/* Compact Metrics Row */}
            <View style={styles.compactMetricsRow}>
              <ProfessionalCard style={styles.compactMetric} glassEffect>
                <View style={styles.compactMetricContent}>
                  <Icon name="fitness" size={20} color={colors.warning} />
                  <View style={styles.compactMetricText}>
                    <Text style={styles.compactMetricValue}>{todaysLog.weight} kg</Text>
                    <Text style={styles.compactMetricLabel}>Weight</Text>
                  </View>
                  <Text style={styles.compactMetricChange}>-0.5kg</Text>
                </View>
              </ProfessionalCard>

              <ProfessionalCard style={styles.compactMetric} glassEffect>
                <View style={styles.compactMetricContent}>
                  <Icon name="flame" size={20} color={colors.accent} />
                  <View style={styles.compactMetricText}>
                    <Text style={styles.compactMetricValue}>{todaysLog.calories}</Text>
                    <Text style={styles.compactMetricLabel}>Calories</Text>
                  </View>
                  <Text style={styles.compactMetricChange}>+150</Text>
                </View>
              </ProfessionalCard>
            </View>
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

        {/* AI Health Assistant */}
        <ProfessionalCard
          gradient={colors.gradientSecondary}
          style={styles.aiCard}
          glassEffect
          elevation="lg"
          shadowColor={colors.shadowSecondary}
        >
          <View style={styles.aiContent}>
            <View style={styles.aiHeader}>
              <View style={styles.aiIconContainer}>
                <Icon name="medical" size={28} color={colors.textPrimary} />
              </View>
              <View style={styles.aiTextContainer}>
                <Text style={styles.aiTitle}>AI Health Assistant</Text>
                <Text style={styles.aiSubtitle}>Get personalized health insights and recommendations</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.aiButton}>
              <LinearGradient colors={[colors.glass, colors.glassStrong]} style={styles.aiButtonGradient}>
                <Text style={styles.aiButtonText}>Start Consultation</Text>
                <Icon name="arrow-forward" size={16} color={colors.textPrimary} />
              </LinearGradient>
            </TouchableOpacity>

            {/* Decorative robot illustration placeholder */}
            <View style={styles.aiRobotContainer}>
              <View style={styles.aiRobot}>
                <Icon name="medical" size={64} color={colors.textPrimary} />
              </View>
            </View>
          </View>
        </ProfessionalCard>

        {/* Health Insights */}
        <View style={styles.insightsSection}>
          <Text style={styles.sectionTitle}>Health Insights</Text>
          <View style={styles.insightsGrid}>
            {[
              {
                title: "Hydration Goal",
                subtitle: "You're 80% towards your daily goal",
                icon: "water",
                color: colors.info,
                progress: 80,
              },
              {
                title: "Activity Level",
                subtitle: "Great job! You exceeded your step goal",
                icon: "footsteps",
                color: colors.success,
                progress: 120,
              },
              {
                title: "Sleep Pattern",
                subtitle: "Consider going to bed 30 minutes earlier",
                icon: "bed",
                color: colors.warning,
                progress: 75,
              },
            ].map((insight, index) => (
              <ProfessionalCard key={index} style={styles.insightCard} glassEffect>
                <View style={styles.insightContent}>
                  <View style={[styles.insightIcon, { backgroundColor: insight.color + "20" }]}>
                    <Icon name={insight.icon} size={20} color={insight.color} />
                  </View>
                  <View style={styles.insightText}>
                    <Text style={styles.insightTitle}>{insight.title}</Text>
                    <Text style={styles.insightSubtitle}>{insight.subtitle}</Text>
                  </View>
                  <View style={styles.insightProgress}>
                    <Text style={styles.insightProgressText}>{insight.progress}%</Text>
                  </View>
                </View>
              </ProfessionalCard>
            ))}
          </View>
        </View>
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
  miniVisualization: {
    flexDirection: "row",
    alignItems: "end",
    gap: dimensions.spacing.sm,
  },
  visualizationBar: {
    width: 4,
    height: 16,
    backgroundColor: colors.textPrimary,
    borderRadius: 2,
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
  compactMetricChange: {
    fontSize: dimensions.fontSize.caption,
    color: colors.success,
    fontWeight: "600",
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
  aiCard: {
    marginHorizontal: dimensions.layout.containerPadding,
    marginBottom: dimensions.layout.sectionSpacing,
  },
  aiContent: {
    position: "relative",
  },
  aiHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: dimensions.spacing.xl,
  },
  aiIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.glassStrong,
    alignItems: "center",
    justifyContent: "center",
    marginRight: dimensions.spacing.lg,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  aiTextContainer: {
    flex: 1,
  },
  aiTitle: {
    fontSize: dimensions.fontSize.titleLarge,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: dimensions.spacing.xs,
  },
  aiSubtitle: {
    fontSize: dimensions.fontSize.body,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  aiButton: {
    borderRadius: dimensions.borderRadius.full,
    overflow: "hidden",
    alignSelf: "flex-start",
  },
  aiButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: dimensions.spacing.xl,
    paddingVertical: dimensions.spacing.md,
    gap: dimensions.spacing.sm,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  aiButtonText: {
    fontSize: dimensions.fontSize.bodyLarge,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  aiRobotContainer: {
    position: "absolute",
    right: 0,
    top: 0,
    opacity: 0.2,
  },
  aiRobot: {
    transform: [{ rotate: "15deg" }],
  },
  insightsSection: {
    paddingHorizontal: dimensions.layout.containerPadding,
    marginBottom: dimensions.layout.scrollBottomPadding,
  },
  insightsGrid: {
    gap: dimensions.spacing.md,
  },
  insightCard: {
    marginBottom: dimensions.spacing.sm,
  },
  insightContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  insightIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: dimensions.spacing.md,
  },
  insightText: {
    flex: 1,
  },
  insightTitle: {
    fontSize: dimensions.fontSize.bodyLarge,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: dimensions.spacing.xs,
  },
  insightSubtitle: {
    fontSize: dimensions.fontSize.body,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  insightProgress: {
    alignItems: "center",
  },
  insightProgressText: {
    fontSize: dimensions.fontSize.body,
    fontWeight: "700",
    color: colors.primary,
  },
  dateSection: {
    paddingHorizontal: dimensions.layout.containerPadding,
    marginTop: dimensions.spacing.md,
    marginBottom: dimensions.spacing.lg,
  },
})

export default HomeScreen
