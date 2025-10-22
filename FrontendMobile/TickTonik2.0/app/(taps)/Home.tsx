import React, { useState, useEffect, useRef, use } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
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
import CustomAlert from '@/components/CustomAlert';
import { PostContext } from '../../context/PostContext';
import { WebView } from 'react-native-webview';
import Cookies from '@react-native-cookies/cookies';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import { createUploadDocument, getUserDocument } from '../../Appwrite/appwrite';
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
  const [NbVideos, setNbVideos] = useState(0);
  const [allowedVideos, setAllowedVideos] = useState(3); // Default to 3 for non-premium users
  const [isCreatingVideo, setIsCreatingVideo] = useState(false);

  // Custom Alert state
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertButtons, setAlertButtons] = useState<Array<{text: string; onPress?: () => void; style?: 'default' | 'cancel' | 'destructive'}>>([]);

  // Helper function to show custom alert
  const showCustomAlert = (title: string, message: string, buttons?: Array<{text: string; onPress?: () => void; style?: 'default' | 'cancel' | 'destructive'}>) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertButtons(buttons || []);
    setAlertVisible(true);
  };

  // Handle restricted platform selection
  const handleRestrictedPlatform = (platformId: string, platformName: string) => {
    showCustomAlert(
      "Coming Soon!", 
      `${platformName} integration is coming soon! Stay tuned for updates.`,
      [
        { text: "Got it!", style: "default" }
      ]
    );
  };

  // NEW: login flow state
  const [stage, setStage] = useState('login'); // 'login' or 'form'
  const [loginName, setLoginName] = useState('');
  const [title, setTitle] = useState('');
  const [schedule, setSchedule] = useState('0');
  const webviewRef = useRef(null);

  // Fetch background posts once
  useEffect(() => {
    const fetchBackgrounds = async () => {
      const upload = await createUploadDocument(moment().format('YYYYMMDD'));
      const userdoc = await getUserDocument();
      setNbVideos(upload ? upload.NbVideos : userdoc!=null && userdoc.Premium ? 10 : 3);
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
      // Check if user is premium to set allowed videos
    (async () => {
      const userDoc = await getUserDocument();
      if (userDoc && userDoc.Premium) {
        setAllowedVideos(10); // Premium users can upload 10 videos/day
      }
    })();
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
          console.log('TikTok handle:', handle);
          setStage('form');
          // Persist session locally
          await AsyncStorage.setItem('tikTokSession', JSON.stringify({
            sessionid: session.value,
            dc_id: dc.value,
            login_name: handle
          }));
          showCustomAlert('Login Success', 'TikTok session captured');
        }
      } catch (err) {
        console.error('Cookie read error:', err);
      }
    }
  };

  // Called when user taps "Create Video" & then performs upload
  const handleCreateVideo = async () => {
    if (SelectedBackground === "None" || SelectedSource === "None") {
      showCustomAlert("Error", "Please select both a source and background");
      return;
    }
    
    setIsCreatingVideo(true);
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
        showCustomAlert("Error", "TikTok session not found. Please log in again.");
        setIsCreatingVideo(false);
        return;
      }
      const tikTokSession = JSON.parse(tikTokSessionStr);
      const uploadDoc = await createUploadDocument(moment().format('YYYYMMDD'));
      setNbVideos(uploadDoc ? uploadDoc.NbVideos : 0);
      if(uploadDoc == null){
        const resp = await fetch('http://172.19.35.165:5000/create_video', {
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
          // schedule: Math.max(0, Math.floor((moment(selectedDate).valueOf() - Date.now()) / 1000)),
          schedule: moment(selectedDate).format('YYYY/MM/DD|HH:mm'),
          platform: String(selectedPlatforms),
          userId: await AsyncStorage.getItem('userId')
        }),
      });
      }else{
        showCustomAlert("Daily Limit", "Daily upload limit reached. Please try again tomorrow or upgrade to premium.");
        setIsCreatingVideo(false);
        return;
      }
      
      setIsCreatingVideo(false);

      

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
      setIsCreatingVideo(false);
      showCustomAlert("Error", "Failed to connect or process video");
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
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FCFCFC' }}>
        {/* Header with logo and mode toggle */}
        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'center', 
          height: 60, 
          paddingHorizontal: 16,
          marginBottom: 8, 
          justifyContent: 'space-between',
          backgroundColor: 'white',
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          elevation: 3,
          borderBottomLeftRadius: 15,
          borderBottomRightRadius: 15,
        }}>
          <Image
            source={require('../../assets/images/TikTonikLogo.png')}
            style={{ width: 55, height: 55, marginRight: 3 }}
            resizeMode="contain"
          />
          <View style={{ 
            flexDirection: 'row', 
            height: 36, 
            backgroundColor: '#F3F4F6', 
            borderRadius: 9999, 
            padding: 2,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 1,
            elevation: 1,
          }}>
            <TouchableOpacity 
              onPress={() => setMode('Manual')}
              style={{
                backgroundColor: mode === 'Manual' ? 'white' : undefined,
                borderRadius: 9999,
                shadowColor: mode === 'Manual' ? "#000" : "transparent",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: mode === 'Manual' ? 0.1 : 0,
                shadowRadius: mode === 'Manual' ? 2 : 0,
                elevation: mode === 'Manual' ? 2 : 0,
              }}
            >
              <Text style={{ 
                paddingHorizontal: 16, 
                paddingVertical: 6, 
                borderRadius: 9999, 
                fontWeight: '600', 
                color: mode === 'Manual' ? '#2C9814' : '#4B5563' 
              }}>
                Manual
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => setMode('Automatic')}
              style={{
                backgroundColor: mode === 'Automatic' ? 'white' : undefined,
                borderRadius: 9999,
                shadowColor: mode === 'Automatic' ? "#000" : "transparent",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: mode === 'Automatic' ? 0.1 : 0,
                shadowRadius: mode === 'Automatic' ? 2 : 0,
                elevation: mode === 'Automatic' ? 2 : 0,
              }}
            >
              <Text style={{ 
                paddingHorizontal: 16, 
                paddingVertical: 6, 
                borderRadius: 9999, 
                fontWeight: '600', 
                color: mode === 'Automatic' ? '#2C9814' : '#4B5563' 
              }}>
                Automatic
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView 
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
        >
          {/* Sources Section with modern styling */}
          <View style={{ 
            marginTop: 15,
            marginBottom: 10,
            backgroundColor: 'white',
            borderRadius: 25,
            paddingVertical: 15,
            marginHorizontal: 12,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 5,
            elevation: 3,
          }}>
            <Text style={{ 
              fontSize: 22, 
              fontWeight: '700', 
              marginLeft: 20,
              marginBottom: 10,
              color: '#111827',
            }}>
              Sources
            </Text>
            <PostsDisplayer post={sourcePosts} type="source" ItemStyle="h-48 w-48 rounded-full" />
            {SelectedSource !== "None" && (
              <View style={{
                backgroundColor: '#F9FAFB',
                paddingVertical: 8,
                paddingHorizontal: 20,
                borderRadius: 15,
                marginTop: 10,
                marginHorizontal: 20,
                alignSelf: 'center',
                borderWidth: 1,
                borderColor: '#E5E7EB',
              }}>
                <Text style={{ 
                  fontSize: 18, 
                  fontWeight: '600', 
                  color: '#2C9814',
                  textAlign: 'center',
                }}>
                  {SelectedSource}
                </Text>
              </View>
            )}
          </View>

          {/* Backgrounds Section with modern styling */}
          <View style={{ 
            marginTop: 15,
            marginBottom: 10,
            backgroundColor: 'white',
            borderRadius: 25,
            paddingVertical: 15,
            marginHorizontal: 12,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 5,
            elevation: 3,
          }}>
            <Text style={{ 
              fontSize: 22, 
              fontWeight: '700', 
              marginLeft: 20,
              marginBottom: 10,
              color: '#111827',
            }}>
              Background
            </Text>
            {error ? (
              <Text style={{ color: 'red', marginLeft: 20 }}>{error}</Text>
            ) : (
              <PostsDisplayer post={BackgroundPosts} ItemStyle="w-52 h-72" />
            )}
            {SelectedBackground !== "None" && (
              <View style={{
                backgroundColor: '#F9FAFB',
                paddingVertical: 8,
                paddingHorizontal: 20,
                borderRadius: 15,
                marginTop: 10,
                marginHorizontal: 20,
                alignSelf: 'center',
                borderWidth: 1,
                borderColor: '#E5E7EB',
              }}>
                <Text style={{ 
                  fontSize: 18, 
                  fontWeight: '600', 
                  color: '#2C9814',
                  textAlign: 'center',
                }}>
                  {SelectedBackground}
                </Text>
              </View>
            )}
          </View>

          {/* Settings Section with modern styling */}
          <View style={{ 
            marginTop: 15,
            marginBottom: 10,
            backgroundColor: 'white',
            borderRadius: 25,
            paddingVertical: 15,
            marginHorizontal: 12,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 5,
            elevation: 3,
          }}>
            <Text style={{ 
              fontSize: 22, 
              fontWeight: '700', 
              marginLeft: 20,
              marginBottom: 15,
              color: '#111827',
            }}>
              Video Settings
            </Text>
            
            <QualitySelector selectedQuality={selectedQuality} setSelectedQuality={setSelectedQuality} />
            <DurationSelector selectedDuration={selectedDuration} setSelectedDuration={setSelectedDuration} />
            <PlatformSelector 
              selectedPlatforms={selectedPlatforms} 
              setSelectedPlatforms={setSelectedPlatforms}
              onRestrictedPlatformPress={handleRestrictedPlatform}
            />
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
          </View>

          <View style={{ 
            marginTop: 25,
            marginHorizontal: 20,
            marginBottom: 20,
          }}>
            <Button1 
              title='Create Video'
              onPress={handleCreateVideo}
              className="rounded-xl shadow-md"
              disabled={selectedPlatforms.length === 0 || title.trim() === '' || SelectedBackground === "None" || SelectedSource === "None"}
              loading={isCreatingVideo}
            />
            <Text style={{ 
              textAlign: 'center', 
              color: '#6B7280',
              marginTop: 10,
              fontSize: 14,
            }}>
              {`You have created ${NbVideos} out of ${allowedVideos} videos today.`}
            </Text>
          </View>
        </ScrollView>

        <CustomAlert
          visible={alertVisible}
          title={alertTitle}
          message={alertMessage}
          buttons={alertButtons}
          onClose={() => setAlertVisible(false)}
        />
      </SafeAreaView>
    </PostContext.Provider>
  );
};

export default Home;
