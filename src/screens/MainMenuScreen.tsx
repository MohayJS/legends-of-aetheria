import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const MainMenuScreen = ({ navigation, route }: any) => {
  const { user } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {user.username}!</Text>
      
      <View style={styles.menu}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Gacha')}>
          <Text style={styles.buttonText}>Summon (Gacha)</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Inventory')}>
          <Text style={styles.buttonText}>Inventory</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Team')}>
          <Text style={styles.buttonText}>Battle / Team</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101622',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    color: '#fde047',
    marginBottom: 40,
  },
  menu: {
    width: '80%',
  },
  button: {
    backgroundColor: '#4f46e5',
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'white',
  },
  buttonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default MainMenuScreen;
