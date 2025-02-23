import { Button, StyleSheet } from "react-native";
import { Text, View } from "@/components/Themed";
import { MonoText, PoppinsText } from "@/components/StyledText";
import { router, Stack } from "expo-router";

import { supabase } from "@/lib/supabase";

const handleLogout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Error logging out:", error);
  } else {
    router.replace("/(auth)/login");
  }
};
export default function TabTwoScreen() {
  return (
    <View style={styles.container}>
      {/*  Hide the header */}
      <Stack.Screen options={{ headerShown: false }} />

      <PoppinsText style={styles.title}>Tab Two</PoppinsText>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <MonoText>app/(tab)/two.tsx</MonoText>
      <PoppinsText>The header is hidden on this screen 😊</PoppinsText>

      <Button
        title="Logout"
        onPress={handleLogout}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
