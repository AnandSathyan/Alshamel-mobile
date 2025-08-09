import type { HealthLog } from "../types/health"

export interface HealthScore {
  overall: number
  category: "Excellent" | "Good" | "Fair" | "Poor"
  color: string
  recommendations: string[]
}

export interface MetricAnalysis {
  steps: { score: number; status: string; recommendation: string }
  water: { score: number; status: string; recommendation: string }
  sleep: { score: number; status: string; recommendation: string }
  heartRate: { score: number; status: string; recommendation: string }
  bloodPressure: { score: number; status: string; recommendation: string }
  weight: { score: number; status: string; recommendation: string }
}

export const calculateBMI = (weight: number, height = 1.75): number => {
  return weight / (height * height)
}

export const getBMICategory = (bmi: number): { category: string; color: string } => {
  if (bmi < 18.5) return { category: "Underweight", color: "#3b82f6" }
  if (bmi < 25) return { category: "Normal", color: "#10b981" }
  if (bmi < 30) return { category: "Overweight", color: "#f59e0b" }
  return { category: "Obese", color: "#ef4444" }
}

export const analyzeMetrics = (log: HealthLog): MetricAnalysis => {
  const analysis: MetricAnalysis = {
    steps: analyzeSteps(log.steps),
    water: analyzeWater(log.waterIntake),
    sleep: analyzeSleep(log.sleepDuration),
    heartRate: analyzeHeartRate(log.heartRate),
    bloodPressure: analyzeBloodPressure(log.bloodPressure),
    weight: analyzeWeight(log.weight),
  }

  return analysis
}

const analyzeSteps = (steps: number) => {
  if (steps >= 10000) {
    return { score: 100, status: "Excellent", recommendation: "Great job! Keep up the active lifestyle." }
  } else if (steps >= 7500) {
    return { score: 80, status: "Good", recommendation: "You're doing well! Try to reach 10,000 steps." }
  } else if (steps >= 5000) {
    return { score: 60, status: "Fair", recommendation: "Increase daily activity. Take stairs, walk more." }
  } else {
    return { score: 30, status: "Poor", recommendation: "Start with short walks. Aim for 5,000 steps daily." }
  }
}

const analyzeWater = (water: number) => {
  if (water >= 2.5) {
    return { score: 100, status: "Excellent", recommendation: "Perfect hydration! Keep it up." }
  } else if (water >= 2.0) {
    return { score: 80, status: "Good", recommendation: "Good hydration. Try to reach 2.5L daily." }
  } else if (water >= 1.5) {
    return { score: 60, status: "Fair", recommendation: "Increase water intake. Set hourly reminders." }
  } else {
    return { score: 30, status: "Poor", recommendation: "Drink more water! Start with a glass every hour." }
  }
}

const analyzeSleep = (sleep: number) => {
  if (sleep >= 7 && sleep <= 9) {
    return { score: 100, status: "Excellent", recommendation: "Perfect sleep duration! Maintain this routine." }
  } else if (sleep >= 6 && sleep <= 10) {
    return { score: 80, status: "Good", recommendation: "Good sleep. Aim for 7-9 hours consistently." }
  } else if (sleep >= 5 && sleep <= 11) {
    return { score: 60, status: "Fair", recommendation: "Improve sleep schedule. Create a bedtime routine." }
  } else {
    return { score: 30, status: "Poor", recommendation: "Poor sleep pattern. Consult a sleep specialist." }
  }
}

const analyzeHeartRate = (heartRate: number) => {
  if (heartRate >= 60 && heartRate <= 100) {
    return { score: 100, status: "Normal", recommendation: "Heart rate is in normal range." }
  } else if (heartRate >= 50 && heartRate <= 110) {
    return { score: 80, status: "Acceptable", recommendation: "Heart rate is acceptable. Monitor regularly." }
  } else {
    return { score: 30, status: "Concerning", recommendation: "Consult your doctor about heart rate." }
  }
}

