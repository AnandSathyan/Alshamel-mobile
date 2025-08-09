import { StatusBar } from "react-native"
import { NavigationContainer } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { Icon } from "./src/components/common/Icon"

import { HealthProvider } from "./src/context/HealthContext"
import HomeScreen from "./src/screens/HomeScreen"
import LogDataScreen from "./src/screens/LogDataScreen"
import HistoryScreen from "./src/screens/HistoryScreen"
import { colors } from "./src/constants/colors"

const Tab = createBottomTabNavigator()
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <HealthProvider>
            <NavigationContainer>
              <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />
              <Tab.Navigator
                screenOptions={({ route }) => ({
                  tabBarIcon: ({ focused, color, size }) => {
                    let iconName: string

                    if (route.name === "Home") {
                      iconName = "home"
                    } else if (route.name === "Log Data") {
                      iconName = "add-circle"
                    } else if (route.name === "History") {
                      iconName = "bar-chart"
                    } else {
                      iconName = "default"
                    }

                    return <Icon name={iconName} size={size} color={color} />
                  },
                  tabBarActiveTintColor: colors.primary,
                  tabBarInactiveTintColor: colors.textSecondary,
                  tabBarStyle: {
                    backgroundColor: colors.surface,
                    borderTopColor: colors.border,
                    paddingBottom: 8,
                    paddingTop: 8,
                    height: 88,
                    elevation: 8,
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: -2,
                    },
                    shadowOpacity: 0.1,
                    shadowRadius: 3.84,
                  },
                  headerStyle: {
                    backgroundColor: colors.surface,
                    elevation: 0,
                    shadowOpacity: 0,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                  },
                  headerTitleStyle: {
                    fontSize: 20,
                    fontWeight: "600",
                    color: colors.textPrimary,
                  },
                  headerTitleAlign: "center",
                })}
              >
                <Tab.Screen
                  name="Home"
                  component={HomeScreen}
                  options={{
                    title: "Dashboard",
                    headerTitle: "Health Dashboard",
                  }}
                />
                <Tab.Screen
                  name="Log Data"
                  component={LogDataScreen}
                  options={{
                    title: "Log Data",
                    headerTitle: "Log Health Data",
                  }}
                />
                <Tab.Screen
                  name="History"
                  component={HistoryScreen}
                  options={{
                    title: "History",
                    headerTitle: "Health History",
                  }}
                />
              </Tab.Navigator>
            </NavigationContainer>
          </HealthProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
