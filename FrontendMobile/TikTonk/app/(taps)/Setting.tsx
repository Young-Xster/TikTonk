import { View, Text } from 'react-native'
import React from 'react'
import Button2 from '@/components/Button2'
import { logout } from '@/Appwrite/appwrite'
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
const Setting = () => {
  const router = useRouter();

  return (
    <Button2 title='Logout' onPress={()=>{
    logout().then(() => {
        //delete user data from local storage
        AsyncStorage.removeItem('user').then(() => {
          console.log('User data removed from local storage');
        })
        console.log('Logged out successfully');
        router.replace('/(auth)/LogIn'); // Redirect to login page after logout
      }).catch((error) => {
        console.error('Logout failed:', error);
        router.replace('/(auth)/LogIn'); // Redirect to login page on error
      });
    }}
    />
  )
}

export default Setting