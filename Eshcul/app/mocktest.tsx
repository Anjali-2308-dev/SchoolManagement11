import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import { Card } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';

export default function MockTestsScreen() {
  const [mockTests, setMockTests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMockTests = async () => {
    try {
      const response = await axios.get('http://192.168.29.77:5000/AddTest');
      const data = response.data;
      console.log('Fetched mock tests:', data);

      let testsArray = [];
      if (Array.isArray(data)) {
        testsArray = data;
      } else if (data && Array.isArray(data.tests)) {
        testsArray = data.tests;
      } else {
        console.warn('Unexpected response format:', data);
        Alert.alert('Unexpected Data', 'The response format is not as expected.');
        testsArray = [];
      }
      setMockTests(testsArray);
    } catch (error) {
      console.error('Fetch error:', error);
      Alert.alert(
        'Error',
        `Unable to load mock tests. Make sure the backend is running and reachable.\n\n${error.message}`
      );
      setMockTests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMockTests();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4a90e2" />
        <Text style={{ marginTop: 16, color: '#888' }}>Loading mock tests...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Upcoming Mock Tests</Text>
      <FlatList
        data={mockTests}
        keyExtractor={(item, index) => item._id ? item._id : index.toString()}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.row}>
                <MaterialCommunityIcons name="clipboard-text-outline" size={30} color="#4a90e2" style={styles.icon} />
                <View style={styles.details}>
                  <Text style={styles.title}>{item.title || 'Untitled Test'}</Text>
                  <Text style={styles.text}>Subject: {item.subject || '-'}</Text>
                  <Text style={styles.text}>Class: {item.class || '-'}</Text>
                  <Text style={styles.text}>Date: {item.date ? new Date(item.date).toLocaleDateString() : '-'}</Text>
                  <Text style={styles.text}>Duration: {item.duration ? `${item.duration} mins` : '-'}</Text>
                  <Text style={styles.text}>Questions: {item.questions || '-'}</Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>No mock tests available.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f4f7',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f7',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#34495e',
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    marginBottom: 14,
    borderRadius: 14,
    elevation: 3,
    backgroundColor: '#ffffff',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  icon: {
    marginRight: 12,
    marginTop: 6,
  },
  details: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  text: {
    fontSize: 15,
    color: '#555',
    marginTop: 4,
  },
  empty: {
    textAlign: 'center',
    color: '#888',
    marginTop: 40,
    fontSize: 16,
  },
});