// app/(auth)/signup.tsx
import { useState } from "react";
import { TextInput, Alert, Pressable, TouchableOpacity } from "react-native";
import { Link, router, Stack } from "expo-router";
import { supabase } from "@/lib/supabase";
import { View } from "@/components/Themed";
import { MonoText, PoppinsText } from "@/components/StyledText";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";

export default function Signup() {
  const theme = useColorScheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setLoading(true);
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      Alert.alert("Error", signUpError.message);
      setLoading(false);
      return;
    }

    // Automatically log in the user after successful signup
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      Alert.alert("Error", signInError.message);
    } else {
      router.replace("/edit-profile"); // Redirect to the main app screen
    }

    setLoading(false);
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        backgroundColor: Colors[theme ?? "light"].background,
      }}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <MonoText
        style={{
          fontSize: 45,
          fontWeight: "bold",
          marginBottom: 20,
        }}
      >
        書
      </MonoText>
      <PoppinsText
        style={{
          fontSize: 32,
          marginBottom: 10,
        }}
      >
        Create an Account
      </PoppinsText>
      <PoppinsText
        style={{
          fontSize: 12,
          marginBottom: 60,
        }}
      >
        Please enter your details
      </PoppinsText>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor={Colors[theme ?? "light"].text}
        autoCapitalize="none"
        style={[
          {
            marginBottom: 10,
            padding: 10,
            borderBottomWidth: 1,
            borderColor: "#ccc",
            borderRadius: 5,
            width: "90%",
            fontFamily: "Poppins",
            color: Colors[theme ?? "light"].text,
          },
        ]}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor={Colors[theme ?? "light"].text}
        autoCapitalize="none"
        style={[
          {
            marginBottom: 10,
            padding: 10,
            borderBottomWidth: 1,
            borderColor: "#ccc",
            borderRadius: 5,
            width: "90%",
            fontFamily: "Poppins",
            color: Colors[theme ?? "light"].text,
          },
        ]}
      />

      <Pressable
        onPress={handleSignup}
        disabled={loading}
        style={{
          backgroundColor: Colors[theme ?? "light"].text,
          width: "80%",
          padding: 10,
          borderRadius: 5,
          alignItems: "center",
          justifyContent: "center",
          marginTop: 20,
        }}
      >
        <PoppinsText
          style={{
            borderRadius: 5,
            color: Colors[theme ?? "light"].background,
          }}
        >
          {loading ? "Loading..." : "Sign Up"}
        </PoppinsText>
      </Pressable>

      <TouchableOpacity
        onPress={() => router.push("/login")}
        style={{
          marginTop: 20,
        }}
      >
        <PoppinsText
          style={{
            color: Colors[theme ?? "light"].text,
          }}
        >
          Already have an account?{" "}
          <MonoText
            style={{
              color: Colors[theme ?? "light"].text,
              textDecorationLine: "underline",
            }}
          >
            Login
          </MonoText>
        </PoppinsText>
      </TouchableOpacity>
    </View>
  );
}
