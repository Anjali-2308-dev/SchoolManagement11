import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';

export default function BusTrackingScreen() {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  const busLocation = {
    latitude: 17.4065, // mock bus location
    longitude: 78.4772,
  };

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Location permission denied');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);
      setLoading(false);
    })();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Bus Tracking</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#2575fc" />
      ) : (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location?.latitude || 0,
            longitude: location?.longitude || 0,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker
            coordinate={{ latitude: location.latitude, longitude: location.longitude }}
            title="You"
            description="Your current location"
            pinColor="blue"
          />
          <Marker
            coordinate={busLocation}
            title="Bus"
            description="School Bus Location"
            pinColor="green"
          />
        </MapView>
      )}

      <View style={styles.busDetails}>
        <Text style={styles.sectionTitle}>Bus Details</Text>
        <View style={styles.detailRow}>
          <MaterialIcons name="directions-bus" size={24} color="#2575fc" />
          <Text style={styles.detailText}>Bus No: TS 09 AB 1234</Text>
        </View>
        <View style={styles.detailRow}>
          <FontAwesome5 name="user-tie" size={20} color="#2575fc" />
          <Text style={styles.detailText}>Driver: Ramesh Kumar</Text>
        </View>
        <View style={styles.detailRow}>
          <FontAwesome5 name="clock" size={20} color="#2575fc" />
          <Text style={styles.detailText}>Estimated Arrival: 8:25 AM</Text>
        </View>
        <View style={styles.detailRow}>
          <FontAwesome5 name="phone" size={20} color="#2575fc" />
          <Text style={styles.detailText}>Driver Contact: +91 98765 43210</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f7fa',
    flexGrow: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2575fc',
  },
  map: {
    width: '100%',
    height: 300,
    borderRadius: 16,
    marginBottom: 30,
  },
  busDetails: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#555',
  },
});
