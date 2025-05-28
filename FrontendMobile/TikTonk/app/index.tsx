import { Text, View } from "react-native";
import { Redirect } from "expo-router";
import "../globals.css";
export default function Index() {
  return (
    <Redirect href="/(auth)/LogIn" />
  );
}
