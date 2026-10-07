import { useState } from "react";
import { ScrollView, Text, View, Pressable } from "react-native";
import { EmptyState, SectionHeader } from "../../components/ui";
import { FinanceScreenBackground } from "../../components/layout/FinanceScreenBackground";
import { TransactionCard } from "../../components/composite/TransactionCard";
import { mockService } from "../../services/mockServices";
import { styles, transactionFilters, useRefreshOnFocus } from "../shared";
import type { TransactionFilter, TransactionsScreenProps } from "../shared";

export function TransactionsScreen({
  navigation,
  theme,
}: TransactionsScreenProps) {
  useRefreshOnFocus();
  const [filter, setFilter] = useState<TransactionFilter>("All");
  const transactionList = mockService.getTransactions();
  const filtered = transactionList.filter(
    (item) =>
      filter === "All" ||
      (filter === "Credits" ? item.type === "credit" : item.type === "payment"),
  );

  return (
    <FinanceScreenBackground theme={theme}>
      <ScrollView
        style={[styles.listContainer, { backgroundColor: "transparent" }]}
        contentContainerStyle={styles.contentContainer}
      >
      <SectionHeader title="Transaction history" theme={theme} />
      <View style={styles.filterRow}>
        {transactionFilters.map((item) => (
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
      {filtered.length === 0 ? (
        <EmptyState
          title="No transactions yet"
          description="Your transaction history will appear here."
          theme={theme}
          actionLabel="Add Transaction"
          onAction={() =>
            navigation.navigate("AddDue", {
              customerId: mockService.getCustomers()[0]?.id ?? "cust-1",
            })
          }
        />
      ) : null}
      {filtered.map((transaction) => (
        <TransactionCard
          key={transaction.id}
          transaction={transaction}
          customerName={
            mockService.getCustomer(transaction.customerId)?.name ??
            "Unknown customer"
          }
          theme={theme}
        />
      ))}
      </ScrollView>
    </FinanceScreenBackground>
  );
}

export { TransactionsScreen as TransactionListScreen };
