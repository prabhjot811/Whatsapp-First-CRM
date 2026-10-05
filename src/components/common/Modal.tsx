import React from "react";
import {
  Modal as NativeModal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import type { AppTheme } from "../../theme/theme";

interface ModalProps extends React.PropsWithChildren {
  visible: boolean;
  title: string;
  onClose(): void;
  theme: AppTheme;
}

export function Modal({
  visible,
  title,
  onClose,
  theme,
  children,
}: ModalProps) {
  return (
    <NativeModal
      animationType="fade"
      onRequestClose={onClose}
      transparent
      visible={visible}
    >
      <Pressable onPress={onClose} style={styles.backdrop}>
        <Pressable
          accessibilityRole="none"
          onPress={(event) => event.stopPropagation()}
          style={[
            styles.dialog,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
            {title}
          </Text>
          <View>{children}</View>
        </Pressable>
      </Pressable>
    </NativeModal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    alignItems: "center",
    backgroundColor: "#0008",
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  dialog: {
    borderRadius: 18,
    borderWidth: 1,
    maxWidth: 480,
    padding: 20,
    width: "100%",
  },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 16 },
});
