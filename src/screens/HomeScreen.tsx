"use client"

import type React from "react"
import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Icon } from "../components/common/Icon"
import { Card } from "../components/common/Card"
import { MetricCard } from "../components/common/MetricCard"
import { Button } from "../components/common/Button"
import { ProgressBar } from "../components/common/ProgressBar"
import { useHealthData } from "../hooks/useHealthData"
import { calculateOverallHealthScore, analyzeMetrics, getTrendAnalysis } from "../utils/healthCalculations"
import { colors } from "../constants/colors"
import { dimensions } from "../constants/dimensions"
import {useNavigation} from '@react-navigation/native'
const { width } = Dimensions.get("window")

const HomeScreen: React.FC = () => {
  const { useTodaysLog, useWeeklyLogs, useAllLogs } = useHealthData()
  const { data: todaysLog, isLoading, refetch, isRefetching } = useTodaysLog()
  const { data: weeklyLogs } = useWeeklyLogs()
  const { data: allLogs } = useAllLogs()
  const [selectedQuickAction, setSelectedQuickAction] = useState<string | null>(null)

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getMoodEmoji = (mood: number) => {
    const moods = ["😢", "😞", "😐", "😊", "😄"]
    return moods[mood - 1] || "😐"
  }
const navigation = useNavigation()
  // Calculate health insights
  const healthScore = allLogs ? calculateOverallHealthScore(allLogs) : null
  const todaysAnalysis = todaysLog ? analyzeMetrics(todaysLog) : null
  const trendAnalysis = allLogs ? getTrendAnalysis(allLogs) : null

  const quickActions = [
    { id: "water", icon: "water", label: "Log Water", color: colors.chartWater },
    { id: "steps", icon: "footsteps", label: "Add Steps", color: colors.chartSteps },
    { id: "mood", icon: "happy", label: "Set Mood", color: colors.warning },
    { id: "weight", icon: "fitness", label: "Log Weight", color: colors.chartWeight },
  ]

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Animated.View style={styles.loadingIcon}>
            <Icon name="heart" size={48} color={colors.primary} />
          </Animated.View>
          <Text style={styles.loadingText}>Loading your health data...</Text>
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
        {/* Enhanced Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.headerLeft}>
              <Text style={styles.greetingText}>Good {getTimeOfDay()}! 👋</Text>
              <Text style={styles.dateText}>{formatDate(new Date())}</Text>
            </View>
            <TouchableOpacity style={styles.profileButton}>
              <View style={styles.profileAvatar}>
                <Icon name="person" size={24} color={colors.surface} />
              </View>
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationText}>3</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActionsContainer}>
            <Text style={styles.quickActionsTitle}>Quick Actions</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickActionsScroll}>
              {quickActions.map((action) => (
                <TouchableOpacity
                  key={action.id}
                  style={[
                    styles.quickActionButton,
                    { backgroundColor: `${action.color}15` },
                    selectedQuickAction === action.id && { backgroundColor: action.color },
                  ]}
                  onPress={() => setSelectedQuickAction(action.id)}
                >
                  <Icon
                    name={action.icon}
                    size={20}
                    color={selectedQuickAction === action.id ? colors.surface : action.color}
                  />
                  <Text
                    style={[styles.quickActionText, selectedQuickAction === action.id && { color: colors.surface }]}
                  >
                    {action.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Enhanced Health Score */}
          {healthScore && (
            <Card style={styles.healthScoreCard}>
              <View style={styles.healthScoreHeader}>
                <View style={styles.healthScoreLeft}>
                  <Text style={styles.healthScoreTitle}>Health Score</Text>
                  <Text style={styles.healthScoreSubtitle}>Based on your recent activity</Text>
                </View>
                <View style={[styles.healthScoreBadge, { backgroundColor: healthScore.color }]}>
                  <Text style={styles.healthScoreCategory}>{healthScore.category}</Text>
                </View>
              </View>
              <View style={styles.healthScoreContent}>
                <View style={styles.healthScoreCircle}>
                  <Text style={[styles.healthScoreValue, { color: healthScore.color }]}>{healthScore.overall}</Text>
                  <Text style={styles.healthScorePercent}>%</Text>
                </View>
                <ProgressBar
                  progress={healthScore.overall}
                  color={healthScore.color}
                  height={12}
                  style={styles.healthScoreProgress}
                />
              </View>
            </Card>
          )}
        </View>

        {todaysLog ? (
          <>
            {/* Enhanced Today's Overview */}
            <Card style={styles.overviewCard}>
              <View style={styles.overviewHeader}>
                <View style={styles.overviewHeaderLeft}>
                  <Icon name="today" size={24} color={colors.surface} />
                  <Text style={styles.overviewTitle}>Today's Progress</Text>
                </View>
                <TouchableOpacity style={styles.overviewMoreButton}>
                  <Icon name="ellipsis-horizontal" size={20} color={colors.surface} />
                </TouchableOpacity>
              </View>

              <View style={styles.overviewGrid}>
                {[
                  {
                    value: todaysLog.steps.toLocaleString(),
                    label: "Steps",
                    progress: (todaysLog.steps / 10000) * 100,
                    icon: "footsteps",
                  },
                  {
                    value: `${todaysLog.waterIntake}L`,
                    label: "Water",
                    progress: (todaysLog.waterIntake / 2.5) * 100,
                    icon: "water",
                  },
                  {
                    value: `${todaysLog.sleepDuration}h`,
                    label: "Sleep",
                    progress: (todaysLog.sleepDuration / 8) * 100,
                    icon: "bed",
                  },
                  {
                    value: getMoodEmoji(todaysLog.mood),
                    label: "Mood",
                    progress: (todaysLog.mood / 5) * 100,
                    icon: "happy",
                    isEmoji: true,
                  },
                ].map((item, index) => (
                  <View key={index} style={styles.overviewItem}>
                    <View style={styles.overviewItemHeader}>
                      <Icon name={item.icon} size={16} color={colors.surface} />
                      <Text style={styles.overviewLabel}>{item.label}</Text>
                    </View>
                    <Text style={[styles.overviewValue, item.isEmoji && styles.overviewEmoji]}>{item.value}</Text>
                    <View style={styles.overviewProgress}>
                      <ProgressBar
                        progress={Math.min(item.progress, 100)}
                        color={colors.surface}
                        backgroundColor="rgba(255,255,255,0.3)"
                        height={4}
                      />
                    </View>
                  </View>
                ))}
              </View>
            </Card>

            {/* Enhanced Health Analysis */}
            {todaysAnalysis && (
              <Card style={styles.analysisCard}>
                <View style={styles.analysisHeader}>
                  <Text style={styles.analysisTitle}>🔍 Health Analysis</Text>
                  <TouchableOpacity style={styles.analysisInfoButton}>
                    <Icon name="information-circle-outline" size={20} color={colors.primary} />
                  </TouchableOpacity>
                </View>

                <View style={styles.analysisGrid}>
                  {[
                    { key: "steps", data: todaysAnalysis.steps, icon: "footsteps", color: colors.chartSteps },
                    { key: "water", data: todaysAnalysis.water, icon: "water", color: colors.chartWater },
                    { key: "sleep", data: todaysAnalysis.sleep, icon: "bed", color: colors.chartSleep },
                    { key: "heartRate", data: todaysAnalysis.heartRate, icon: "heart", color: colors.chartHeartRate },
                  ].map((item, index) => (
                    <View key={index} style={styles.analysisItem}>
                      <View style={styles.analysisItemHeader}>
                        <View style={[styles.analysisIcon, { backgroundColor: `${item.color}20` }]}>
                          <Icon name={item.icon} size={16} color={item.color} />
                        </View>
                        <Text style={styles.analysisLabel}>{item.key}</Text>
                      </View>
                      <Text style={[styles.analysisStatus, { color: getStatusColor(item.data.score) }]}>
                        {item.data.status}
                      </Text>
                      <ProgressBar
                        progress={item.data.score}
                        color={getStatusColor(item.data.score)}
                        height={6}
                        style={styles.analysisProgress}
                      />
                      <Text style={styles.analysisScore}>{item.data.score}/100</Text>
                    </View>
                  ))}
                </View>
              </Card>
            )}

            {/* Enhanced Metrics Grid */}
            <View style={styles.metricsContainer}>
              <View style={styles.metricsHeader}>
                <Text style={styles.metricsTitle}>📊 Detailed Metrics</Text>
                <TouchableOpacity style={styles.metricsViewAllButton} onPress={()=>navigation.navigate('History')}>
                  <Text style={styles.metricsViewAllText}>View All</Text>
                  <Icon name="chevron-forward" size={16} color={colors.primary} />
                </TouchableOpacity>
              </View>

              <View style={styles.metricsGrid}>
                <MetricCard
                  title="Daily Steps"
                  value={todaysLog.steps}
                  unit=""
                  icon="footsteps"
                  color={colors.chartSteps}
                  target={10000}
                  subtitle={todaysAnalysis?.steps.recommendation}
                />

                <MetricCard
                  title="Water Intake"
                  value={todaysLog.waterIntake.toFixed(1)}
                  unit="L"
                  icon="water"
                  color={colors.chartWater}
                  target={2.5}
                  subtitle={todaysAnalysis?.water.recommendation}
                />

                <MetricCard
                  title="Sleep Duration"
                  value={todaysLog.sleepDuration.toFixed(1)}
                  unit="h"
                  icon="bed"
                  color={colors.chartSleep}
                  target={8}
                  subtitle={todaysAnalysis?.sleep.recommendation}
                />

                <MetricCard
                  title="Heart Rate"
                  value={todaysLog.heartRate}
                  unit="BPM"
                  icon="heart"
                  color={colors.chartHeartRate}
                  subtitle={todaysAnalysis?.heartRate.recommendation}
                />
              </View>
            </View>

            {/* Enhanced Trends Section */}
            {trendAnalysis && (
              <Card style={styles.trendsCard}>
                <View style={styles.trendsHeader}>
                  <Text style={styles.trendsTitle}>📈 Weekly Trends</Text>
                  <View style={styles.trendsLegend}>
                    <View style={styles.trendsLegendItem}>
                      <Icon name="trending-up" size={12} color={colors.success} />
                      <Text style={styles.trendsLegendText}>Improving</Text>
                    </View>
                    <View style={styles.trendsLegendItem}>
                      <Icon name="trending-down" size={12} color={colors.error} />
                      <Text style={styles.trendsLegendText}>Declining</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.trendsGrid}>
                  {[
                    { key: "steps", data: trendAnalysis.steps, icon: "footsteps", color: colors.chartSteps },
                    { key: "water", data: trendAnalysis.water, icon: "water", color: colors.chartWater },
                    { key: "sleep", data: trendAnalysis.sleep, icon: "bed", color: colors.chartSleep },
                    { key: "heartRate", data: trendAnalysis.heartRate, icon: "heart", color: colors.chartHeartRate },
                  ].map((item, index) => (
                    <View key={index} style={styles.trendItem}>
                      <View style={styles.trendItemHeader}>
                        <Icon name={item.icon} size={16} color={item.color} />
                        <Text style={styles.trendLabel}>{item.key}</Text>
                      </View>
                      <View style={styles.trendValue}>
                        <Icon
                          name={item.data.trend === "up" ? "trending-up" : "trending-down"}
                          size={16}
                          color={item.data.trend === "up" ? colors.success : colors.error}
                        />
                        <Text
                          style={[
                            styles.trendPercentage,
                            { color: item.data.trend === "up" ? colors.success : colors.error },
                          ]}
                        >
                          {Math.abs(item.data.change).toFixed(1)}%
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </Card>
            )}
          </>
        ) : (
          <Card style={styles.noDataCard}>
            <View style={styles.noDataContent}>
              <View style={styles.noDataIcon}>
                <Icon name="analytics-outline" size={64} color={colors.textSecondary} />
              </View>
              <Text style={styles.noDataTitle}>Start Your Health Journey! 🚀</Text>
              <Text style={styles.noDataText}>
                Begin tracking your daily health metrics to unlock personalized insights and achieve your wellness
                goals.
              </Text>
              <Button
                title="Log Your First Entry"
                onPress={() => {
                  /* Navigate to Log Data screen */
                }}
                style={styles.noDataButton}
              />
            </View>
          </Card>
        )}

        {/* Enhanced Health Tips */}
        <Card style={styles.tipsCard}>
          <View style={styles.tipsHeader}>
            <Text style={styles.tipsTitle}>💡 Daily Health Tips</Text>
            <TouchableOpacity style={styles.tipsRefreshButton}>
              <Icon name="refresh" size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.tipsList}>
            {[
              {
                icon: "footsteps",
                color: colors.chartSteps,
                text: "Take the stairs instead of elevators to boost your daily steps",
              },
              {
                icon: "water",
                color: colors.chartWater,
                text: "Start your day with a glass of water to kickstart hydration",
              },
              {
                icon: "bed",
                color: colors.chartSleep,
                text: "Create a bedtime routine 1 hour before sleep for better rest",
              },
              {
                icon: "heart",
                color: colors.chartHeartRate,
                text: "Check your pulse after exercise to monitor heart health",
              },
            ].map((tip, index) => (
              <View key={index} style={styles.tipItem}>
                <View style={[styles.tipIcon, { backgroundColor: `${tip.color}20` }]}>
                  <Icon name={tip.icon} size={16} color={tip.color} />
                </View>
                <Text style={styles.tipText}>{tip.text}</Text>
              </View>
            ))}
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  )
}

