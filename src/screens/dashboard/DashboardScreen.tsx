import { ScrollView, Text, View } from "react-native";
import { AppButton, Card, SectionHeader } from "../../components/ui";
import { mockService } from "../../services/mockServices";
import { useCurrencyFormatter } from "../../hooks/useCurrencyFormatter";
import { getGreeting, styles, useRefreshOnFocus } from "../shared";
import type { HomeScreenProps } from "../shared";

export function HomeScreen({ navigation, theme }: HomeScreenProps) {
  useRefreshOnFocus();
  const formatMoney = useCurrencyFormatter();
  const summary = mockService.getDashboardSummary();
  const attentionCustomers = mockService
    .getCustomers()
    .filter(
      (customer) =>
        mockService.getCustomerOverdueBalance(customer.id) > 0 ||
        mockService.getCustomerDueTodayBalance(customer.id) > 0,
    )
    .slice(0, 3);

  return (
    <ScrollView
      style={[
        styles.listContainer,
        { backgroundColor: theme.colors.background },
      ]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.topBar}>
        <Text style={[styles.greeting, { color: theme.colors.textPrimary }]}>
          {getGreeting()}, Raj 👋
        </Text>
      </View>
      <Card
        theme={theme}
        style={{
          backgroundColor: theme.colors.primary,
          borderColor: theme.colors.primary,
        }}
      >
        <Text style={styles.cardLabel}>Total Pending</Text>
        <Text style={styles.principalAmount}>
          {formatMoney(summary.totalPending)}
        </Text>
      </Card>

      <View style={styles.summaryGrid}>
        <Card theme={theme} style={{ flex: 1 }}>
          <Text style={styles.summaryLabel}>Due Today</Text>
          <Text style={[styles.summaryValue, { color: theme.colors.primary }]}>
            {formatMoney(summary.dueToday)}
          </Text>
        </Card>
        <Card theme={theme} style={{ flex: 1 }}>
          <Text style={styles.summaryLabel}>Overdue</Text>
          <Text style={[styles.summaryValue, { color: theme.colors.error }]}>
            {formatMoney(summary.overdue)}
          </Text>
        </Card>
      </View>
      <Card theme={theme}>
        <Text style={styles.summaryLabel}>Collected This Month</Text>
        <Text style={[styles.summaryValue, { color: theme.colors.success }]}>
          {formatMoney(summary.collectedThisMonth)}
        </Text>
      </Card>

      <SectionHeader title="Needs Attention" theme={theme} />
      {attentionCustomers.map((customer) => (
        <Card key={customer.id} theme={theme}>
          <View style={styles.rowBetween}>
            <View>
              <Text
                style={[styles.listTitle, { color: theme.colors.textPrimary }]}
              >
                {customer.name}
              </Text>
              <Text
                style={[styles.listMeta, { color: theme.colors.textSecondary }]}
              >
                {mockService.getCustomerOverdueBalance(customer.id) > 0
                  ? `${formatMoney(
                      mockService.getCustomerOverdueBalance(customer.id),
                    )} overdue`
                  : `${formatMoney(
                      mockService.getCustomerDueTodayBalance(customer.id),
                    )} due today`}
              </Text>
            </View>
            <AppButton
              title="Remind"
              onPress={() =>
                navigation.navigate("SendReminder", { customerId: customer.id })
              }
              theme={theme}
              variant="secondary"
            />
          </View>
        </Card>
      ))}

      <View style={styles.actionRow}>
        <AppButton
          title="Add Transaction"
          onPress={() =>
            navigation.navigate("AddDue", { customerId: "cust-1" })
          }
          theme={theme}
        />
        <AppButton
          title="Add Customer"
          onPress={() => navigation.navigate("AddCustomer")}
          theme={theme}
          variant="secondary"
        />
      </View>
    </ScrollView>
  );
}

export { HomeScreen as DashboardScreen };
