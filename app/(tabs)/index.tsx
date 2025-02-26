// import React, { useEffect, useState } from "react";
// import { Redirect, Stack } from "expo-router";
// import { useAuth } from "@/providers/AuthProvider";
// import { Text, View } from "@/components/Themed";
// import Colors from "@/constants/Colors";
// import { useColorScheme } from "@/components/useColorScheme";
// import { MonoText } from "@/components/StyledText";
// import { supabase } from "@/lib/supabase";
// import { FlatList } from "react-native";

// export default function Index() {
//   const theme = useColorScheme();
//   const { session, loading } = useAuth();
//   const [quotes, setQuotes] = useState<any[]>([]);

//   useEffect(() => {
//     const fetchQuotes = async () => {
//       const { data, error } = await supabase
//         .from("quotes")
//         .select("*")
//         .order("created_at", { ascending: false });

//       if (error) {
//         console.error("Error fetching quotes:", error);
//         return;
//       }

//       setQuotes(data);
//     };

//     fetchQuotes();
//   }, []);

//   if (loading) {
//     return null;
//   }

//   if (!session) {
//     return <Redirect href="/login" />;
//   }

//   return (
//     <View
//       style={{
//         flex: 1,
//         alignItems: "center",
//         justifyContent: "center",
//         backgroundColor: Colors[theme ?? "light"].background,
//       }}
//     >
//       <Stack.Screen
//         options={{
//           headerTitleStyle: { fontFamily: "SpaceMono" },
//           headerStyle: { backgroundColor: Colors[theme ?? "light"].background },
//           headerTintColor: Colors[theme ?? "light"].text,
//         }}
//       />

//       <FlatList
//         data={quotes}
//         keyExtractor={(item) => item.id}
//         contentContainerStyle={{
//           padding: 20,
//           width: "100%",
//         }}
//         renderItem={({ item }) => (
//           <View
//             style={{
//               backgroundColor: Colors[theme ?? "light"].text,
//               padding: 15,
//               borderRadius: 10,
//               marginBottom: 10,
//             }}
//           >
//             <MonoText
//               style={{
//                 fontSize: 16,
//                 marginBottom: 5,
//                 color: Colors[theme ?? "light"].background,
//               }}
//             >
//               {item.text}
//             </MonoText>
//             <MonoText
//               style={{
//                 fontSize: 12,
//                 color: Colors[theme ?? "light"].background,
//               }}
//             >
//               {new Date(item.created_at).toLocaleString()}
//             </MonoText>
//           </View>
//         )}
//       />
//     </View>
//   );
// }
import React, { useEffect, useState } from "react";
import { Redirect, Stack } from "expo-router";
import { useAuth } from "@/providers/AuthProvider";
import { Text, View } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { MonoText } from "@/components/StyledText";
import { supabase } from "@/lib/supabase";
import { FlatList, RefreshControl } from "react-native";

export default function Index() {
  const theme = useColorScheme();
  const { session, loading } = useAuth();
  const [quotes, setQuotes] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchQuotes = async () => {
    const { data, error } = await supabase
      .from("quotes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching quotes:", error);
      return;
    }

    setQuotes(data);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchQuotes();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchQuotes();

    // Subscribe to realtime changes
    const subscription = supabase
      .channel("quotes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "quotes" },
        (payload) => {
          fetchQuotes(); // Refresh the quotes list on any change
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return null;
  }

  if (!session) {
    return <Redirect href="/login" />;
  }

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
          headerTitleStyle: { fontFamily: "SpaceMono" },
          headerStyle: { backgroundColor: Colors[theme ?? "light"].background },
          headerTintColor: Colors[theme ?? "light"].text,
        }}
      />

      <FlatList
        data={quotes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          padding: 20,
          width: "100%",
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["black"]}
          />
        }
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: Colors[theme ?? "light"].text,
              padding: 15,
              borderRadius: 10,
              marginBottom: 10,
            }}
          >
            <MonoText
              style={{
                fontSize: 16,
                marginBottom: 5,
                color: Colors[theme ?? "light"].background,
              }}
            >
              {item.text}
            </MonoText>
            <MonoText
              style={{
                fontSize: 12,
                color: Colors[theme ?? "light"].background,
              }}
            >
              {new Date(item.created_at).toLocaleString()}
            </MonoText>
          </View>
        )}
      />
    </View>
  );
}
