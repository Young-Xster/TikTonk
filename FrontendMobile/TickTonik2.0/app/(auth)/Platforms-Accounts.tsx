import React, { useState } from 'react';
import { Image, Text, View, ScrollView } from 'react-native';
import Button2 from '../../components/Button2';
import Input from '../../components/Input';
import { useRouter } from 'expo-router';
import {PlatformsAccountsRegister} from "../../Appwrite/appwrite"
import "../../globals.css";
import { replace } from 'expo-router/build/global-state/routing';
const router = useRouter();

const LogIn = () => {
  const [emailTikTok, setEmailTikTok] = useState('')
  const [passwordTikTok, setPasswordTikTok] = useState('')
  const [emailIG,setEmailIG] = useState('')
  const [passwordIG, setPasswordIG] = useState('')
  const [emailYTs,setEmailYTs] = useState('')
  const [passwordYTs, setPasswordYTs] = useState('')

  

  const handleDone = () => {
    // Handle login logic here
    if (!emailTikTok || !passwordTikTok) {
      alert("Please fill in TikTok credentials");
      console.log("TikTok credentials are missing");
      
      return;
    }
    try {
      const obj= {TikTokEmail: emailTikTok, TikTokPassword: passwordTikTok, IGEmail: emailIG, IGPassword: passwordIG, YTsEmail: emailYTs, YTsPassword: passwordYTs}
      PlatformsAccountsRegister(obj)
      console.log("Accounts registered successfully");
      router.push("/(taps)/Home")
    } catch (error) {
      console.error("Error registering accounts:", error);
      alert("Failed to register accounts. Please try again.");
    }
    
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
      <ScrollView className="flex-1">
        <Text className='text-2xl font-bold '>TikTok Account <Text className='text-red-700'>*</Text></Text>
        <View className='mt-5 ml-8'>
            <Input
              label="Email"
              value={emailTikTok}
              onChangeText={setEmailTikTok}
              />
            <Input
            label='Password'
            value={passwordTikTok}
            onChangeText={setPasswordTikTok}
            />
        </View>
        <Text className='text-2xl font-bold '>Instagram Account </Text>
        <View className='mt-5 ml-8'>
            <Input
              label="Email"
              value={emailIG}
              onChangeText={setEmailIG}
              />
            <Input
            label='Password'
            value={passwordIG}
            onChangeText={setPasswordIG}
            />
        </View>
        <Text className='text-2xl font-bold '>YouTube Shorts Account </Text>
        <View className='mt-5 ml-8'>
            <Input
              label="Email"
              value={emailYTs}
              onChangeText={setEmailYTs}
              />
            <Input
            label='Password'
            value={passwordYTs}
            onChangeText={setPasswordYTs}
            />
        </View>
        <Button2 title="Done" onPress={handleDone} className='mt-14' />
      </ScrollView>


      
      
     
      
    </View>
  )
}

export default LogIn

