import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';

interface QualitySelectorProps {
  selectedQuality: string;
  setSelectedQuality: (quality: string) => void;
}

const qualities = ["360p", "480p", "720p", "1080p"];

const QualitySelector = ({ selectedQuality, setSelectedQuality }: QualitySelectorProps) => {
  return (
    <View className='mx-5 mt-8'>
      <Text className='text-[21px] font-bold mb-4 text-gray-800'>Quality</Text>
      <View className='bg-gray-50 rounded-[35px] h-14 flex-row items-center justify-between px-3 my-2 border-gray-100'>
        {qualities.map((quality) => (
          <TouchableOpacity
            key={quality}
            onPress={() => setSelectedQuality(quality)}
            className={`px-5 py-2 rounded-[25px] ${
              selectedQuality === quality ? 'bg-white border border-gray-100' : ''
            }`}
          >
            <Text
              className={`${
                selectedQuality === quality
                  ? 'text-blue-500 font-bold'
                  : 'text-gray-400 font-medium'
              }`}
            >
              {quality}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default QualitySelector;
