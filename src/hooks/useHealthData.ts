import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import AsyncStorage from "@react-native-async-storage/async-storage"
import type { HealthLog, HealthMetrics } from "../types/health"

const STORAGE_KEY = "health_data"

// Mock API functions
const getHealthData = async (): Promise<HealthLog[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error("Error loading health data:", error)
    return []
  }
}

const saveHealthData = async (data: HealthLog[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error("Error saving health data:", error)
    throw error
  }
}

const getTodaysLog = async (): Promise<HealthLog | null> => {
  const data = await getHealthData()
  const today = new Date().toISOString().split("T")[0]
  return data.find((log) => log.date === today) || null
}

const getWeeklyLogs = async (): Promise<HealthLog[]> => {
  const data = await getHealthData()
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  return data
    .filter((log) => new Date(log.date) >= sevenDaysAgo)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

const createHealthLog = async (logData: Omit<HealthLog, "id" | "createdAt" | "updatedAt">): Promise<HealthLog> => {
  const data = await getHealthData()
  const newLog: HealthLog = {
    ...logData,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  const updatedData = [...data, newLog]
  await saveHealthData(updatedData)
  return newLog
}

const updateHealthLog = async ({
  id,
  data: updateData,
}: { id: string; data: Partial<HealthMetrics> }): Promise<HealthLog> => {
  const data = await getHealthData()
  const index = data.findIndex((log) => log.id === id)

  if (index === -1) {
    throw new Error("Health log not found")
  }

  const updatedLog: HealthLog = {
    ...data[index],
    ...updateData,
    updatedAt: new Date().toISOString(),
  }

  data[index] = updatedLog
  await saveHealthData(data)
  return updatedLog
}

export const useHealthData = () => {
  const queryClient = useQueryClient()

  const useTodaysLog = () => {
    return useQuery({
      queryKey: ["todaysLog"],
      queryFn: getTodaysLog,
      staleTime: 1000 * 60 * 5, // 5 minutes
    })
  }

  const useWeeklyLogs = () => {
    return useQuery({
      queryKey: ["weeklyLogs"],
      queryFn: getWeeklyLogs,
      staleTime: 1000 * 60 * 5, // 5 minutes
    })
  }

  const useAllLogs = () => {
    return useQuery({
      queryKey: ["allLogs"],
      queryFn: getHealthData,
      staleTime: 1000 * 60 * 5, // 5 minutes
    })
  }

  const useCreateHealthLog = () => {
    return useMutation({
      mutationFn: createHealthLog,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["todaysLog"] })
        queryClient.invalidateQueries({ queryKey: ["weeklyLogs"] })
        queryClient.invalidateQueries({ queryKey: ["allLogs"] })
      },
    })
  }

  const useUpdateHealthLog = () => {
    return useMutation({
      mutationFn: updateHealthLog,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["todaysLog"] })
        queryClient.invalidateQueries({ queryKey: ["weeklyLogs"] })
        queryClient.invalidateQueries({ queryKey: ["allLogs"] })
      },
    })
  }

  return {
    useTodaysLog,
    useWeeklyLogs,
    useAllLogs,
    useCreateHealthLog,
    useUpdateHealthLog,
  }
}
