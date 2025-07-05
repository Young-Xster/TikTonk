import React, { useState, useRef } from 'react';
import { View, Text, TextInput, Button, Alert, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import Cookies from '@react-native-cookies/cookies';

export default function App() {
  const [stage, setStage] = useState('login'); // 'login' or 'form'
  const [loginName, setLoginName] = useState('');
  const [title, setTitle] = useState('');
  const [schedule, setSchedule] = useState('0');
  const webviewRef = useRef<WebView>(null);

  // Triggered on every URL change in the WebView
  const onWebViewNavigationStateChange = async (navState: { url: any; }) => {
    const { url } = navState;
    // After user logs in, TikTok typically redirects to homepage/profile
    if (url.includes('tiktok.com') && url.includes('@')) {
      // Try to read required cookies
      const cookieStore = await Cookies.get('https://www.tiktok.com');
      const session = cookieStore['sessionid'];
      const dc = cookieStore['tt-target-idc'];
      if (session?.value && dc?.value) {
        // Store loginName as the TikTok handle extracted from URL
        const handle = url.split('/@')[1]?.split('?')[0];
        setLoginName(handle || loginName);
        setStage('form');
        Alert.alert('Login Success', 'TikTok session captured');
      }
    }
  };

  // Called when user taps "Upload"
  const upload = async () => {
    // Retrieve cookies again to ensure freshness
    const cookieStore = await Cookies.get('https://www.tiktok.com');
    const session = cookieStore['sessionid'];
    const dc = cookieStore['tt-target-idc'];
    if (!session?.value || !dc?.value) {
      Alert.alert('Error', 'Not logged in');
      return;
    }

    const payload = {
      login_name: loginName,
      sessionid: session.value,
      dc_id: dc.value,
      title,
      schedule: parseInt(schedule, 10) || 0,
    };

    fetch('http://192.168.1.15:5000/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(r => r.json())
      .then(json => Alert.alert('Response', json.message))
      .catch(err => Alert.alert('Error', err.message));
  };

  // Render WebView for login
  if (stage === 'login') {
    return (
      <WebView
        ref={webviewRef}
        source={{ uri: 'https://www.tiktok.com/login' }}
        onNavigationStateChange={onWebViewNavigationStateChange}
        startInLoadingState
        renderLoading={() => <ActivityIndicator size="large" />}
      />
    );
  }

  // Render metadata form after login
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Logged in as: @{loginName}</Text>

      <Text style={{ marginTop: 20 }}>Title:</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Video caption"
        style={{ borderBottomWidth: 1, marginBottom: 20 }}
      />

      <Text>Schedule (seconds from now):</Text>
      <TextInput
        value={schedule}
        onChangeText={setSchedule}
        keyboardType="numeric"
        placeholder="0 for immediate"
        style={{ borderBottomWidth: 1, marginBottom: 20 }}
      />

      <Button title="Upload to TikTok" onPress={upload} />
    </View>
  );
}