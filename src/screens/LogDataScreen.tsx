"use client"

import React, { useState, useRef } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Animated,
  TouchableOpacity,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Icon } from "../components/common/Icon"
import { Card } from "../components/common/Card"
import { AnimatedInput } from "../components/common/AnimatedInput"
import { Button } from "../components/common/Button"
import { SuccessAnimation } from "../components/common/SuccessAnimation"
import { useHealthData } from "../hooks/useHealthData"
import { colors } from "../constants/colors"
import { dimensions } from "../constants/dimensions"
import type { HealthMetrics } from "../types/health"

const LogDataScreen: React.FC = () => {
  const { useTodaysLog, useCreateHealthLog, useUpdateHealthLog } = useHealthData()
  const { data: todaysLog } = useTodaysLog()
  const createMutation = useCreateHealthLog()
  const updateMutation = useUpdateHealthLog()

  const [formData, setFormData] = useState<HealthMetrics>({
    steps: 0,
    waterIntake: 0,
    sleepDuration: 0,
    heartRate: 0,
    weight: 0,
    bloodPressure: { systolic: 0, diastolic: 0 },
    mood: 3,
    calories: 0,
    exercise: "",
    notes: "",
  })

  const [errors, setErrors] = useState<Partial<Record<keyof HealthMetrics, string>>>({})
  const [showSuccess, setShowSuccess] = useState(false)
  const fadeAnim = useRef(new Animated.Value(1)).current

  // Exercise suggestions
  const exerciseSuggestions = [
    "30 min walk",
    "45 min jogging",
    "Gym workout",
    "Yoga session",
    "Swimming",
    "Cycling",
    "Weight training",
    "Cardio workout",
    "Rest day",
  ]

  React.useEffect(() => {
    if (todaysLog) {
      setFormData({
        steps: todaysLog.steps,
        waterIntake: todaysLog.waterIntake,
        sleepDuration: todaysLog.sleepDuration,
        heartRate: todaysLog.heartRate,
        weight: todaysLog.weight,
        bloodPressure: todaysLog.bloodPressure,
        mood: todaysLog.mood,
        calories: todaysLog.calories,
        exercise: todaysLog.exercise,
        notes: todaysLog.notes,
      })
    }
  }, [todaysLog])

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof HealthMetrics, string>> = {}

    if (formData.steps < 0 || formData.steps > 100000) {
      newErrors.steps = "Steps must be between 0 and 100,000"
    }
    if (formData.waterIntake < 0 || formData.waterIntake > 10) {
      newErrors.waterIntake = "Water intake must be between 0 and 10 liters"
    }
    if (formData.sleepDuration < 0 || formData.sleepDuration > 24) {
      newErrors.sleepDuration = "Sleep duration must be between 0 and 24 hours"
    }
    if (formData.heartRate < 0 || formData.heartRate > 300) {
      newErrors.heartRate = "Heart rate must be between 0 and 300 BPM"
    }
    if (formData.weight < 0 || formData.weight > 500) {
      newErrors.weight = "Weight must be between 0 and 500 kg"
    }
    if (formData.calories < 0 || formData.calories > 10000) {
      newErrors.calories = "Calories must be between 0 and 10,000"
    }
    if (formData.bloodPressure.systolic < 0 || formData.bloodPressure.systolic > 300) {
      newErrors.bloodPressure = "Invalid blood pressure values"
    }
    if (formData.bloodPressure.diastolic < 0 || formData.bloodPressure.diastolic > 200) {
      newErrors.bloodPressure = "Invalid blood pressure values"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const clearForm = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setFormData({
        steps: 0,
        waterIntake: 0,
        sleepDuration: 0,
        heartRate: 0,
        weight: 0,
        bloodPressure: { systolic: 0, diastolic: 0 },
        mood: 3,
        calories: 0,
        exercise: "",
        notes: "",
      })
      setErrors({})

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start()
    })
  }

  const handleSave = async () => {
    if (!validateForm()) {
      return
    }

    try {
      const today = new Date().toISOString().split("T")[0]

      if (todaysLog) {
        await updateMutation.mutateAsync({
          id: todaysLog.id,
          data: formData,
        })
        setShowSuccess(true)
      } else {
        await createMutation.mutateAsync({
          date: today,
          ...formData,
        })
        setShowSuccess(true)
        clearForm()
      }
    } catch (error) {
      Alert.alert("Error", "Failed to save health data. Please try again.")
    }
  }

  const updateField = (field: keyof HealthMetrics, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }))
    }
  }

  const isLoading = createMutation.isPending || updateMutation.isPending

  const getMoodEmoji = (mood: number) => {
    const moods = ["😢", "😞", "😐", "😊", "😄"]
    return moods[mood - 1] || "😐"
  }

  const getMoodText = (mood: number) => {
    const moods = ["Very Bad", "Bad", "Neutral", "Good", "Excellent"]
    return moods[mood - 1] || "Neutral"
  }

  return (
    <SafeAreaView style={styles.container}>
      <SuccessAnimation
        visible={showSuccess}
        message={todaysLog ? "Data updated successfully!" : "Data saved successfully!"}
        onComplete={() => setShowSuccess(false)}
      />

      <KeyboardAvoidingView style={styles.keyboardAvoid} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{todaysLog ? "Update Today's Data" : "Log Today's Health Data"}</Text>
            <Text style={styles.subtitle}>Track your daily health metrics for better insights</Text>
          </View>

          <Animated.View style={{ opacity: fadeAnim }}>
            {/* Activity & Movement Section */}
            <Card style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <View style={[styles.sectionIcon, { backgroundColor: `${colors.chartSteps}20` }]}>
                  <Icon name="fitness" size={24} color={colors.chartSteps} />
                </View>
                <Text style={styles.sectionTitle}>Activity & Movement</Text>
              </View>

              <AnimatedInput
                // label="Daily Steps"
                placeholder="Enter steps taken"
                value={formData.steps > 0 ? formData.steps.toString() : ""}
                onChangeText={(value) => updateField("steps", Number.parseInt(value) || 0)}
                inputType="number"
                icon="footsteps"
                error={errors.steps}
                suggestions={["5000", "7500", "10000", "12500", "15000"]}
                onSuggestionPress={(value) => updateField("steps", Number.parseInt(value))}
              />

              <AnimatedInput
                // label="Exercise Activity"
                placeholder="e.g., 30 min jogging, gym workout"
                value={formData.exercise}
                onChangeText={(value) => updateField("exercise", value)}
                icon="barbell"
                suggestions={exerciseSuggestions}
                onSuggestionPress={(value) => updateField("exercise", value)}
              />

              <AnimatedInput
                // label="Calories Consumed"
                placeholder="Enter calories"
                value={formData.calories > 0 ? formData.calories.toString() : ""}
                onChangeText={(value) => updateField("calories", Number.parseInt(value) || 0)}
                inputType="number"
                icon="flame"
                suffix="kcal"
                error={errors.calories}
                suggestions={["1500", "1800", "2000", "2200", "2500"]}
                onSuggestionPress={(value) => updateField("calories", Number.parseInt(value))}
              />
            </Card>

            {/* Health Vitals Section */}
            <Card style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <View style={[styles.sectionIcon, { backgroundColor: `${colors.chartHeartRate}20` }]}>
                  <Icon name="heart" size={24} color={colors.chartHeartRate} />
                </View>
                <Text style={styles.sectionTitle}>Health Vitals</Text>
              </View>

              <AnimatedInput
                label={formData.heartRate > 0 ? "":"Heart Rate"}
                placeholder="Enter heart rate"
                value={formData.heartRate > 0 ? formData.heartRate.toString() : ""}
                onChangeText={(value) => updateField("heartRate", Number.parseInt(value) || 0)}
                inputType="number"
                icon="pulse"
                suffix="BPM"
                error={errors.heartRate}
                // style={{marginTop:"10px"}}
                suggestions={["60", "70", "80", "90", "100"]}
                onSuggestionPress={(value) => updateField("heartRate", Number.parseInt(value))}
              />

              <AnimatedInput
                label={formData.weight > 0 ? "":"Weight"}
                placeholder="Enter weight"
                value={formData.weight > 0 ? formData.weight.toString() : ""}
                onChangeText={(value) => updateField("weight", Number.parseFloat(value) || 0)}
                inputType="decimal"
                icon="fitness"
                suffix="kg"
                error={errors.weight}
              />

              <View style={styles.bloodPressureContainer}>
                <Text style={styles.bloodPressureLabel}>Blood Pressure</Text>
                <View style={styles.bloodPressureRow}>
                  <AnimatedInput
                    placeholder="Systolic"
                    value={formData.bloodPressure.systolic > 0 ? formData.bloodPressure.systolic.toString() : ""}
                    onChangeText={(value) =>
                      updateField("bloodPressure", {
                        ...formData.bloodPressure,
                        systolic: Number.parseInt(value) || 0,
                      })
                    }
                    inputType="number"
                    containerStyle={styles.bloodPressureInput}
                    suggestions={["110", "120", "130", "140"]}
                    onSuggestionPress={(value) =>
                      updateField("bloodPressure", {
                        ...formData.bloodPressure,
                        systolic: Number.parseInt(value),
                      })
                    }
                  />
                  <Text style={styles.bloodPressureSeparator}>/</Text>
                  <AnimatedInput
                    placeholder="Diastolic"
                    value={formData.bloodPressure.diastolic > 0 ? formData.bloodPressure.diastolic.toString() : ""}
                    onChangeText={(value) =>
                      updateField("bloodPressure", {
                        ...formData.bloodPressure,
                        diastolic: Number.parseInt(value) || 0,
                      })
                    }
                    inputType="number"
                    containerStyle={styles.bloodPressureInput}
                    suggestions={["70", "80", "90", "100"]}
                    onSuggestionPress={(value) =>
                      updateField("bloodPressure", {
                        ...formData.bloodPressure,
                        diastolic: Number.parseInt(value),
                      })
                    }
                  />
                </View>
                {errors.bloodPressure && <Text style={styles.errorText}>{errors.bloodPressure}</Text>}
              </View>
            </Card>

            {/* Lifestyle & Wellness Section */}
            <Card style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <View style={[styles.sectionIcon, { backgroundColor: `${colors.chartWater}20` }]}>
                  <Icon name="water" size={24} color={colors.chartWater} />
                </View>
                <Text style={styles.sectionTitle}>Lifestyle & Wellness</Text>
              </View>

              <AnimatedInput
                // label="Water Intake"
                placeholder="Enter water intake"
                value={formData.waterIntake > 0 ? formData.waterIntake.toString() : ""}
                onChangeText={(value) => updateField("waterIntake", Number.parseFloat(value) || 0)}
                inputType="decimal"
                icon="water"
                suffix="L"
                error={errors.waterIntake}
                suggestions={["1.5", "2.0", "2.5", "3.0", "3.5"]}
                onSuggestionPress={(value) => updateField("waterIntake", Number.parseFloat(value))}
              />

              <AnimatedInput
                // label="Sleep Duration"
                placeholder="Enter sleep hours"
                value={formData.sleepDuration > 0 ? formData.sleepDuration.toString() : ""}
                onChangeText={(value) => updateField("sleepDuration", Number.parseFloat(value) || 0)}
                inputType="decimal"
                icon="bed"
                suffix="h"
                error={errors.sleepDuration}
                suggestions={["6.0", "7.0", "7.5", "8.0", "8.5"]}
                onSuggestionPress={(value) => updateField("sleepDuration", Number.parseFloat(value))}
              />

              {/* Mood Selector */}
              <View style={styles.moodContainer}>
                <Text style={styles.moodLabel}>Mood Rating</Text>
                <View style={styles.moodSelector}>
                  {[1, 2, 3, 4, 5].map((mood) => (
                    <TouchableOpacity
                      key={mood}
                      style={[styles.moodButton, formData.mood === mood && styles.moodButtonActive]}
                      onPress={() => updateField("mood", mood)}
                    >
                      <Text style={styles.moodEmoji}>{getMoodEmoji(mood)}</Text>
                      <Text style={[styles.moodNumber, formData.mood === mood && styles.moodNumberActive]}>{mood}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <Text style={styles.moodText}>
                  Current: {getMoodText(formData.mood)} ({formData.mood}/5)
                </Text>
              </View>
            </Card>

            {/* Notes Section */}
            <Card style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <View style={[styles.sectionIcon, { backgroundColor: `${colors.textSecondary}20` }]}>
                  <Icon name="document-text" size={24} color={colors.textSecondary} />
                </View>
                <Text style={styles.sectionTitle}>Notes & Observations</Text>
              </View>

              <AnimatedInput
                label="Daily Notes"
                placeholder="How are you feeling today? Any observations about your health..."
                value={formData.notes}
                onChangeText={(value) => updateField("notes", value)}
                multiline
                numberOfLines={4}
                style={styles.notesInput}
                icon="create"
              />
            </Card>

            {/* Summary Card */}
            <Card style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>📋 Today's Summary</Text>
              <View style={styles.summaryGrid}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Steps</Text>
                  <Text style={styles.summaryValue}>{formData.steps > 0 ? formData.steps.toLocaleString() : "-"}</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Water</Text>
                  <Text style={styles.summaryValue}>{formData.waterIntake > 0 ? `${formData.waterIntake}L` : "-"}</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Sleep</Text>
                  <Text style={styles.summaryValue}>
                    {formData.sleepDuration > 0 ? `${formData.sleepDuration}h` : "-"}
                  </Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Heart Rate</Text>
                  <Text style={styles.summaryValue}>{formData.heartRate > 0 ? `${formData.heartRate} BPM` : "-"}</Text>
                </View>
              </View>
            </Card>
          </Animated.View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            {!todaysLog && (
              <Button title="Clear Form" onPress={clearForm} variant="outline" style={styles.clearButton} />
            )}
            <Button
              title={todaysLog ? "Update Data" : "Save Data"}
              onPress={handleSave}
              loading={isLoading}
              style={styles.saveButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

// Styles remain the same as before
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: dimensions.spacing.xxl,
  },
  header: {
    paddingHorizontal: dimensions.spacing.lg,
    paddingVertical: dimensions.spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  title: {
    fontSize: dimensions.fontSize.headline,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: dimensions.spacing.xs,
  },
  subtitle: {
    fontSize: dimensions.fontSize.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  sectionCard: {
    marginHorizontal: dimensions.spacing.lg,
    marginTop: dimensions.spacing.lg,
    padding: dimensions.spacing.xl,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: dimensions.spacing.xl,
  },
  sectionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: dimensions.spacing.md,
  },
  sectionTitle: {
    fontSize: dimensions.fontSize.title,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  bloodPressureContainer: {
    marginBottom: dimensions.spacing.lg,
  },
  bloodPressureLabel: {
    fontSize: dimensions.fontSize.body,
    fontWeight: "500",
    color: colors.textPrimary,
    marginBottom: dimensions.spacing.md,
  },
  bloodPressureRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  bloodPressureInput: {
    flex: 1,
    marginBottom: 0,
  },
  bloodPressureSeparator: {
    fontSize: dimensions.fontSize.headline,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginHorizontal: dimensions.spacing.md,
    marginTop: -dimensions.spacing.md,
  },
  moodContainer: {
    marginBottom: dimensions.spacing.lg,
  },
  moodLabel: {
    fontSize: dimensions.fontSize.body,
    fontWeight: "500",
    color: colors.textPrimary,
    marginBottom: dimensions.spacing.md,
    
  },
  moodSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: dimensions.spacing.md,
    padding:"30px"
  },
  moodButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: dimensions.spacing.md,
    marginHorizontal: dimensions.spacing.xs,
    borderRadius: dimensions.borderRadius.lg,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 2,
    borderColor: "transparent",

  },
  moodButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  moodEmoji: {
    fontSize: 24,
    marginBottom: dimensions.spacing.xs,
  },
  moodNumber: {
    fontSize: dimensions.fontSize.caption,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  moodNumberActive: {
    color: colors.surface,
  },
  moodText: {
    fontSize: dimensions.fontSize.body,
    color: colors.textSecondary,
    textAlign: "center",
    fontWeight: "500",
  },
  notesInput: {
    height: 120,
    textAlignVertical: "top",
    paddingTop: 28,
  },
  summaryCard: {
    marginHorizontal: dimensions.spacing.lg,
    marginTop: dimensions.spacing.lg,
    padding: dimensions.spacing.xl,
    backgroundColor: colors.surfaceSecondary,
  },
  summaryTitle: {
    fontSize: dimensions.fontSize.title,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: dimensions.spacing.lg,
    textAlign: "center",
  },
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  summaryItem: {
    width: "48%",
    alignItems: "center",
    paddingVertical: dimensions.spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: dimensions.borderRadius.lg,
    marginBottom: dimensions.spacing.md,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  summaryLabel: {
    fontSize: dimensions.fontSize.caption,
    color: colors.textSecondary,
    marginBottom: dimensions.spacing.xs,
    fontWeight: "500",
  },
  summaryValue: {
    fontSize: dimensions.fontSize.body,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  buttonContainer: {
    flexDirection: "row",
    paddingHorizontal: dimensions.spacing.lg,
    paddingTop: dimensions.spacing.xl,
    gap: dimensions.spacing.md,
  },
  clearButton: {
    flex: 1,
  },
  saveButton: {
    flex: 2,
  },
  errorText: {
    fontSize: dimensions.fontSize.caption,
    color: colors.error,
    marginTop: dimensions.spacing.sm,
    marginLeft: dimensions.spacing.xs,
  },
})

export default LogDataScreen
