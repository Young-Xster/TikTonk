import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface VideoItemProps {
  thamnailUrl?: string;
  likes: string;
  views: string;
  comments: string;
  shares: string;
  rank: string;
  caption: string;
}

const VideoItem: React.FC<VideoItemProps> = ({ likes, views, comments, shares, rank, caption, thamnailUrl }) => {
  // Format large numbers with K, M suffix
  const formatNumber = (num: string) => {
    const value = parseInt(num, 10);
    if (isNaN(value)) return '0';
    
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + 'M';
    }
    if (value >= 1000) {
      return (value / 1000).toFixed(1) + 'K';
    }
    return value.toString();
  };

  // Truncate long captions
  const truncateCaption = (text: string, maxLength: number = 80) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.9}>
      <Image 
        source={{ uri: thamnailUrl }} 
        style={styles.thumbnail} 
        resizeMode='cover' 
      />
      
      <View style={styles.contentContainer}>
        <Text style={styles.caption}>{truncateCaption(caption)}</Text>
        
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Ionicons name="heart" size={16} color="#FF4D67" />
            <Text style={styles.statText}>{formatNumber(likes)}</Text>
          </View>
          
          <View style={styles.statItem}>
            <Ionicons name="eye" size={16} color="#2C9814" />
            <Text style={styles.statText}>{formatNumber(views)}</Text>
          </View>
          
          <View style={styles.statItem}>
            <Ionicons name="chatbubble" size={16} color="#4D7EFF" />
            <Text style={styles.statText}>{formatNumber(comments)}</Text>
          </View>
        </View>
        
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Ionicons name="share-social" size={16} color="#8B5CF6" />
            <Text style={styles.statText}>{formatNumber(shares)}</Text>
          </View>
          
          <View style={styles.statItem}>
            <Ionicons name="trending-up" size={16} color="#F59E0B" />
            <Text style={styles.statText}>Rank {rank}</Text>
          </View>
          
          {/* <TouchableOpacity style={styles.playButton}>
            <Ionicons name="play" size={14} color="white" />
            <Text style={styles.playButtonText}>Play</Text>
          </TouchableOpacity> */}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    overflow: 'hidden',
  },
  thumbnail: {
    width: 110,
    height: 140,
    backgroundColor: '#F3F4F6',
  },
  contentContainer: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  caption: {
    fontSize: 14,
    color: '#1F2937',
    marginBottom: 8,
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    marginLeft: 4,
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C9814',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  playButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 3,
  },
});

export default VideoItem;