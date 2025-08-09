import axios from 'axios';
import { HealthLog, HealthMetrics, ApiResponse } from '../types/health';

// ✅ WORKING API URLs (choose one)
const WORKING_APIS = {
  // Option 1: Ready-made health API (works immediately)
  demo: 'https://jsonplaceholder.typicode.com',
  
  // Option 2: If you set up JSON Server locally
  local: 'http://localhost:3001',
  
  // Option 3: Reqres.in (another working demo API)
  reqres: 'https://reqres.in/api'
};

// Start with demo API (always works)
const API_BASE_URL = WORKING_APIS.demo;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Complete mock health dataset
const mockHealthData: HealthLog[] = [
  {
    id: "1",
    date: "2025-08-01",
    steps: 8500,
    waterIntake: 2.1,
    sleepDuration: 7.5,
    heartRate: 72,
    weight: 70.5,
    bloodPressure: { systolic: 120, diastolic: 80 },
    mood: 4,
    calories: 2200,
    exercise: "30 min walk",
    notes: "Felt energetic today",
    createdAt: "2025-08-01T10:30:00Z",
    updatedAt: "2025-08-01T10:30:00Z"
  },
  {
    id: "2", 
    date: "2025-08-02",
    steps: 12000,
    waterIntake: 2.8,
    sleepDuration: 8.0,
    heartRate: 68,
    weight: 70.2,
    bloodPressure: { systolic: 118, diastolic: 78 },
    mood: 5,
    calories: 2150,
    exercise: "45 min jogging",
    notes: "Great workout session",
    createdAt: "2025-08-02T09:15:00Z",
    updatedAt: "2025-08-02T09:15:00Z"
  },
  {
    id: "3",
    date: "2025-08-03", 
    steps: 6500,
    waterIntake: 1.9,
    sleepDuration: 6.5,
    heartRate: 76,
    weight: 70.8,
    bloodPressure: { systolic: 125, diastolic: 82 },
    mood: 3,
    calories: 2350,
    exercise: "Rest day",
    notes: "Tired, didn't sleep well",
    createdAt: "2025-08-03T11:45:00Z",
    updatedAt: "2025-08-03T11:45:00Z"
  },
  {
    id: "4",
    date: "2025-08-04",
    steps: 9800,
    waterIntake: 2.5,
    sleepDuration: 7.8,
    heartRate: 70,
    weight: 70.1,
    bloodPressure: { systolic: 122, diastolic: 79 },
    mood: 4,
    calories: 2180,
    exercise: "Gym - strength training", 
    notes: "Good balance of activities",
    createdAt: "2025-08-04T08:20:00Z",
    updatedAt: "2025-08-04T08:20:00Z"
  },
  {
    id: "5",
    date: "2025-08-05",
    steps: 11200,
    waterIntake: 3.0,
    sleepDuration: 8.2,
    heartRate: 65,
    weight: 69.9,
    bloodPressure: { systolic: 115, diastolic: 75 },
    mood: 5,
    calories: 2100,
    exercise: "Yoga + cycling",
    notes: "Perfect day, feeling healthy",
    createdAt: "2025-08-05T07:30:00Z",
    updatedAt: "2025-08-05T07:30:00Z"
  },
  {
    id: "6",
    date: "2025-08-06",
    steps: 7800,
    waterIntake: 2.3,
    sleepDuration: 7.2,
    heartRate: 73,
    weight: 70.0,
    bloodPressure: { systolic: 119, diastolic: 77 },
    mood: 4,
    calories: 2250,
    exercise: "Swimming 30 min",
    notes: "Good recovery day",
    createdAt: "2025-08-06T09:00:00Z",
    updatedAt: "2025-08-06T09:00:00Z"
  },
  {
    id: "7",
    date: "2025-08-07",
    steps: 13500,
    waterIntake: 3.2,
    sleepDuration: 8.5,
    heartRate: 64,
    weight: 69.7,
    bloodPressure: { systolic: 116, diastolic: 74 },
    mood: 5,
    calories: 2050,
    exercise: "Hiking 2 hours",
    notes: "Amazing hike, great weather",
    createdAt: "2025-08-07T18:30:00Z",
    updatedAt: "2025-08-07T18:30:00Z"
  },
  {
    id: "8",
    date: "2025-08-08",
    steps: 5200,
    waterIntake: 2.0,
    sleepDuration: 6.0,
    heartRate: 78,
    weight: 70.3,
    bloodPressure: { systolic: 128, diastolic: 84 },
    mood: 2,
    calories: 2400,
    exercise: "Light stretching",
    notes: "Stressful day at work",
    createdAt: "2025-08-08T20:15:00Z",
    updatedAt: "2025-08-08T20:15:00Z"
  }
];

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 Making ${config.method?.toUpperCase()} request to ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor  
api.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.status} response from ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error(`❌ API Error: ${error.response?.status || 'Network'} - ${error.message}`);
    console.log('🔄 Using mock data as fallback...');
    return Promise.reject(error);
  }
);

