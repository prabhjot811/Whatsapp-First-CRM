import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import type { AppTheme } from "../../theme/theme";

type PhoneLoginIllustrationProps = {
  theme: AppTheme;
  size: number;
};

export function PhoneLoginIllustration({
  theme,
  size,
}: PhoneLoginIllustrationProps) {
  return (
    <View
      accessible
      accessibilityLabel="Mobile phone displaying WhatsApp, surrounded by soft shapes"
      style={[styles.illustration, { height: size, width: size }]}
    >
      <View style={[styles.halo, { backgroundColor: theme.colors.accent }]} />
      <View
        style={[
          styles.leftSplash,
          { backgroundColor: `${theme.colors.warning}38` },
        ]}
      />
      <View
        style={[
          styles.rightSplash,
          { backgroundColor: `${theme.colors.warning}50` },
        ]}
      />
      <View
        style={[
          styles.sparkle,
          { backgroundColor: `${theme.colors.success}40` },
        ]}
      />
      <View
        style={[
          styles.phone,
          {
            backgroundColor: theme.colors.primary,
            boxShadow: `0px 5px 12px ${theme.colors.shadow}`,
          },
        ]}
      >
        <View style={[styles.screen, { backgroundColor: theme.colors.surface }]}>
          <View
            style={[
              styles.speaker,
              { backgroundColor: theme.colors.border },
            ]}
          />
          <View
            style={[
              styles.whatsAppBubble,
              { backgroundColor: theme.colors.accent },
            ]}
          >
            <MaterialCommunityIcons
              name="whatsapp"
              size={size * 0.104}
              color={theme.colors.primary}
            />
          </View>
          <View
            style={[
              styles.homeButton,
              { backgroundColor: theme.colors.surfaceAlt },
            ]}
          />
        </View>
      </View>
      <View
        style={[
          styles.leaf,
          styles.leftLeaf,
          { backgroundColor: theme.colors.success },
        ]}
      />
      <View
        style={[
          styles.leaf,
          styles.rightLeaf,
          { backgroundColor: theme.colors.success },
        ]}
      />
      <View
        style={[
          styles.ground,
          { backgroundColor: `${theme.colors.warning}65` },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  illustration: {
    aspectRatio: 1,
    position: "relative",
  },
  halo: {
    borderRadius: 999,
    height: "73%",
    left: "13%",
    position: "absolute",
    top: "16%",
    width: "74%",
  },
  leftSplash: {
    borderRadius: 999,
    height: "31%",
    left: "12%",
    position: "absolute",
    top: "47%",
    transform: [{ rotate: "-27deg" }],
    width: "25%",
  },
  rightSplash: {
    borderRadius: 999,
    height: "20%",
    left: "68%",
    position: "absolute",
    top: "40%",
    transform: [{ rotate: "32deg" }],
    width: "18%",
  },
  sparkle: {
    borderRadius: 4,
    height: 11,
    left: "72%",
    position: "absolute",
    top: "31%",
    transform: [{ rotate: "28deg" }],
    width: 11,
  },
  phone: {
    borderRadius: 13,
    height: "69%",
    left: "37%",
    padding: 4,
    position: "absolute",
    top: "15%",
    width: "29%",
  },
  screen: {
    alignItems: "center",
    borderRadius: 9,
    flex: 1,
    justifyContent: "center",
  },
  speaker: {
    borderRadius: 4,
    height: 3,
    position: "absolute",
    top: 5,
    width: "35%",
  },
  whatsAppBubble: {
    alignItems: "center",
    borderRadius: 999,
    height: 42,
    justifyContent: "center",
    width: 42,
  },
  homeButton: {
    borderRadius: 999,
    bottom: 4,
    height: 4,
    position: "absolute",
    width: 4,
  },
  leaf: {
    borderRadius: 999,
    height: 12,
    position: "absolute",
    top: "70%",
    width: 26,
  },
  leftLeaf: {
    left: "19%",
    transform: [{ rotate: "56deg" }],
  },
  rightLeaf: {
    left: "67%",
    transform: [{ rotate: "-55deg" }],
  },
  ground: {
    borderRadius: 999,
    height: 6,
    left: "26%",
    position: "absolute",
    top: "84%",
    width: "48%",
  },
});
