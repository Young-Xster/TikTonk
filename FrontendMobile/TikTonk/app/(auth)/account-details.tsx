import { View, Text, Image, ScrollView } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'

interface VideoItemProps {
  url: string;
  likes: string;
  views: string;
  comments: string;
  shares: string;
  watchTime: string;
  caption: string;
}

const VideoItem: React.FC<VideoItemProps> = ({ url, likes, views, comments, shares, watchTime, caption }) => (
  <View className="flex-row bg-gray-100 p-4 rounded-lg mb-4">
    <View className="w-24 h-24 bg-gray-300 rounded-lg mr-4" />
    <View className="flex-1">
      <Text className="text-sm mb-1">URL: {url}</Text>
      <View className="flex-row mb-1">
        <Text className="text-sm mr-4">Likes: {likes}</Text>
        <Text className="text-sm">Views: {views}</Text>
      </View>
      <View className="flex-row mb-1">
        <Text className="text-sm mr-4">Comments: {comments}</Text>
        <Text className="text-sm">Shares: {shares}</Text>
      </View>
      <Text className="text-sm mb-1">Watch Time: {watchTime}</Text>
      <Text className="text-sm">Caption: {caption}</Text>
    </View>
  </View>
);

const AccountDetails = () => {
  const { name } = useLocalSearchParams();

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Profile Header */}
      <View className="items-center p-5">
        <Image 
          source={require('../../assets/images/icons/AccountIcon.png')}
          className="w-24 h-24 rounded-full"
        />
        <Text className="text-xl font-bold mt-2.5">{name}</Text>
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

      {/* Videos Section */}
      <View className="p-5">
        <Text className="text-lg font-bold mb-4">Videos</Text>
        <VideoItem 
          url="http://example.com"
          likes="99k"
          views="99k"
          comments="99k"
          shares="99k"
          watchTime="99h"
          caption="This is my Video"
        />
        <VideoItem 
          url="http://example.com"
          likes="99k"
          views="99k"
          comments="99k"
          shares="99k"
          watchTime="99h"
          caption="This is my Video"
        />
      </View>
    </ScrollView>
  )
}

export default AccountDetails