export const healthApi = {
  // Test connection (always works with JSONPlaceholder)
  testConnection: async (): Promise<boolean> => {
    try {
      const response = await api.get('/posts/1');
      console.log('✅ API connection successful!', response.status);
      return true;
    } catch (error) {
      console.log('❌ API connection failed, using mock data');
      return false;
    }
  },

  // Get all health logs (uses mock data)
  getAllLogs: async (): Promise<HealthLog[]> => {
    console.log('📊 Fetching all health logs...');
    
    // For demo, we'll use mock data directly
    // In a real scenario, this would try the API first
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`✅ Returning ${mockHealthData.length} health logs`);
        resolve(mockHealthData);
      }, 500); // Simulate API delay
    });
  },

  // Get health log by date
  getLogByDate: async (date: string): Promise<HealthLog | null> => {
    console.log(`🔍 Searching for health log on ${date}`);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const log = mockHealthData.find(log => log.date === date);
        if (log) {
          console.log(`✅ Found health log for ${date}`);
        } else {
          console.log(`❌ No health log found for ${date}`);
        }
        resolve(log || null);
      }, 300);
    });
  },

  // Get logs for date range
  getLogsByDateRange: async (startDate: string, endDate: string): Promise<HealthLog[]> => {
    console.log(`📅 Fetching logs from ${startDate} to ${endDate}`);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const logs = mockHealthData.filter(log => 
          log.date >= startDate && log.date <= endDate
        ).sort((a, b) => a.date.localeCompare(b.date));
        
        console.log(`✅ Found ${logs.length} logs in date range`);
        resolve(logs);
      }, 400);
    });
  },

  // Create new health log
  createLog: async (data: Omit<HealthLog, 'id' | 'createdAt' | 'updatedAt'>): Promise<HealthLog> => {
    console.log('➕ Creating new health log...');
    
    const now = new Date().toISOString();
    const newLog: HealthLog = {
      ...data,
      id: (mockHealthData.length + 1).toString(),
      createdAt: now,
      updatedAt: now,
    };

    return new Promise((resolve) => {
      setTimeout(() => {
        mockHealthData.push(newLog);
        console.log(`✅ Created health log with ID: ${newLog.id}`);
        resolve(newLog);
      }, 600);
    });
  },

  // Update existing health log
  updateLog: async (id: string, data: Partial<HealthMetrics>): Promise<HealthLog> => {
    console.log(`✏️ Updating health log ${id}...`);
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const logIndex = mockHealthData.findIndex(log => log.id === id);
        
        if (logIndex === -1) {
          console.log(`❌ Health log ${id} not found`);
          reject(new Error('Log not found'));
          return;
        }

        const updatedLog = {
          ...mockHealthData[logIndex],
          ...data,
          updatedAt: new Date().toISOString(),
        };

        mockHealthData[logIndex] = updatedLog;
        console.log(`✅ Updated health log ${id}`);
        resolve(updatedLog);
      }, 500);
    });
  },

  // Delete health log
  deleteLog: async (id: string): Promise<void> => {
    console.log(`🗑️ Deleting health log ${id}...`);
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const logIndex = mockHealthData.findIndex(log => log.id === id);
        
        if (logIndex === -1) {
          console.log(`❌ Health log ${id} not found`);
          reject(new Error('Log not found'));
          return;
        }

        mockHealthData.splice(logIndex, 1);
        console.log(`✅ Deleted health log ${id}`);
        resolve();
      }, 400);
    });
  },

  // Get mock data directly (for testing)
  getMockData: (): HealthLog[] => {
    return [...mockHealthData];
  },

  // Add sample data (for testing)
  addSampleData: async (): Promise<void> => {
    console.log('📋 Adding more sample data...');
    
    const sampleLogs: HealthLog[] = [
      {
        id: "9",
        date: "2025-08-09",
        steps: 10500,
        waterIntake: 2.7,
        sleepDuration: 7.9,
        heartRate: 69,
        weight: 69.8,
        bloodPressure: { systolic: 117, diastolic: 76 },
        mood: 4,
        calories: 2150,
        exercise: "Tennis 1 hour",
        notes: "Fun game with friends",
        createdAt: "2025-08-09T16:45:00Z",
        updatedAt: "2025-08-09T16:45:00Z"
      },
      {
        id: "10",
        date: "2025-08-10",
        steps: 9200,
        waterIntake: 2.4,
        sleepDuration: 8.0,
        heartRate: 71,
        weight: 69.9,
        bloodPressure: { systolic: 120, diastolic: 78 },
        mood: 4,
        calories: 2200,
        exercise: "Morning run 45 min",
        notes: "Consistent routine",
        createdAt: "2025-08-10T07:00:00Z",
        updatedAt: "2025-08-10T07:00:00Z"
      }
    ];

    mockHealthData.push(...sampleLogs);
    console.log(`✅ Added ${sampleLogs.length} sample logs. Total: ${mockHealthData.length}`);
  },

  // Get health statistics
  getStats: async (): Promise<{
    totalLogs: number;
    avgSteps: number;
    avgWater: number;
    avgSleep: number;
    latestDate: string;
  }> => {
    console.log('📈 Calculating health statistics...');
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const stats = {
          totalLogs: mockHealthData.length,
          avgSteps: Math.round(mockHealthData.reduce((sum, log) => sum + log.steps, 0) / mockHealthData.length),
          avgWater: Math.round((mockHealthData.reduce((sum, log) => sum + log.waterIntake, 0) / mockHealthData.length) * 10) / 10,
          avgSleep: Math.round((mockHealthData.reduce((sum, log) => sum + log.sleepDuration, 0) / mockHealthData.length) * 10) / 10,
          latestDate: mockHealthData.sort((a, b) => b.date.localeCompare(a.date))[0].date
        };
        
        console.log('✅ Stats calculated:', stats);
        resolve(stats);
      }, 300);
    });
  }
};

// Usage examples:
export const examples = {
  basic: `
    // Test the connection
    const connected = await healthApi.testConnection();
    console.log('Connected:', connected);

    // Get all logs
    const logs = await healthApi.getAllLogs();
    console.log('Total logs:', logs.length);

    // Get today's log
    const todayLog = await healthApi.getLogByDate('2025-08-01');
    console.log('Today:', todayLog);
  `,
  
  advanced: `
    // Get logs for the week
    const weekLogs = await healthApi.getLogsByDateRange('2025-08-01', '2025-08-07');
    
    // Create a new log
    const newLog = await healthApi.createLog({
      date: '2025-08-11',
      steps: 15000,
      waterIntake: 3.5,
      sleepDuration: 8.0,
      heartRate: 62,
      weight: 69.5,
      bloodPressure: { systolic: 112, diastolic: 72 },
      mood: 5,
      calories: 2000,
      exercise: 'Marathon training',
      notes: 'Great long run!'
    });

    // Get statistics
    const stats = await healthApi.getStats();
    console.log('Health stats:', stats);
  `
};

export default healthApi;