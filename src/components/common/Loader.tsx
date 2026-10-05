import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import type { AppTheme } from "../../theme/theme";

export function Loader({ theme }: { theme: AppTheme }) {
  return (
    <View
      accessibilityRole="progressbar"
      style={[
        styles.container,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <ActivityIndicator color={theme.colors.primary} size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
