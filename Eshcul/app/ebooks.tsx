import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Alert,
  useWindowDimensions,
  Text,
} from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import axios from 'axios';

interface Ebook {
  id: string;
  title: string;
  subject: string;
  pdfurl: string;
  author: string;
}

const API_URL = 'http://192.168.29.77:5000/api/ebooks'; // Update with your server IP

const EbookScreen = () => {
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [loading, setLoading] = useState(true);
  const { width } = useWindowDimensions();
  const isMidSizePhone = width >= 320 && width <= 480;

  useEffect(() => {
    const fetchEbooks = async () => {
      try {
        const res = await axios.get(API_URL, { timeout: 5000 });
        const ebooksArray = Array.isArray(res.data)
          ? res.data
          : res.data?.ebooks || res.data?.data || [];

        const formatted = ebooksArray.map((item: any) => ({
          id: item._id || item.id || Math.random().toString(),
          title: item.title || 'Untitled',
          subject: item.subject || '-',
          pdfurl: item.url?.startsWith('http')
            ? item.url
            : `http://192.168.29.77:5000${item.url}`,
          author: item.author || '-',
        }));
        setEbooks(formatted);
      } catch (err) {
        Alert.alert(
          'Error',
          'Failed to load ebooks. Please check your network or server.'
        );
        setEbooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEbooks();
  }, []);

  const handleDownload = async (ebook: Ebook) => {
    try {
      if (!ebook.pdfurl) {
        Alert.alert('Error', 'No file URL available');
        return;
      }

      // Sanitize title to make it a valid filename
      const safeTitle = ebook.title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();

      // Extract file extension
      let fileExt = 'pdf';
      try {
        const urlPath = new URL(ebook.pdfurl).pathname;
        const parts = urlPath.split('.');
        if (parts.length > 1) {
          fileExt = parts.pop() || 'pdf';
        }
      } catch {
        fileExt = 'pdf';
      }

      const fileName = `${safeTitle}_${Date.now()}.${fileExt}`;
      const downloadPath = `${FileSystem.documentDirectory}${fileName}`;

      console.log('Downloading from:', ebook.pdfurl);
      console.log('Saving as:', downloadPath);

      const downloadResumable = FileSystem.createDownloadResumable(
        ebook.pdfurl,
        downloadPath
      );

      const { uri } = await downloadResumable.downloadAsync();
      console.log('Downloaded to:', uri);

      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert('Downloaded', `Saved to: ${uri}`);
        return;
      }

      await Sharing.shareAsync(uri);
    } catch (error: any) {
      console.error('Download error:', error);
      Alert.alert('Error', 'Could not open or download file. Please check the file name or URL.');
    }
  };

  const renderEbookCard = ({ item }: { item: Ebook }) => (
    <Card style={[styles.card, isMidSizePhone && styles.midSizeCard]}>
      <Card.Content>
        <Title style={[styles.title, isMidSizePhone && styles.midSizeTitle]}>
          {item.title}
        </Title>
        <Paragraph style={styles.subject}>Subject: {item.subject}</Paragraph>
        <Paragraph style={styles.file}>Author: {item.author}</Paragraph>
      </Card.Content>
      <Card.Actions style={styles.actions}>
        <Button mode="contained" onPress={() => handleDownload(item)}>
          Download
        </Button>
      </Card.Actions>
    </Card>
  );

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ fontSize: 18, color: '#555' }}>Loading eBooks...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, isMidSizePhone && styles.midSizeContainer]}>
      <FlatList
        data={ebooks}
        keyExtractor={(item) => item.id}
        renderItem={renderEbookCard}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', color: '#888', marginTop: 40, fontSize: 16 }}>
            No eBooks available.
          </Text>
        }
      />
    </View>
  );
};

export default EbookScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F9F9F9',
  },
  midSizeContainer: {
    padding: 12,
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 3,
    paddingHorizontal: 10,
  },
  midSizeCard: {
    paddingHorizontal: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  midSizeTitle: {
    fontSize: 16,
  },
  subject: {
    marginTop: 4,
    fontSize: 14,
    color: '#555',
  },
  file: {
    fontSize: 13,
    color: '#999',
  },
  actions: {
    justifyContent: 'flex-end',
    marginTop: 8,
    marginBottom: 4,
  },
});
