import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { AppButton, Card } from "../../components/ui";
import { typography } from "../../constants/typography";
import { mockService } from "../../services/mockServices";
import { useCurrencyFormatter } from "../../hooks/useCurrencyFormatter";
import { getGreeting, styles, useRefreshOnFocus } from "../shared";
import type { HomeScreenProps } from "../shared";

export function HomeScreen({ navigation, theme }: HomeScreenProps) {
  useRefreshOnFocus();
  const formatMoney = useCurrencyFormatter();
  const avatarTones = [
    `${theme.colors.success}18`,
    `${theme.colors.info}14`,
    `${theme.colors.warning}20`,
  ];
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
    <View style={dashboardStyles.screen}>
      <LinearGradient
        colors={[
          theme.colors.primaryDark,
          theme.colors.primary,
          theme.colors.success,
          theme.colors.primaryGradientStart,
        ]}
        end={{ x: 0.9, y: 1 }}
        start={{ x: 0.05, y: 0 }}
        style={StyleSheet.absoluteFill}
      />
      <View
        pointerEvents="none"
        style={dashboardStyles.wallpaper}
      >
        <View
          style={[
            dashboardStyles.wallpaperOrb,
            dashboardStyles.wallpaperOrbTop,
            { backgroundColor: `${theme.colors.onPrimary}16` },
          ]}
        />
        <View
          style={[
            dashboardStyles.wallpaperOrb,
            dashboardStyles.wallpaperOrbBottom,
            { backgroundColor: `${theme.colors.primaryDark}6B` },
          ]}
        />
        <View
          style={[
            dashboardStyles.wallpaperRing,
            dashboardStyles.wallpaperRingTop,
            { borderColor: `${theme.colors.onPrimary}50` },
          ]}
        />
        <View
          style={[
            dashboardStyles.wallpaperRing,
            dashboardStyles.wallpaperRingBottom,
            { borderColor: `${theme.colors.onPrimary}38` },
          ]}
        />
        <View
          style={[
            dashboardStyles.ledgerMotif,
            dashboardStyles.ledgerTop,
            {
              backgroundColor: `${theme.colors.onPrimary}16`,
              borderColor: `${theme.colors.onPrimary}54`,
            },
          ]}
        >
          <Ionicons
            name="receipt-outline"
            size={21}
            color={`${theme.colors.onPrimary}CC`}
          />
        </View>
        <View
          style={[
            dashboardStyles.ledgerMotif,
            dashboardStyles.ledgerBottom,
            {
              backgroundColor: `${theme.colors.primaryDark}50`,
              borderColor: `${theme.colors.onPrimary}42`,
            },
          ]}
        >
          <Ionicons
            name="trending-up-outline"
            size={22}
            color={`${theme.colors.onPrimary}D9`}
          />
        </View>
      </View>
      <ScrollView
        style={[styles.listContainer, dashboardStyles.transparent]}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
      <View style={styles.topBar}>
        <Text
          style={[
            styles.greeting,
            {
              color: theme.colors.onPrimary,
            },
          ]}
        >
          {getGreeting()}, Raj 👋
        </Text>
      </View>

      <View
        style={[
          dashboardStyles.pendingCard,
          {
            borderRadius: theme.radius.lg,
            boxShadow: `0px 9px 22px ${theme.colors.primary}30`,
          },
        ]}
      >
        <LinearGradient
          colors={[
            theme.colors.primaryDark,
            theme.colors.primary,
            theme.colors.primaryGradientEnd,
          ]}
          end={{ x: 1, y: 0.9 }}
          start={{ x: 0, y: 0 }}
          style={dashboardStyles.pendingGradient}
        >
          <View
            pointerEvents="none"
            style={[
              dashboardStyles.pendingGlow,
              { backgroundColor: `${theme.colors.onPrimary}0D` },
            ]}
          />
          <View
            style={[
              dashboardStyles.pendingIcon,
              {
                backgroundColor: `${theme.colors.onPrimary}1C`,
                borderColor: `${theme.colors.onPrimary}35`,
              },
            ]}
          >
            <Ionicons
              name="wallet"
              size={23}
              color={theme.colors.onPrimary}
            />
          </View>
          <View style={dashboardStyles.pendingCopy}>
            <Text
              style={[
                dashboardStyles.pendingLabel,
                { color: theme.colors.onPrimary },
              ]}
            >
              Total Pending
            </Text>
            <Text
              style={[
                dashboardStyles.pendingAmount,
                { color: theme.colors.onPrimary },
              ]}
            >
              {formatMoney(summary.totalPending)}
            </Text>
          </View>
          <Ionicons
            name="trending-up"
            size={22}
            color={`${theme.colors.onPrimary}B8`}
          />
        </LinearGradient>
      </View>

      <View style={dashboardStyles.summaryGrid}>
        <Card
          theme={theme}
          style={[
            dashboardStyles.metricCard,
            {
              backgroundColor: "#FFF0D2",
              borderColor: `${theme.colors.warning}45`,
              borderRadius: theme.radius.md,
              flex: 1,
            },
          ]}
        >
          <LinearGradient
            colors={["#FFF6E2", "#FFE7BF"]}
            end={{ x: 1, y: 1 }}
            start={{ x: 0, y: 0 }}
            style={[
              StyleSheet.absoluteFill,
              { borderRadius: theme.radius.md },
            ]}
          />
          <View
            style={[
              dashboardStyles.metricIcon,
              { backgroundColor: `${theme.colors.warning}28` },
            ]}
          >
            <Ionicons
              name="time"
              size={18}
              color={theme.colors.warning}
            />
          </View>
          <View style={dashboardStyles.metricCopy}>
            <Text
              style={[
                dashboardStyles.metricLabel,
                { color: "#111111" },
              ]}
            >
              Due Today
            </Text>
            <Text
              style={[
                dashboardStyles.metricValue,
                { color: "#111111" },
              ]}
            >
              {formatMoney(summary.dueToday)}
            </Text>
          </View>
        </Card>
        <Card
          theme={theme}
          style={[
            dashboardStyles.metricCard,
            {
              backgroundColor: "#FFE5E8",
              borderColor: `${theme.colors.error}38`,
              borderRadius: theme.radius.md,
              flex: 1,
            },
          ]}
        >
          <LinearGradient
            colors={["#FFF0F2", "#FFDDE2"]}
            end={{ x: 1, y: 1 }}
            start={{ x: 0, y: 0 }}
            style={[
              StyleSheet.absoluteFill,
              { borderRadius: theme.radius.md },
            ]}
          />
          <View
            style={[
              dashboardStyles.metricIcon,
              { backgroundColor: `${theme.colors.error}20` },
            ]}
          >
            <Ionicons
              name="alert-circle"
              size={18}
              color={theme.colors.error}
            />
          </View>
          <View style={dashboardStyles.metricCopy}>
            <Text
              style={[
                dashboardStyles.metricLabel,
                { color: "#111111" },
              ]}
            >
              Overdue
            </Text>
            <Text
              style={[
                dashboardStyles.metricValue,
                { color: "#111111" },
              ]}
            >
              {formatMoney(summary.overdue)}
            </Text>
          </View>
        </Card>
      </View>

      <Card
        theme={theme}
        style={[
          dashboardStyles.collectedCard,
          {
            borderColor: `${theme.colors.success}30`,
            borderRadius: theme.radius.md,
          },
        ]}
      >
        <View
          style={[
            dashboardStyles.collectedIcon,
            { backgroundColor: `${theme.colors.success}14` },
          ]}
        >
          <Ionicons
            name="checkmark-circle"
            size={19}
            color={theme.colors.success}
          />
        </View>
        <View>
          <Text
            style={[
              dashboardStyles.metricLabel,
              { color: theme.colors.textSecondary },
            ]}
          >
            Collected This Month
          </Text>
          <Text
            style={[
              dashboardStyles.metricValue,
              { color: theme.colors.success },
            ]}
          >
            {formatMoney(summary.collectedThisMonth)}
          </Text>
        </View>
      </Card>

      <View style={dashboardStyles.sectionHeader}>
        <Text
          style={[
            dashboardStyles.sectionTitle,
            { color: theme.colors.onPrimary },
          ]}
        >
          Needs Attention
        </Text>
      </View>
      {attentionCustomers.map((customer, index) => {
        const overdueBalance = mockService.getCustomerOverdueBalance(
          customer.id,
        );
        const dueTodayBalance = mockService.getCustomerDueTodayBalance(
          customer.id,
        );
        const isOverdue = overdueBalance > 0;
        const dueAmount = isOverdue ? overdueBalance : dueTodayBalance;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const oldestOverdueDate = isOverdue
          ? mockService
              .getCustomerTransactions(customer.id)
              .flatMap((transaction) => {
                if (transaction.type !== "credit" || !transaction.dueDate) {
                  return [];
                }
                const dueDate = new Date(transaction.dueDate);
                dueDate.setHours(0, 0, 0, 0);
                return [dueDate];
              })
              .filter((dueDate) => dueDate < today)
              .sort((first, second) => first.getTime() - second.getTime())[0]
          : undefined;
        const overdueDays = oldestOverdueDate
          ? Math.max(
              1,
              Math.floor(
                (today.getTime() -
                  new Date(
                    oldestOverdueDate.getFullYear(),
                    oldestOverdueDate.getMonth(),
                    oldestOverdueDate.getDate(),
                  ).getTime()) /
                  86_400_000,
              ),
            )
          : undefined;

        return (
          <Card
            key={customer.id}
            theme={theme}
            style={[
              dashboardStyles.customerCard,
              {
                borderColor: `${theme.colors.primary}20`,
                borderRadius: theme.radius.md,
              },
            ]}
          >
            <View style={dashboardStyles.customerRow}>
              <View
                style={[
                  dashboardStyles.avatar,
                  {
                    backgroundColor: avatarTones[index % avatarTones.length],
                    borderColor: `${theme.colors.primary}22`,
                  },
                ]}
              >
                <Ionicons
                  name="person"
                  size={18}
                  color={theme.colors.primaryDark}
                />
              </View>
              <View style={dashboardStyles.customerCopy}>
                <Text
                  numberOfLines={1}
                  style={[
                    dashboardStyles.customerName,
                    { color: theme.colors.textPrimary },
                  ]}
                >
                  {customer.name}
                </Text>
                <Text
                  numberOfLines={1}
                  style={[
                    dashboardStyles.customerMeta,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  <Text
                    style={[
                      dashboardStyles.customerAmount,
                      { color: theme.colors.error },
                    ]}
                  >
                    {formatMoney(dueAmount)}
                  </Text>
                  <Text>  •  </Text>
                  <Text
                    style={{
                      color: theme.colors.error,
                      fontWeight: "700",
                    }}
                  >
                    {isOverdue
                      ? overdueDays
                        ? `${overdueDays} ${
                            overdueDays === 1 ? "day" : "days"
                          } overdue`
                        : "Overdue"
                      : "Due today"}
                  </Text>
                </Text>
              </View>
              <Pressable
                accessibilityRole="button"
                onPress={() =>
                  navigation.navigate("SendReminder", {
                    customerId: customer.id,
                  })
                }
                style={({ pressed }) => [
                  dashboardStyles.remindButton,
                  {
                    backgroundColor: `${theme.colors.success}17`,
                    borderColor: `${theme.colors.success}28`,
                    borderRadius: theme.radius.sm,
                    opacity: pressed ? 0.74 : 1,
                  },
                ]}
              >
                <Text
                  style={[
                    dashboardStyles.remindText,
                    { color: theme.colors.primaryDark },
                  ]}
                >
                  Remind
                </Text>
              </Pressable>
            </View>
          </Card>
        );
      })}

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
    </View>
  );
}

export { HomeScreen as DashboardScreen };

const dashboardStyles = StyleSheet.create({
  screen: {
    flex: 1,
    overflow: "hidden",
    position: "relative",
  },
  transparent: {
    backgroundColor: "transparent",
  },
  wallpaper: {
    ...StyleSheet.absoluteFill,
    overflow: "hidden",
    pointerEvents: "none",
  },
  wallpaperOrb: {
    borderRadius: 999,
    position: "absolute",
  },
  wallpaperOrbTop: {
    height: 290,
    right: -175,
    top: -145,
    width: 290,
  },
  wallpaperOrbBottom: {
    bottom: -205,
    height: 360,
    left: -185,
    width: 360,
  },
  wallpaperRing: {
    borderRadius: 999,
    borderWidth: 2,
    position: "absolute",
  },
  wallpaperRingTop: {
    height: 270,
    right: -135,
    top: "22%",
    width: 270,
  },
  wallpaperRingBottom: {
    bottom: "9%",
    height: 230,
    left: -110,
    width: 230,
  },
  ledgerMotif: {
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    height: 48,
    justifyContent: "center",
    position: "absolute",
    width: 48,
  },
  ledgerTop: {
    right: 14,
    top: "43%",
    transform: [{ rotate: "12deg" }],
  },
  ledgerBottom: {
    bottom: "21%",
    left: 14,
    transform: [{ rotate: "-12deg" }],
  },
  sectionHeader: {
    marginBottom: 12,
    marginTop: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  pendingCard: {
    borderWidth: 1,
    borderColor: "transparent",
    marginBottom: 12,
    overflow: "hidden",
  },
  pendingGradient: {
    alignItems: "center",
    flexDirection: "row",
    minHeight: 92,
    overflow: "hidden",
    paddingHorizontal: 17,
    paddingVertical: 16,
  },
  pendingGlow: {
    borderRadius: 999,
    height: 160,
    position: "absolute",
    right: -65,
    top: -100,
    width: 210,
  },
  pendingIcon: {
    alignItems: "center",
    borderRadius: 15,
    borderWidth: 1,
    height: 48,
    justifyContent: "center",
    marginRight: 13,
    width: 48,
  },
  pendingCopy: {
    flex: 1,
  },
  pendingLabel: {
    fontSize: typography.bodySmall,
    fontWeight: "600",
    marginBottom: 3,
    opacity: 0.92,
  },
  pendingAmount: {
    fontSize: typography.h1,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  summaryGrid: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 2,
  },
  metricCard: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 12,
    minHeight: 76,
    paddingHorizontal: 11,
    paddingVertical: 11,
  },
  metricIcon: {
    alignItems: "center",
    borderRadius: 11,
    height: 36,
    justifyContent: "center",
    marginRight: 9,
    width: 36,
  },
  metricCopy: {
    flex: 1,
  },
  metricLabel: {
    fontSize: typography.caption,
    fontWeight: "600",
    marginBottom: 3,
  },
  metricValue: {
    fontSize: typography.body,
    fontWeight: "800",
  },
  collectedCard: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 2,
    paddingVertical: 12,
  },
  collectedIcon: {
    alignItems: "center",
    borderRadius: 11,
    height: 36,
    justifyContent: "center",
    marginRight: 11,
    width: 36,
  },
  customerCard: {
    marginBottom: 9,
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  customerRow: {
    alignItems: "center",
    flexDirection: "row",
  },
  avatar: {
    alignItems: "center",
    borderRadius: 999,
    borderWidth: 1,
    height: 42,
    justifyContent: "center",
    marginRight: 11,
    width: 42,
  },
  customerCopy: {
    flex: 1,
    minWidth: 0,
  },
  customerName: {
    fontSize: typography.bodySmall,
    fontWeight: "700",
  },
  customerMeta: {
    fontSize: typography.caption,
    marginTop: 4,
  },
  customerAmount: {
    fontSize: typography.caption,
    fontWeight: "700",
  },
  remindButton: {
    alignItems: "center",
    borderWidth: 1,
    justifyContent: "center",
    marginLeft: 8,
    minHeight: 34,
    minWidth: 68,
    paddingHorizontal: 11,
  },
  remindText: {
    fontSize: typography.caption,
    fontWeight: "700",
  },
});
