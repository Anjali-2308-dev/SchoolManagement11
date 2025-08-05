import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import { FontAwesome } from '@expo/vector-icons'; // FontAwesome for play icon

const screenWidth = Dimensions.get('window').width;

type VideoItem = {
  _id: string;
  title: string;
  subject: string;
  thumbnail: string;
  url: string;
};

export default function VideosScreen() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await axios.get('http://192.168.29.77:5000/videos');
      if (Array.isArray(res.data)) {
        setVideos(res.data);
      } else {
        setVideos([]);
        Alert.alert('Error', 'Unexpected API response format');
      }
    } catch (error: any) {
      Alert.alert('Error', 'Failed to load video content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openLink = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert("Can't open this URL");
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#2575fc" />
      </View>
    );
  }

  return (
    <LinearGradient colors={['#e0eafc', '#f5f7fa']} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>📹 Teacher Videos</Text>
        <View style={styles.videoList}>
          {videos.length === 0 ? (
            <Text style={{ textAlign: 'center', color: '#888', marginTop: 40 }}>
              No videos available.
            </Text>
          ) : (
            videos.map((item) => (
              <TouchableOpacity
                key={item._id}
                style={styles.videoCard}
                onPress={() => openLink(item.url)}
              >
                {item.thumbnail && item.thumbnail.startsWith('http') ? (
                  <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
                ) : (
                  <View style={styles.iconWrapper}>
                    <FontAwesome name="play-circle" size={70} color="#2575fc" />
                  </View>
                )}
                <Text style={styles.videoTitle}>{item.title}</Text>
                <Text style={styles.subject}>{item.subject}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#2575fc',
  },
  videoList: {
    marginBottom: 24,
  },
  videoCard: {
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: 180,
  },
  iconWrapper: {
    height: 180,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#edf2fc',
  },
  videoTitle: {
    paddingHorizontal: 12,
    paddingTop: 10,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  subject: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    fontSize: 14,
    color: '#666',
  },
});