const analyzeBloodPressure = (bp: { systolic: number; diastolic: number }) => {
  if (bp.systolic <= 120 && bp.diastolic <= 80) {
    return { score: 100, status: "Normal", recommendation: "Blood pressure is optimal." }
  } else if (bp.systolic <= 130 && bp.diastolic <= 85) {
    return { score: 80, status: "Elevated", recommendation: "Monitor blood pressure. Reduce sodium intake." }
  } else {
    return { score: 40, status: "High", recommendation: "Consult doctor. Monitor blood pressure daily." }
  }
}

const analyzeWeight = (weight: number) => {
  const bmi = calculateBMI(weight)
  const { category } = getBMICategory(bmi)

  if (category === "Normal") {
    return { score: 100, status: "Healthy", recommendation: "Maintain current weight with balanced diet." }
  } else if (category === "Overweight") {
    return {
      score: 70,
      status: "Overweight",
      recommendation: "Consider gradual weight loss through diet and exercise.",
    }
  } else {
    return { score: 50, status: category, recommendation: "Consult healthcare provider for weight management." }
  }
}

export const calculateOverallHealthScore = (logs: HealthLog[]): HealthScore => {
  if (logs.length === 0) {
    return {
      overall: 0,
      category: "Poor",
      color: "#ef4444",
      recommendations: ["Start logging your health data to get insights"],
    }
  }

  const latestLog = logs[logs.length - 1]
  const analysis = analyzeMetrics(latestLog)

  const scores = [
    analysis.steps.score,
    analysis.water.score,
    analysis.sleep.score,
    analysis.heartRate.score,
    analysis.bloodPressure.score,
    analysis.weight.score,
  ]

  const overall = Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)

  let category: HealthScore["category"]
  let color: string

  if (overall >= 90) {
    category = "Excellent"
    color = "#10b981"
  } else if (overall >= 75) {
    category = "Good"
    color = "#3b82f6"
  } else if (overall >= 60) {
    category = "Fair"
    color = "#f59e0b"
  } else {
    category = "Poor"
    color = "#ef4444"
  }

  const recommendations = Object.values(analysis)
    .filter((metric) => metric.score < 80)
    .map((metric) => metric.recommendation)
    .slice(0, 3)

  return { overall, category, color, recommendations }
}

export const getTrendAnalysis = (logs: HealthLog[]) => {
  if (logs.length < 2) return null

  const recent = logs.slice(-7) // Last 7 days
  const previous = logs.slice(-14, -7) // Previous 7 days

  if (recent.length === 0 || previous.length === 0) return null

  const recentAvg = {
    steps: recent.reduce((sum, log) => sum + log.steps, 0) / recent.length,
    water: recent.reduce((sum, log) => sum + log.waterIntake, 0) / recent.length,
    sleep: recent.reduce((sum, log) => sum + log.sleepDuration, 0) / recent.length,
    heartRate: recent.reduce((sum, log) => sum + log.heartRate, 0) / recent.length,
  }

  const previousAvg = {
    steps: previous.reduce((sum, log) => sum + log.steps, 0) / previous.length,
    water: previous.reduce((sum, log) => sum + log.waterIntake, 0) / previous.length,
    sleep: previous.reduce((sum, log) => sum + log.sleepDuration, 0) / previous.length,
    heartRate: previous.reduce((sum, log) => sum + log.heartRate, 0) / previous.length,
  }

  return {
    steps: {
      change: ((recentAvg.steps - previousAvg.steps) / previousAvg.steps) * 100,
      trend: recentAvg.steps > previousAvg.steps ? "up" : "down",
    },
    water: {
      change: ((recentAvg.water - previousAvg.water) / previousAvg.water) * 100,
      trend: recentAvg.water > previousAvg.water ? "up" : "down",
    },
    sleep: {
      change: ((recentAvg.sleep - previousAvg.sleep) / previousAvg.sleep) * 100,
      trend: recentAvg.sleep > previousAvg.sleep ? "up" : "down",
    },
    heartRate: {
      change: ((recentAvg.heartRate - previousAvg.heartRate) / previousAvg.heartRate) * 100,
      trend: recentAvg.heartRate > previousAvg.heartRate ? "up" : "down",
    },
  }
}
