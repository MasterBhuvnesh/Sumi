import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";
import { Text, View } from "@/components/Themed";
import { MonoText, PoppinsText } from "@/components/StyledText";
import { Stack } from "expo-router";
import { ExternalLink } from "@/components/ExternalLink";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
export default function ModalScreen() {
  const theme = useColorScheme();
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Stack.Screen
        options={{
          headerTitleStyle: { fontFamily: "SpaceMono" },
          headerStyle: { backgroundColor: Colors[theme ?? "light"].background },
          headerTintColor: Colors[theme ?? "light"].text,
        }}
      />
      <Text
        style={{
          fontSize: 48,
          fontFamily: "Sigmar",
        }}
      >
        SUMI
      </Text>

      <MonoText
        style={{
          fontSize: 16,
          margin: 20,
          textAlign: "center",
        }}
      >
        Sumi is inspired by Sumi-e, which means ink painting, and Sho, which
        means writing.
      </MonoText>
      <ExternalLink
        href="https://github.com/MasterBhuvnesh"
        style={{
          justifyContent: "center",
          alignItems: "flex-end",
        }}
      >
        <MonoText
          style={{
            fontSize: 16,
            margin: 20,
            textAlign: "center",
            color: Colors[theme ?? "light"].blue,
          }}
        >
          Made by @ MasterBhuvnesh
        </MonoText>
      </ExternalLink>
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}
