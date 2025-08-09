# Modern Health Monitor App

A professional React Native health tracking application built with React Native CLI, featuring comprehensive health metrics tracking, data visualization, and a modern UI design.

## 🚀 Features

### Core Functionality
- **Home Screen**: Dashboard with today's date, daily health summary, and no-data state
- **Log Data Screen**: Comprehensive health metrics input form with validation
- **History Screen**: 7-day data visualization with charts and analytics

### Health Metrics Tracked
- Daily steps
- Water intake (liters)
- Sleep duration (hours)
- Heart rate (BPM)
- Weight (kg)
- Blood pressure (systolic/diastolic)
- Mood assessment (1-5 scale)
- Calories consumed
- Exercise activities
- Daily notes

### Advanced Features
- Professional UI with gradient designs and glass morphism effects
- Interactive charts and data visualization
- Real-time data persistence with JSON Server
- Responsive design for all screen sizes
- Custom hooks for state management
- Form validation and error handling
- Success animations and loading states

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (version 16.0 or higher)
- **npm** or **yarn** package manager
- **React Native CLI**: `npm install -g react-native-cli`
- **Git** for version control

### For Android Development
- **Android Studio** with Android SDK
- **Java Development Kit (JDK)** 11 or newer
- **Android Virtual Device (AVD)** or physical Android device
- **ANDROID_HOME** environment variable set

### For iOS Development (macOS only)
- **Xcode** (latest version)
- **iOS Simulator** or physical iOS device
- **CocoaPods**: `sudo gem install cocoapods`

## 🛠️ Installation & Setup

### 1. Clone the Repository
\`\`\`bash
git clone <repository-url>
cd modern-health-app
\`\`\`

### 2. Install Dependencies
\`\`\`bash
npm install
# or
yarn install
\`\`\`

### 3. iOS Setup (macOS only)
\`\`\`bash
cd ios
pod install
cd ..
\`\`\`

### 4. Start the JSON Server (Mock API)
Open a new terminal window and run:
\`\`\`bash
npm run json-server
# or
yarn json-server
\`\`\`

This will start the JSON Server on `http://localhost:3001` with the health data API endpoints.

**Important**: Keep this terminal window open while using the app.

### 5. Start the Metro Bundler
In another terminal window:
\`\`\`bash
npm start
# or
yarn start
\`\`\`

This will start the Metro bundler for React Native.

### 6. Run the Application

#### For Android
\`\`\`bash
# Make sure you have an Android emulator running or device connected
npm run android
# or
yarn android
\`\`\`

#### For iOS (macOS only)
\`\`\`bash
npm run ios
# or
yarn ios
\`\`\`

## 📱 Usage Instructions

### Home Screen
- View today's date and health summary
- Quick access to logging and analytics
- Professional dashboard with health insights
- No-data state guides users to start logging

### Log Data Screen
- Input daily health metrics using the comprehensive form
- Form validation ensures data accuracy
- Auto-saves data with POST (new) or PUT (update) requests
- Success animations confirm data submission

### History Screen
- View past 7 days of health data
- Interactive charts with metric selection
- Bar chart visualization for quick overview
- Weekly summary with averages

## 🔧 API Endpoints

The JSON Server provides the following endpoints:

- `GET /healthLogs` - Get all health logs
- `GET /healthLogs?date=YYYY-MM-DD` - Get log by date
- `POST /healthLogs` - Create new health log
- `PATCH /healthLogs/:id` - Update existing health log
- `DELETE /healthLogs/:id` - Delete health log

## 📊 Data Structure

\`\`\`typescript
interface HealthLog {
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
\`\`\`

## 🎨 Design System

### Color Palette
- Professional dark theme with sophisticated gradients
- Premium color combinations for different health metrics
- Glass morphism effects for modern UI elements

### Typography
- Hierarchical text system with proper font weights
- Responsive font sizes for different screen sizes
- Professional spacing and line heights

### Components
- Reusable professional cards with gradient backgrounds
- Animated input components with validation
- Custom charts and data visualization components

## 🏗️ Architecture

### Component Structure
\`\`\`
src/
├── components/
│   └── common/
│       ├── ProfessionalCard.tsx
│       ├── ProfessionalMetricCard.tsx
│       ├── ProfessionalHeader.tsx
│       ├── AnimatedInput.tsx
│       ├── SimpleBarChart.tsx
│       └── Icon.tsx
├── screens/
│   ├── HomeScreen.tsx
│   ├── LogDataScreen.tsx
│   └── HistoryScreen.tsx
├── hooks/
│   └── useHealthData.ts
├── services/
│   └── api.ts
├── constants/
│   ├── colors.ts
│   └── dimensions.ts
└── types/
    └── health.ts
\`\`\`

### State Management
- Custom React hooks for data fetching and state management
- React Query for server state management
- Local state with useState and useEffect

## 🧪 Testing the Application

### Test Scenarios

1. **Home Screen Testing**
   - Verify today's date display
   - Test no-data state message
   - Check daily summary with sample data

2. **Log Data Screen Testing**
   - Test all input fields with various data types
   - Verify form validation with invalid inputs
   - Test POST request for new data
   - Test PUT request for existing data updates

3. **History Screen Testing**
   - Verify 7-day data display
   - Test chart interactions and metric selection
   - Check data visualization accuracy

### Sample Test Data
The `db.json` file includes 7 days of sample health data for testing purposes.

## 🚨 Troubleshooting

### Common Issues

1. **JSON Server not starting**
   \`\`\`bash
   # Make sure json-server is installed
   npm install -g json-server
   # Or install locally
   npm install json-server --save-dev
   \`\`\`

2. **API connection issues**
   - Ensure JSON Server is running on port 3001
   - Check if `http://localhost:3001/healthLogs` returns data
   - For Android emulator, use `http://10.0.2.2:3001` instead of `localhost`
   - For physical device, use your computer's IP address

3. **Metro bundler issues**
   - Clear Metro cache: `npx react-native start --reset-cache`
   - Clean build: `cd android && ./gradlew clean && cd ..`
   - For iOS: `cd ios && xcodebuild clean && cd ..`

4. **Android build issues**
   - Make sure ANDROID_HOME is set correctly
   - Check Android SDK and build tools are installed
   - Verify Android emulator is running

5. **iOS build issues (macOS)**
   - Run `pod install` in the ios directory
   - Clean Xcode build folder
   - Check iOS simulator is available

6. **Chart not displaying**
   - Ensure sample data exists in db.json
   - Check console for any JavaScript errors
   - Verify chart dependencies are installed

### Network Configuration for Physical Devices

If testing on a physical device, update the API base URL in `src/services/api.ts`:

\`\`\`typescript
// Replace localhost with your computer's IP address
const API_BASE_URL = "http://YOUR_COMPUTER_IP:3001"
// Example: const API_BASE_URL = "http://192.168.1.100:3001"
\`\`\`

To find your IP address:
- **Windows**: `ipconfig`
- **macOS/Linux**: `ifconfig` or `ip addr show`

## 📈 Performance Considerations

- Optimized re-renders with React.memo and useMemo
- Efficient data fetching with proper caching
- Responsive images and optimized assets
- Smooth animations with native drivers

## 🔮 Future Enhancements

- Push notifications for health reminders
- Data export functionality
- Integration with health devices
- Social features and challenges
- AI-powered health insights
- Dark/light theme toggle
- Offline data synchronization

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the documentation

---

**Built with ❤️ using React Native CLI and modern development practices.**
