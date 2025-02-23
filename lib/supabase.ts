import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

const supabaseUrl = "https://vphbogdialozzigavvvl.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwaGJvZ2RpYWxvenppZ2F2dnZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyMTkzMjUsImV4cCI6MjA1NTc5NTMyNX0.LBzhfYtycQZj6Wv4ygsDgUIBXfWQgNV47uWd6ghxi6c";

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