// Helper functions remain the same
const getTimeOfDay = () => {
  const hour = new Date().getHours()
  if (hour < 12) return "Morning"
  if (hour < 17) return "Afternoon"
  return "Evening"
}

const getStatusColor = (score: number) => {
  if (score >= 90) return colors.success
  if (score >= 75) return colors.primary
  if (score >= 60) return colors.warning
  return colors.error
}

// Styles remain the same as before
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
    backgroundColor: colors.background,
  },
  loadingIcon: {
    marginBottom: dimensions.spacing.lg,
  },
  loadingText: {
    fontSize: dimensions.fontSize.body,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  header: {
    backgroundColor: colors.surface,
    paddingTop: dimensions.spacing.lg,
    paddingHorizontal: dimensions.spacing.lg,
    paddingBottom: dimensions.spacing.xl,
    borderBottomLeftRadius: dimensions.borderRadius.xl,
    borderBottomRightRadius: dimensions.borderRadius.xl,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: dimensions.spacing.xl,
  },
  headerLeft: {
    flex: 1,
  },
  greetingText: {
    fontSize: dimensions.fontSize.headline,
    fontWeight: "800",
    color: colors.textPrimary,
    marginBottom: dimensions.spacing.xs,
  },
  dateText: {
    fontSize: dimensions.fontSize.body,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  profileButton: {
    position: "relative",
  },
  profileAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  notificationBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.error,
    alignItems: "center",
    justifyContent: "center",
  },
  notificationText: {
    fontSize: 10,
    fontWeight: "bold",
    color: colors.surface,
  },
  quickActionsContainer: {
    marginBottom: dimensions.spacing.xl,
  },
  quickActionsTitle: {
    fontSize: dimensions.fontSize.body,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: dimensions.spacing.md,
  },
  quickActionsScroll: {
    marginHorizontal: -dimensions.spacing.lg,
    paddingHorizontal: dimensions.spacing.lg,
  },
  quickActionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: dimensions.spacing.md,
    paddingHorizontal: dimensions.spacing.lg,
    borderRadius: dimensions.borderRadius.full,
    marginRight: dimensions.spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionText: {
    fontSize: dimensions.fontSize.caption,
    fontWeight: "600",
    marginLeft: dimensions.spacing.sm,
  },
  healthScoreCard: {
    backgroundColor: colors.surfaceSecondary,
    padding: dimensions.spacing.xl,
    marginHorizontal: 0,
    borderRadius: dimensions.borderRadius.xl,
  },
  healthScoreHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: dimensions.spacing.lg,
  },
  healthScoreLeft: {
    flex: 1,
  },
  healthScoreTitle: {
    fontSize: dimensions.fontSize.title,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: dimensions.spacing.xs,
  },
  healthScoreSubtitle: {
    fontSize: dimensions.fontSize.caption,
    color: colors.textSecondary,
  },
  healthScoreBadge: {
    paddingHorizontal: dimensions.spacing.md,
    paddingVertical: dimensions.spacing.sm,
    borderRadius: dimensions.borderRadius.full,
  },
  healthScoreCategory: {
    fontSize: dimensions.fontSize.caption,
    fontWeight: "700",
    color: colors.surface,
  },
  healthScoreContent: {
    alignItems: "center",
  },
  healthScoreCircle: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: dimensions.spacing.lg,
  },
  healthScoreValue: {
    fontSize: 48,
    fontWeight: "900",
  },
  healthScorePercent: {
    fontSize: dimensions.fontSize.title,
    fontWeight: "600",
    color: colors.textSecondary,
    marginLeft: dimensions.spacing.xs,
  },
  healthScoreProgress: {
    width: "100%",
  },
  overviewCard: {
    backgroundColor: colors.primary,
    marginHorizontal: dimensions.spacing.lg,
    marginTop: dimensions.spacing.xl,
    padding: dimensions.spacing.md,
    borderRadius: dimensions.borderRadius.xl,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  overviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: dimensions.spacing.xl,
  },
  overviewHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  overviewTitle: {
    fontSize: dimensions.fontSize.title,
    fontWeight: "700",
    color: colors.surface,
    marginLeft: dimensions.spacing.sm,
  },
  overviewMoreButton: {
    padding: dimensions.spacing.sm,
    borderRadius: dimensions.borderRadius.md,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  overviewGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  overviewItem: {
    alignItems: "center",
    flex: 1,
    paddingHorizontal: dimensions.spacing.xs,
  },
  overviewItemHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: dimensions.spacing.sm,
  },
  overviewLabel: {
    fontSize: dimensions.fontSize.caption,
    color: colors.surface,
    opacity: 0.9,
    marginLeft: dimensions.spacing.xs,
    fontWeight: "500",
  },
  overviewValue: {
    fontSize: dimensions.fontSize.title,
    fontWeight: "800",
    color: colors.surface,
    marginBottom: dimensions.spacing.sm,
  },
  overviewEmoji: {
    fontSize: 24,
  },
  overviewProgress: {
    width: "100%",
  },
  analysisCard: {
    marginHorizontal: dimensions.spacing.lg,
    marginTop: dimensions.spacing.xl,
    padding: dimensions.spacing.xl,
    borderRadius: dimensions.borderRadius.xl,
  },
  analysisHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: dimensions.spacing.xl,
  },
  analysisTitle: {
    fontSize: dimensions.fontSize.title,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  analysisInfoButton: {
    padding: dimensions.spacing.sm,
  },
  analysisGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  analysisItem: {
    width: "48%",
    padding: dimensions.spacing.lg,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: dimensions.borderRadius.lg,
    marginBottom: dimensions.spacing.md,
  },
  analysisItemHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: dimensions.spacing.md,
  },
  analysisIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: dimensions.spacing.sm,
  },
  analysisLabel: {
    fontSize: dimensions.fontSize.caption,
    fontWeight: "600",
    color: colors.textSecondary,
    textTransform: "capitalize",
  },
  analysisStatus: {
    fontSize: dimensions.fontSize.body,
    fontWeight: "700",
    marginBottom: dimensions.spacing.sm,
  },
  analysisProgress: {
    marginBottom: dimensions.spacing.sm,
  },
  analysisScore: {
    fontSize: dimensions.fontSize.caption,
    color: colors.textSecondary,
    textAlign: "right",
    fontWeight: "500",
  },
  metricsContainer: {
    marginTop: dimensions.spacing.xl,
  },
  metricsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: dimensions.spacing.lg,
    marginBottom: dimensions.spacing.lg,
  },
  metricsTitle: {
    fontSize: dimensions.fontSize.title,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  metricsViewAllButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  metricsViewAllText: {
    fontSize: dimensions.fontSize.body,
    color: colors.primary,
    fontWeight: "600",
    marginRight: dimensions.spacing.xs,
  },
  metricsGrid: {
    paddingHorizontal: 10,

  },
  trendsCard: {
    marginHorizontal: dimensions.spacing.lg,
    marginTop: dimensions.spacing.xl,
    padding: dimensions.spacing.xl,
    borderRadius: dimensions.borderRadius.xl,
  },
  trendsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: dimensions.spacing.xl,
  },
  trendsTitle: {
    fontSize: dimensions.fontSize.title,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  trendsLegend: {
    flexDirection: "row",
    gap: dimensions.spacing.md,
  },
  trendsLegendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  trendsLegendText: {
    fontSize: dimensions.fontSize.caption,
    color: colors.textSecondary,
    marginLeft: dimensions.spacing.xs,
  },
  trendsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  trendItem: {
    width: "48%",
    alignItems: "center",
    padding: dimensions.spacing.lg,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: dimensions.borderRadius.lg,
    marginBottom: dimensions.spacing.md,
  },
  trendItemHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: dimensions.spacing.md,
  },
  trendLabel: {
    fontSize: dimensions.fontSize.caption,
    fontWeight: "600",
    color: colors.textSecondary,
    marginLeft: dimensions.spacing.sm,
    textTransform: "capitalize",
  },
  trendValue: {
    flexDirection: "row",
    alignItems: "center",
  },
  trendPercentage: {
    fontSize: dimensions.fontSize.body,
    fontWeight: "700",
    marginLeft: dimensions.spacing.xs,
  },
  noDataCard: {
    alignItems: "center",
    paddingVertical: dimensions.spacing.xxl * 2,
    marginHorizontal: dimensions.spacing.lg,
    marginTop: dimensions.spacing.xl,
    borderRadius: dimensions.borderRadius.xl,
  },
  noDataContent: {
    alignItems: "center",
    paddingHorizontal: dimensions.spacing.xl,
  },
  noDataIcon: {
    marginBottom: dimensions.spacing.xl,
    opacity: 0.6,
  },
  noDataTitle: {
    fontSize: dimensions.fontSize.headline,
    fontWeight: "800",
    color: colors.textPrimary,
    marginBottom: dimensions.spacing.md,
    textAlign: "center",
  },
  noDataText: {
    fontSize: dimensions.fontSize.body,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: dimensions.spacing.xl,
  },
  noDataButton: {
    paddingHorizontal: dimensions.spacing.xl,
  },
  tipsCard: {
    marginHorizontal: dimensions.spacing.lg,
    marginTop: dimensions.spacing.xl,
    marginBottom: dimensions.spacing.xxl,
    padding: dimensions.spacing.xl,
    borderRadius: dimensions.borderRadius.xl,
  },
  tipsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: dimensions.spacing.xl,
  },
  tipsTitle: {
    fontSize: dimensions.fontSize.title,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  tipsRefreshButton: {
    padding: dimensions.spacing.sm,
  },
  tipsList: {
    gap: dimensions.spacing.lg,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  tipIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: dimensions.spacing.md,
  },
  tipText: {
    fontSize: dimensions.fontSize.body,
    color: colors.textSecondary,
    lineHeight: 22,
    flex: 1,
    fontWeight: "500",
  },
})

export default HomeScreen
