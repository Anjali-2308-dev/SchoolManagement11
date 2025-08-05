import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Alert,
  Image,
  Modal,
  Text,
  useWindowDimensions,
} from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { WebView } from 'react-native-webview';

interface Achievement {
  id: string;
  title: string;
  student: string;
  date: string;
  description: string;
  fileUrl: string;
  fileType: 'pdf' | 'image/jpeg' | 'image/png';
}

const BASE_URL = 'http://192.168.29.77:5000'; // ✅ Change to your server IP

const AchievementsScreen = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState<Achievement | null>(null);
  const { width } = useWindowDimensions();

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const res = await fetch(`${BASE_URL}/achievements`);
        const data = await res.json();
        const achievementsArray = Array.isArray(data)
          ? data
          : data.achievements || [];

        const formatted = achievementsArray.map((item: any) => ({
          id: item._id?.$oid || item._id || Math.random().toString(),
          title: item.title || 'Untitled',
          student: item.student || 'Unknown',
          date: item.date || '-',
          description: item.description || '-',
          fileUrl: item.fileUrl?.startsWith('http')
            ? item.fileUrl
            : `${BASE_URL}${item.fileUrl}`,
          fileType: item.fileType || 'image/jpeg',
        }));

        setAchievements(formatted);
      } catch (error) {
        console.error('Fetch error:', error);
        Alert.alert('Error', 'Failed to load achievements');
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  const handleViewFile = (item: Achievement) => {
    setSelectedFile(item);
    setModalVisible(true);
  };

  const handleDownload = async () => {
    if (!selectedFile) return;

    try {
      const fileExt = selectedFile.fileType.includes('pdf') ? 'pdf' : 'jpg';
      const safeTitle = selectedFile.title
        .replace(/[^a-z0-9]/gi, '_')
        .toLowerCase();
      const fileName = `${safeTitle}_${Date.now()}.${fileExt}`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

      const downloadResumable = FileSystem.createDownloadResumable(
        selectedFile.fileUrl,
        fileUri
      );

      const { uri } = await downloadResumable.downloadAsync();

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert('Downloaded', `File saved to:\n${uri}`);
      }
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert('Error', 'Failed to download file');
    }
  };

  const renderAchievement = ({ item }: { item: Achievement }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Title>{item.title}</Title>
        <Paragraph>👤 {item.student}</Paragraph>
        <Paragraph>📅 {item.date}</Paragraph>
        <Paragraph>Description: {item.description}</Paragraph>
        {item.fileType.includes('image') && (
          <Image source={{ uri: item.fileUrl }} style={styles.image} />
        )}
      </Card.Content>
      <Card.Actions>
        <Button mode="contained" onPress={() => handleViewFile(item)}>
          View File
        </Button>
      </Card.Actions>
    </Card>
  );

  if (loading) {
    return (
      <Text style={{ marginTop: 50, textAlign: 'center' }}>
        Loading achievements...
      </Text>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={achievements}
        keyExtractor={(item) => item.id}
        renderItem={renderAchievement}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {/* File Preview Modal */}
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedFile && (
              <>
                <Text style={styles.modalTitle}>{selectedFile.title}</Text>
                {selectedFile.fileType.includes('pdf') ? (
                  <WebView
                    source={{ uri: selectedFile.fileUrl }}
                    style={styles.modalViewer}
                  />
                ) : (
                  <Image
                    source={{ uri: selectedFile.fileUrl }}
                    style={styles.modalViewer}
                    resizeMode="contain"
                  />
                )}
                <View style={styles.modalActions}>
                  <Button mode="contained" onPress={handleDownload}>
                    Download
                  </Button>
                  <Button
                    mode="outlined"
                    onPress={() => {
                      setModalVisible(false);
                      setSelectedFile(null);
                    }}
                    style={{ marginLeft: 10 }}
                  >
                    Close
                  </Button>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AchievementsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f6f9ff',
  },
  card: {
    marginBottom: 16,
    borderRadius: 10,
  },
  image: {
    width: '100%',
    height: 200,
    marginTop: 10,
    borderRadius: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    maxHeight: '85%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalViewer: {
    width: 300,
    height: 400,
    borderRadius: 10,
    backgroundColor: '#eee',
  },
  modalActions: {
    flexDirection: 'row',
    marginTop: 16,
  },
});
