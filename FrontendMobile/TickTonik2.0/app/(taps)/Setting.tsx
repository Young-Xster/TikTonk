import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons'
import { logout } from '@/Appwrite/appwrite'
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getUserDocument } from '@/Appwrite/appwrite'

type SettingOptionProps = {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress: () => void;
};

const SettingOption: React.FC<SettingOptionProps> = ({ icon, title, subtitle, onPress }) => (
  <TouchableOpacity 
    className="flex-row items-center px-4 py-3 border-b border-gray-100"
    onPress={onPress}
  >
    <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center">
      {icon}
    </View>
    <View className="flex-1 ml-3">
      <Text className="text-base font-medium text-gray-800">{title}</Text>
      {subtitle && <Text className="text-sm text-gray-500">{subtitle}</Text>}
    </View>
    <Feather name="chevron-right" size={20} color="#9CA3AF" />
  </TouchableOpacity>
)

const Setting = () => {
  const router = useRouter();
  const [username, setUsername] = useState('TikTonk User')
  try {
    getUserDocument().then((user) => {
      if (user && user.Name) {
        setUsername(user.Name);
      }
    })
  } catch (error) {
    console.error('Failed to fetch user document:', error);
  }

  const handleLogout = () => {
    logout().then(() => {
      AsyncStorage.removeItem('user').then(() => {
        console.log('User data removed from local storage');
      })
      AsyncStorage.removeItem('tikTokSession').then(() => {
        console.log('TikTok session removed from local storage');
      })
      console.log('Logged out successfully');
      router.replace('/(auth)/LogIn');
    }).catch((error) => {
      console.error('Logout failed:', error);
      router.replace('/(auth)/LogIn');
    });
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-4 py-3 border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-800">Settings</Text>
      </View>

      {/* Profile Section */}
      <View className="px-4 py-6 border-b border-gray-200">
        <View className="flex-row items-center">
          <View className="w-20 h-20 bg-gray-200 rounded-full items-center justify-center">
            <Ionicons name="person" size={40} color="#6B7280" />
          </View>
          <View className="ml-4 flex-1">
            <Text className="text-xl font-semibold text-gray-800">{username}</Text>
            {/* <TouchableOpacity>
              <Text className="text-sm text-blue-500 mt-1">Edit Profile</Text>
            </TouchableOpacity> */}
          </View>
        </View>
      </View>

      {/* Settings Options */}
      <View className="py-2">
        {/* <SettingOption
          icon={<Ionicons name="notifications-outline" size={24} color="#4B5563" />}
          title="Notifications"
          subtitle="Manage your alerts"
          onPress={() => {}}
        />
        <SettingOption
          icon={<Ionicons name="lock-closed-outline" size={24} color="#4B5563" />}
          title="Privacy"
          subtitle="Control your privacy settings"
          onPress={() => {}}
        />
        <SettingOption
          icon={<MaterialIcons name="language" size={24} color="#4B5563" />}
          title="Language"
          subtitle="Choose your preferred language"
          onPress={() => {}}
        /> */}
        <SettingOption
          icon={<Ionicons name="help-circle-outline" size={24} color="#4B5563" />}
          title="Help & Support"
          subtitle=''
          onPress={() => {}}
        />
        <SettingOption
          icon={<Ionicons name="information-circle-outline" size={24} color="#4B5563" />}
          title="About"
          subtitle=''
          onPress={() => {}}
        />
      </View>

      {/* Logout Button */}
      <TouchableOpacity 
        className="mx-4 mt-6 p-3 bg-red-500 rounded-lg items-center"
        onPress={handleLogout}
      >
        <Text className="text-white font-semibold text-base">Log Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default Setting









