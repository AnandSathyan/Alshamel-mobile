export interface HealthLog {
  id: string;
  date: string;
  steps: number;
  waterIntake: number; // in liters
  sleepDuration: number; // in hours
  createdAt: string;
  updatedAt: string;
}

export interface HealthMetrics {
  steps: number;
  waterIntake: number;
  sleepDuration: number;
}

export interface ChartDataPoint {
  date: string;
  steps: number;
  water: number;
  sleep: number;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}
