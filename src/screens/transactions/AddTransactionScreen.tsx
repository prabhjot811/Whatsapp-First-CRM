import { useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppButton, InputField } from "../../components/ui";
import { AmountInput } from "../../components/common/AmountInput";
import { PhoneInput } from "../../components/common/PhoneInput";
import { ScreenWrapper } from "../../components/layout/ScreenWrapper";
import { Header } from "../../components/layout/Header";
import { mockService } from "../../services/mockServices";
import { appConfig } from "../../constants/config";
import { toIsoDate } from "../../utils/dateFormatter";
import { getAmountError, isValidPhone } from "../../utils/validators";
import { parseAmount } from "../../utils/currencyFormatter";
import { getErrorMessage } from "../../utils/errorHandler";
import { styles } from "../shared";
import type { AddDueScreenProps } from "../shared";

export function AddDueScreen({ route, navigation, theme }: AddDueScreenProps) {
  const preselectedCustomerId = route.params?.customerId;
  const [selectedCustomerId, setSelectedCustomerId] = useState(
    preselectedCustomerId ?? "",
  );
  const [customerPickerVisible, setCustomerPickerVisible] = useState(false);
  const [addingCustomer, setAddingCustomer] = useState(false);
  const [customerQuery, setCustomerQuery] = useState("");
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerPhone, setNewCustomerPhone] = useState("");
  const [customerError, setCustomerError] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [reference, setReference] = useState("");
  const [dueDate, setDueDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const selectedCustomer = mockService
    .getCustomers()
    .find(
      (customer) =>
        customer.id === selectedCustomerId &&
        customer.businessId === appConfig.businessId,
    );
  const filteredCustomers = mockService
    .getCustomers()
    .filter((customer) => {
      const query = customerQuery.trim().toLowerCase();
      return (
        customer.businessId === appConfig.businessId &&
        customer.status === "active" &&
        (!query ||
          customer.name.toLowerCase().includes(query) ||
          customer.phone.toLowerCase().includes(query))
      );
    });

  const handleCreateCustomer = () => {
    if (!newCustomerName.trim()) {
      setCustomerError("Customer name is required.");
      return;
    }
    if (!isValidPhone(newCustomerPhone)) {
      setCustomerError("Enter a valid phone number.");
      return;
    }

    try {
      const customer = mockService.createCustomer({
        businessId: appConfig.businessId,
        name: newCustomerName,
        phone: newCustomerPhone,
      });
      setSelectedCustomerId(customer.id);
      setCustomerPickerVisible(false);
      setAddingCustomer(false);
      setCustomerQuery("");
      setNewCustomerName("");
      setNewCustomerPhone("");
      setCustomerError("");
      setError("");
    } catch (createError) {
      setCustomerError(getErrorMessage(createError));
    }
  };

  const handleSave = () => {
    const value = parseAmount(amount);
    const validDueDate = toIsoDate(dueDate);
    if (!selectedCustomer) {
      setError(
        preselectedCustomerId
          ? "The selected customer could not be found."
          : "Select a customer before saving this due.",
      );
      return;
    }
    if (!value) {
      setError(getAmountError(amount) ?? "Enter a valid amount.");
      return;
    }
    if (!validDueDate) {
      setError("Enter a valid due date in YYYY-MM-DD format.");
      return;
    }
    try {
      mockService.addTransaction({
        businessId: appConfig.businessId,
        customerId: selectedCustomer.id,
        type: "credit",
        amount: value,
        description: description.trim() || "Due added",
        reference: reference.trim() || `INV-${Date.now()}`,
        dueDate: validDueDate,
        notes: notes.trim() || undefined,
      });
      setError("");
      navigation.goBack();
    } catch (saveError) {
      setError(getErrorMessage(saveError));
    }
  };

  return (
    <ScreenWrapper theme={theme} scrollable>
      <Header
        title="Add Due"
        theme={theme}
        onBack={() => navigation.goBack()}
      />
      <Text style={[customerStyles.label, { color: theme.colors.textSecondary }]}>
        Customer
      </Text>
      <Pressable
        accessibilityRole={preselectedCustomerId ? undefined : "button"}
        accessibilityLabel={
          selectedCustomer
            ? `Customer: ${selectedCustomer.name}${
                preselectedCustomerId ? "" : ", change selection"
              }`
            : "Select customer"
        }
        disabled={Boolean(preselectedCustomerId)}
        onPress={() => {
          setCustomerPickerVisible(true);
          setAddingCustomer(false);
          setCustomerError("");
        }}
        style={[
          customerStyles.customerField,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            borderRadius: theme.radius.sm,
          },
        ]}
      >
        <View style={customerStyles.customerCopy}>
          <Text
            numberOfLines={1}
            style={[
              customerStyles.customerName,
              {
                color: selectedCustomer
                  ? theme.colors.textPrimary
                  : theme.colors.textSecondary,
              },
            ]}
          >
            {selectedCustomer?.name ?? "Select a customer"}
          </Text>
          {selectedCustomer ? (
            <Text
              numberOfLines={1}
              style={[
                customerStyles.customerPhone,
                { color: theme.colors.textSecondary },
              ]}
            >
              {selectedCustomer.phone}
            </Text>
          ) : null}
        </View>
        <Ionicons
          name={preselectedCustomerId ? "lock-closed-outline" : "chevron-down"}
          size={20}
          color={theme.colors.primary}
        />
      </Pressable>

      <Modal
        animationType="slide"
        onRequestClose={() => setCustomerPickerVisible(false)}
        transparent
        visible={customerPickerVisible && !preselectedCustomerId}
      >
        <View style={customerStyles.modalBackdrop}>
          <View
            style={[
              customerStyles.modal,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <View style={customerStyles.modalHeader}>
              <View style={customerStyles.modalHeading}>
                <Text
                  style={[
                    customerStyles.modalTitle,
                    { color: theme.colors.textPrimary },
                  ]}
                >
                  {addingCustomer ? "Add customer" : "Select customer"}
                </Text>
                <Text
                  style={[
                    customerStyles.modalSubtitle,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  {addingCustomer
                    ? "Create a customer and attach them to this due."
                    : "Search by customer name or phone number."}
                </Text>
              </View>
              <Pressable
                accessibilityLabel="Close customer selector"
                accessibilityRole="button"
                hitSlop={8}
                onPress={() => setCustomerPickerVisible(false)}
                style={customerStyles.closeButton}
              >
                <Ionicons
                  name="close"
                  size={20}
                  color={theme.colors.textPrimary}
                />
              </Pressable>
            </View>
            {addingCustomer ? (
              <>
                <InputField
                  label="Customer name"
                  placeholder="Enter customer name"
                  value={newCustomerName}
                  onChangeText={(value) => {
                    setNewCustomerName(value);
                    setCustomerError("");
                  }}
                  theme={theme}
                />
                <PhoneInput
                  label="Phone number"
                  placeholder="+91 98765 43210"
                  value={newCustomerPhone}
                  onChangeText={(value) => {
                    setNewCustomerPhone(value);
                    setCustomerError("");
                  }}
                  theme={theme}
                />
                {customerError ? (
                  <Text
                    accessibilityLiveRegion="polite"
                    style={[
                      customerStyles.error,
                      { color: theme.colors.error },
                    ]}
                  >
                    {customerError}
                  </Text>
                ) : null}
                <AppButton
                  title="Create and select customer"
                  onPress={handleCreateCustomer}
                  theme={theme}
                  gradient
                />
                <AppButton
                  title="Back to customer list"
                  onPress={() => {
                    setAddingCustomer(false);
                    setCustomerError("");
                  }}
                  theme={theme}
                  variant="secondary"
                />
              </>
            ) : (
              <>
                <TextInput
                  accessibilityLabel="Search customers"
                  autoCorrect={false}
                  onChangeText={setCustomerQuery}
                  placeholder="Search customers"
                  placeholderTextColor={theme.colors.textSecondary}
                  style={[
                    customerStyles.searchInput,
                    {
                      backgroundColor: theme.colors.surfaceAlt,
                      borderColor: theme.colors.border,
                      color: theme.colors.textPrimary,
                    },
                  ]}
                  value={customerQuery}
                />
                <FlatList
                  data={filteredCustomers}
                  keyExtractor={(customer) => customer.id}
                  keyboardShouldPersistTaps="handled"
                  ListEmptyComponent={
                    <Text
                      style={[
                        customerStyles.emptyText,
                        { color: theme.colors.textSecondary },
                      ]}
                    >
                      No matching customers found.
                    </Text>
                  }
                  renderItem={({ item }) => (
                    <Pressable
                      accessibilityRole="button"
                      onPress={() => {
                        setSelectedCustomerId(item.id);
                        setCustomerPickerVisible(false);
                        setCustomerQuery("");
                        setError("");
                      }}
                      style={[
                        customerStyles.customerOption,
                        { borderBottomColor: theme.colors.border },
                      ]}
                    >
                      <View style={customerStyles.customerCopy}>
                        <Text
                          style={[
                            customerStyles.customerName,
                            { color: theme.colors.textPrimary },
                          ]}
                        >
                          {item.name}
                        </Text>
                        <Text
                          style={[
                            customerStyles.customerPhone,
                            { color: theme.colors.textSecondary },
                          ]}
                        >
                          {item.phone}
                        </Text>
                      </View>
                      {item.id === selectedCustomerId ? (
                        <Ionicons
                          name="checkmark-circle"
                          size={21}
                          color={theme.colors.primary}
                        />
                      ) : null}
                    </Pressable>
                  )}
                  style={customerStyles.customerList}
                />
                <AppButton
                  title="Add new customer"
                  onPress={() => {
                    setAddingCustomer(true);
                    setCustomerError("");
                  }}
                  theme={theme}
                  variant="secondary"
                />
              </>
            )}
          </View>
        </View>
      </Modal>
      <AmountInput
        label="Amount"
        placeholder="₹10,000"
        value={amount}
        onChangeText={setAmount}
        theme={theme}
      />
      <InputField
        label="Description"
        placeholder="Invoice or product description"
        value={description}
        onChangeText={setDescription}
        theme={theme}
      />
      <InputField
        label="Invoice / reference number"
        placeholder="INV-1024"
        value={reference}
        onChangeText={setReference}
        theme={theme}
      />
      <InputField
        label="Due date"
        placeholder="2026-10-10"
        value={dueDate}
        onChangeText={setDueDate}
        theme={theme}
      />
      <InputField
        label="Optional notes"
        placeholder="Notes"
        value={notes}
        onChangeText={setNotes}
        theme={theme}
        multiline
      />
      {error ? (
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          {error}
        </Text>
      ) : null}
      <AppButton title="Save" onPress={handleSave} theme={theme} gradient />
    </ScreenWrapper>
  );
}

export { AddDueScreen as AddTransactionScreen };

const customerStyles = StyleSheet.create({
  label: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
  },
  customerField: {
    alignItems: "center",
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    minHeight: 54,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  customerCopy: {
    flex: 1,
    gap: 3,
    minWidth: 0,
  },
  customerName: {
    fontSize: 15,
    fontWeight: "700",
  },
  customerPhone: {
    fontSize: 12,
  },
  modalBackdrop: {
    backgroundColor: "#00000066",
    flex: 1,
    justifyContent: "flex-end",
  },
  modal: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "82%",
    minHeight: "48%",
    paddingBottom: 28,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  modalHeader: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
    marginBottom: 18,
  },
  modalHeading: {
    flex: 1,
    gap: 4,
  },
  modalTitle: {
    fontSize: 19,
    fontWeight: "800",
  },
  modalSubtitle: {
    fontSize: 13,
  },
  closeButton: {
    alignItems: "center",
    borderRadius: 999,
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  searchInput: {
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 15,
    minHeight: 48,
    paddingHorizontal: 14,
  },
  customerList: {
    flexGrow: 0,
    marginBottom: 12,
    marginTop: 8,
  },
  customerOption: {
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    minHeight: 62,
    paddingVertical: 10,
  },
  emptyText: {
    paddingVertical: 22,
    textAlign: "center",
  },
  error: {
    fontSize: 13,
    marginBottom: 12,
    marginTop: -6,
  },
});
