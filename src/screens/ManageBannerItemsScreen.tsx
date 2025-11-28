import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import api from '../services/api';

const ManageBannerItemsScreen = () => {
  const [bannerId, setBannerId] = useState('');
  const [itemId, setItemId] = useState('');
  const [dropRate, setDropRate] = useState('0.01');
  const [isFeatured, setIsFeatured] = useState('0');

  const handleAddBannerItem = async () => {
    try {
      await api.post('/admin/banner-items', {
        banner_id: parseInt(bannerId),
        item_id: parseInt(itemId),
        drop_rate: parseFloat(dropRate),
        is_featured: parseInt(isFeatured)
      });
      Alert.alert('Success', 'Item added to banner successfully');
      setItemId('');
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to add item to banner');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add Item to Banner</Text>

      <Text style={styles.label}>Banner ID</Text>
      <TextInput style={styles.input} value={bannerId} onChangeText={setBannerId} keyboardType="numeric" />

      <Text style={styles.label}>Item ID</Text>
      <TextInput style={styles.input} value={itemId} onChangeText={setItemId} keyboardType="numeric" />

      <Text style={styles.label}>Drop Rate (0.0 - 1.0)</Text>
      <TextInput style={styles.input} value={dropRate} onChangeText={setDropRate} keyboardType="numeric" />

      <Text style={styles.label}>Is Featured (0 or 1)</Text>
      <TextInput style={styles.input} value={isFeatured} onChangeText={setIsFeatured} keyboardType="numeric" />

      <TouchableOpacity style={styles.button} onPress={handleAddBannerItem}>
        <Text style={styles.buttonText}>Link Item to Banner</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101622',
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: '#fde047',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    color: '#e5e7eb',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#1e293b',
    color: 'white',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#475569',
  },
  button: {
    backgroundColor: '#fde047',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#1e1b4b',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ManageBannerItemsScreen;
