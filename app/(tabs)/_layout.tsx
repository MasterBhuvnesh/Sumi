import React from "react";
import { Link, Tabs } from "expo-router";
import { Pressable } from "react-native";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";

import {
  HomeIcon,
  UserCircleIcon,
  InformationCircleIcon,
} from "react-native-heroicons/outline";

function TabBarIcon(props: { icon: React.ReactElement; color: string }) {
  return React.cloneElement(props.icon, {
    size: 25,
    color: props.color,
    style: { marginBottom: -3, padding: 10 },
  });
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: useClientOnlyValue(false, true),
        tabBarStyle: {
          position: "absolute",
          marginTop: 10,
          borderTopWidth: 1,
          borderTopColor: Colors[colorScheme ?? "light"].border,
          elevation: 0,
          backgroundColor: Colors[colorScheme ?? "light"].background,
        },
        tabBarPosition: "bottom",
        tabBarButton: (props) => (
          <Pressable
            {...props}
            android_ripple={{ color: "transparent" }} // Disable ripple effect on Android
            style={({ pressed }) => [
              props.style,
              { opacity: pressed ? 0.7 : 1 }, // Optional: Add a slight opacity change on press
            ]}
          />
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarShowLabel: false,
          tabBarLabelStyle: {
            fontFamily: "Poppins",
          },
          tabBarIcon: ({ color }) => (
            <TabBarIcon
              icon={<HomeIcon />}
              color={color}
            />
          ),
          headerRight: () => (
            <Link
              href="/info"
              asChild
            >
              <Pressable>
                {({ pressed }) => (
                  <InformationCircleIcon
                    size={25}
                    color={Colors[colorScheme ?? "light"].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarShowLabel: false,
          tabBarLabelStyle: {
            fontFamily: "Poppins",
          },
          tabBarIcon: ({ color }) => (
            <TabBarIcon
              icon={<UserCircleIcon />}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
