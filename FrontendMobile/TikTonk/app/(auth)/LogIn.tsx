import React, { useState } from 'react';
import { Image, Text, View } from 'react-native';
import Button from '../../components/Button';
import Input from '../../components/Input';
import "../../globals.css";

const LogIn = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = () => {
    // Handle login logic here
    console.log('Login attempted with:', { email, password })
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
      
      <Button title="Login" onPress={handleLogin} className='mt-14' />
      
      <View className="flex-row justify-center mt-5">
        <Text className="mr-1">Don't have an Account?</Text>
        <Text className="text-green-400">SignUp</Text>
      </View>
    </View>
  )
}

export default LogIn

