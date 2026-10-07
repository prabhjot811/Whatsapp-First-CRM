import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import type { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";
import type { AppTheme } from "../../theme/theme";

type FinanceScreenBackgroundProps = PropsWithChildren<{
  theme: AppTheme;
}>;

export function FinanceScreenBackground({
  children,
  theme,
}: FinanceScreenBackgroundProps) {
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <LinearGradient
        colors={[
          theme.colors.surfaceAlt,
          theme.colors.background,
          `${theme.colors.primary}32`,
        ]}
        end={{ x: 0.12, y: 1 }}
        start={{ x: 0.92, y: 0 }}
        style={styles.fill}
      />
      <LinearGradient
        colors={[
          `${theme.colors.primary}1A`,
          `${theme.colors.success}0B`,
          `${theme.colors.primaryDark}26`,
        ]}
        end={{ x: 0.8, y: 1 }}
        start={{ x: 0.1, y: 0 }}
        style={styles.fill}
      />
      <View pointerEvents="none" style={styles.decorations}>
        <View
          style={[
            styles.orb,
            styles.topOrb,
            { backgroundColor: `${theme.colors.primary}1B` },
          ]}
        />
        <View
          style={[
            styles.orb,
            styles.bottomOrb,
            { backgroundColor: `${theme.colors.success}20` },
          ]}
        />
        <View
          style={[
            styles.ring,
            styles.topRing,
            { borderColor: `${theme.colors.primary}43` },
          ]}
        />
        <View
          style={[
            styles.ring,
            styles.bottomRing,
            { borderColor: `${theme.colors.success}46` },
          ]}
        />
        <View
          style={[
            styles.ledgerMotif,
            styles.ledgerTop,
            {
              backgroundColor: `${theme.colors.surface}D9`,
              borderColor: `${theme.colors.primary}48`,
            },
          ]}
        >
          <Ionicons
            name="receipt-outline"
            size={22}
            color={theme.colors.primary}
          />
        </View>
        <View
          style={[
            styles.ledgerMotif,
            styles.ledgerBottom,
            {
              backgroundColor: `${theme.colors.surface}D9`,
              borderColor: `${theme.colors.success}48`,
            },
          ]}
        >
          <Ionicons
            name="trending-up-outline"
            size={22}
            color={theme.colors.success}
          />
        </View>
        <View
          style={[
            styles.ledgerLines,
            styles.linesLeft,
            { backgroundColor: `${theme.colors.primary}13` },
          ]}
        >
          {[0, 1, 2].map((line) => (
            <View
              key={line}
              style={[
                styles.ledgerLine,
                { backgroundColor: `${theme.colors.primary}4D` },
              ]}
            />
          ))}
        </View>
        <View
          style={[
            styles.ledgerLines,
            styles.linesRight,
            { backgroundColor: `${theme.colors.success}16` },
          ]}
        >
          {[0, 1, 2].map((line) => (
            <View
              key={line}
              style={[
                styles.ledgerLine,
                { backgroundColor: `${theme.colors.success}52` },
              ]}
            />
          ))}
        </View>
      </View>
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
    position: "relative",
  },
  fill: {
    ...StyleSheet.absoluteFill,
  },
  decorations: {
    ...StyleSheet.absoluteFill,
    overflow: "hidden",
  },
  content: {
    flex: 1,
  },
  orb: {
    borderRadius: 999,
    position: "absolute",
  },
  topOrb: {
    height: 245,
    right: -150,
    top: -105,
    width: 245,
  },
  bottomOrb: {
    bottom: -150,
    height: 300,
    left: -155,
    width: 300,
  },
  ring: {
    borderRadius: 999,
    borderWidth: 2,
    position: "absolute",
  },
  topRing: {
    height: 230,
    right: -110,
    top: "24%",
    width: 230,
  },
  bottomRing: {
    bottom: "9%",
    height: 205,
    left: -95,
    width: 205,
  },
  ledgerMotif: {
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1.5,
    height: 50,
    justifyContent: "center",
    position: "absolute",
    width: 50,
  },
  ledgerTop: {
    right: -18,
    top: "42%",
    transform: [{ rotate: "12deg" }],
  },
  ledgerBottom: {
    bottom: "23%",
    left: -15,
    transform: [{ rotate: "-12deg" }],
  },
  ledgerLines: {
    borderRadius: 13,
    gap: 6,
    height: 62,
    justifyContent: "center",
    paddingHorizontal: 11,
    position: "absolute",
    width: 88,
  },
  linesLeft: {
    left: -62,
    top: "58%",
    transform: [{ rotate: "-12deg" }],
  },
  linesRight: {
    right: -58,
    top: "74%",
    transform: [{ rotate: "12deg" }],
  },
  ledgerLine: {
    borderRadius: 3,
    height: 3,
    width: "78%",
  },
});
