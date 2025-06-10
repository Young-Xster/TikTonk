import React, { useState } from 'react';
import { Image, Text, View } from 'react-native';
import Button1 from '../../components/Button1';
import Input from '../../components/Input';
import { login,logout } from '@/Appwrite/appwrite';
import "../../globals.css";
import { useRouter } from 'expo-router';
import { Client, Account } from "appwrite";

const logIn = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    
    login(email, password)
      .then((response) => {
        console.log("Login successful");
        router.push('/(taps)/Home');
      })
      .catch((error) => {
        console.error("Login failed:", error);
        setError(error.message || "An error occurred during login.");
      })
      .finally(() => {
        setIsLoading(false);
        logout()
      });
  }

  return (
    <View className="flex-1 p-5 bg-white">
      <View className="flex-row items-center mb-10">
        <Image
          source={require('../../assets/images/TikTonikLogo.png')}
          className="w-[80px] h-[80px] mr-4"
          resizeMode="contain"
        />
        <Text className="text-4xl font-bold right-3">TikTonik</Text>
      </View>
      
      <Input
        label="Email"
        value={email}
        onChangeText={setEmail}
      />
      
      <Input
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        classname="mt-9"
      />
      
      <Button1 title="Login" onPress={handleLogin} className='mt-14' />
      
      <View className="flex-row justify-center mt-5">
        <Text className="mr-1">Don't have an Account?</Text>
        <Text className="text-green-400" onPress={() => router.push('/(auth)/SignUp')}>SignUp</Text>
        
      </View>
    </View>
  )
}

export default logIn

