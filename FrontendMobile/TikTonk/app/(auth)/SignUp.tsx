import React, { useState } from 'react';
import { Image, Text, View } from 'react-native';
import Button1 from '../../components/Button1';
import Input from '../../components/Input';
import { useRouter } from 'expo-router';
import "../../globals.css";
const router = useRouter();
const SignUp = () => {
  const [email, setEmail] = useState('')
  const [password1, setPassword1] = useState('')
  const [password2, setPassword2] = useState('')
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
   
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
      const response = await fetch("https://your-backend-url/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password1,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        
        localStorage.setItem("token", data.token); 
        window.location.href = "/login"; 
      } else {
        // Account creation failed
        setError(data.message || "Failed to create account. Please try again.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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
  )
}

export default SignUp

