import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';

export default function TimetableScreen() {
  const [timetable, setTimetable] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const className = '10A';

  const periodTimeMap: { [key: number]: string } = {
    0: '9:00 - 10:00',
    1: '10:00 - 11:00',
    2: '11:00 - 12:00',
    3: '12:00 - 1:00',
    4: '2:00 - 3:00',
    5: '3:00 - 4:00',
  };

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const res = await axios.get(`http://192.168.29.77:5000/timetable/${className}`);
        console.log('Fetched timetable:', res.data);
        setTimetable(res.data.data);
      } catch (err) {
        console.error('Failed to fetch timetable:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTimetable();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2575fc" />
      </View>
    );
  }

  if (!timetable || !timetable.entries || Object.keys(timetable.entries).length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: '#333' }}>No timetable data found.</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={['#e0eafc', '#cfdef3']} style={styles.gradientContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Class Info */}
        <View style={styles.studentCard}>
          <LinearGradient colors={['#2575fc', '#6a11cb']} style={styles.studentHeader} />
          <Text style={styles.studentName}>Class: {timetable.className}</Text>
          <Text style={styles.studentDetail}>Section: {timetable.section}</Text>
          <Text style={styles.studentDetail}>Academic Year: {timetable.academicYear}</Text>
        </View>

        {/* Timetable Entries */}
        <View style={styles.timetableCard}>
          <Text style={styles.timetableTitle}>Weekly Timetable</Text>

          {Object.entries(timetable.entries).map(([day, dailyEntries]: [string, string[]]) => (
            <View key={day} style={styles.dayBlock}>
              <Text style={styles.dayHeader}>{day}</Text>

              {dailyEntries.map((subject: string, index: number) => (
                <View
                  key={index}
                  style={[styles.timetableRow, index % 2 === 0 && styles.altRow]}
                >
                  <Text style={styles.time}>{periodTimeMap[index]}</Text>
                  <Text style={styles.subject}>{subject}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientContainer: { flex: 1 },
  container: { padding: 20, alignItems: 'center' },
  studentCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    alignItems: 'center',
    marginBottom: 28,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    position: 'relative',
    overflow: 'hidden',
  },
  studentHeader: {
    position: 'absolute',
    top: 0, left: 0, right: 0, height: 8,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  studentName: { fontSize: 22, fontWeight: 'bold', color: '#1a237e', marginBottom: 6 },
  studentDetail: { fontSize: 16, color: '#555', marginBottom: 2 },
  timetableCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  timetableTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2575fc',
    marginBottom: 16,
    textAlign: 'center',
  },
  dayBlock: {
    marginBottom: 20,
  },
  dayHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6a11cb',
    marginBottom: 10,
  },
  timetableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  altRow: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  subject: { fontSize: 15, color: '#333', width: 140, textAlign: 'right' },
  time: { fontSize: 15, color: '#555', width: 140 },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
