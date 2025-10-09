import React from 'react';
import { Text, TouchableOpacity, StyleSheet, ActivityIndicator, View } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
}

const Button1 = ({ title, onPress, className, disabled = false, loading = false }: ButtonProps) => {
  return (
    <TouchableOpacity 
      className={`w-full h-[55px] ${disabled ? 'bg-gray-400' : 'bg-green-500'} rounded-lg justify-center items-center my-2 ${className || ''}`}
      style={[styles.button, disabled && styles.disabledButton]}
      onPress={disabled || loading ? undefined : onPress}
      activeOpacity={disabled || loading ? 1 : 0.8}
      disabled={disabled || loading}
    >
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="white" style={styles.spinner} />
          <Text className="text-white text-xl font-bold ml-2" style={styles.buttonText}>
            Creating...
          </Text>
        </View>
      ) : (
        <Text className="text-white text-xl font-bold" style={styles.buttonText}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    shadowColor: "#2C9814",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  disabledButton: {
    shadowColor: "#9CA3AF",
    shadowOpacity: 0.2,
    elevation: 2,
  },
  buttonText: {
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    marginRight: 8,
  },
});

export default Button1;
