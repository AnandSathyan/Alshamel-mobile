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
import LinearGradient from "react-native-linear-gradient"
import { Icon } from "../components/common/Icon"
import { ProfessionalCard } from "../components/common/ProfessionalCard"
import { ProfessionalHeader } from "../components/common/ProfessionalHeader"
import { AnimatedInput } from "../components/common/AnimatedInput"
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

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
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

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }))
    }
  }

  // Helper function to handle suggestion selection with proper type conversion
  const handleSuggestionPress = (
    field: keyof HealthMetrics,
    value: string,
    type: "number" | "float" | "string" = "string",
  ) => {
    let convertedValue: any = value

    switch (type) {
      case "number":
        convertedValue = Number.parseInt(value) || 0
        break
      case "float":
        convertedValue = Number.parseFloat(value) || 0
        break
      case "string":
      default:
        convertedValue = value
        break
    }

    updateField(field, convertedValue)
  }

  const isLoading = createMutation.isPending || updateMutation.isPending

  const getMoodEmoji = (mood: number) => {
    const moods = ["😢", "😞", "😐", "😊", "😄"]
    return moods[mood - 1] || "😐"
  }

  const getMoodLabel = (mood: number) => {
    const labels = ["Very Bad", "Bad", "Neutral", "Good", "Excellent"]
    return labels[mood - 1] || "Neutral"
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
          keyboardShouldPersistTaps="handled"
        >
          {/* Professional Header */}
          <ProfessionalHeader
            title="Health Tracker"
            subtitle={todaysLog ? "Update your daily metrics" : "Log your daily health data"}
            showNotifications={false}
          />

          <Animated.View style={{ opacity: fadeAnim }}>
            {/* Quick Overview Cards */}
            <View style={styles.overviewSection}>
              <Text style={styles.sectionTitle}>Today's Overview</Text>
              <View style={styles.overviewGrid}>
                {[
                  {
                    icon: "footsteps",
                    label: "Steps",
                    value: formData.steps > 0 ? formData.steps.toLocaleString() : "0",
                    gradient: colors.gradientSuccess,
                  },
                  {
                    icon: "water",
                    label: "Water",
                    value: formData.waterIntake > 0 ? `${formData.waterIntake}L` : "0L",
                    gradient: colors.gradientInfo,
                  },
                  {
                    icon: "bed",
                    label: "Sleep",
                    value: formData.sleepDuration > 0 ? `${formData.sleepDuration}h` : "0h",
                    gradient: colors.gradientPrimary,
                  },
                  {
                    icon: "heart",
                    label: "Heart Rate",
                    value: formData.heartRate > 0 ? `${formData.heartRate}` : "0",
                    gradient: ["#EF4444", "#F87171"],
                  },
                ].map((item, index) => (
                  <ProfessionalCard key={index} gradient={item.gradient} style={styles.overviewCard} glassEffect>
                    <View style={styles.overviewCardContent}>
                      <Icon name={item.icon} size={24} color={colors.textPrimary} />
                      <Text style={styles.overviewValue}>{item.value}</Text>
                      <Text style={styles.overviewLabel}>{item.label}</Text>
                    </View>
                  </ProfessionalCard>
                ))}
              </View>
            </View>

            {/* Activity & Movement Section */}
            <View style={styles.inputSection}>
              <ProfessionalCard style={styles.sectionCard} glassEffect elevation="lg">
                <View style={styles.sectionHeader}>
                  <View style={[styles.sectionIcon, { backgroundColor: colors.successGlow }]}>
                    <Icon name="fitness" size={24} color={colors.success} />
                  </View>
                  <View style={styles.sectionTitleContainer}>
                    <Text style={styles.sectionCardTitle}>Activity & Movement</Text>
                    <Text style={styles.sectionSubtitle}>Track your daily physical activity</Text>
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <AnimatedInput
                    placeholder="Enter steps taken"
                    value={formData.steps > 0 ? formData.steps.toString() : ""}
                    onChangeText={(value) => updateField("steps", Number.parseInt(value) || 0)}
                    inputType="number"
                    icon="footsteps"
                    error={errors.steps}
                    suggestions={["5000", "7500", "10000", "12500", "15000"]}
                    onSuggestionPress={(value) => handleSuggestionPress("steps", value, "number")}
                  />

                  <AnimatedInput
                    placeholder="Enter calories consumed"
                    value={formData.calories > 0 ? formData.calories.toString() : ""}
                    onChangeText={(value) => updateField("calories", Number.parseInt(value) || 0)}
                    inputType="number"
                    icon="flame"
                    suffix="kcal"
                    error={errors.calories}
                    suggestions={["1500", "1800", "2000", "2200", "2500"]}
                    onSuggestionPress={(value) => handleSuggestionPress("calories", value, "number")}
                  />

                  <AnimatedInput
                    placeholder="Exercise activity (e.g., 30 min jogging)"
                    value={formData.exercise}
                    onChangeText={(value) => updateField("exercise", value)}
                    icon="barbell"
                    suggestions={["30 min walk", "45 min jogging", "Gym workout", "Yoga session", "Swimming"]}
                    onSuggestionPress={(value) => handleSuggestionPress("exercise", value, "string")}
                  />
                </View>
              </ProfessionalCard>
            </View>

            {/* Health Vitals Section */}
            <View style={styles.inputSection}>
              <ProfessionalCard style={styles.sectionCard} glassEffect elevation="lg">
                <View style={styles.sectionHeader}>
                  <View style={[styles.sectionIcon, { backgroundColor: colors.errorGlow }]}>
                    <Icon name="heart" size={24} color={colors.error} />
                  </View>
                  <View style={styles.sectionTitleContainer}>
                    <Text style={styles.sectionCardTitle}>Health Vitals</Text>
                    <Text style={styles.sectionSubtitle}>Monitor your vital signs</Text>
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <AnimatedInput
                    placeholder="Enter heart rate"
                    value={formData.heartRate > 0 ? formData.heartRate.toString() : ""}
                    onChangeText={(value) => updateField("heartRate", Number.parseInt(value) || 0)}
                    inputType="number"
                    icon="pulse"
                    suffix="BPM"
                    error={errors.heartRate}
                    suggestions={["60", "70", "80", "90", "100"]}
                    onSuggestionPress={(value) => handleSuggestionPress("heartRate", value, "number")}
                  />

                  <AnimatedInput
                    placeholder="Enter weight"
                    value={formData.weight > 0 ? formData.weight.toString() : ""}
                    onChangeText={(value) => updateField("weight", Number.parseFloat(value) || 0)}
                    inputType="decimal"
                    icon="fitness"
                    suffix="kg"
                    error={errors.weight}
                    suggestions={["50", "60", "70", "80", "90"]}
                    onSuggestionPress={(value) => handleSuggestionPress("weight", value, "float")}
                  />

                  {/* Blood Pressure */}
                  <View style={styles.bloodPressureContainer}>
                    <Text style={styles.inputLabel}>Blood Pressure</Text>
                    <View style={styles.bloodPressureRow}>
                      <View style={styles.bloodPressureInput}>
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
                          containerStyle={styles.bloodPressureInputContainer}
                          suggestions={["110", "120", "130", "140"]}
                          onSuggestionPress={(value) =>
                            updateField("bloodPressure", {
                              ...formData.bloodPressure,
                              systolic: Number.parseInt(value),
                            })
                          }
                        />
                      </View>
                      <Text style={styles.bloodPressureSeparator}>/</Text>
                      <View style={styles.bloodPressureInput}>
                        <AnimatedInput
                          placeholder="Diastolic"
                          value={
                            formData.bloodPressure.diastolic > 0 ? formData.bloodPressure.diastolic.toString() : ""
                          }
                          onChangeText={(value) =>
                            updateField("bloodPressure", {
                              ...formData.bloodPressure,
                              diastolic: Number.parseInt(value) || 0,
                            })
                          }
                          inputType="number"
                          containerStyle={styles.bloodPressureInputContainer}
                          suggestions={["70", "80", "90", "100"]}
                          onSuggestionPress={(value) =>
                            updateField("bloodPressure", {
                              ...formData.bloodPressure,
                              diastolic: Number.parseInt(value),
                            })
                          }
                        />
                      </View>
                    </View>
                    {errors.bloodPressure && <Text style={styles.errorText}>{errors.bloodPressure}</Text>}
                  </View>
                </View>
              </ProfessionalCard>
            </View>

            {/* Lifestyle & Wellness Section */}
            <View style={styles.inputSection}>
              <ProfessionalCard style={styles.sectionCard} glassEffect elevation="lg">
                <View style={styles.sectionHeader}>
                  <View style={[styles.sectionIcon, { backgroundColor: colors.infoGlow }]}>
                    <Icon name="water" size={24} color={colors.info} />
                  </View>
                  <View style={styles.sectionTitleContainer}>
                    <Text style={styles.sectionCardTitle}>Lifestyle & Wellness</Text>
                    <Text style={styles.sectionSubtitle}>Track your daily wellness habits</Text>
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <AnimatedInput
                    placeholder="Enter water intake"
                    value={formData.waterIntake > 0 ? formData.waterIntake.toString() : ""}
                    onChangeText={(value) => updateField("waterIntake", Number.parseFloat(value) || 0)}
                    inputType="decimal"
                    icon="water"
                    suffix="L"
                    error={errors.waterIntake}
                    suggestions={["0.5", "1.0", "1.5", "2.0", "2.5", "3.0", "3.5"]}
                    onSuggestionPress={(value) => handleSuggestionPress("waterIntake", value, "float")}
                  />

                  <AnimatedInput
                    placeholder="Enter sleep hours"
                    value={formData.sleepDuration > 0 ? formData.sleepDuration.toString() : ""}
                    onChangeText={(value) => updateField("sleepDuration", Number.parseFloat(value) || 0)}
                    inputType="decimal"
                    icon="bed"
                    suffix="h"
                    error={errors.sleepDuration}
                    suggestions={["5.0", "6.0", "7.0", "7.5", "8.0", "8.5", "9.0"]}
                    onSuggestionPress={(value) => handleSuggestionPress("sleepDuration", value, "float")}
                  />

                  {/* Professional Mood Selector */}
                  <View style={styles.moodContainer}>
                    <Text style={styles.inputLabel}>Mood Assessment</Text>
                    <Text style={styles.moodSubtitle}>How are you feeling today?</Text>

                    <View style={styles.moodSelector}>
                      {[1, 2, 3, 4, 5].map((mood) => (
                        <TouchableOpacity
                          key={mood}
                          style={[styles.moodButton, formData.mood === mood && styles.moodButtonActive]}
                          onPress={() => updateField("mood", mood)}
                          activeOpacity={0.7}
                        >
                          <LinearGradient
                            colors={
                              formData.mood === mood
                                ? colors.gradientPrimary
                                : [colors.surface, colors.surfaceSecondary]
                            }
                            style={styles.moodButtonGradient}
                          >
                            <Text style={styles.moodEmoji}>{getMoodEmoji(mood)}</Text>
                            <Text style={[styles.moodNumber, formData.mood === mood && styles.moodNumberActive]}>
                              {mood}
                            </Text>
                          </LinearGradient>
                        </TouchableOpacity>
                      ))}
                    </View>

                    <View style={styles.moodFeedback}>
                      <Text style={styles.moodFeedbackText}>
                        Current mood: {getMoodLabel(formData.mood)} ({formData.mood}/5)
                      </Text>
                    </View>
                  </View>
                </View>
              </ProfessionalCard>
            </View>

            {/* Notes Section */}
            <View style={styles.inputSection}>
              <ProfessionalCard style={styles.sectionCard} glassEffect elevation="lg">
                <View style={styles.sectionHeader}>
                  <View style={[styles.sectionIcon, { backgroundColor: colors.warningGlow }]}>
                    <Icon name="document-text" size={24} color={colors.warning} />
                  </View>
                  <View style={styles.sectionTitleContainer}>
                    <Text style={styles.sectionCardTitle}>Daily Notes</Text>
                    <Text style={styles.sectionSubtitle}>Record your thoughts and observations</Text>
                  </View>
                </View>

                <AnimatedInput
                  placeholder="How are you feeling today? Any observations about your health, energy levels, or general wellbeing..."
                  value={formData.notes}
                  onChangeText={(value) => updateField("notes", value)}
                  multiline
                  numberOfLines={4}
                  style={styles.notesInput}
                  icon="create"
                />
              </ProfessionalCard>
            </View>
          </Animated.View>

          {/* Professional Save Button */}
          <View style={styles.saveButtonContainer}>
            <TouchableOpacity
              style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={isLoading ? colors.gradientDark : colors.gradientPrimary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.saveButtonGradient}
              >
                <View style={styles.saveButtonContent}>
                  {isLoading ? (
                    <Icon name="hourglass" size={20} color={colors.textPrimary} />
                  ) : (
                    <Icon name="checkmark-circle" size={20} color={colors.textPrimary} />
                  )}
                  <Text style={styles.saveButtonText}>
                    {isLoading ? "Saving..." : todaysLog ? "Update Health Data" : "Save Health Data"}
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

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
    paddingBottom: dimensions.layout.scrollBottomPadding,
  },
  overviewSection: {
    paddingHorizontal: dimensions.layout.containerPadding,
    paddingTop: dimensions.layout.screenPaddingTop,
    marginBottom: dimensions.layout.sectionSpacing,
  },
  sectionTitle: {
    fontSize: dimensions.fontSize.titleLarge,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: dimensions.spacing.lg,
  },
  overviewGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: dimensions.spacing.md,
  },
  overviewCard: {
    width: "47%",
    minHeight: 100,
  },
  overviewCardContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  overviewValue: {
    fontSize: dimensions.fontSize.titleLarge,
    fontWeight: "800",
    color: colors.textPrimary,
    marginTop: dimensions.spacing.sm,
    marginBottom: dimensions.spacing.xs,
  },
  overviewLabel: {
    fontSize: dimensions.fontSize.body,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  inputSection: {
    paddingHorizontal: dimensions.layout.containerPadding,
    marginBottom: dimensions.spacing.xl,
  },
  sectionCard: {
    padding: dimensions.spacing.xl,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: dimensions.spacing.xl,
  },
  sectionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginRight: dimensions.spacing.lg,
  },
  sectionTitleContainer: {
    flex: 1,
  },
  sectionCardTitle: {
    fontSize: dimensions.fontSize.title,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: dimensions.spacing.xs,
  },
  sectionSubtitle: {
    fontSize: dimensions.fontSize.body,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  inputGroup: {
    gap: dimensions.spacing.lg,
  },
  inputLabel: {
    fontSize: dimensions.fontSize.bodyLarge,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: dimensions.spacing.md,
  },
  bloodPressureContainer: {
    marginTop: dimensions.spacing.md,
  },
  bloodPressureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: dimensions.spacing.md,
  },
  bloodPressureInput: {
    flex: 1,
  },
  bloodPressureInputContainer: {
    marginBottom: 0,
  },
  bloodPressureSeparator: {
    fontSize: dimensions.fontSize.headlineLarge,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  errorText: {
    fontSize: dimensions.fontSize.caption,
    color: colors.error,
    marginTop: dimensions.spacing.sm,
    fontWeight: "500",
  },
  moodContainer: {
    marginTop: dimensions.spacing.lg,
  },
  moodSubtitle: {
    fontSize: dimensions.fontSize.body,
    color: colors.textTertiary,
    marginBottom: dimensions.spacing.lg,
  },
  moodSelector: {
    flexDirection: "row",
    gap: dimensions.spacing.sm,
    marginBottom: dimensions.spacing.lg,
  },
  moodButton: {
    flex: 1,
    borderRadius: dimensions.borderRadius.lg,
    overflow: "hidden",
  },
  moodButtonActive: {
    transform: [{ scale: 1.05 }],
  },
  moodButtonGradient: {
    alignItems: "center",
    paddingVertical: dimensions.spacing.lg,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  moodEmoji: {
    fontSize: 28,
    marginBottom: dimensions.spacing.sm,
  },
  moodNumber: {
    fontSize: dimensions.fontSize.body,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  moodNumberActive: {
    color: colors.textPrimary,
  },
  moodFeedback: {
    backgroundColor: colors.surfaceSecondary,
    padding: dimensions.spacing.md,
    borderRadius: dimensions.borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  moodFeedbackText: {
    fontSize: dimensions.fontSize.body,
    color: colors.textSecondary,
    textAlign: "center",
    fontWeight: "500",
  },
  notesInput: {
    minHeight: 120,
    textAlignVertical: "top",
    paddingTop: dimensions.spacing.lg,
  },
  saveButtonContainer: {
    paddingHorizontal: dimensions.layout.containerPadding,
    paddingTop: dimensions.spacing.xl,
    paddingBottom: dimensions.layout.screenPaddingBottom,
  },
  saveButton: {
    borderRadius: dimensions.borderRadius.xl,
    overflow: "hidden",
    ...dimensions.shadow.lg,
    shadowColor: colors.shadowPrimary,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonGradient: {
    paddingVertical: dimensions.spacing.lg,
  },
  saveButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: dimensions.spacing.md,
  },
  saveButtonText: {
    fontSize: dimensions.fontSize.bodyLarge,
    fontWeight: "700",
    color: colors.textPrimary,
  },
})

export default LogDataScreen
