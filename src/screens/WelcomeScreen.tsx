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
        if (response.data.user.username === 'admin') {
          navigation.replace('Admin');
        } else {
          navigation.replace('MainMenu', { user: response.data.user });
        }
      }
    } catch (error: any) {
      console.error('Login Error:', error);
      Alert.alert('Login Failed', getErrorMessage(error));
    }
  };

  const handleRegister = async () => {
    try {
      await api.post('/auth/register', { username, password, email, name });
      await handleLogin();
    } catch (error: any) {
      console.error('Registration Error:', error);
      Alert.alert('Registration Failed', getErrorMessage(error));
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground 
        source={require('../../srcassets/login_screen.png')} 
        style={styles.background}
      >
        <View style={styles.content}>
          <View style={styles.form}>
            {isRegistering ? (
              <>
                <TextInput 
                  style={styles.input} 
                  value={name} 
                  onChangeText={setName}
                  placeholder="NAME"
                  placeholderTextColor="#666"
                />
                <TextInput 
                  style={styles.input} 
                  value={username} 
                  onChangeText={setUsername}
                  placeholder="USERNAME"
                  placeholderTextColor="#666"
                />
                <TextInput 
                  style={styles.input} 
                  value={email} 
                  onChangeText={setEmail}
                  placeholder="EMAIL"
                  placeholderTextColor="#666"
                />
                <TextInput 
                  style={styles.input} 
                  value={password} 
                  onChangeText={setPassword}
                  placeholder="PASSWORD"
                  placeholderTextColor="#666"
                  secureTextEntry
                />
                <TouchableOpacity 
                  style={[styles.loginButton, { width: '100%', marginTop: 10 }]} 
                  onPress={handleRegister}
                >
                  <Text style={styles.loginButtonText}>REGISTER</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.sideButton, { width: '100%', marginTop: 10 }]} 
                  onPress={() => setIsRegistering(false)}
                >
                  <Text style={styles.sideButtonText}>BACK TO LOGIN</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TextInput 
                  style={styles.input} 
                  value={email} 
                  onChangeText={setEmail}
                  placeholder="USERNAME"
                  placeholderTextColor="#666"
                />

                <TextInput 
                  style={styles.input} 
                  value={password} 
                  onChangeText={setPassword}
                  placeholder="PASSWORD"
                  placeholderTextColor="#666"
                  secureTextEntry
                />

                <TouchableOpacity 
                  style={[styles.loginButton, { width: '100%' }]} 
                  onPress={handleLogin}
                >
                  <Text style={styles.loginButtonText}>LOG IN</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.smallRegisterButton} 
                  onPress={() => setIsRegistering(true)}
                >
                  <Text style={styles.smallRegisterButtonText}>Register</Text>
                </TouchableOpacity>
              </>
            )}
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
    justifyContent: 'center',
    flex: 1,
  },
  title: {
    fontSize: 40,
    color: '#fde047',
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
    display: 'none',
  },
  form: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  input: {
    backgroundColor: '#FFF8DC',
    borderWidth: 4,
    borderColor: '#2d1b4e',
    color: '#000',
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
    width: '100%',
    fontWeight: 'bold',
  },
  smallRegisterButton: {
    marginTop: 15,
    padding: 10,
  },
  smallRegisterButtonText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  loginButton: {
    backgroundColor: '#6A4C93',
    borderWidth: 4,
    borderColor: '#2d1b4e',
    paddingVertical: 15,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '40%',
    borderBottomWidth: 6,
    borderRightWidth: 6,
  },
  sideButton: {
    backgroundColor: '#6A4C93',
    borderWidth: 3,
    borderColor: '#2d1b4e',
    paddingVertical: 10,
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: '28%',
    borderBottomWidth: 5,
    borderRightWidth: 5,
  },
  loginButtonText: {
    color: '#4CAF50',
    fontSize: 22,
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },
  sideButtonText: {
    color: '#FFD700',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
});

export default WelcomeScreen;
