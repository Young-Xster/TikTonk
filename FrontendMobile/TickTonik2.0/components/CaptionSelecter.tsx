import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import React from 'react';

interface CaptionSelectorProps {
  selectedCaption: string;
  setSelectedCaption: (Caption: string) => void;
}


const CaptionSelector = ({ selectedCaption, setSelectedCaption }: CaptionSelectorProps) => {
  return (
    <View className='mx-5 mt-8'>
      <Text className='text-[21px] font-bold mb-4 text-gray-800'>Video Caption</Text>
      <TextInput
        value={selectedCaption}
        onChangeText={setSelectedCaption}
        placeholder='Enter video caption'
        className='border border-gray-300 rounded-lg p-3 text-gray-700'
        style={{ height: 100, textAlignVertical: 'top' }}
        multiline/>
    </View>
  );
};

export default CaptionSelector;
