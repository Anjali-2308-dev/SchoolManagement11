import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator } from 'react-native';
import { Card } from 'react-native-paper';
import { FontAwesome5, Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';

const student = {
  name: 'John Doe',
  class: '10',
  section: 'A',
  rollNo: '23',
  profilePic: require('../assets/images/profile.png'),
};

export default function SubjectsScreen() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const iconMap = {
    calculator: <FontAwesome5 name="calculator" size={28} color="#fff" />,
    book: <Entypo name="book" size={28} color="#fff" />,
    atom: <MaterialCommunityIcons name="atom" size={28} color="#fff" />,
    landmark: <FontAwesome5 name="landmark" size={28} color="#fff" />,
    'laptop-code': <FontAwesome5 name="laptop-code" size={28} color="#fff" />,
    'run-fast': <MaterialCommunityIcons name="run-fast" size={28} color="#fff" />,
  };

  useEffect(() => {
    axios.get('http://192.168.29.77:5000/subjects')
      .then(res => {
        setSubjects(res.data);
      })
      .catch(err => {
        console.error('Error fetching subjects:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <View style={styles.container}>
      {/* Student Info */}
      <View style={styles.profileCard}>
        <Image source={student.profilePic} style={styles.profileImage} />
        <View style={styles.profileDetails}>
          <Text style={styles.name}>{student.name}</Text>
          <Text style={styles.detail}>Class: {student.class}</Text>
          <Text style={styles.detail}>Section: {student.section}</Text>
          <Text style={styles.detail}>Roll No: {student.rollNo}</Text>
        </View>
      </View>

      {/* Subjects */}
      {loading ? (
        <ActivityIndicator size="large" color="#2575fc" />
      ) : (
        <FlatList
          data={subjects}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <Card style={[styles.card, { backgroundColor: item.bgColor || '#4a90e2' }]}>
              <Card.Content style={styles.cardContent}>
                <View style={styles.icon}>
                  {iconMap[item.subjectIcon] || <FontAwesome5 name="book" size={28} color="#fff" />}
                </View>
                <View>
                  <Text style={styles.subjectName}>{item.name}</Text>
                  <Text style={styles.subjectInfo}>Teacher: {item.teacher}</Text>
                </View>
              </Card.Content>
            </Card>
          )}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f4f7',
  },
  profileCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 14,
    marginBottom: 16,
    elevation: 3,
    alignItems: 'center',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
    backgroundColor: '#e0e0e0',
  },
  profileDetails: {
    flex: 1,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2575fc',
  },
  detail: {
    fontSize: 16,
    color: '#444',
    marginTop: 4,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    marginVertical: 10,
    borderRadius: 16,
    elevation: 4,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 16,
  },
  subjectName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  subjectInfo: {
    fontSize: 15,
    color: '#f0f0f0',
    marginTop: 4,
  },
});