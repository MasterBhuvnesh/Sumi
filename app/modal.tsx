import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet } from "react-native";
import { View } from "@/components/Themed";
import { MonoText, PoppinsText } from "@/components/StyledText";
import { Stack } from "expo-router";

export default function ModalScreen() {
  return (
    <View style={styles.container}>
      {/* The header can also be styled  */}
      <Stack.Screen
        options={{
          headerTitleStyle: { fontFamily: "SpaceMono" },
        }}
      />
      <PoppinsText style={styles.title}>Modal</PoppinsText>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <MonoText>app/model.tsx</MonoText>
      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
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
