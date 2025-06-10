import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { platforms } from '../constants/images';

interface PlatformSelectorProps {
  selectedPlatforms: string[];
  setSelectedPlatforms: (callback: (prev: string[]) => string[]) => void;
}

const PlatformSelector = ({ selectedPlatforms, setSelectedPlatforms }: PlatformSelectorProps) => {
  return (
    <View className='mx-5 mt-8'>
      <Text className='text-[21px] font-bold mb-4 text-gray-800'>Platform</Text>
      <View className='flex-row items-center justify-between my-4'>
        {platforms.map((platform) => (
          <TouchableOpacity
            key={platform.id}
            onPress={() => {
              setSelectedPlatforms(prev => 
                prev.includes(platform.id)
                  ? prev.filter(id => id !== platform.id)
                  : [...prev, platform.id]
              )
            }}
            className='items-center'
          >
            <View 
              className={`w-20 h-20 rounded-3xl p-4 shadow-lg ${
                selectedPlatforms.includes(platform.id)
                  ? 'bg-blue-50 border-[2.5px] border-blue-500'
                  : 'bg-white border border-gray-100'
              }`}
            >
              <Image
                source={platform.icon}
                className='w-full h-full'
                resizeMode="contain"
              />
            </View>
            <Text
              className={`text-sm mt-1 ${
                selectedPlatforms.includes(platform.id)
                  ? 'text-blue-500 font-semibold'
                  : 'text-gray-500'
              }`}
            >
              {platform.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default PlatformSelector;
