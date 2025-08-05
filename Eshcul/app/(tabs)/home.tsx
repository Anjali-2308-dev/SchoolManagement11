import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5, Entypo, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const cardData = [
  {
    name: 'Attendance',
    icon: (color: string) => <Ionicons name="calendar" size={32} color={color} />,
    bgColor: '#e0f7fa',
    color: '#00796b',
  },
  {
    name: 'Fees',
    icon: (color: string) => <FontAwesome5 name="money-bill-wave" size={32} color={color} />,
    bgColor: '#fff3e0',
    color: '#f57c00',
  },
  {
    name: 'Timetable',
    icon: (color: string) => <Ionicons name="time" size={32} color={color} />,
    bgColor: '#e3f2fd',
    color: '#1976d2',
  },
  {
    name: 'Subjects',
    icon: (color: string) => <MaterialCommunityIcons name="book-open-page-variant" size={32} color={color} />,
    bgColor: '#f3e5f5',
    color: '#6a1b9a',
  },
  {
    name: 'Dairy',
    icon: (color: string) => <MaterialCommunityIcons name="notebook" size={32} color={color} />,
    bgColor: '#fce4ec',
    color: '#ad1457',
  },
  {
    name: 'Project Work',
    icon: (color: string) => <MaterialCommunityIcons name="file-document-edit" size={32} color={color} />,
    bgColor: '#e8f5e9',
    color: '#2e7d32',
  },
  {
    name: 'Videos/Gallery',
    icon: (color: string) => <Ionicons name="images" size={32} color={color} />,
    bgColor: '#ede7f6',
    color: '#512da8',
  },
  {
    name: 'Mock Test',
    icon: (color: string) => <MaterialCommunityIcons name="clipboard-check" size={32} color={color} />,
    bgColor: '#fff8e1',
    color: '#f9a825',
  },
  {
    name: 'Reports',
    icon: (color: string) => <Ionicons name="document-text" size={32} color={color} />,
    bgColor: '#fbe9e7',
    color: '#d84315',
  },
  {
    name: 'E Books',
    icon: (color: string) => <MaterialCommunityIcons name="book" size={32} color={color} />,
    bgColor: '#e1f5fe',
    color: '#0288d1',
  },
  {
    name: 'Achievements',
    icon: (color: string) => <FontAwesome5 name="medal" size={32} color={color} />,
    bgColor: '#f9fbe7',
    color: '#9e9d24',
  },
  {
    name: 'Notification',
    icon: (color: string) => <Ionicons name="notifications" size={32} color={color} />,
    bgColor: '#fce4ec',
    color: '#ec407a',
  },
  {
    name: 'Bus Tracking',
    icon: (color: string) => <FontAwesome5 name="bus" size={32} color={color} />,
    bgColor: '#f1f8e9',
    color: '#689f38',
  },
  {
    name: 'Feedback',
    icon: (color: string) => <Feather name="message-square" size={32} color={color} />,
    bgColor: '#f3e5f5',
    color: '#8e24aa',
  },
  {
    name: 'Inventory',
    icon: (color: string) => <MaterialCommunityIcons name="warehouse" size={32} color={color} />,
    bgColor: '#fffde7',
    color: '#fbc02d',
  },
  {
    name: 'Chat Box',
    icon: (color: string) => <Ionicons name="chatbubble-ellipses" size={32} color={color} />,
    bgColor: '#ede7f6',
    color: '#7b1fa2',
  },
];

const numColumns = 3;
const screenWidth = Dimensions.get('window').width;
const cardSize = (screenWidth - 40 - (numColumns * 16)) / numColumns;

export default function HomeScreen() {
  const router = useRouter();

  const handleCardPress = (cardName: string) => {
    const routes: Record<string, string> = {
      'Attendance': '../../attendance',
      'Fees': '../../fee',
      'Timetable': '../../timetable',
      'Subjects': '../../subjects',
      'Dairy': '../../dairy',
      'Project Work': '../../project',
      'Videos/Gallery': '../../videos',
      'Mock Test': '../../mocktest',
      'Reports': '../../reports',
      'E Books': '../../ebooks',
      'Achievements': '../../achievements',
      'Notification': '../../notifications',
      'Bus Tracking': '../../bus-tracking',
      'Feedback': '../../feedback',
      'Inventory': '../../inventory',
      'Chat Box': '../../chatbox',
    };

    if (routes[cardName]) {
      router.push(routes[cardName]);
    }
  };

  return (
    <LinearGradient colors={['#e0eafc', '#cfdef3', '#f5f7fa']} style={styles.gradientContainer}>
      <View style={styles.container}>
        {/* Profile Info */}
        <View style={styles.profileCardRow}>
          <Image source={require('../../assets/images/profile.png')} style={styles.profileImage} />
          <View style={styles.profileDetails}>
            <Text style={styles.profileName}>Anjali</Text>
            <View style={styles.profileRow}>
              <Text style={styles.profileDetail}>Class: 10</Text>
              <Text style={styles.profileDetail}>Section: A</Text>
            </View>
            <Text style={styles.profileDetail}>Roll No: 23</Text>
          </View>
        </View>

        {/* Cards Section */}
        <FlatList
          data={cardData}
          keyExtractor={(_, idx) => idx.toString()}
          numColumns={numColumns}
          contentContainerStyle={styles.cardsContainer}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.card,
                {
                  width: cardSize,
                  height: cardSize,
                  backgroundColor: item.bgColor,
                },
              ]}
              onPress={() => handleCardPress(item.name)}
              activeOpacity={0.85}
            >
              {item.icon(item.color)}
              <Text style={[styles.cardText, { color: item.color }]}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    padding: 30,
    flex: 1,
  },
  profileCardRow: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 32, // pushed more down
    width: '100%',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 6,
  },
  profileImage: {
    width: 75,
    height: 75,
    borderRadius: 75 / 2,
    marginRight: 16,
    borderWidth: 2,
    borderColor: '#2575fc',
    backgroundColor: '#e6f0ff',
  },
  profileDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a237e',
    marginBottom: 4,
  },
  profileDetail: {
    fontSize: 15,
    color: '#333',
    marginRight: 12,
  },
  profileRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  cardsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 80,
  },
  card: {
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  cardText: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
});
