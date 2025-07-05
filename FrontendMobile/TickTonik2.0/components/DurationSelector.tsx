import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';

interface DurationSelectorProps {
  selectedDuration: string;
  setSelectedDuration: (duration: string) => void;
}

const durations = ["1min", "2min", "3min", "4min", "5min"];

const DurationSelector = ({ selectedDuration, setSelectedDuration }: DurationSelectorProps) => {
  return (
    <View className='mx-5 mt-8'>
      <Text className='text-[21px] font-bold mb-4 text-gray-800'>Duration</Text>
      <View className='bg-gray-50 rounded-[35px] h-16 flex-row items-center justify-between px-8 my-2 shadow-sm border border-gray-100'>
        {durations.map((duration, index) => (
          <React.Fragment key={duration}>
            <TouchableOpacity
              onPress={() => setSelectedDuration(duration)}
              className='items-center'
            >
              <View 
                className={`h-5 w-5 rounded-full mb-2 ${
                  selectedDuration === duration ? 'bg-blue-500 shadow-md' : 'bg-gray-300'
                }`} 
              />
              <Text
                className={`text-sm ${
                  selectedDuration === duration
                    ? 'text-blue-500 font-bold'
                    : 'text-gray-400 font-medium'
                }`}
              >
                {duration}
              </Text>
            </TouchableOpacity>
            {index < durations.length - 1 && (
              <View className='h-[1px] flex-1 bg-gray-300 mx-1' />
            )}
          </React.Fragment>
        ))}
      </View>
    </View>
  );
};

export default DurationSelector;
