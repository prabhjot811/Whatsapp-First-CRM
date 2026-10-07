import React from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import type { AppTheme } from "../../theme/theme";
import { FinanceScreenBackground } from "./FinanceScreenBackground";

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
  if (scrollable) {
    return (
      <FinanceScreenBackground theme={theme}>
        <ScrollView
          contentContainerStyle={[styles.content, contentContainerStyle]}
          keyboardShouldPersistTaps="handled"
          style={styles.transparent}
        >
          {children}
        </ScrollView>
      </FinanceScreenBackground>
    );
  }

  return (
    <FinanceScreenBackground theme={theme}>
      <View style={[styles.container, styles.content, contentContainerStyle]}>
        {children}
      </View>
    </FinanceScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  transparent: { backgroundColor: "transparent" },
  content: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 28 },
});
