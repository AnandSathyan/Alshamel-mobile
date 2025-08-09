const API_BASE_URL = "http://localhost:3001"

export interface HealthLog {
  id: string
  date: string
  steps: number
  waterIntake: number
  sleepDuration: number
  heartRate: number
  weight: number
  bloodPressure: {
    systolic: number
    diastolic: number
  }
  mood: number
  calories: number
  exercise: string
  notes: string
}

export interface CreateHealthLogData {
  date: string
  steps: number
  waterIntake: number
  sleepDuration: number
  heartRate: number
  weight: number
  bloodPressure: {
    systolic: number
    diastolic: number
  }
  mood: number
  calories: number
  exercise: string
  notes: string
}

export interface UpdateHealthLogData {
  steps?: number
  waterIntake?: number
  sleepDuration?: number
  heartRate?: number
  weight?: number
  bloodPressure?: {
    systolic: number
    diastolic: number
  }
  mood?: number
  calories?: number
  exercise?: string
  notes?: string
}

class HealthAPI {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`

    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
        ...options,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("API request failed:", error)
      throw error
    }
  }

  // Get all health logs
  async getAllLogs(): Promise<HealthLog[]> {
    return this.request<HealthLog[]>("/healthLogs")
  }

  // Get health log by date
  async getLogByDate(date: string): Promise<HealthLog | null> {
    const logs = await this.request<HealthLog[]>(`/healthLogs?date=${date}`)
    return logs.length > 0 ? logs[0] : null
  }

  // Get logs for the past week
  async getWeeklyLogs(): Promise<HealthLog[]> {
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(endDate.getDate() - 6)

    const logs = await this.getAllLogs()
    return logs
      .filter((log) => {
        const logDate = new Date(log.date)
        return logDate >= startDate && logDate <= endDate
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }

  // Create new health log
  async createLog(data: CreateHealthLogData): Promise<HealthLog> {
    const newLog = {
      id: Date.now().toString(),
      ...data,
    }

    return this.request<HealthLog>("/healthLogs", {
      method: "POST",
      body: JSON.stringify(newLog),
    })
  }

  // Update existing health log
  async updateLog(id: string, data: UpdateHealthLogData): Promise<HealthLog> {
    return this.request<HealthLog>(`/healthLogs/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  }

  // Delete health log
  async deleteLog(id: string): Promise<void> {
    await this.request(`/healthLogs/${id}`, {
      method: "DELETE",
    })
  }

  // Get today's log
  async getTodaysLog(): Promise<HealthLog | null> {
    const today = new Date().toISOString().split("T")[0]
    return this.getLogByDate(today)
  }
}

export const healthAPI = new HealthAPI()
