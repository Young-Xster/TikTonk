import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import PostsDisplayer from "../../components/PostsDisplayer"
import { listPostsFiles } from "../../Appwrite/appwrite"
import QualitySelector from '../../components/QualitySelector'
import DurationSelector from '../../components/DurationSelector'
import PlatformSelector from '../../components/PlatformSelector'
import ScheduleSelector from '../../components/ScheduleSelector'
import { sourcePosts } from '../../constants/images'
import Button1 from '@/components/Button1'
import { PostContext } from '../../context/PostContext'
import AsyncStorage from '@react-native-async-storage/async-storage'

type PostItem = {
  Item: {
    id: string;
    thumbnail: string;
    name: string;
  };
};

const Home = () => {
  const [BackgroundPosts, setBackgroundPosts] = useState<PostItem[]>([]);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<'Manual' | 'Automatic'>('Manual');
  const [SelectedBackground, setSelectedBackground] = useState("None");
  const [SelectedSource, setSelectedSource] = useState("None");
  const [selectedQuality, setSelectedQuality] = useState("360p");
  const [selectedDuration, setSelectedDuration] = useState("1min");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState("Manually");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect( () => {
    const fetchBackgrounds = async () => {
      try {
        const files = await listPostsFiles('683ecc71000a4f3da014');
        setBackgroundPosts(files);
      } catch (err) {
        console.error("Error fetching backgrounds:", err);
        setError("Failed to load backgrounds");
      }
    };

    fetchBackgrounds();
  }, []);

  return (
    <PostContext.Provider value={{
      background: [SelectedBackground, setSelectedBackground],
      source: [SelectedSource, setSelectedSource]
    }}>
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-row items-center h-[40px]  p-5 mb-2 justify-between">
          <View className="flex-row items-center">
            <Image
              source={require('../../assets/images/TikTonikLogo.png')}
              className="w-[50px] h-[50px] mr-3"
              resizeMode="contain"
            />
          </View>
          <View className="flex-row h-[33px] bg-gray-200 rounded-full p-1 ">
            <TouchableOpacity onPress={() => setMode('Manual')}>
              <Text className={`px-4 py-1 rounded-full font-medium ${mode === 'Manual' ? 'bg-white' : 'text-gray-600'}`}>
                Manual
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setMode('Automatic')}>
              <Text className={`px-4 py-1 rounded-full font-medium ${mode === 'Automatic' ? 'bg-white' : 'text-gray-600'}`}>
                Automatic
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView className="flex-1">
          <View className='ml-5'>
            <Text className='text-[21px] font-semibold'>Sources</Text>
            <PostsDisplayer post={sourcePosts} type="source" ItemStyle='h-48 w-48 rounded-full' />
            <Text className='text-[21px] font-bold mt-5 self-center'>{SelectedSource}</Text>
          </View>

          <View className={`ml-5 mt-5 ${(SelectedSource==="Anime" || SelectedSource==="Movie") ? "opacity-50":""}`}>
            <Text className='text-[21px] font-semibold'>Background</Text>
            {error ? (
              <Text className='text-red-500'>{error}</Text>
            ) : (
              <PostsDisplayer post={BackgroundPosts} ItemStyle="w-52 h-72" />
            )}
            <Text className='text-[21px] font-bold mt-5 self-center'>{SelectedBackground}</Text>
          </View>


          <QualitySelector
            selectedQuality={selectedQuality}
            setSelectedQuality={setSelectedQuality}
          />

          <DurationSelector
            selectedDuration={selectedDuration}
            setSelectedDuration={setSelectedDuration}
          />

          <PlatformSelector
            selectedPlatforms={selectedPlatforms}
            setSelectedPlatforms={setSelectedPlatforms}
          />

          <ScheduleSelector
            selectedSchedule={selectedSchedule}
            setSelectedSchedule={setSelectedSchedule}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            showDatePicker={showDatePicker}
            setShowDatePicker={setShowDatePicker}
            showTimePicker={showTimePicker}
            setShowTimePicker={setShowTimePicker}
          />
          <Button1 title='Done' onPress={()=>{}} className='mt-28'/>
        </ScrollView>
      </SafeAreaView>
    </PostContext.Provider>
  )
}

export default Home