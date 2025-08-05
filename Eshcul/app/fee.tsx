import React from 'react';
import { View, StyleSheet, FlatList, Text, Alert } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

interface FeeRecord {
  id: string;
  label: string;
  amount: number;
  dueDate: string;
  status: 'Paid' | 'Unpaid';
}

const termWiseData: FeeRecord[] = [
  { id: '1', label: 'Term 1', amount: 15000, dueDate: '2025-06-01', status: 'Paid' },
  { id: '2', label: 'Term 2', amount: 15000, dueDate: '2025-09-01', status: 'Unpaid' },
  { id: '3', label: 'Term 3', amount: 15000, dueDate: '2025-12-01', status: 'Unpaid' },
];

const FeeScreen = () => {
  const generateInvoiceHTML = (item: FeeRecord) => `
    <html>
    <head>
      <style>
        body { font-family: Arial; padding: 20px; }
        h1 { color: #444; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { text-align: left; padding: 10px; border: 1px solid #ccc; }
      </style>
    </head>
    <body>
      <h1>Invoice - ${item.label}</h1>
      <table>
        <tr><th>Term</th><td>${item.label}</td></tr>
        <tr><th>Amount</th><td>₹${item.amount}</td></tr>
        <tr><th>Due Date</th><td>${item.dueDate}</td></tr>
        <tr><th>Status</th><td>${item.status}</td></tr>
        <tr><th>Remaining</th><td>₹${item.status === 'Paid' ? 0 : item.amount}</td></tr>
      </table>
    </body>
    </html>
  `;

  const handleDownloadInvoice = async (item: FeeRecord) => {
    try {
      const html = generateInvoiceHTML(item);
      const { uri } = await Print.printToFileAsync({ html });

      const newPath = `${FileSystem.documentDirectory}Invoice_${item.label.replace(' ', '_')}.pdf`;
      await FileSystem.moveAsync({ from: uri, to: newPath });

      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Please allow media access to save the invoice');
        return;
      }

      const asset = await MediaLibrary.createAssetAsync(newPath);
      await MediaLibrary.createAlbumAsync('Download', asset, false);

      Alert.alert('Success', `Invoice saved to Downloads folder`);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to generate or save invoice');
    }
  };

  const renderCard = ({ item }: { item: FeeRecord }) => {
    const remainingAmount = item.status === 'Paid' ? 0 : item.amount;

    return (
      <Card style={[styles.card, item.status === 'Paid' ? styles.paid : styles.unpaid]}>
        <Card.Content>
          <View style={styles.headerRow}>
            <Title style={styles.title}>{item.label}</Title>
            <Text style={item.status === 'Paid' ? styles.badgePaid : styles.badgeUnpaid}>
              {item.status}
            </Text>
          </View>
          <Paragraph style={styles.paragraph}>💰 Amount: ₹{item.amount}</Paragraph>
          <Paragraph style={styles.paragraph}>📅 Due Date: {item.dueDate}</Paragraph>
          <Paragraph style={styles.remaining}>
            Remaining Amount: ₹{remainingAmount}
          </Paragraph>
        </Card.Content>

        <Card.Actions style={styles.actions}>
          <Button onPress={() => handleDownloadInvoice(item)}>Download Invoice</Button>
          {item.status === 'Unpaid' && (
            <Button
              mode="contained"
              buttonColor="#2575fc"
              textColor="#fff"
              onPress={() => Alert.alert('Redirect', 'Proceed to payment')}>
              Pay Now
            </Button>
          )}
        </Card.Actions>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>📘 Fee Details</Text>
      <FlatList
        data={termWiseData}
        keyExtractor={(item) => item.id}
        renderItem={renderCard}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default FeeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f7fa',
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2575fc',
    textAlign: 'center',
    marginBottom: 12,
  },
  listContainer: {
    paddingBottom: 16,
  },
  card: {
    marginVertical: 8,
    borderRadius: 16,
    elevation: 3,
  },
  paid: {
    backgroundColor: '#e0ffe6',
  },
  unpaid: {
    backgroundColor: '#ffe0e0',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badgePaid: {
    backgroundColor: 'green',
    color: 'white',
    fontWeight: 'bold',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
  },
  badgeUnpaid: {
    backgroundColor: 'red',
    color: 'white',
    fontWeight: 'bold',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  paragraph: {
    fontSize: 15,
    marginTop: 4,
    color: '#333',
  },
  remaining: {
    fontSize: 16,
    marginTop: 6,
    fontWeight: '600',
    color: '#444',
  },
  actions: {
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingBottom: 12,
  },
});
