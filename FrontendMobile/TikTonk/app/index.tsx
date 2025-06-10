import { Text, View } from "react-native";
import { Redirect, router } from "expo-router";
import "../globals.css";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { use } from "react";
let userData: any;

AsyncStorage.getItem("user").then((user) => {
  if (user) {
    userData = JSON.parse(user);
  }
 
});
export default function Index() {
  return (
    <>
      {userData ? (
        <Redirect href="/(taps)/Home" />
      ) : (
        <Redirect href="/(auth)/LogIn" />
      )}
    </>
  );
}
