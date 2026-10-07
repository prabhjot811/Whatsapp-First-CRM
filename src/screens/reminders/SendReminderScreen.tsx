import { useState } from "react";
import { Text, TextInput, View, Pressable } from "react-native";
import { AppButton, Card } from "../../components/ui";
import { ScreenWrapper } from "../../components/layout/ScreenWrapper";
import { Header } from "../../components/layout/Header";
import { mockService } from "../../services/mockServices";
import { formatDate } from "../../utils/dateFormatter";
import { getErrorMessage } from "../../utils/errorHandler";
import { useBusiness } from "../../hooks/useBusiness";
import { useCurrencyFormatter } from "../../hooks/useCurrencyFormatter";
import { styles } from "../shared";
import type { ReminderScreenProps } from "../shared";

export function ReminderScreen({
  route,
  navigation,
  theme,
}: ReminderScreenProps) {
  const formatMoney = useCurrencyFormatter();
  const { business: activeBusiness } = useBusiness();
  const customer = mockService.getCustomer(route.params.customerId);
  const amount = mockService.getCustomerOutstandingBalance(
    route.params.customerId,
  );
  const nextDueDate = mockService
    .getCustomerTransactions(route.params.customerId)
    .find((transaction) => transaction.type === "credit" && transaction.dueDate)
    ?.dueDate;
  const templates = mockService.getReminderTemplates();
  const renderTemplate = (templateId: string) => {
    const template = templates.find((item) => item.id === templateId);
    if (!template) return "";
    return template.content
      .replaceAll("{customerName}", customer?.name ?? "Customer")
      .replaceAll("₹{amount}", formatMoney(amount))
      .replaceAll("{amount}", formatMoney(amount))
      .replaceAll(
        "{dueDate}",
        nextDueDate ? formatDate(nextDueDate) : "No due date set",
      )
      .replaceAll("{businessName}", activeBusiness.name);
  };
  const [selectedTemplateId, setSelectedTemplateId] = useState(
    templates[0]?.id ?? "",
  );
  const [message, setMessage] = useState(() =>
    renderTemplate(templates[0]?.id ?? ""),
  );
  const [error, setError] = useState("");

  const sendReminder = () => {
    if (!customer) {
      setError("Customer could not be found.");
      return;
    }
    if (amount <= 0) {
      setError("There is no outstanding balance to remind this customer about.");
      return;
    }
    if (!message.trim()) {
      setError("Add a reminder message before sending.");
      return;
    }
    try {
      const sentAt = new Date().toISOString();
      mockService.createReminder({
        customerId: customer.id,
        amount,
        channel: "WhatsApp",
        status: "sent",
        scheduledAt: sentAt,
        sentAt,
        message: message.trim(),
      });
      setError("");
      navigation.goBack();
    } catch (sendError) {
      setError(getErrorMessage(sendError));
    }
  };

  return (
    <ScreenWrapper theme={theme} scrollable>
      <Header
        title="Send Reminder"
        theme={theme}
        onBack={() => navigation.goBack()}
      />
      <Card theme={theme}>
        <Text
          style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}
        >
          Customer
        </Text>
        <Text style={[styles.listTitle, { color: theme.colors.textPrimary }]}>
          {customer?.name}
        </Text>
        <Text style={[styles.listMeta, { color: theme.colors.textSecondary }]}>
          Outstanding: {formatMoney(amount)}
        </Text>
        <Text style={[styles.listMeta, { color: theme.colors.textSecondary }]}>
          Due date: {nextDueDate ? formatDate(nextDueDate) : "Not set"}
        </Text>
      </Card>
      <Text style={[styles.screenLabel, { color: theme.colors.textSecondary }]}>
        WhatsApp template
      </Text>
      <View style={styles.filterRow}>
        {templates.map((template) => (
          <Pressable
            key={template.id}
            accessibilityRole="button"
            accessibilityState={{
              selected: selectedTemplateId === template.id,
            }}
            onPress={() => {
              setSelectedTemplateId(template.id);
              setMessage(renderTemplate(template.id));
            }}
            style={[
              styles.filterChip,
              {
                backgroundColor:
                  selectedTemplateId === template.id
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
                    selectedTemplateId === template.id
                      ? "#fff"
                      : theme.colors.textPrimary,
                },
              ]}
            >
              {template.name}
            </Text>
          </Pressable>
        ))}
      </View>
      <Text style={[styles.screenLabel, { color: theme.colors.textSecondary }]}>
        Message preview
      </Text>
      <TextInput
        value={message}
        onChangeText={setMessage}
        multiline
        style={[
          styles.messageInput,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            color: theme.colors.textPrimary,
          },
        ]}
      />
      {error ? (
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          {error}
        </Text>
      ) : null}
      <View style={styles.actionRow}>
        <AppButton
          title="Send via WhatsApp"
          onPress={sendReminder}
          theme={theme}
          disabled={amount <= 0}
          gradient
        />
        <AppButton
          title="Customize Message"
          onPress={() => setMessage(renderTemplate(selectedTemplateId))}
          theme={theme}
          variant="secondary"
        />
      </View>
    </ScreenWrapper>
  );
}

export { ReminderScreen as SendReminderScreen };
