import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';

interface QualitySelectorProps {
  selectedQuality: string;
  setSelectedQuality: (quality: string) => void;
}

const qualities = ["360p", "480p", "720p", "1080p"];

const QualitySelector = ({ selectedQuality, setSelectedQuality }: QualitySelectorProps) => {
  return (
    <View className='mx-5 mb-6'>
      <Text className='text-[18px] font-semibold mb-3 text-gray-700'>Video Quality</Text>
      <View style={styles.container}>
        {qualities.map((quality) => (
          <TouchableOpacity
            key={quality}
            onPress={() => setSelectedQuality(quality.slice(0, -1))}
            style={[
              styles.option,
              selectedQuality === quality.slice(0, -1) && styles.selectedOption
            ]}
          >
            <Text
              style={[
                styles.optionText,
                selectedQuality === quality.slice(0, -1) && styles.selectedOptionText
              ]}
            >
              {quality}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    height: 48,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginVertical: 4,
  },
  option: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  selectedOption: {
    backgroundColor: 'white',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.00,
    elevation: 1,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  selectedOptionText: {
    color: '#2C9814',
    fontWeight: '700',
  }
});

export default QualitySelector;
