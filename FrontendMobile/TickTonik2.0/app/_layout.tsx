import { Stack } from "expo-router";
import "../globals.css";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)/LogIn" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)/SignUp" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)/Platforms-Accounts" options={{ headerShown: false }} />
      
      <Stack.Screen name="(taps)" options={{ headerShown: false }} />
      <Stack.Screen 
        name="(auth)/account-details" 
        options={{ 
          headerShown: false,
          title: 'Account Details',
          headerTitleAlign: 'center'
        }} 
      />
    </Stack>
  );
}
