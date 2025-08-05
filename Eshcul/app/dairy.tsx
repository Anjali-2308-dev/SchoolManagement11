import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  Platform,
  Button,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons, FontAwesome5, Entypo } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';

export default function DiaryScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [diaryData, setDiaryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  const formatDate = (date: Date) => date.toISOString().split('T')[0];
  const formattedDate = formatDate(selectedDate);

  const iconMap: Record<string, JSX.Element> = {
    Math: <MaterialCommunityIcons name="math-compass" size={28} color="#fff" />,
    Science: <MaterialCommunityIcons name="flask-outline" size={28} color="#fff" />,
    English: <FontAwesome5 name="book-open" size={24} color="#fff" />,
    Computer: <Entypo name="laptop" size={24} color="#fff" />,
    Default: <FontAwesome5 name="book" size={24} color="#fff" />,
  };

  const fetchDiary = async (dateStr: string) => {
    setLoading(true);
    try {
      const res = await axios.get(`http://192.168.29.77:5000/AddDiary?date=${dateStr}`);
      const filtered = (res.data || []).filter((entry: any) => entry.date === dateStr);
      setDiaryData(filtered);
    } catch (err) {
      console.error('Fetch diary error:', err);
      setDiaryData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiary(formattedDate);
  }, [formattedDate]);

  const handleDateChange = (_: any, date?: Date) => {
    if (Platform.OS !== 'ios') setShowPicker(false);
    if (date) setSelectedDate(date);
  };

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

        <View style={styles.datePicker}>
          <Button title="Select Date" onPress={() => setShowPicker(true)} color="#2575fc" />
          <Text style={styles.selectedDateText}>{formattedDate}</Text>
        </View>

        {showPicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}

        {loading ? (
          <ActivityIndicator size="large" color="#2575fc" />
        ) : diaryData.length > 0 ? (
          <FlatList
            data={diaryData}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={[styles.diaryCard, { backgroundColor: '#4a90e2' }]}>
                <View style={styles.cardHeader}>
                  {iconMap[item.subject] || iconMap.Default}
                  <View style={{ marginLeft: 12 }}>
                    <Text style={styles.subjectText}>{item.subject}</Text>
                    <Text style={styles.teacherText}>Class: {item.class}</Text>
                  </View>
                </View>
                <Text style={styles.diaryText}>{item.notes}</Text>
              </View>
            )}
          />
        ) : (
          <Text style={styles.noDataText}>No diary entries for this date.</Text>
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
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2575fc',
  },
  profileInfo: {
    fontSize: 14,
    color: '#444',
  },
  datePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  selectedDateText: {
    fontSize: 16,
    color: '#2575fc',
  },
  diaryCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  subjectText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  teacherText: {
    fontSize: 13,
    color: '#f1f1f1',
    marginTop: 2,
  },
  diaryText: {
    fontSize: 15,
    color: '#fff',
    lineHeight: 20,
    marginTop: 8,
  },
  noDataText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginTop: 30,
  },
});
