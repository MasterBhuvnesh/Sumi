import React, { useState, useEffect } from "react";
import { Pressable, StyleSheet, TextInput, Image, Alert } from "react-native";
import { Text, View } from "@/components/Themed";
import { MonoText, PoppinsText } from "@/components/StyledText";
import { router, Stack } from "expo-router";
import * as ImagePicker from "expo-image-picker";

import { supabase } from "@/lib/supabase";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { ArrowUpTrayIcon } from "react-native-heroicons/outline";

export default function EditScreen() {
  const theme = useColorScheme();
  const [fullname, setFullname] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  // Fetch user data from the `users` table
  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) {
          Alert.alert("Error", error.message);
          return;
        }

        setUserData(data);
        setFullname(data.fullname || "");
        setDateOfBirth(data.date_of_birth || "");
        setProfilePic(data.profile_pic || null);
      }
    };

    fetchUserData();
  }, []);

  // Upload profile picture
  const uploadProfilePic = async () => {
    try {
      setUploading(true);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        console.log("User cancelled image picker.");
        return;
      }

      const image = result.assets[0];
      if (!image.uri) {
        throw new Error("No image URI found.");
      }

      // Convert the image to an array buffer
      const arrayBuffer = await fetch(image.uri).then((res) =>
        res.arrayBuffer()
      );

      // Upload the image to Supabase Storage
      const fileExt = image.uri.split(".").pop()?.toLowerCase() || "jpeg";
      const filePath = `${Date.now()}.${fileExt}`;

      const { data, error: uploadError } = await supabase.storage
        .from("profile_pics")
        .upload(filePath, arrayBuffer, {
          contentType: image.mimeType || "image/jpeg",
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL of the uploaded image
      const { data: urlData } = supabase.storage
        .from("profile_pics")
        .getPublicUrl(data.path);

      setProfilePic(urlData.publicUrl);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Error", error.message);
      }
    } finally {
      setUploading(false);
    }
  };

  // Save user data
  const handleSave = async () => {
    if (!fullname || !dateOfBirth) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateOfBirth)) {
      Alert.alert(
        "Error",
        "Please enter a valid date in the format YYYY-MM-DD"
      );
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      Alert.alert("Error", "User not authenticated");
      return;
    }
    const username = user.email?.split("@")[0] || "user";
    // Update user data in the `users` table
    const { error } = await supabase.from("users").upsert([
      {
        id: user.id,
        username,
        email: user.email,
        fullname,
        profile_pic: profilePic,
        date_of_birth: dateOfBirth,
      },
    ]);

    if (error) {
      Alert.alert("Error", error.message);
      return;
    }

    Alert.alert("Success", "Profile updated successfully");
    router.replace("/");
  };

  if (!userData) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: Colors[theme ?? "light"].background,
        }}
      >
        <Stack.Screen
          options={{
            headerShown: false,
            headerTitleStyle: { fontFamily: "SpaceMono" },
            headerStyle: {
              backgroundColor: Colors[theme ?? "light"].background,
            },
            headerTintColor: Colors[theme ?? "light"].text,
          }}
        />
        <MonoText>Loading...</MonoText>
      </View>
    );
  }

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
      <View
        style={{
          width: "100%",
          backgroundColor: Colors[theme ?? "light"].background,
          borderWidth: 1,
          borderColor: Colors[theme ?? "light"].text,
          borderRadius: 15,
          padding: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
      >
        <View
          style={{
            alignSelf: "flex-end",
            backgroundColor: Colors[theme ?? "light"].text,
            padding: 10,
            borderRadius: 10,
          }}
        >
          <Pressable onPress={uploadProfilePic}>
            <ArrowUpTrayIcon
              size={18}
              color={Colors[theme ?? "light"].background}
            />
          </Pressable>
        </View>

        <View
          style={{
            alignItems: "center",
            marginVertical: 20,
          }}
        >
          {profilePic && (
            <Image
              source={{ uri: profilePic }}
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                borderWidth: 2,
                borderColor: Colors[theme ?? "light"].text,
              }}
            />
          )}
        </View>

        <View
          style={{
            width: "100%",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 15,
            }}
          >
            <MonoText
              style={{
                fontSize: 12,
                marginRight: 10,
                color: Colors[theme ?? "light"].text,
                width: "30%",
              }}
            >
              Full Name:
            </MonoText>
            <TextInput
              value={fullname}
              onChangeText={setFullname}
              placeholder="Enter full name"
              placeholderTextColor={Colors[theme ?? "light"].text}
              autoCapitalize="none"
              style={{
                flex: 1,
                padding: 10,
                borderBottomWidth: 1,
                borderColor: Colors[theme ?? "light"].text,
                borderRadius: 5,
                fontFamily: "Poppins",
                color: Colors[theme ?? "light"].text,
              }}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 15,
            }}
          >
            <MonoText
              style={{
                fontSize: 12,
                marginRight: 10,
                color: Colors[theme ?? "light"].text,
                width: "30%",
              }}
            >
              DOB:
            </MonoText>
            <TextInput
              value={dateOfBirth}
              onChangeText={setDateOfBirth}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={Colors[theme ?? "light"].text}
              autoCapitalize="none"
              style={{
                flex: 1,
                padding: 10,
                borderBottomWidth: 1,
                borderColor: Colors[theme ?? "light"].text,
                borderRadius: 5,
                fontFamily: "Poppins",
                color: Colors[theme ?? "light"].text,
              }}
            />
          </View>
        </View>
      </View>

      <Pressable
        onPress={handleSave}
        style={{
          backgroundColor: Colors[theme ?? "light"].text,
          width: "50%",
          padding: 10,
          borderRadius: 15,
          alignItems: "center",
          justifyContent: "center",
          marginTop: 20,
        }}
      >
        <MonoText
          style={{
            borderRadius: 5,
            color: Colors[theme ?? "light"].background,
          }}
        >
          Save
        </MonoText>
      </Pressable>
    </View>
  );
}
