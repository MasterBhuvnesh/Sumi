import React, { useState, useEffect } from "react";
import { Pressable, StyleSheet, Image, ToastAndroid } from "react-native";
import { Text, View } from "@/components/Themed";
import { MonoText } from "@/components/StyledText";
import { router, Stack } from "expo-router";

import { supabase } from "@/lib/supabase";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { HashtagIcon } from "react-native-heroicons/outline";

const handleLogout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Error logging out:", error);
  } else {
    router.replace("/(auth)/login");
  }
};

export default function ProfileScreen() {
  const theme = useColorScheme();
  const [userData, setUserData] = useState<any>(null);

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
          console.error("Error fetching user data:", error);
          return;
        }

        setUserData(data);
      }
    };

    fetchUserData();
  }, []);

  if (!userData) {
    return (
      <View style={styles.container}>
        <MonoText>Loading...</MonoText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Hide the header */}
      <Stack.Screen
        options={{
          headerShown: false,
          headerTitleStyle: { fontFamily: "SpaceMono" },
          headerStyle: { backgroundColor: Colors[theme ?? "light"].background },
          headerTintColor: Colors[theme ?? "light"].text,
        }}
      />
      <View
        style={{
          width: "95%",
          backgroundColor: Colors[theme ?? "light"].background,
          borderWidth: 1,
          borderColor: Colors[theme ?? "light"].text,
          borderRadius: 15,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
      >
        {/* Hash Icon */}
        <View
          style={{
            alignSelf: "flex-end",
            width: 30,
            height: 30,
            backgroundColor: Colors[theme ?? "light"].text,
            marginTop: 20,
            marginRight: 20,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 10,
            borderCurve: "circular",
          }}
        >
          <HashtagIcon
            size={18}
            color={Colors[theme ?? "light"].background}
            onLongPress={() => {
              ToastAndroid.showWithGravity(
                `ID : ${userData.id}`,
                ToastAndroid.SHORT,
                ToastAndroid.CENTER
              );
            }}
            onPress={() => {
              ToastAndroid.showWithGravity(
                `Username: ${userData.username}`,
                ToastAndroid.SHORT,
                ToastAndroid.CENTER
              );
            }}
          />
        </View>

        {/* User Data */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginRight: 20,
            marginLeft: 20,
            marginBottom: 20,
            backgroundColor: "transparent",
          }}
        >
          {userData.profile_pic && (
            <Image
              source={{ uri: userData.profile_pic }}
              style={{
                width: 80,
                height: 80,
                borderRadius: 50,
                marginRight: 15,
                borderWidth: 1,
                borderColor: Colors[theme ?? "light"].text,
              }}
            />
          )}

          <View
            style={{
              flexDirection: "column",
              backgroundColor: "transparent",
            }}
          >
            <MonoText style={{ fontSize: 12 }}>{userData.fullname}</MonoText>
            <MonoText style={{ fontSize: 12 }}>{userData.email}</MonoText>
            <MonoText style={{ fontSize: 12 }}>
              DOB : {userData.date_of_birth}
            </MonoText>
          </View>
        </View>
      </View>

      {/* Logout Button */}

      <Pressable
        onPress={handleLogout}
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
          Logout
        </MonoText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
