import { useState } from "react";
import { Alert, Text, View, Pressable } from "react-native";
import { AppButton, InputField } from "../../components/ui";
import { isValidPhone } from "../../utils/validators";
import type { BusinessType, CurrencyCode } from "../../types";
import { useBusiness } from "../../hooks/useBusiness";
import { businessTypes, currencies, styles } from "../shared";
import type { BusinessProfileScreenProps } from "../shared";

export function BusinessProfileScreen({
  navigation,
  theme,
}: BusinessProfileScreenProps) {
  const { business: currentBusiness, updateBusiness } = useBusiness();
  const [name, setName] = useState(currentBusiness.name);
  const [type, setType] = useState<BusinessType>(currentBusiness.type);
  const [phone, setPhone] = useState(currentBusiness.phone);
  const [currency, setCurrency] = useState<CurrencyCode>(
    currentBusiness.currency,
  );
  const [address, setAddress] = useState(currentBusiness.address || "");

  const handleSave = () => {
    if (!name.trim() || !isValidPhone(phone)) {
      Alert.alert(
        "Check business details",
        !name.trim()
          ? "Business name is required."
          : "Enter a valid business phone number.",
      );
      return;
    }
    updateBusiness({
      name: name.trim(),
      type,
      phone: phone.trim(),
      currency,
      address: address.trim(),
    });
    navigation.goBack();
  };

  return (
    <View
      style={[
        styles.screen,
        { backgroundColor: theme.colors.background, paddingHorizontal: 20 },
      ]}
    >
      <Text style={[styles.screenTitle, { color: theme.colors.textPrimary }]}>
        Business Profile
      </Text>
      <InputField
        label="Business name"
        placeholder="Business name"
        value={name}
        onChangeText={setName}
        theme={theme}
      />
      <Text style={[styles.screenLabel, { color: theme.colors.textSecondary }]}>
        Business type
      </Text>
      <View style={styles.filterRow}>
        {businessTypes.map((businessType) => (
          <Pressable
            key={businessType}
            onPress={() => setType(businessType)}
            style={[
              styles.filterChip,
              {
                backgroundColor:
                  type === businessType
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
                    type === businessType
                      ? "#fff"
                      : theme.colors.textPrimary,
                },
              ]}
            >
              {businessType}
            </Text>
          </Pressable>
        ))}
      </View>
      <InputField
        label="Phone"
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        theme={theme}
      />
      <InputField
        label="Address"
        placeholder="Add address"
        value={address}
        onChangeText={setAddress}
        theme={theme}
        multiline
      />
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
                  currency === code
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
                    currency === code ? "#fff" : theme.colors.textPrimary,
                },
              ]}
            >
              {code}
            </Text>
          </Pressable>
        ))}
      </View>
      <AppButton
        title="Save Changes"
        onPress={handleSave}
        theme={theme}
      />
    </View>
  );
}
