import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import {
  HomeScreen,
  CustomersScreen,
  TransactionsScreen,
  ReminderHistoryScreen,
  MoreScreen,
} from "../../screens";
import type { AppTheme } from "../../theme/theme";
import type { AppTabParamList } from "../../navigation/types";

const Tab = createBottomTabNavigator<AppTabParamList>();

interface BottomNavProps {
  theme: AppTheme;
  toggleTheme: () => void;
}

export function BottomNav({ theme, toggleTheme }: BottomNavProps) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          paddingTop: 8,
          height: 72,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarIcon: ({ color, size }) => {
          const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
            Home: "home",
            Customers: "people",
            Transactions: "cash",
            Reminders: "notifications",
            More: "menu",
          };
          return (
            <Ionicons
              name={iconMap[route.name] ?? "ellipse"}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Home">
        {(props) => (
          <HomeScreen {...props} theme={theme} toggleTheme={toggleTheme} />
        )}
      </Tab.Screen>
      <Tab.Screen name="Customers">
        {(props) => (
          <CustomersScreen {...props} theme={theme} toggleTheme={toggleTheme} />
        )}
      </Tab.Screen>
      <Tab.Screen name="Transactions">
        {(props) => (
          <TransactionsScreen
            {...props}
            theme={theme}
            toggleTheme={toggleTheme}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Reminders">
        {(props) => (
          <ReminderHistoryScreen
            {...props}
            theme={theme}
            toggleTheme={toggleTheme}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="More">
        {(props) => (
          <MoreScreen {...props} theme={theme} toggleTheme={toggleTheme} />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
