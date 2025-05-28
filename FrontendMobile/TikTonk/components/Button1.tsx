import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  className?: string;
}

const Button1 = ({ title, onPress, className }: ButtonProps) => {
  return (
    <TouchableOpacity 
      className={`w-full h-[50px] bg-green-400 rounded-lg justify-center items-center my-2 ${className || ''}`} 
      onPress={onPress}
    >
      <Text className="text-black text-2xl font-semibold italic ">
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default Button1;
