import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import type { AppTheme } from "../../theme/theme";

type OnboardingIllustrationProps = {
  theme: AppTheme;
  size: number;
};

export function OnboardingIllustration({
  theme,
  size,
}: OnboardingIllustrationProps) {
  return (
    <View
      accessible
      accessibilityLabel="Checklist clipboard with a WhatsApp badge and foliage"
      style={[styles.illustration, { height: size, width: size }]}
    >
      <View
        style={[
          styles.backdrop,
          { backgroundColor: theme.colors.accent },
        ]}
      />
      <View
        style={[
          styles.paperAccent,
          { backgroundColor: `${theme.colors.warning}55` },
        ]}
      />
      <View
        style={[
          styles.leftNote,
          { backgroundColor: `${theme.colors.success}22` },
        ]}
      />
      <View
        style={[
          styles.clipboard,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.primary,
            boxShadow: `0px 5px 12px ${theme.colors.shadow}`,
          },
        ]}
      >
        <View
          style={[
            styles.clip,
            { backgroundColor: theme.colors.primary },
          ]}
        />
        <View style={styles.checklist}>
          {[0, 1, 2].map((item) => (
            <View key={item} style={styles.checkRow}>
              <View
                style={[
                  styles.checkCircle,
                  {
                    backgroundColor: theme.colors.accent,
                    borderColor: theme.colors.primary,
                  },
                ]}
              />
              <View
                style={[
                  styles.checkLine,
                  { backgroundColor: theme.colors.border },
                ]}
              />
            </View>
          ))}
        </View>
      </View>
      <View
        style={[
          styles.whatsAppBadge,
          {
            backgroundColor: theme.colors.primary,
            borderColor: theme.colors.surface,
          },
        ]}
      >
        <MaterialCommunityIcons
          name="whatsapp"
          size={25}
          color={theme.colors.onPrimary}
        />
      </View>
      <View
        style={[
          styles.leaf,
          styles.leftLeafTop,
          { backgroundColor: theme.colors.success },
        ]}
      />
      <View
        style={[
          styles.leaf,
          styles.leftLeafBottom,
          { backgroundColor: theme.colors.primary },
        ]}
      />
      <View
        style={[
          styles.leaf,
          styles.leftLeafInner,
          { backgroundColor: theme.colors.success },
        ]}
      />
      <View
        style={[
          styles.leaf,
          styles.rightLeafTop,
          { backgroundColor: theme.colors.success },
        ]}
      />
      <View
        style={[
          styles.leaf,
          styles.rightLeafBottom,
          { backgroundColor: theme.colors.primary },
        ]}
      />
      <View
        style={[
          styles.leaf,
          styles.rightLeafInner,
          { backgroundColor: theme.colors.success },
        ]}
      />
      <View
        style={[
          styles.stem,
          styles.leftStem,
          { backgroundColor: theme.colors.primary },
        ]}
      />
      <View
        style={[
          styles.stem,
          styles.rightStem,
          { backgroundColor: theme.colors.primary },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  illustration: {
    aspectRatio: 1,
    maxWidth: 300,
    position: "relative",
  },
  backdrop: {
    borderRadius: 120,
    height: "72%",
    left: "13%",
    position: "absolute",
    top: "17%",
    transform: [{ rotate: "-8deg" }],
    width: "74%",
  },
  paperAccent: {
    borderRadius: 11,
    height: "19%",
    left: "18%",
    position: "absolute",
    top: "28%",
    transform: [{ rotate: "-13deg" }],
    width: "16%",
  },
  leftNote: {
    borderRadius: 8,
    height: "12%",
    left: "21%",
    position: "absolute",
    top: "19%",
    transform: [{ rotate: "-14deg" }],
    width: "11%",
  },
  clipboard: {
    borderRadius: 18,
    borderWidth: 1.5,
    height: "62%",
    left: "33%",
    overflow: "visible",
    position: "absolute",
    top: "13%",
    width: "35%",
  },
  clip: {
    alignSelf: "center",
    borderRadius: 6,
    height: 13,
    marginTop: -7,
    width: "33%",
  },
  checklist: {
    gap: 12,
    paddingHorizontal: "15%",
    paddingTop: "18%",
  },
  checkRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 9,
  },
  checkCircle: {
    borderRadius: 5,
    borderWidth: 1,
    height: 11,
    width: 11,
  },
  checkLine: {
    borderRadius: 3,
    height: 4,
    width: "65%",
  },
  whatsAppBadge: {
    alignItems: "center",
    borderRadius: 999,
    borderWidth: 3,
    height: 58,
    justifyContent: "center",
    left: "55%",
    position: "absolute",
    top: "51%",
    width: 58,
  },
  leaf: {
    borderRadius: 999,
    height: 13,
    position: "absolute",
    width: 25,
  },
  leftLeafTop: {
    left: "14%",
    top: "56%",
    transform: [{ rotate: "33deg" }],
  },
  leftLeafBottom: {
    left: "13%",
    top: "76%",
    transform: [{ rotate: "62deg" }],
  },
  leftLeafInner: {
    left: "23%",
    top: "81%",
    transform: [{ rotate: "30deg" }],
  },
  rightLeafTop: {
    left: "73%",
    top: "58%",
    transform: [{ rotate: "-38deg" }],
  },
  rightLeafBottom: {
    left: "77%",
    top: "76%",
    transform: [{ rotate: "-65deg" }],
  },
  rightLeafInner: {
    left: "67%",
    top: "82%",
    transform: [{ rotate: "-25deg" }],
  },
  stem: {
    borderRadius: 4,
    height: 37,
    position: "absolute",
    width: 3,
  },
  leftStem: {
    left: "21%",
    top: "69%",
    transform: [{ rotate: "-15deg" }],
  },
  rightStem: {
    left: "79%",
    top: "67%",
    transform: [{ rotate: "14deg" }],
  },
});
