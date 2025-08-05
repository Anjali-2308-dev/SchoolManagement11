import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons, FontAwesome5, Entypo } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import moment from 'moment';

export default function ProjectScreen() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get('http://192.168.29.77:5000/AddProject'); // Update if needed
        setProjects(res.data);
      } catch (err) {
        console.error('Failed to fetch projects', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const renderIcon = (subject) => {
    switch (subject?.toLowerCase()) {
      case 'mathematics':
        return <MaterialCommunityIcons name="math-compass" size={28} color="#fff" />;
      case 'science':
        return <MaterialCommunityIcons name="atom" size={28} color="#fff" />;
      case 'english':
        return <FontAwesome5 name="pen-fancy" size={24} color="#fff" />;
      case 'computer':
        return <Entypo name="laptop" size={24} color="#fff" />;
      default:
        return <Entypo name="book" size={24} color="#fff" />;
    }
  };

  const subjectColors = {
    mathematics: '#F76E6E',
    science: '#00B894',
    english: '#6C5CE7',
    computer: '#0984E3',
    telugu: '#F0932B',
    default: '#636e72',
  };

  const formatDate = (dateStr) => moment(dateStr).format('MMM DD, YYYY');

  return (
    <LinearGradient colors={['#e0eafc', '#f5f7fa']} style={styles.gradient}>
      <View style={styles.container}>
        <View style={styles.profileCard}>
          <Image source={require('../assets/images/profile.png')} style={styles.profileImage} />
          <View>
            <Text style={styles.profileName}>John Doe</Text>
            <Text style={styles.profileInfo}>Class: 10 | Section: A</Text>
            <Text style={styles.profileInfo}>Roll No: 23</Text>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#2575fc" />
        ) : (
          <FlatList
            data={projects}
            keyExtractor={(item, i) => item._id || i.toString()}
            renderItem={({ item }) => {
              const color = subjectColors[item.subject?.toLowerCase()] || subjectColors.default;
              return (
                <View style={[styles.projectCard, { backgroundColor: color }]}>
                  <View style={styles.cardHeader}>
                    {renderIcon(item.subject)}
                    <Text style={styles.subjectText}>{item.subject}</Text>
                  </View>
                  <Text style={styles.projectTitle}>Title: {item.title}</Text>
                  <Text style={styles.projectInfo}>Class: {item.class}</Text>
                  <Text style={styles.projectInfo}>Due Date: {formatDate(item.dueDate)}</Text>
                  <Text style={styles.projectInfo}>Description: {item.description || 'N/A'}</Text>
                </View>
              );
            }}
            contentContainerStyle={{ paddingBottom: 40 }}
          />
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1, padding: 20 },
  profileCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
    elevation: 4,
  },
  profileImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 16,
    backgroundColor: '#ddd',
  },
  profileName: { fontSize: 20, fontWeight: 'bold', color: '#2575fc' },
  profileInfo: { fontSize: 14, color: '#444' },
  projectCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  subjectText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 12,
    textTransform: 'capitalize',
  },
  projectTitle: { fontSize: 16, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  projectInfo: { fontSize: 14, color: '#fff', marginBottom: 2 },
});
