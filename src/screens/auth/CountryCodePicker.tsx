import { useMemo, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import { typography } from "../../constants/typography";
import type { AppTheme } from "../../theme/theme";
import { countries, type Country } from "./countries";
import { CountryFlag } from "./CountryFlag";

type CountryCodePickerProps = {
  selectedCountry: Country;
  onSelect(country: Country): void;
  theme: AppTheme;
};

export function CountryCodePicker({
  selectedCountry,
  onSelect,
  theme,
}: CountryCodePickerProps) {
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState("");
  const { height } = useWindowDimensions();
  const filteredCountries = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    if (!query) return countries;

    const dialingCodeQuery = query.replace(/^\+/, "");
    return countries.filter(
      (country) =>
        country.name.toLocaleLowerCase().includes(query) ||
        country.iso2.toLocaleLowerCase() === query ||
        country.dialCode.startsWith(dialingCodeQuery),
    );
  }, [search]);

  const closePicker = () => {
    setVisible(false);
    setSearch("");
  };

  const selectCountry = (country: Country) => {
    onSelect(country);
    closePicker();
  };

  return (
    <>
      <Pressable
        accessibilityLabel={`Country code, ${selectedCountry.name}, +${selectedCountry.dialCode}`}
        accessibilityRole="button"
        onPress={() => setVisible(true)}
        style={[
          styles.selector,
          {
            borderRightColor: theme.colors.border,
          },
        ]}
      >
        <CountryFlag
          key={selectedCountry.iso2}
          country={selectedCountry}
          size="small"
          theme={theme}
        />
        <Text
          style={[
            styles.countryInitials,
            { color: theme.colors.textSecondary },
          ]}
        >
          {selectedCountry.iso2}
        </Text>
        <Text style={[styles.dialCode, { color: theme.colors.textPrimary }]}>
          +{selectedCountry.dialCode}
        </Text>
        <Ionicons
          name="chevron-down"
          size={14}
          color={theme.colors.textSecondary}
        />
      </Pressable>

      <Modal
        animationType="slide"
        onRequestClose={closePicker}
        transparent
        visible={visible}
      >
        <View style={styles.modalRoot}>
          <Pressable
            accessibilityLabel="Close country selector"
            accessibilityRole="button"
            onPress={closePicker}
            style={styles.backdrop}
          />
          <View
            accessibilityViewIsModal
            style={[
              styles.sheet,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
                maxHeight: Math.min(height * 0.82, 680),
              },
            ]}
          >
            <View
              style={[
                styles.handle,
                { backgroundColor: theme.colors.border },
              ]}
            />
            <View style={styles.sheetHeader}>
              <View style={styles.titleBlock}>
                <Text
                  style={[
                    styles.title,
                    { color: theme.colors.textPrimary },
                  ]}
                >
                  Select country
                </Text>
                <Text
                  style={[
                    styles.subtitle,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  Search by country or calling code
                </Text>
              </View>
              <Pressable
                accessibilityLabel="Close country selector"
                accessibilityRole="button"
                hitSlop={8}
                onPress={closePicker}
                style={[
                  styles.closeButton,
                  { backgroundColor: theme.colors.surfaceAlt },
                ]}
              >
                <Ionicons
                  name="close"
                  size={19}
                  color={theme.colors.textPrimary}
                />
              </Pressable>
            </View>

            <View
              style={[
                styles.searchField,
                {
                  backgroundColor: theme.colors.surfaceAlt,
                  borderColor: theme.colors.border,
                  borderRadius: theme.radius.sm,
                },
              ]}
            >
              <Ionicons
                name="search"
                size={18}
                color={theme.colors.textSecondary}
              />
              <TextInput
                accessibilityLabel="Search countries"
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={setSearch}
                placeholder="Search country or code"
                placeholderTextColor={theme.colors.textSecondary}
                returnKeyType="search"
                style={[
                  styles.searchInput,
                  { color: theme.colors.textPrimary },
                ]}
                value={search}
              />
              {search.length > 0 ? (
                <Pressable
                  accessibilityLabel="Clear country search"
                  accessibilityRole="button"
                  hitSlop={8}
                  onPress={() => setSearch("")}
                >
                  <Ionicons
                    name="close-circle"
                    size={18}
                    color={theme.colors.textSecondary}
                  />
                </Pressable>
              ) : null}
            </View>

            <FlatList
              data={filteredCountries}
              keyboardShouldPersistTaps="handled"
              keyExtractor={(country) => country.iso2}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <Text
                    style={[
                      styles.emptyText,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    No countries match your search.
                  </Text>
                </View>
              }
              renderItem={({ item: country }) => {
                const isSelected = country.iso2 === selectedCountry.iso2;
                return (
                  <Pressable
                    accessibilityLabel={`${country.name}, +${country.dialCode}`}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    onPress={() => selectCountry(country)}
                    style={({ pressed }) => [
                      styles.countryRow,
                      {
                        backgroundColor: isSelected
                          ? theme.colors.surfaceAlt
                          : theme.colors.surface,
                        opacity: pressed ? 0.72 : 1,
                      },
                    ]}
                  >
                    <CountryFlag country={country} theme={theme} />
                    <Text
                      style={[
                        styles.rowInitials,
                        { color: theme.colors.textSecondary },
                      ]}
                    >
                      {country.iso2}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.countryName,
                        { color: theme.colors.textPrimary },
                      ]}
                    >
                      {country.name}
                    </Text>
                    <Text
                      style={[
                        styles.rowDialCode,
                        { color: theme.colors.textSecondary },
                      ]}
                    >
                      +{country.dialCode}
                    </Text>
                    {isSelected ? (
                      <Ionicons
                        name="checkmark-circle"
                        size={19}
                        color={theme.colors.primary}
                      />
                    ) : null}
                  </Pressable>
                );
              }}
              showsVerticalScrollIndicator={false}
              style={styles.countryList}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  selector: {
    alignItems: "center",
    borderRightWidth: 1,
    flexDirection: "row",
    gap: 5,
    height: 44,
    paddingRight: 12,
  },
  countryInitials: {
    fontSize: typography.caption,
    fontWeight: "600",
  },
  dialCode: {
    fontSize: typography.bodySmall,
    fontWeight: "600",
  },
  modalRoot: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    backgroundColor: "rgba(9, 24, 24, 0.42)",
    bottom: 0,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  handle: {
    alignSelf: "center",
    borderRadius: 3,
    height: 4,
    marginBottom: 18,
    width: 38,
  },
  sheetHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  titleBlock: {
    flex: 1,
  },
  title: {
    fontSize: typography.h3,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: typography.caption,
    marginTop: 4,
  },
  closeButton: {
    alignItems: "center",
    borderRadius: 999,
    height: 34,
    justifyContent: "center",
    width: 34,
  },
  searchField: {
    alignItems: "center",
    borderWidth: 1,
    flexDirection: "row",
    gap: 10,
    minHeight: 48,
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.bodySmall,
    minHeight: 46,
    padding: 0,
  },
  countryList: {
    marginTop: 12,
  },
  countryRow: {
    alignItems: "center",
    borderRadius: 10,
    flexDirection: "row",
    gap: 12,
    minHeight: 48,
    paddingHorizontal: 10,
  },
  rowInitials: {
    fontSize: typography.caption,
    fontWeight: "600",
    width: 24,
  },
  countryName: {
    flex: 1,
    fontSize: typography.bodySmall,
  },
  rowDialCode: {
    fontSize: typography.bodySmall,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: typography.bodySmall,
  },
});
