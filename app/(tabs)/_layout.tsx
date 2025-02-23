import React from "react";
import { Link, Tabs } from "expo-router";
import { Pressable } from "react-native";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";

// Import Heroicons
import {
  HomeIcon,
  UserCircleIcon,
  InformationCircleIcon,
} from "react-native-heroicons/outline";

// Custom TabBarIcon component using Heroicons
function TabBarIcon(props: {
  icon: React.ReactElement; // Ensure the icon is a ReactElement
  color: string;
}) {
  return React.cloneElement(props.icon, {
    size: 25,
    color: props.color,
    style: { marginBottom: -3 },
  });
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <TabBarIcon
              icon={<HomeIcon />} // Use HomeIcon for the Home tab
              color={color}
            />
          ),
          headerRight: () => (
            <Link
              href="/modal"
              asChild
            >
              <Pressable>
                {({ pressed }) => (
                  <InformationCircleIcon // Use InformationCircleIcon for the header
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
        name="two"
        options={{
          title: "Profile", // Rename the title to "Profile"
          tabBarIcon: ({ color }) => (
            <TabBarIcon
              icon={<UserCircleIcon />} // Use UserCircleIcon for the Profile tab
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
