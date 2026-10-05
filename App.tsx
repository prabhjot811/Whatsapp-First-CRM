import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { AppNavigator } from "./src/navigation/AppNavigator";
import { AuthProvider } from "./src/context/AuthContext";
import { BusinessProvider } from "./src/context/BusinessContext";
import { ThemeProvider } from "./src/context/ThemeContext";
import { useTheme } from "./src/hooks/useTheme";

function AppContent() {
  const { theme, toggleTheme, isDarkMode } = useTheme();
  return (
    <>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <View
        style={{
          alignItems: "center",
          backgroundColor: theme.colors.background,
          flex: 1,
          width: "100%",
        }}
      >
        <View style={{ flex: 1, maxWidth: 480, width: "100%" }}>
          <NavigationContainer>
            <AppNavigator theme={theme} toggleTheme={toggleTheme} />
          </NavigationContainer>
        </View>
      </View>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BusinessProvider>
          <AppContent />
        </BusinessProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
