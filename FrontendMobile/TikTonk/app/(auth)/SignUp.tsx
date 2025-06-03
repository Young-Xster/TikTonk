import React, { useState, useEffect } from 'react';
import { Image, Text, View, Animated, Easing } from 'react-native';
import Button1 from '../../components/Button1';
import Input from '../../components/Input';
import { useRouter } from 'expo-router';
import {signup} from "../../Appwrite/appwrite"
import "../../globals.css";
const router = useRouter();
const SignUp = () => {
  const [email, setEmail] = useState('')
  const [password1, setPassword1] = useState('')
  const [password2, setPassword2] = useState('')
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Add rotation animation value
  const spinValue = new Animated.Value(0);

  // Start spinning animation
  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  // Create interpolate rotation
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const handleSignUp = async () => {
   setIsLoading(true);
    // Validation checks
    if (!email || !password1 || !password2) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    if (password1.length < 8) {
      setError("Password must be at least 8 characters long");
      setIsLoading(false);
      return;
    }

    if (password1 !== password2) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await signup(email, password1);
      console.log("Signup successful:", response);
      router.push('/(auth)/Platforms-Accounts');
    } catch (err: any) {
      console.error("Signup error:", err);
      setError(err?.message || "An error occurred during signup");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <View className="absolute inset-0 z-10 bg-black/50 flex items-center justify-center" style={{ display: isLoading ? 'flex' : 'none' }}>
        <Animated.Image
          source={require('../../assets/images/TikTonikLogo.png')}
          className="w-[80px] h-[80px]"
          style={{ transform: [{ rotate: spin }] }}
          resizeMode="contain"
        />
      </View>
      <View className="flex-1 p-5">
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
          value={password1}
          onChangeText={setPassword1}
          secureTextEntry
          classname="mt-9"
        />
        
        <Input
          label="Conferm Password"
          value={password2}
          onChangeText={setPassword2}
          secureTextEntry
          classname="mt-9"
        />
        
        <Button1 title="SignUp" onPress={handleSignUp} className='mt-14' />
      </View>
    </View>
    
  )
}

export default SignUp

