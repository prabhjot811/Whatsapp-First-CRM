import { useState } from "react";
import { FlatList, Text, TextInput, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { EmptyState } from "../../components/ui";
import { CustomerCard } from "../../components/composite/CustomerCard";
import { mockService } from "../../services/mockServices";
import { useDebounce } from "../../hooks/useDebounce";
import { customerFilters, styles, useRefreshOnFocus } from "../shared";
import type { CustomerFilter, CustomersScreenProps } from "../shared";

export function CustomersScreen({ navigation, theme }: CustomersScreenProps) {
  useRefreshOnFocus();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<CustomerFilter>("All");
  const debouncedQuery = useDebounce(query, 250);
  const customersList = mockService
    .getCustomers()
    .filter((customer) => customer.status === "active");

  const filteredCustomers = customersList.filter((customer) => {
    const matchesQuery =
      customer.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
      customer.phone.includes(debouncedQuery);
    if (!matchesQuery) return false;
    if (filter === "All") return true;
    const balance = mockService.getCustomerOutstandingBalance(customer.id);
    if (filter === "With Dues") return balance > 0;
    if (filter === "Due Today")
      return mockService.getCustomerDueTodayBalance(customer.id) > 0;
    if (filter === "Overdue")
      return mockService.getCustomerOverdueBalance(customer.id) > 0;
    return balance === 0;
  });

  return (
    <View
      style={[
        styles.listContainer,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <View style={styles.toolbar}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search customers"
          style={[
            styles.searchInput,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              color: theme.colors.textPrimary,
            },
          ]}
        />
        <Pressable
          onPress={() => navigation.navigate("AddCustomer")}
          style={styles.addButton}
        >
          <Ionicons name="person-add" size={22} color={theme.colors.primary} />
          <Text style={[styles.addButtonText, { color: theme.colors.primary }]}>
            Add Customer
          </Text>
        </Pressable>
      </View>

      <View style={styles.filterRow}>
        {customerFilters.map((item) => (
          <Pressable
            key={item}
            onPress={() => setFilter(item)}
            style={[
              styles.filterChip,
              {
                backgroundColor:
                  filter === item ? theme.colors.primary : theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.filterText,
                { color: filter === item ? "#fff" : theme.colors.textPrimary },
              ]}
            >
              {item}
            </Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={filteredCustomers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CustomerCard
            customer={item}
            balance={mockService.getCustomerOutstandingBalance(item.id)}
            overdueBalance={mockService.getCustomerOverdueBalance(item.id)}
            dueTodayBalance={mockService.getCustomerDueTodayBalance(item.id)}
            theme={theme}
            onPress={() =>
              navigation.navigate("CustomerDetail", { customerId: item.id })
            }
          />
        )}
        ListEmptyComponent={
          <EmptyState
            title="No customers yet"
            description="Start by adding your first customer."
            actionLabel="Add Customer"
            onAction={() => navigation.navigate("AddCustomer")}
            theme={theme}
          />
        }
      />
    </View>
  );
}

export { CustomersScreen as CustomerListScreen };
