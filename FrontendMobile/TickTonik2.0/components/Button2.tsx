import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  className?: string;
}

const Button2 = ({ title, onPress, className }: ButtonProps) => {
  return (
    <TouchableOpacity 
      className={`w-full h-[50px] border-b-[1px] rounded-lg justify-center items-center my-2 ${className || ''}`} 
      onPress={onPress}
    >
      <Text className="text-green-400 text-2xl font-semibold italic ">
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default Button2;
