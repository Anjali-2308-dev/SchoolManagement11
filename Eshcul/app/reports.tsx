import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const studentInfo = {
  name: 'John Doe',
  class: '10',
  section: 'A',
  rollNo: '23',
};

const reportCardData = [
  { subject: 'Mathematics', marks: 92, grade: 'A+' },
  { subject: 'Science', marks: 85, grade: 'A' },
  { subject: 'English', marks: 78, grade: 'B+' },
  { subject: 'Social Studies', marks: 88, grade: 'A' },
  { subject: 'Computer', marks: 95, grade: 'A+' },
  { subject: 'Hindi', marks: 74, grade: 'B' },
];

// Calculate total and average
const totalMarks = reportCardData.reduce((acc, item) => acc + item.marks, 0);
const maxMarks = reportCardData.length * 100;
const averageMarks = totalMarks / reportCardData.length;

// Grade based on average
const getOverallGrade = (avg: number) => {
  if (avg >= 90) return 'A+';
  if (avg >= 80) return 'A';
  if (avg >= 70) return 'B+';
  if (avg >= 60) return 'B';
  if (avg >= 50) return 'C';
  return 'D';
};

export default function ReportsScreen() {
  return (
    <LinearGradient colors={['#e0eafc', '#f5f7fa']} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Profile */}
        <View style={styles.profileCard}>
          <Image
            source={require('../assets/images/profile.png')}
            style={styles.profileImage}
          />
          <View>
            <Text style={styles.profileName}>{studentInfo.name}</Text>
            <Text style={styles.profileInfo}>Class: {studentInfo.class} | Section: {studentInfo.section}</Text>
            <Text style={styles.profileInfo}>Roll No: {studentInfo.rollNo}</Text>
          </View>
        </View>

        {/* Heading */}
        <Text style={styles.heading}>Academic Report</Text>

        {/* Table Header */}
        <View style={[styles.row, styles.headerRow]}>
          <Text style={[styles.cell, styles.headerText]}>Subject</Text>
          <Text style={[styles.cell, styles.headerText]}>Marks</Text>
          <Text style={[styles.cell, styles.headerText]}>Grade</Text>
        </View>

        {/* Table Rows */}
        {reportCardData.map((item, index) => (
          <View key={index} style={styles.row}>
            <Text style={styles.cell}>{item.subject}</Text>
            <Text style={styles.cell}>{item.marks}</Text>
            <Text style={styles.cell}>{item.grade}</Text>
          </View>
        ))}

        {/* Overall Section */}
        <View style={[styles.row, styles.overallRow]}>
          <Text style={styles.cellBold}>Total</Text>
          <Text style={styles.cellBold}>{totalMarks} / {maxMarks}</Text>
          <Text style={styles.cellBold}>Avg: {averageMarks.toFixed(1)}</Text>
        </View>

        <View style={[styles.row, styles.gradeRow]}>
          <Text style={[styles.cell, styles.overallGradeText]}>Overall Grade:</Text>
          <Text style={[styles.cell, styles.overallGradeValue]}>{getOverallGrade(averageMarks)}</Text>
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
    paddingBottom: 40,
  },
  profileCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,
  },
  profileImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 16,
    backgroundColor: '#ccc',
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2575fc',
  },
  profileInfo: {
    fontSize: 14,
    color: '#555',
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 10,
    marginBottom: 8,
    elevation: 1,
  },
  headerRow: {
    backgroundColor: '#2575fc',
  },
  headerText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    color: '#444',
  },
  cellBold: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#222',
  },
  overallRow: {
    backgroundColor: '#f2f2f2',
    borderColor: '#ddd',
    borderWidth: 1,
  },
  gradeRow: {
    backgroundColor: '#d1e7ff',
    borderColor: '#a5c9ff',
    borderWidth: 1,
  },
  overallGradeText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#2575fc',
  },
  overallGradeValue: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#2575fc',
    textAlign: 'center',
  },
});
