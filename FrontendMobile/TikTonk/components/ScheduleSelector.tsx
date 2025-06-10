import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';

interface ScheduleSelectorProps {
  selectedSchedule: string;
  setSelectedSchedule: (schedule: string) => void;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  showDatePicker: boolean;
  setShowDatePicker: (show: boolean) => void;
  showTimePicker: boolean;
  setShowTimePicker: (show: boolean) => void;
}

const ScheduleSelector = ({ 
  selectedSchedule, 
  setSelectedSchedule,
  selectedDate,
  setSelectedDate,
  showDatePicker,
  setShowDatePicker,
  showTimePicker,
  setShowTimePicker
}: ScheduleSelectorProps) => {
  return (    <View className='px-5 pt-6 pb-4'>
      <Text className="text-[24px] font-bold text-gray-800 mb-4">Schedule Upload</Text>
      <View className='bg-gray-100/80 rounded-[20px] h-12 w-full flex-row items-center justify-between p-1.5 shadow-sm'>
        <TouchableOpacity 
          onPress={() => setSelectedSchedule("Manually")} 
          className={`h-full flex-1 rounded-[15px] items-center justify-center mr-1 ${selectedSchedule === "Manually" ? 'bg-white shadow-sm' : 'bg-transparent'}`}
        >
          <Text className={`text-[15px] ${selectedSchedule === "Manually" ? 'text-black font-bold' : 'text-gray-500'}`}>
            Manually
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => setSelectedSchedule("Automatic")} 
          className={`h-8 flex-1 rounded-[15px] items-center justify-center ${selectedSchedule === "Automatic" ? 'bg-white ' : 'bg-gray-100'}`}
        >
          <Text className={`text-[15px] ${selectedSchedule === "Automatic" ? 'text-black font-bold' : 'text-gray-500'}`}>
            Automatic
          </Text>
        </TouchableOpacity>
      </View>
      
      {selectedSchedule === "Manually" && (        <View className='mt-6'>
          <View className='flex-row justify-between items-center space-x-4'>
            <TouchableOpacity 
              onPress={() => setShowDatePicker(true)}
              className='bg-white px-5 py-3 rounded-2xl flex-1 shadow-sm border border-gray-100'
            >
              <Text className='text-gray-400 text-[13px] mb-1'>Date</Text>
              <Text className='text-gray-800 font-bold text-[15px]'>{moment(selectedDate).format('MMMM Do YYYY')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={() => setShowTimePicker(true)}
              className='bg-white px-5 py-3 rounded-2xl flex-1 shadow-sm border border-gray-100'
            >
              <Text className='text-gray-400 text-[13px] mb-1'>Time</Text>
              <Text className='text-gray-800 font-bold text-[15px]'>{moment(selectedDate).format('h:mm A')}</Text>
            </TouchableOpacity>
          </View>

          <DateTimePickerModal
            isVisible={showDatePicker}
            mode="date"
            onConfirm={(date) => {
              const newDate = new Date(date);
              newDate.setHours(selectedDate.getHours());
              newDate.setMinutes(selectedDate.getMinutes());
              
              const maxDate = new Date();
              maxDate.setDate(maxDate.getDate() + 7);
              
              if (newDate > maxDate) {
                setSelectedDate(maxDate);
              } else {
                setSelectedDate(newDate);
              }
              setShowDatePicker(false);
            }}
            onCancel={() => setShowDatePicker(false)}
            minimumDate={new Date()}
            maximumDate={(() => {
              const maxDate = new Date();
              maxDate.setDate(maxDate.getDate() + 7);
              return maxDate;
            })()}
          />

          <DateTimePickerModal
            isVisible={showTimePicker}
            mode="time"
            onConfirm={(date) => {
              const newDate = new Date(selectedDate);
              newDate.setHours(date.getHours());
              newDate.setMinutes(date.getMinutes());
              setSelectedDate(newDate);
              setShowTimePicker(false);
            }}
            onCancel={() => setShowTimePicker(false)}
          />
        </View>
      )}
    </View>
  );
};

export default ScheduleSelector;
