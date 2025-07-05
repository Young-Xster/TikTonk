import React, { useState, useEffect, useRef, use } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import * as Sharing from 'expo-sharing'; // CHANGED: Replaced MediaLibrary with Sharing
import * as FileSystem from 'expo-file-system';
import { SafeAreaView } from 'react-native-safe-area-context';
import PostsDisplayer from "../../components/PostsDisplayer";
import { listPostsFiles } from "../../Appwrite/appwrite";
import QualitySelector from '../../components/QualitySelector';
import DurationSelector from '../../components/DurationSelector';
import PlatformSelector from '../../components/PlatformSelector';
import ScheduleSelector from '../../components/ScheduleSelector';
import CaptionSelector from '@/components/CaptionSelecter';
import { sourcePosts } from '../../constants/images';
import Button1 from '@/components/Button1';
import { PostContext } from '../../context/PostContext';
import { WebView } from 'react-native-webview';
import Cookies from '@react-native-cookies/cookies';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

const Home = () => {
  type BackgroundPost = { Item: { id: string; thumbnail: string; name: string } };
  const [BackgroundPosts, setBackgroundPosts] = useState<BackgroundPost[]>([]);
  const [error, setError] = useState("");
  const [mode, setMode] = useState('Manual');
  const [SelectedBackground, setSelectedBackground] = useState("None");
  const [SelectedSource, setSelectedSource] = useState("None");
  const [selectedQuality, setSelectedQuality] = useState("360");
  const [selectedDuration, setSelectedDuration] = useState("1min");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState("Manually");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showTiktokLogin, setShowTiktokLogin] = useState(false);

  // NEW: login flow state
  const [stage, setStage] = useState('login'); // 'login' or 'form'
  const [loginName, setLoginName] = useState('');
  const [title, setTitle] = useState('');
  const [schedule, setSchedule] = useState('0');
  const webviewRef = useRef(null);

  // Fetch background posts once
  useEffect(() => {
    const fetchBackgrounds = async () => {
      try {
        const files = await listPostsFiles('683ecc71000a4f3da014');
        setBackgroundPosts(files);
      } catch (err) {
        console.error("Error fetching backgrounds:", err);
        setError("Failed to load backgrounds");
      }
      if (await AsyncStorage.getItem('tikTokSession')) {
        // If session exists, skip login stage
        console.log("TikTok session found, skipping login stage");
        setStage('form');
      }
    };
    fetchBackgrounds();
  }, []);

  // Handler for when WebView navigation changes
  const onWebViewNavigationStateChange = async ({ url }: { url: string }) => {
    if (url.includes('tiktok.com') && url.includes('/@')) {
      try {
        const cookieStore = await Cookies.get('https://www.tiktok.com');
        const session = cookieStore['sessionid'];
        const dc = cookieStore['tt-target-idc'];
        if (session?.value && dc?.value) {
          const handle = url.split('/@')[1]?.split('?')[0] || '';
          setLoginName(handle);
          setStage('form');
          // Persist session locally
          await AsyncStorage.setItem('tikTokSession', JSON.stringify({
            sessionid: session.value,
            dc_id: dc.value,
            login_name: handle
          }));
          Alert.alert('Login Success', 'TikTok session captured');
        }
      } catch (err) {
        console.error('Cookie read error:', err);
      }
    }
  };

  // Called when user taps "Create Video" & then performs upload
  const handleCreateVideo = async () => {
    if (SelectedBackground === "None" || SelectedSource === "None") {
      Alert.alert("Error", "Please select both a source and background");
      return;
    }
    try {
      const durationInMinutes = parseInt(selectedDuration.replace('min', ''));
      const durationInSeconds = durationInMinutes * 60;
      // const payload = {
      //   login_name: await AsyncStorage.getItem('tikTokSession').then(data => JSON.parse(data).login_name),
      //   sessionid: await AsyncStorage.getItem('tikTokSession').then(data => JSON.parse(data).sessionid),
      //   dc_id: await AsyncStorage.getItem('tikTokSession').then(data => JSON.parse(data).dc_id),
      //   title,
      //   schedule: parseInt(schedule, 10) || 0,
      // };
      // 1) create the video on backend
      // Safely get TikTok session from AsyncStorage
      const tikTokSessionStr = await AsyncStorage.getItem('tikTokSession');
      if (!tikTokSessionStr) {
        Alert.alert("Error", "TikTok session not found. Please log in again.");
        return;
      }
      const tikTokSession = JSON.parse(tikTokSessionStr);

      const resp = await fetch('http://192.168.1.103:5000/create_video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bg_video: SelectedBackground,
          font_path: "Bangers-Regular.ttf",
          duration: durationInSeconds,
          gen: SelectedSource,
          quality: selectedQuality,
          login_name: tikTokSession.login_name,
          sessionid: tikTokSession.sessionid,
          dc_id: tikTokSession.dc_id,
          title: title,
          schedule: parseInt(schedule, 10) || 0,

        }),
      });

      

      // 2) after creation, upload using captured cookies
      // const cookieStore = await Cookies.get('https://www.tiktok.com');
      // const session = cookieStore['sessionid'];
      // const dc = cookieStore['tt-target-idc'];
      // if (!session?.value || !dc?.value) {
      //   Alert.alert('Error', 'Not logged in');
      //   return;
      // }
      
      // const uploadResp = await fetch('http://192.168.1.15:5000/upload', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(payload),
      // });
      // const uploadJson = await uploadResp.json();
      // Alert.alert('Response', uploadJson.message);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to connect or process video");
    }
  };

  // ---- RENDER ----
  // 1) Show TikTok login WebView if not yet logged in
  useEffect(() => {
    const checkTiktokLogin = async () => {
      const formattedDate = moment(selectedDate).format('YYYY/MM/DD|HH:mm');
      console.log(formattedDate)
      if (selectedPlatforms.includes('tiktok')) {
        const tikTokSession = await AsyncStorage.getItem('tikTokSession');
        if (!tikTokSession) {
          setStage('login');
          setShowTiktokLogin(true);
        } else {
          setStage('form');
          setShowTiktokLogin(false);
        }
      } else {
        setShowTiktokLogin(false);
      }
    };
    checkTiktokLogin();
  }, [selectedPlatforms]);

  if (showTiktokLogin && stage === 'login') {
    return (
      <WebView
        ref={webviewRef}
        source={{ uri: 'https://www.tiktok.com/login' }}
        javaScriptEnabled
        domStorageEnabled
        sharedCookiesEnabled
        thirdPartyCookiesEnabled
        originWhitelist={['https://*', 'http://*']}
        onNavigationStateChange={onWebViewNavigationStateChange}
        startInLoadingState
        renderLoading={() => <ActivityIndicator size="large" />}
        onShouldStartLoadWithRequest={event => {
          // Prevent opening unknown URL schemes
          if (event.url.startsWith('http') || event.url.startsWith('https')) {
            return true;
          }
          return false;
        }}
      />
    );
  }

  // 2) Show main UI after login
  return (

    <PostContext.Provider value={{
      background: [SelectedBackground, setSelectedBackground],
      source: [SelectedSource, setSelectedSource]
    }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        {/* Header with mode toggle */}
        <View style={{ flexDirection: 'row', alignItems: 'center', height: 40, padding: 5, marginBottom: 2, justifyContent: 'space-between' }}>
          <Image
            source={require('../../assets/images/TikTonikLogo.png')}
            style={{ width: 50, height: 50, marginRight: 3 }}
            resizeMode="contain"
          />
          <View style={{ flexDirection: 'row', height: 33, backgroundColor: '#E5E7EB', borderRadius: 9999, padding: 1 }}>
            <TouchableOpacity onPress={() => setMode('Manual')}>
              <Text style={{ paddingHorizontal: 16, paddingVertical: 4, borderRadius: 9999, fontWeight: '500', backgroundColor: mode === 'Manual' ? 'white' : undefined, color: mode === 'Manual' ? 'black' : '#4B5563' }}>
                Manual
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setMode('Automatic')}>
              <Text style={{ paddingHorizontal: 16, paddingVertical: 4, borderRadius: 9999, fontWeight: '500', backgroundColor: mode === 'Automatic' ? 'white' : undefined, color: mode === 'Automatic' ? 'black' : '#4B5563' }}>
                Automatic
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={{ flex: 1 }}>
          {/* Sources */}
          <View style={{ marginLeft: 20 }}>
            <Text style={{ fontSize: 21, fontWeight: '600' }}>Sources</Text>
            <PostsDisplayer post={sourcePosts} type="source" ItemStyle="h-48 w-48 rounded-full" />
            <Text style={{ fontSize: 21, fontWeight: 'bold', marginTop: 20, alignSelf: 'center' }}>{SelectedSource}</Text>
          </View>

          {/* Backgrounds */}
          <View style={{ marginLeft: 20, marginTop: 20, opacity: (SelectedSource === "Anime" || SelectedSource === "Movie") ? 0.5 : 1 }}>
            <Text style={{ fontSize: 21, fontWeight: '600' }}>Background</Text>
            {error ? (
              <Text style={{ color: 'red' }}>{error}</Text>
            ) : (
              <PostsDisplayer post={BackgroundPosts} ItemStyle="w-52 h-72" />
            )}
            <Text style={{ fontSize: 21, fontWeight: 'bold', marginTop: 20, alignSelf: 'center' }}>{SelectedBackground}</Text>
          </View>

          <QualitySelector selectedQuality={selectedQuality} setSelectedQuality={setSelectedQuality} />
          <DurationSelector selectedDuration={selectedDuration} setSelectedDuration={setSelectedDuration} />
          <PlatformSelector selectedPlatforms={selectedPlatforms} setSelectedPlatforms={setSelectedPlatforms} />
          <CaptionSelector selectedCaption={title} setSelectedCaption={setTitle} />
          
          {/* Schedule Selector */}
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

          <View style={{ marginTop: 40 }}>
            <Button1 title='Done' onPress={handleCreateVideo} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </PostContext.Provider>
  );
};

export default Home;
