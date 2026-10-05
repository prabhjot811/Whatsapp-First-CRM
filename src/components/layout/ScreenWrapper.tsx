import React from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import type { AppTheme } from "../../theme/theme";

interface ScreenWrapperProps extends React.PropsWithChildren {
  theme: AppTheme;
  scrollable?: boolean;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export function ScreenWrapper({
  children,
  theme,
  scrollable = false,
  contentContainerStyle,
}: ScreenWrapperProps) {
  const baseStyle = [
    styles.container,
    { backgroundColor: theme.colors.background },
  ];
  if (scrollable) {
    return (
      <ScrollView
        contentContainerStyle={[styles.content, contentContainerStyle]}
        keyboardShouldPersistTaps="handled"
        style={baseStyle}
      >
        {children}
      </ScrollView>
    );
  }

  return (
    <View style={[...baseStyle, styles.content, contentContainerStyle]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 28 },
});
