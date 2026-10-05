import { Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppButton, Card } from "../../components/ui";
import { user } from "../../mock/data";
import { useAuth } from "../../hooks/useAuth";
import { useBusiness } from "../../hooks/useBusiness";
import { type RootStackParamList } from "../../navigation/types";
import { styles } from "../shared";
import type { ThemeProps } from "../shared";

export function ProfileScreen({
  navigation,
  theme,
}: NativeStackScreenProps<RootStackParamList, "Profile"> & ThemeProps) {
  const { user: signedInUser, signOut } = useAuth();
  const { business: currentBusiness } = useBusiness();

  return (
    <View
      style={[
        styles.screen,
        { backgroundColor: theme.colors.background, paddingHorizontal: 20 },
      ]}
    >
      <Text style={[styles.screenTitle, { color: theme.colors.textPrimary }]}>
        Profile
      </Text>
      <Card theme={theme}>
        <Text style={[styles.listTitle, { color: theme.colors.textPrimary }]}>
          {signedInUser?.name ?? user.name}
        </Text>
        <Text style={[styles.listMeta, { color: theme.colors.textSecondary }]}>
          {signedInUser?.phone ?? user.phone}
        </Text>
        <Text style={[styles.listMeta, { color: theme.colors.textSecondary }]}>
          Business: {currentBusiness.name}
        </Text>
      </Card>
      <AppButton
        title="Logout"
        onPress={() => {
          signOut();
          navigation.reset({ index: 0, routes: [{ name: "Welcome" }] });
        }}
        theme={theme}
        variant="ghost"
      />
    </View>
  );
}
