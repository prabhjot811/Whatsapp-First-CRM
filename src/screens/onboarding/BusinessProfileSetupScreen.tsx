import { useState } from "react";
import { Text, View, Pressable } from "react-native";
import { AppButton, InputField } from "../../components/ui";
import type { BusinessType, CurrencyCode } from "../../types";
import { useBusiness } from "../../hooks/useBusiness";
import { businessTypes, currencies, styles } from "../shared";
import type { BusinessSetupScreenProps } from "../shared";

export function BusinessSetupScreen({
  navigation,
  theme,
}: BusinessSetupScreenProps) {
  const { updateBusiness } = useBusiness();
  const [businessName, setBusinessName] = useState("Verma Electronics");
  const [businessType, setBusinessType] = useState<BusinessType>("Retail");
  const [currency, setCurrency] = useState<CurrencyCode>("INR");
  const [address, setAddress] = useState("Sector 18, Noida, UP");

  const handleSave = () => {
    if (!businessName.trim()) {
      return;
    }
    updateBusiness({
      name: businessName.trim(),
      type: businessType,
      currency,
      address: address.trim(),
    });
    navigation.replace("AppTabs");
  };

  return (
    <View
      style={[
        styles.screen,
        { backgroundColor: theme.colors.background, paddingHorizontal: 20 },
      ]}
    >
      <Text style={[styles.screenTitle, { color: theme.colors.textPrimary }]}>
        Business setup
      </Text>
      <InputField
        label="Business name"
        placeholder="Enter business name"
        value={businessName}
        onChangeText={setBusinessName}
        theme={theme}
      />
      <Text style={[styles.screenLabel, { color: theme.colors.textSecondary }]}>
        Business type
      </Text>
      <View style={styles.filterRow}>
        {businessTypes.map((type) => (
          <Pressable
            key={type}
            onPress={() => setBusinessType(type)}
            style={[
              styles.filterChip,
              {
                backgroundColor:
                  businessType === type
                    ? theme.colors.primary
                    : theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.filterText,
                {
                  color:
                    businessType === type
                      ? "#fff"
                      : theme.colors.textPrimary,
                },
              ]}
            >
              {type}
            </Text>
          </Pressable>
        ))}
      </View>
      <Text style={[styles.screenLabel, { color: theme.colors.textSecondary }]}>
        Currency
      </Text>
      <View style={styles.filterRow}>
        {currencies.map((code) => (
          <Pressable
            key={code}
            onPress={() => setCurrency(code)}
            style={[
              styles.filterChip,
              {
                backgroundColor:
                  currency === code ? theme.colors.primary : theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.filterText,
                {
                  color: currency === code ? "#fff" : theme.colors.textPrimary,
                },
              ]}
            >
              {code}
            </Text>
          </Pressable>
        ))}
      </View>
      <InputField
        label="Optional business address"
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
        theme={theme}
        multiline
      />
      <AppButton title="Continue" onPress={handleSave} theme={theme} />
    </View>
  );
}

export { BusinessSetupScreen as BusinessProfileSetupScreen };
