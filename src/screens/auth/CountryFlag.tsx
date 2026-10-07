import { useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { AppTheme } from "../../theme/theme";
import type { Country } from "./countries";

type CountryFlagProps = {
  country: Pick<Country, "iso2">;
  theme: AppTheme;
  size?: "small" | "regular";
};

export function CountryFlag({
  country,
  theme,
  size = "regular",
}: CountryFlagProps) {
  const [failed, setFailed] = useState(false);
  const dimensions = size === "small" ? styles.small : styles.regular;

  return (
    <View
      style={[
        styles.frame,
        dimensions,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}
    >
      {failed ? (
        <Ionicons name="flag" size={12} color={theme.colors.textSecondary} />
      ) : (
        <Image
          accessibilityIgnoresInvertColors
          onError={() => setFailed(true)}
          resizeMode="cover"
          source={{
            uri: `https://flagcdn.com/w40/${country.iso2.toLowerCase()}.png`,
          }}
          style={styles.image}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    alignItems: "center",
    borderRadius: 3,
    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: "center",
    overflow: "hidden",
  },
  small: {
    height: 16,
    width: 22,
  },
  regular: {
    height: 20,
    width: 28,
  },
  image: {
    height: "100%",
    width: "100%",
  },
});
