import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";
import type { PropsWithChildren } from "react";
import type { AppTheme } from "../../theme/theme";

type AuthScreenBackgroundProps = PropsWithChildren<{
  theme: AppTheme;
}>;

export function AuthScreenBackground({
  theme,
  children,
}: AuthScreenBackgroundProps) {
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <LinearGradient
        colors={[
          theme.colors.surfaceAlt,
          theme.colors.background,
          `${theme.colors.primary}12`,
        ]}
        end={{ x: 0.15, y: 1 }}
        start={{ x: 0.85, y: 0 }}
        style={styles.fill}
      />
      <LinearGradient
        colors={[
          `${theme.colors.primary}20`,
          `${theme.colors.primary}08`,
          `${theme.colors.primary}00`,
        ]}
        end={{ x: 0.5, y: 1 }}
        start={{ x: 0.5, y: 0 }}
        style={styles.topWash}
      />
      <LinearGradient
        colors={[
          `${theme.colors.primary}00`,
          `${theme.colors.primary}0D`,
          `${theme.colors.primary}28`,
        ]}
        end={{ x: 0.5, y: 1 }}
        start={{ x: 0.5, y: 0 }}
        style={styles.bottomWash}
      />
      <View style={styles.decorations}>
        <View
          style={[
            styles.ring,
            styles.topRing,
            { borderColor: `${theme.colors.primary}20` },
          ]}
        />
        <View
          style={[
            styles.ring,
            styles.bottomRing,
            { borderColor: `${theme.colors.success}24` },
          ]}
        />
        <View
          style={[
            styles.orb,
            styles.topOrb,
            { backgroundColor: theme.colors.primary, opacity: 0.11 },
          ]}
        />
        <View
          style={[
            styles.orb,
            styles.bottomOrb,
            { backgroundColor: theme.colors.success, opacity: 0.12 },
          ]}
        />
        <View
          style={[
            styles.ledgerMotif,
            styles.ledgerTop,
            {
              borderColor: `${theme.colors.primary}65`,
              backgroundColor: `${theme.colors.surface}D9`,
            },
          ]}
        >
          <Ionicons
            name="receipt-outline"
            size={23}
            color={theme.colors.primary}
          />
        </View>
        <View
          style={[
            styles.ledgerMotif,
            styles.ledgerBottom,
            {
              borderColor: `${theme.colors.success}65`,
              backgroundColor: `${theme.colors.surface}D9`,
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
            styles.dot,
            styles.dotTop,
            { backgroundColor: theme.colors.success },
          ]}
        />
        <View
          style={[
            styles.dot,
            styles.dotBottom,
            { backgroundColor: theme.colors.primary },
          ]}
        />
        <View
          style={[
            styles.ledgerLines,
            styles.ledgerLinesTop,
            { backgroundColor: `${theme.colors.primary}20` },
          ]}
        >
          {[0, 1, 2].map((line) => (
            <View
              key={line}
              style={[
                styles.ledgerLine,
                { backgroundColor: `${theme.colors.primary}55` },
              ]}
            />
          ))}
        </View>
        <View
          style={[
            styles.ledgerLines,
            styles.ledgerLinesBottom,
            { backgroundColor: `${theme.colors.success}18` },
          ]}
        >
          {[0, 1, 2].map((line) => (
            <View
              key={line}
              style={[
                styles.ledgerLine,
                { backgroundColor: `${theme.colors.success}55` },
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
  topWash: {
    height: "50%",
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  bottomWash: {
    bottom: 0,
    height: "43%",
    left: 0,
    position: "absolute",
    right: 0,
  },
  decorations: {
    ...StyleSheet.absoluteFill,
    overflow: "hidden",
    pointerEvents: "none",
  },
  content: {
    flex: 1,
  },
  orb: {
    borderRadius: 999,
    position: "absolute",
  },
  ring: {
    borderRadius: 999,
    borderWidth: 2,
    position: "absolute",
  },
  topRing: {
    height: 260,
    right: -115,
    top: "12%",
    width: 260,
  },
  bottomRing: {
    bottom: "5%",
    height: 250,
    left: -115,
    width: 250,
  },
  topOrb: {
    height: 220,
    right: -130,
    top: -90,
    width: 220,
  },
  bottomOrb: {
    bottom: -135,
    height: 275,
    left: -140,
    width: 275,
  },
  ledgerMotif: {
    alignItems: "center",
    borderRadius: 17,
    borderWidth: 1.5,
    height: 52,
    justifyContent: "center",
    opacity: 0.55,
    position: "absolute",
    width: 52,
  },
  ledgerTop: {
    right: -28,
    top: "28%",
    transform: [{ rotate: "12deg" }],
  },
  ledgerBottom: {
    bottom: "5%",
    left: -18,
    transform: [{ rotate: "-12deg" }],
  },
  ledgerLines: {
    borderRadius: 14,
    gap: 7,
    height: 66,
    justifyContent: "center",
    paddingHorizontal: 12,
    position: "absolute",
    transform: [{ rotate: "-12deg" }],
    width: 94,
  },
  ledgerLinesTop: {
    left: -70,
    top: "41%",
  },
  ledgerLinesBottom: {
    right: -62,
    top: "76%",
    transform: [{ rotate: "12deg" }],
  },
  ledgerLine: {
    borderRadius: 3,
    height: 3,
    width: "78%",
  },
  dot: {
    borderRadius: 999,
    height: 12,
    opacity: 0.35,
    position: "absolute",
    width: 12,
  },
  dotTop: {
    left: 31,
    top: "18%",
  },
  dotBottom: {
    bottom: "15%",
    right: 38,
  },
});
