import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { useRouter } from 'expo-router'
import { fetchUser } from '@/Appwrite/appwrite'

const Profile = () => {
  const [user, setUser] = React.useState<any>(null);
  
  useEffect(() => {
    const loadUser = async () => {
      const userData = await fetchUser();
      setUser(userData);
      
    }
    loadUser();
  }, [])

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Profile Header */}
      <View className="items-center p-5">
        <Image 
          source={require('../../assets/images/icons/AccountIcon.png')}
          className="w-24 h-24 rounded-full"
        />
        <Text className="text-xl font-bold mt-2.5">{user?.name || 'Loading...'}</Text>
        <Text className="text-sm text-gray-500 mt-1">{user?.email}</Text>
      </View>

      {/* Stats Section */}
      <View className="flex-row justify-around py-5 border-b border-gray-200">
        <View className="items-center">
          <Text className="text-lg font-bold">99K</Text>
          <Text className="text-sm text-gray-500">Followers</Text>
        </View>
        <View className="items-center">
          <Text className="text-lg font-bold">99K</Text>
          <Text className="text-sm text-gray-500">Likes</Text>
        </View>
        <View className="items-center">
          <Text className="text-lg font-bold">99K</Text>
          <Text className="text-sm text-gray-500">Comments</Text>
        </View>
      </View>

      {/* TikTok Accounts Section */}
      <View className="p-5">
        <Text className="text-lg font-bold mb-4">TikTok Accounts</Text>
        <View className="space-y-2.5">
          <AccountItem name="AccountName" />
          <AccountItem name="AccountName" />
          <TouchableOpacity className="bg-gray-100 p-4 rounded-lg items-center">
            <Text className="text-2xl text-gray-500">+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Instagram Accounts Section */}
      <View className="p-5">
        <Text className="text-lg font-bold mb-4">Instagram Accounts</Text>
        <View className="space-y-2.5">
          <AccountItem name="AccountName" />
          <AccountItem name="AccountName" />
          <TouchableOpacity className="bg-gray-100 p-4 rounded-lg items-center">
            <Text className="text-2xl text-gray-500">+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}

interface AccountItemProps {
  name: string;
}

const AccountItem: React.FC<AccountItemProps> = ({ name }) => {
  const router = useRouter();
  
  return (
    <TouchableOpacity 
      className="flex-row justify-between items-center bg-gray-100 p-4 mb-2 rounded-lg"
      onPress={() => router.push({
        pathname: "/(auth)/account-details",
        params: { name }
      }) }
    >
      <Text className="text-base">{name}</Text>
      <TouchableOpacity className="p-1">
        <Text className="text-xl text-gray-500">⋮</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default Profile