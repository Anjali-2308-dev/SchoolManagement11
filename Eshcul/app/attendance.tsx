import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { LinearGradient } from 'expo-linear-gradient';

const screenWidth = Dimensions.get('window').width;

type AttendanceRecord = { status: string };
type AttendanceData = { [date: string]: AttendanceRecord };

const attendanceData: AttendanceData = {
  '2025-07-01': { status: 'present' },
  '2025-07-02': { status: 'absent' },
  '2025-07-03': { status: 'present' },
  '2025-07-04': { status: 'present' },
  '2025-07-05': { status: 'absent' },
};

const markedDates = Object.keys(attendanceData).reduce((acc, date) => {
  acc[date] = {
    selected: true,
    selectedColor: attendanceData[date].status === 'present' ? '#4CAF50' : '#F44336',
    customStyles: {
      container: {
        borderRadius: 8,
      },
      text: {
        color: '#fff',
        fontWeight: 'bold',
      },
    },
  };
  return acc;
}, {});

const totalDays = Object.keys(attendanceData).length;
const presentDays = Object.values(attendanceData).filter(d => d.status === 'present').length;
const absentDays = totalDays - presentDays;
const totalPercentage = totalDays ? ((presentDays / totalDays) * 100).toFixed(2) : '0.00';
const monthlyPercentage = totalPercentage;
const dailyPercentage = presentDays ? '100.00' : '0.00';

export default function AttendanceScreen() {
  const [selected, setSelected] = useState('');

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#2575fc', '#6a11cb']} style={styles.header}>
        <Text style={styles.headerText}>📅 Attendance Overview</Text>
      </LinearGradient>

      <Calendar
        style={styles.calendar}
        markedDates={markedDates}
        onDayPress={day => setSelected(day.dateString)}
        theme={{
          todayTextColor: '#2575fc',
          arrowColor: '#2575fc',
          textSectionTitleColor: '#444',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: '600',
        }}
      />

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Summary</Text>
        <Text style={styles.detailText}>
          ✅ Total Present: <Text style={{ color: '#4CAF50' }}>{presentDays}</Text>
        </Text>
        <Text style={styles.detailText}>
          ❌ Total Absent: <Text style={{ color: '#F44336' }}>{absentDays}</Text>
        </Text>
        <Text style={styles.detailText}>
          📊 Total Percentage: <Text style={{ color: '#2575fc' }}>{totalPercentage}%</Text>
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Performance</Text>
        <Text style={styles.detailText}>
          📆 Monthly Percentage: <Text style={{ color: '#2575fc' }}>{monthlyPercentage}%</Text>
        </Text>
        <Text style={styles.detailText}>
          🗓️ Daily Percentage: <Text style={{ color: '#2575fc' }}>{dailyPercentage}%</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef1f5',
  },
  header: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 4,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  calendar: {
    marginTop: 16,
    marginHorizontal: 18,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 4,
    paddingBottom: 8,
  },
  card: {
    marginHorizontal: 18,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    marginTop: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2575fc',
  },
  detailText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 6,
  },
});
