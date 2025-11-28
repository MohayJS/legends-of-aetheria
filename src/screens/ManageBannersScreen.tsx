import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import api from '../services/api';

import PixelSelect from '../components/PixelSelect';

const ManageBannersScreen = () => {
  const [name, setName] = useState('');
  const [type, setType] = useState('Standard');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0]);
  const [imagePath, setImagePath] = useState('');
  const [description, setDescription] = useState('');

  const handleAddBanner = async () => {
    try {
      await api.post('/admin/banners', {
        name,
        type,
        start_date: startDate,
        end_date: endDate,
        image_path: imagePath,
        description
      });
      Alert.alert('Success', 'Banner added successfully');
      setName('');
      setDescription('');
      setImagePath('');
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to add banner');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add New Banner</Text>

      <Text style={styles.label}>Name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <PixelSelect 
        label="Type" 
        value={type} 
        options={['Character', 'Weapon', 'Standard', 'Event']} 
        onSelect={setType} 
      />

      <Text style={styles.label}>Start Date (YYYY-MM-DD)</Text>
      <TextInput style={styles.input} value={startDate} onChangeText={setStartDate} />

      <Text style={styles.label}>End Date (YYYY-MM-DD)</Text>
      <TextInput style={styles.input} value={endDate} onChangeText={setEndDate} />

      <Text style={styles.label}>Image URL</Text>
      <TextInput style={styles.input} value={imagePath} onChangeText={setImagePath} />

      <Text style={styles.label}>Description</Text>
      <TextInput style={styles.input} value={description} onChangeText={setDescription} multiline />

      <TouchableOpacity style={styles.button} onPress={handleAddBanner}>
        <Text style={styles.buttonText}>Add Banner</Text>
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

export default ManageBannersScreen;
