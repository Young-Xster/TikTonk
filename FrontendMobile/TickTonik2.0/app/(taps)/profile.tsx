import { View, Text, Image, ScrollView, TouchableOpacity, FlatList, ActivityIndicator, StyleSheet, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'expo-router'
import { fetchUser } from '@/Appwrite/appwrite'
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import VideoItem from '@/components/VideoItem'
import CustomAlert from '@/components/CustomAlert'
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry'
import { Ionicons, MaterialIcons, Feather, FontAwesome5 } from '@expo/vector-icons'

interface TikTokVideo {
  url: string;
  likes: number;
  views: number;
  comments: number;
  shares: number;
  watchTime: number;
  caption: string;
  thumbnail: string;
  rank: string;
}

const Profile = () => {
  const [user, setUser] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<{
    username: string;
    followers: string;
    following: string;
    likes: string;
    nickname: string;
    videos: string;
    avatarUrl?: string;
  } | null>(null);
  const [videoList, setVideoList] = useState<TikTokVideo[]>([]);
  const [activeTab, setActiveTab] = useState('videos'); // 'videos' or 'statistics'
  
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

  // Handle statistics tab press
  const handleStatisticsTabPress = () => {
    showCustomAlert(
      "Coming Soon!",
      "Advanced analytics and statistics are coming soon! Stay tuned for detailed insights about your content performance.",
      [
        { text: "Got it!", style: "default" }
      ]
    );
  };
  
  useEffect(() => {
    // const loadUser = async () => {
    //   const userData = await fetchUser();
    //   setUser(userData);
      
    // }
    // loadUser();
  const getUserTikTokData = async () => {
    setIsLoading(true);
    try {
      const tikTokSessionStr = await AsyncStorage.getItem('tikTokSession');
      if (!tikTokSessionStr) {
        showCustomAlert("Error", "TikTok session not found. Please log in again.");
        return;
      }
      const tikTokSession = JSON.parse(tikTokSessionStr);
      const username = tikTokSession.login_name;
      console.log('TikTok Session:', username);
      
      const res = await fetch(`https://www.tiktok.com/@${username}`, {
        headers: {
          "User-Agent": "Mozilla/5.0",
          "Accept": "text/html",
        },
      });
      const res2 = await fetch(`https://api.buzzlytics.io/metadata?username=${username}&service=tiktok`, {
      });
      const data = await res2.json();
      interface TikTokVideo {
        playUrl: string;
        likes: number;
        views: number;
        comments: number;
        shares: number;
        watchTime: number;
        videoDescription: string;
        videoCover: string;
        rank: string;
      }
      
      const videos = data.videos.map((video: TikTokVideo) => ({
        url: video.playUrl,
        likes: video.likes,
        views: video.views,
        comments: video.comments,
        shares: video.shares,
        watchTime: video.watchTime,
        caption: video.videoDescription,
        thumbnail: video.videoCover,
        rank: video.rank
      }));
      if (!res.ok) {
        console.error("Failed to fetch TikTok page:", res.status);
        return null;
      }
      
      const html = await res.text();
      const userPhotoMatch = html.match(/"avatarLarger":"([^"]+)"/)?.[1].replace(/\\u002F/g, "/");
      const VideosCount = html.match(/"videoCount":(\d+)/)?.[1];
      const followersMatch = html.match(/"followerCount":(\d+)/)?.[1];
      const followingMatch = html.match(/"followingCount":(\d+)/)?.[1];
      const likesMatch = html.match(/"heartCount":(\d+)/)?.[1];
      const nicknameMatch = html.match(/"nickname":"([^"]+)"/)?.[1];

      

      setUserData({
        username,
        followers: followersMatch || "N/A",
        following: followingMatch || "N/A",
        likes: likesMatch || "N/A",
        nickname: nicknameMatch || "N/A",
        videos : VideosCount || "N/A",
        avatarUrl: userPhotoMatch || undefined,
      });
      
      setVideoList(videos);
      //

      setUser(username);
    } catch (error) {
      console.error("Error fetching TikTok data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  getUserTikTokData();
  }, []);

  // Format large numbers with K, M suffix
  const formatNumber = (num: string) => {
    const value = parseInt(num, 10);
    if (isNaN(value)) return 'N/A';
    
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + 'M';
    }
    if (value >= 1000) {
      return (value / 1000).toFixed(1) + 'K';
    }
    return value.toString();
  };
  
  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2C9814" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      ) : (
        <FlatList
          ListHeaderComponent={() => (
            <View style={styles.headerContainer}>
              {/* Profile Header with improved design */}
              <View style={styles.profileHeader}>
                <TouchableOpacity style={styles.settingsButton}>
                  <Ionicons name="settings-outline" size={24} color="#333" />
                </TouchableOpacity>
                
                <View style={styles.profileImageContainer}>
                  <Image 
                    source={userData?.avatarUrl ? { uri: userData.avatarUrl } : require('../../assets/images/icons/AccountIcon.png')}
                    style={styles.profileImage}
                  />
                  <View style={styles.verifiedBadge}>
                    <Ionicons name="checkmark-circle" size={22} color="#2C9814" />
                  </View>
                </View>
                
                <Text style={styles.nickname}>{userData?.nickname}</Text>
                <Text style={styles.username}>@{userData?.username}</Text>
                
                {/* <TouchableOpacity style={styles.editProfileButton}>
                  <Text style={styles.editProfileText}>Edit Profile</Text>
                </TouchableOpacity> */}
              </View>

              {/* Stats Section with improved styling */}
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{formatNumber(userData?.followers || '0')}</Text>
                  <Text style={styles.statLabel}>Followers</Text>
                </View>
                
                <View style={styles.statDivider} />
                
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{formatNumber(userData?.likes || '0')}</Text>
                  <Text style={styles.statLabel}>Likes</Text>
                </View>
                
                <View style={styles.statDivider} />
                
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{formatNumber(userData?.videos || '0')}</Text>
                  <Text style={styles.statLabel}>Videos</Text>
                </View>
              </View>
              
              {/* Tab selector for Videos/Statistics */}
              <View style={styles.tabContainer}>
                <TouchableOpacity 
                  style={[styles.tab, activeTab === 'videos' && styles.activeTab]}
                  onPress={() => setActiveTab('videos')}
                >
                  <Ionicons 
                    name="grid-outline" 
                    size={22} 
                    color={activeTab === 'videos' ? '#2C9814' : '#666'} 
                  />
                  <Text style={[
                    styles.tabText, 
                    activeTab === 'videos' && styles.activeTabText
                  ]}>
                    Videos
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.tab]} // Remove activeTab styling since statistics is not implemented
                  onPress={handleStatisticsTabPress}
                >
                  <Ionicons 
                    name="stats-chart-outline" 
                    size={22} 
                    color='#666' // Keep it gray since it's not active
                  />
                  <Text style={[
                    styles.tabText // Remove activeTabText styling since statistics is not implemented
                  ]}>
                    Statistics
                  </Text>
                </TouchableOpacity>
              </View>
              
              <Text style={styles.sectionTitle}>Recent Videos</Text>
            </View>
          )}
          data={videoList}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <VideoItem 
              likes={item.likes?.toString() || '0'}
              views={item.views?.toString() || '0'}
              comments={item.comments?.toString() || '0'}
              shares={item.shares?.toString() || '0'}
              rank={item.rank?.toString() || '0'}
              caption={item.caption || ''}
              thamnailUrl={item.thumbnail || ""}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
      
      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        buttons={alertButtons}
        onClose={() => setAlertVisible(false)}
      />
    </SafeAreaView>
  )
}

interface AccountItemProps {
  name: string;
}

const AccountItem: React.FC<AccountItemProps> = ({ name }) => {
  const router = useRouter();
  
  return (
    <TouchableOpacity 
      className="flex-row justify-between items-center bg-gray-100 p-4 mb-2 rounded-lg"
      onPress={() => router.push({
        pathname: "/(auth)/account-details",
        params: { name }
      }) }
    >
      <Text className="text-base">{name}</Text>
      <TouchableOpacity className="p-1">
        <Text className="text-xl text-gray-500">⋮</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

// Add styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFCFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  headerContainer: {
    backgroundColor: 'white',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 5,
    paddingBottom: 15,
    marginBottom: 15,
  },
  profileHeader: {
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 20,
    position: 'relative',
  },
  settingsButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 2,
  },
  nickname: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 16,
  },
  editProfileButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  editProfileText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C9814',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    marginHorizontal: 15,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: '70%',
    backgroundColor: '#E5E7EB',
    alignSelf: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    marginTop: 20,
    paddingHorizontal: 30,
    marginBottom: 10,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#2C9814',
  },
  tabText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: '#2C9814',
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 15,
  },
  listContent: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
});

export default Profile