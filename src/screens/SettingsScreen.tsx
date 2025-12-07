import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ImageBackground, SafeAreaView } from 'react-native';
import api from '../services/api';

const SettingsScreen = ({ navigation, route }: any) => {
  const { user } = route.params;
  const [name, setName] = useState(user.name || '');
  const [loading, setLoading] = useState(false);

  const handleUpdateName = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }

    if (name === user.name) {
        Alert.alert('Info', 'Name is the same');
        return;
    }

    setLoading(true);
    try {
      const response = await api.post('/player/update-name', {
        userId: user.id || user.player_id, // Handle both cases if inconsistent
        newName: name,
      });

      Alert.alert('Success', 'Name updated successfully');
      // Update local user object and navigate back or stay
      // Ideally we should update the global state or pass it back
      const updatedUser = { ...user, name: name };
      navigation.setParams({ user: updatedUser });
      // Also update the previous screen params if possible, or just rely on re-fetching
      // For now, let's just update the local state and maybe navigate back with new params
      navigation.navigate('MainMenu', { user: updatedUser });
    } catch (error: any) {
      console.error(error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to update name');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // Clear any stored tokens if applicable
    navigation.reset({
      index: 0,
      routes: [{ name: 'Welcome' }],
    });
  };

  return (
    <ImageBackground 
      source={require('../../srcassets/main_menu_background.png')} 
      style={styles.container}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.overlay}>
          <Text style={styles.title}>Settings</Text>

          <View style={styles.formContainer}>
            <Text style={styles.label}>Change Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter new name"
              placeholderTextColor="#9ca3af"
            />
            <TouchableOpacity 
              style={[styles.button, styles.updateButton]} 
              onPress={handleUpdateName}
              disabled={loading}
            >
              <Text style={styles.buttonText}>{loading ? 'Updating...' : 'Update Name'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
              <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.button, styles.backButton]} onPress={() => navigation.goBack()}>
              <Text style={styles.buttonText}>Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1122',
  },
  safeArea: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(28, 17, 34, 0.8)',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    color: '#fff',
    fontFamily: 'monospace',
    textAlign: 'center',
    marginBottom: 40,
    fontWeight: 'bold',
  },
  formContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#553267',
    marginBottom: 20,
  },
  label: {
    color: '#b792c9',
    fontSize: 14,
    fontFamily: 'monospace',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderWidth: 1,
    borderColor: '#553267',
    borderRadius: 5,
    padding: 10,
    color: '#fff',
    fontFamily: 'monospace',
    marginBottom: 15,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 2,
    borderBottomWidth: 4,
  },
  updateButton: {
    backgroundColor: '#ca8a04',
    borderColor: '#facc15',
  },
  logoutButton: {
    backgroundColor: '#dc2626',
    borderColor: '#ef4444',
    marginTop: 20,
  },
  backButton: {
    backgroundColor: '#4b5563',
    borderColor: '#6b7280',
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 20,
  },
});

export default SettingsScreen;
