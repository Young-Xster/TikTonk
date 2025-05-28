import React, { useState } from 'react';
import { Image, Text, View } from 'react-native';
import Button1 from '../../components/Button1';
import Input from '../../components/Input';
import { useRouter } from 'expo-router';
import "../../globals.css";
const router = useRouter();
const SignUp = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleSignup = () => {
    // Handle SignUp logic here
    console.log('SignUp ettempt:', { email, password })
    router.push('/(auth)/Platforms-Accounts');
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
      
      <Input
        label="Conferm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        classname="mt-9"
      />
      
      <Button1 title="SignUp" onPress={handleSignup} className='mt-14' />
      
    </View>
  )
}

export default SignUp

