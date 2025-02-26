import React, { useState } from "react";
import { Pressable, StyleSheet, TextInput, Alert, View } from "react-native";
import { Text } from "@/components/Themed";
import { MonoText, PoppinsText } from "@/components/StyledText";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/lib/supabase";
import { Stack, useRouter } from "expo-router";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";

export default function AddQuoteScreen() {
  const { session } = useAuth();
  const router = useRouter();
  const [quote, setQuote] = useState("");
  const [enhancedQuote, setEnhancedQuote] = useState("");
  const [loading, setLoading] = useState(false);
  const theme = useColorScheme();

  const handleEnhanceQuote = async () => {
    if (!quote) {
      Alert.alert("Error", "Please enter a quote to enhance.");
      return;
    }

    setLoading(true);

    try {
      // Call the Gemini API to enhance the quote
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: quote }),
      });

      if (!response.ok) {
        throw new Error("Failed to enhance quote.");
      }

      const data = await response.json();
      setEnhancedQuote(data.enhancedQuote); // Set the enhanced quote
    } catch (error) {
      console.error("Error enhancing quote:", error);
      Alert.alert("Error", "Failed to enhance quote. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveQuote = async (quoteToSave: string) => {
    if (!quoteToSave) {
      Alert.alert("Error", "No quote to save.");
      return;
    }

    if (!session) {
      Alert.alert("Error", "You must be logged in to save a quote.");
      return;
    }

    try {
      const { error } = await supabase.from("quotes").insert([
        {
          text: quoteToSave,
          user_id: session.user.id,
        },
      ]);

      if (error) {
        throw error;
      }

      Alert.alert("Success", "Quote saved successfully!");
      router.replace("/"); // Navigate back to the home screen
    } catch (error) {
      console.error("Error saving quote:", error);
      Alert.alert("Error", "Failed to save quote. Please try again.");
    }
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
      {" "}
      <Stack.Screen options={{ headerShown: false }} />
      <View
        style={{
          width: "100%",
          backgroundColor: Colors[theme ?? "light"].background,
          padding: 20,
        }}
      >
        <PoppinsText
          style={{
            fontSize: 20,
            marginBottom: 20,
            color: Colors[theme ?? "light"].text,
          }}
        >
          Add a Quote
        </PoppinsText>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: Colors[theme ?? "light"].text,
            borderRadius: 5,
            padding: 10,
            marginBottom: 20,
            minHeight: 100,
            color: Colors[theme ?? "light"].text,
            fontFamily: "Poppins",
          }}
          placeholder="Enter your quote..."
          placeholderTextColor={Colors[theme ?? "light"].text}
          value={quote}
          onChangeText={setQuote}
          multiline
        />
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Pressable
            onPress={handleEnhanceQuote}
            disabled={loading}
            style={{
              backgroundColor: Colors[theme ?? "light"].text,
              padding: 10,
              borderRadius: 15,
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              marginRight: 10,
            }}
          >
            <PoppinsText
              style={{
                color: Colors[theme ?? "light"].background,
                fontFamily: "Poppins",
              }}
            >
              {loading ? "Enhancing..." : "Enhance Quote"}
            </PoppinsText>
          </Pressable>
          <Pressable
            onPress={() => handleSaveQuote(quote)} // Save the original quote
            disabled={!quote || loading} // Disable if no quote or loading
            style={{
              backgroundColor: Colors[theme ?? "light"].text,
              padding: 10,
              borderRadius: 15,
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              marginLeft: 10,
            }}
          >
            <PoppinsText
              style={{
                color: Colors[theme ?? "light"].background,
                fontFamily: "Poppins",
              }}
            >
              Save Quote
            </PoppinsText>
          </Pressable>
        </View>
        {enhancedQuote && (
          <>
            <PoppinsText
              style={{
                fontSize: 18,
                marginTop: 20,
                marginBottom: 10,
                color: Colors[theme ?? "light"].text,
              }}
            >
              Enhanced Quote:
            </PoppinsText>
            <MonoText
              style={{
                fontSize: 16,
                marginBottom: 20,
                color: Colors[theme ?? "light"].text,
              }}
            >
              {enhancedQuote}
            </MonoText>
            <Pressable
              onPress={() => handleSaveQuote(enhancedQuote)} // Save the enhanced quote
              style={{
                backgroundColor: Colors[theme ?? "light"].text,
                padding: 10,
                borderRadius: 15,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <PoppinsText
                style={{
                  color: Colors[theme ?? "light"].background,
                  fontFamily: "Poppins",
                }}
              >
                Save Enhanced Quote
              </PoppinsText>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
}
