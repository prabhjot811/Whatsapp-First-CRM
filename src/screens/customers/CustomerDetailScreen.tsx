import { ScrollView, Text, View } from "react-native";
import { AppButton, Card, EmptyState, ErrorState, SectionHeader } from "../../components/ui";
import { Header } from "../../components/layout/Header";
import { mockService } from "../../services/mockServices";
import { formatDate } from "../../utils/dateFormatter";
import { useCurrencyFormatter } from "../../hooks/useCurrencyFormatter";
import { amountColor, styles, useRefreshOnFocus } from "../shared";
import type { CustomerDetailScreenProps } from "../shared";

export function CustomerDetailScreen({
  route,
  navigation,
  theme,
}: CustomerDetailScreenProps) {
  useRefreshOnFocus();
  const formatMoney = useCurrencyFormatter();
  const customer = mockService.getCustomer(route.params.customerId);
  const transactions = mockService.getCustomerTransactions(
    route.params.customerId,
  );
  const payments = mockService
    .getCustomerPayments(route.params.customerId)
    .filter((payment) => payment.status === "successful");
  const nextDueDate = transactions
    .filter(
      (transaction) =>
        transaction.type === "credit" && transaction.dueDate !== undefined,
    )
    .sort(
      (a, b) =>
        new Date(a.dueDate ?? 0).getTime() - new Date(b.dueDate ?? 0).getTime(),
    )[0]?.dueDate;
  const balance = mockService.getCustomerOutstandingBalance(
    route.params.customerId,
  );

  if (!customer) {
    return (
      <ErrorState
        title="Customer not found"
        description="This customer could not be loaded."
        onRetry={() => navigation.goBack()}
        theme={theme}
      />
    );
  }

  return (
    <ScrollView
      style={[
        styles.listContainer,
        { backgroundColor: theme.colors.background },
      ]}
      contentContainerStyle={styles.contentContainer}
    >
      <Header
        title={customer.name}
        theme={theme}
        onBack={() => navigation.goBack()}
      />
      <Text style={[styles.listMeta, { color: theme.colors.textSecondary }]}>
        {customer.phone}
      </Text>

      <Card theme={theme}>
        <Text
          style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}
        >
          Total Due
        </Text>
        <Text
          style={[styles.summaryValue, { color: amountColor(balance, theme) }]}
        >
          {formatMoney(balance)}
        </Text>
        <Text style={[styles.listMeta, { color: theme.colors.textSecondary }]}>
          Last payment:{" "}
          {payments[0] ? formatMoney(payments[0].amount) : "No payments"}
        </Text>
        <Text style={[styles.listMeta, { color: theme.colors.textSecondary }]}>
          Next due: {nextDueDate ? formatDate(nextDueDate) : "No due date"}
        </Text>
      </Card>

      <View style={styles.actionRow}>
        <AppButton
          title="Send Reminder"
          onPress={() =>
            navigation.navigate("SendReminder", { customerId: customer.id })
          }
          theme={theme}
        />
        <AppButton
          title="Add Due"
          onPress={() =>
            navigation.navigate("AddDue", { customerId: customer.id })
          }
          theme={theme}
          variant="secondary"
        />
      </View>
      <View style={styles.actionRow}>
        <AppButton
          title="Record Payment"
          onPress={() =>
            navigation.navigate("RecordPayment", { customerId: customer.id })
          }
          theme={theme}
          variant="secondary"
        />
      </View>

      <SectionHeader title="Transactions" theme={theme} />
      {transactions.length === 0 ? (
        <EmptyState
          title="No transactions"
          description="Add a due or payment to get started."
          actionLabel="Add Due"
          onAction={() =>
            navigation.navigate("AddDue", { customerId: customer.id })
          }
          theme={theme}
        />
      ) : null}
      {transactions.slice(0, 3).map((transaction) => (
        <Card key={transaction.id} theme={theme}>
          <View style={styles.rowBetween}>
            <Text
              style={[styles.listTitle, { color: theme.colors.textPrimary }]}
            >
              {transaction.type === "credit" ? "Credit" : "Payment"}
            </Text>
            <Text
              style={[
                styles.moneyText,
                {
                  color:
                    transaction.type === "credit"
                      ? theme.colors.primary
                      : theme.colors.success,
                },
              ]}
            >
              {formatMoney(transaction.amount)}
            </Text>
          </View>
          <Text
            style={[styles.listMeta, { color: theme.colors.textSecondary }]}
          >
            {transaction.description}
          </Text>
        </Card>
      ))}
    </ScrollView>
  );
}
