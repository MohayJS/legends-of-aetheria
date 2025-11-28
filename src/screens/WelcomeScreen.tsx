import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Alert } from 'react-native';
import api from '../services/api';

const WelcomeScreen = ({ navigation }: any) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const getErrorMessage = (error: any) => {
    if (error.response?.data?.error) {
      return error.response.data.error;
    }
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    return error.message || 'An unknown error occurred';
  };

  const handleLogin = async () => {
    try {
      // Send email instead of username for login
      const response = await api.post('/auth/login', { email, password });
      if (response.data.user) {
        navigation.replace('MainMenu', { user: response.data.user });
      }
    } catch (error: any) {
      console.error('Login Error:', error);
      Alert.alert('Login Failed', getErrorMessage(error));
    }
  };

  const handleRegister = async () => {
    try {
      await api.post('/auth/register', { username, password, email, name });
      Alert.alert('Success', 'Registration successful! Please login.');
      setIsRegistering(false);
    } catch (error: any) {
      console.error('Registration Error:', error);
      Alert.alert('Registration Failed', getErrorMessage(error));
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground 
        source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6yjgH45QXimuclDoHZJ4nErfeeT8o2QPErhshzH7JBzv3LvFxqfbDBDBoZxdtI_TIwyTixVTYOHIVHK-e3AJ3wNFxxXbZGgbzVXER6S8u7MMO_lJx2krXlJbyuij6lhzo4bTgvThKZrGtdK5KlmJMnnlRj5QuhwuoTA9clmoqZgMnCv-kmrVITT-ZXgscW2ruQ9pN15Oa9eSfwTjYV3pSTLn30tvaYAbxmkVQYsnBS0UV3tqudvHnqbpVelLxiA9MeuqAu6HgdUe6' }} 
        style={styles.background}
        imageStyle={{ opacity: 0.5 }}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Legends of Aetheria</Text>
          
          <View style={styles.form}>
            {/* Show Username only for Register */}
            {isRegistering && (
              <>
                <Text style={styles.label}>Name</Text>
                <TextInput 
                  style={styles.input} 
                  value={name} 
                  onChangeText={setName}
                  placeholder="Enter your name"
                  placeholderTextColor="#888"
                />

                <Text style={styles.label}>Username</Text>
                <TextInput 
                  style={styles.input} 
                  value={username} 
                  onChangeText={setUsername}
                  placeholder="Enter username"
                  placeholderTextColor="#888"
                />
              </>
            )}

            {/* Always show Email/Username (Login needs it now) */}
            <Text style={styles.label}>Username or Email</Text>
            <TextInput 
              style={styles.input} 
              value={email} 
              onChangeText={setEmail}
              placeholder="Enter username or email"
              placeholderTextColor="#888"
            />

            <Text style={styles.label}>Password</Text>
            <TextInput 
              style={styles.input} 
              value={password} 
              onChangeText={setPassword}
              placeholder="Enter password"
              placeholderTextColor="#888"
              secureTextEntry
            />

            <TouchableOpacity 
              style={[styles.button, styles.primaryButton]} 
              onPress={isRegistering ? handleRegister : handleLogin}
            >
              <Text style={styles.buttonText}>{isRegistering ? 'Register' : 'Login'}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.button, styles.secondaryButton]} 
              onPress={() => setIsRegistering(!isRegistering)}
            >
              <Text style={styles.buttonText}>{isRegistering ? 'Back to Login' : 'Create Account'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101622',
  },
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 40,
    color: '#fde047',
    fontWeight: 'bold',
    marginBottom: 40,
    textShadowColor: '#4338ca',
    textShadowOffset: { width: 4, height: 4 },
    textShadowRadius: 0,
    textAlign: 'center',
  },
  form: {
    width: '100%',
    maxWidth: 400,
  },
  label: {
    color: '#e5e7eb',
    fontSize: 18,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#192233',
    borderWidth: 4,
    borderColor: '#92a4c9',
    color: 'white',
    padding: 15,
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 4,
    borderColor: 'white',
  },
  primaryButton: {
    backgroundColor: '#fde047',
    borderColor: '#4338ca',
  },
  secondaryButton: {
    backgroundColor: '#15803d',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e1b4b',
  },
});

export default WelcomeScreen;
