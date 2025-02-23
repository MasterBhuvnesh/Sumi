// app/(tabs)/index.tsx
import { Redirect } from "expo-router";
import { useAuth } from "@/providers/AuthProvider";
import { Text, View } from "@/components/Themed";

export default function Index() {
  const { session, loading } = useAuth();

  if (loading) {
    return null; // Show a loading spinner
  }

  if (!session) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <View>
      <Text>Welcome, {session.user.email}!</Text>
    </View>
  );
}
