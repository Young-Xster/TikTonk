import { TextInput, View, Text } from 'react-native';
import React from 'react';

interface InputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  classname?: string;
}

const Input = ({ label, value, onChangeText, secureTextEntry = false ,classname}: InputProps) => {
  return (
    <View className={`w-full my-2 ${classname || ''}`}>
      <Text className="mb-2 font-bold text-xl ">{label}:</Text>
      <TextInput
        className="w-full h-[50px] bg-gray-50 rounded-lg px-4 text-base border-[1px]"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        placeholderTextColor="#666"
      />
    </View>
  );
};

export default Input;
