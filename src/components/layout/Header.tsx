import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { AppTheme } from "../../theme/theme";

interface HeaderProps {
  title: string;
  theme: AppTheme;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export function Header({ title, theme, onBack, rightAction }: HeaderProps) {
  return (
    <View style={styles.container}>
      {onBack ? (
        <Pressable
          accessibilityLabel="Go back"
          accessibilityRole="button"
          hitSlop={8}
          onPress={onBack}
          style={styles.backButton}
        >
          <Ionicons
            name="chevron-back"
            size={22}
            color={theme.colors.textPrimary}
          />
        </Pressable>
      ) : null}
      <Text
        numberOfLines={1}
        style={[styles.title, { color: theme.colors.textPrimary }]}
      >
        {title}
      </Text>
      {rightAction}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    minHeight: 48,
    marginBottom: 12,
  },
  backButton: { alignItems: "center", justifyContent: "center", width: 32 },
  title: { flex: 1, fontSize: 22, fontWeight: "700" },
});
