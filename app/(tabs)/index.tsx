import { StyleSheet } from "react-native";
import { Text, View } from "@/components/Themed";
import { MonoText, PoppinsText } from "@/components/StyledText";
import { ExternalLink } from "@/components/ExternalLink";
import { AtSymbolIcon } from "react-native-heroicons/outline";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";

export default function TabOneScreen() {
  const theme = useColorScheme(); // Custom theme 1. Use the useColorScheme hook
  return (
    <View style={styles.container}>
      <PoppinsText style={styles.title}>Tab One</PoppinsText>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <MonoText>app/(tab)/index.tsx</MonoText>
      <View
        style={{
          // Inline styles
          marginVertical: 10,
          alignItems: "center",
          borderColor: Colors[theme ?? "light"].text,
          borderWidth: 1,
          padding: 10,
        }}
      >
        <PoppinsText>Connect with me</PoppinsText>

        <ExternalLink href="https://linkedin.com/in/bhuvneshverma">
          <View style={styles.link}>
            <AtSymbolIcon
              color={Colors[theme ?? "light"].text} // Custom theme 2. Use the theme variable
              size={14}
            />
            <MonoText>LinkedIn</MonoText>
          </View>
        </ExternalLink>
      </View>
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
  link: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
});
