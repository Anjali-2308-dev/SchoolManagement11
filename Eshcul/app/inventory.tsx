import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { Card } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const screenWidth = Dimensions.get('window').width;

export default function InventoryScreen() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInventory();
  }, []);

  const getIconForItem = (itemName) => {
    const name = itemName.toLowerCase();

    if (name.includes('book')) return 'book-open-page-variant';
    if (name.includes('uniform')) return 'tshirt-crew';
    if (name.includes('id card')) return 'card-account-details';
    if (name.includes('notebook')) return 'notebook';
    if (name.includes('shoe')) return 'shoe-formal';
    if (name.includes('bag')) return 'bag-personal';

    return 'package-variant'; // default fallback icon
  };

  const fetchInventory = async () => {
    try {
      const response = await fetch('http://192.168.29.77:5000/Addstock');
      const data = await response.json();

      const formatted = data.map(item => ({
        id: item._id,
        name: item.item,
        quantity: item.minStock,
        icon: getIconForItem(item.item),
      }));

      setInventory(formatted);
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <View style={styles.cardContent}>
        <MaterialCommunityIcons name={item.icon} size={32} color="#2e7d32" />
        <View style={{ marginLeft: 16 }}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemQuantity}>Available: {item.quantity}</Text>
        </View>
      </View>
    </Card>
  );

  return (
    <LinearGradient colors={['#e8f5e9', '#f1f8e9']} style={styles.container}>
      <Text style={styles.header}>Student Inventory</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#2e7d32" style={{ marginTop: 30 }} />
      ) : (
        <FlatList
          data={inventory}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 20,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    marginBottom: 12,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    elevation: 3,
    padding: 14,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  itemQuantity: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
});
