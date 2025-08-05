import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import DropDownPicker from 'react-native-dropdown-picker';
import axios from 'axios'

const FeedbackScreen = () => {
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const [open, setOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [teachers, setTeachers] = useState([
    { label: 'Mr. Ramesh (Math)', value: 'ramesh' },
    { label: 'Ms. Priya (Science)', value: 'priya' },
    { label: 'Mr. Kiran (English)', value: 'kiran' },
    { label: 'Ms. Sneha (Computer)', value: 'sneha' },
  ]);

  const handleSubmit = async () => {
  if (!selectedTeacher || !feedback || rating === 0) {
    Alert.alert('Please complete all fields before submitting.');
    return;
  }

  try {
    const res = await axios.post('http://192.168.29.77:5000/studentfeedback', {
  teacher: selectedTeacher,
  feedback,
  rating,
});
    Alert.alert('Success', res.data.message);
    setFeedback('');
    setRating(0);
    setSelectedTeacher(null);
  } catch (err) {
    console.error(err);
    Alert.alert('Error', 'Failed to submit feedback.');
  }
};

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Give Feedback on Teachers</Text>

        <DropDownPicker
          open={open}
          value={selectedTeacher}
          items={teachers}
          setOpen={setOpen}
          setValue={setSelectedTeacher}
          setItems={setTeachers}
          placeholder="Select a Teacher"
          style={styles.dropdown}
          dropDownContainerStyle={{ borderColor: '#ccc' }}
        />

        <Text style={styles.label}>Your Feedback</Text>
        <TextInput
          style={styles.textInput}
          multiline
          numberOfLines={5}
          value={feedback}
          onChangeText={setFeedback}
          placeholder="Write your feedback here..."
          placeholderTextColor="#888"
        />

        <Text style={styles.label}>Rate the Teacher</Text>
        <View style={styles.ratingContainer}>
          {[1, 2, 3, 4, 5].map((num) => (
            <TouchableOpacity key={num} onPress={() => setRating(num)}>
              <Ionicons
                name={num <= rating ? 'star' : 'star-outline'}
                size={32}
                color="#fdd835"
                style={{ marginHorizontal: 6 }}
              />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit Feedback</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FeedbackScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fc',
  },
  scrollContainer: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2575fc',
    textAlign: 'center',
  },
  dropdown: {
    marginBottom: 20,
    borderColor: '#ccc',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#2575fc',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#2575fc',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
});
