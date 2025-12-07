import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';

const AdminScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <ImageBackground 
        source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6yjgH45QXimuclDoHZJ4nErfeeT8o2QPErhshzH7JBzv3LvFxqfbDBDBoZxdtI_TIwyTixVTYOHIVHK-e3AJ3wNFxxXbZGgbzVXER6S8u7MMO_lJx2krXlJbyuij6lhzo4bTgvThKZrGtdK5KlmJMnnlRj5QuhwuoTA9clmoqZgMnCv-kmrVITT-ZXgscW2ruQ9pN15Oa9eSfwTjYV3pSTLn30tvaYAbxmkVQYsnBS0UV3tqudvHnqbpVelLxiA9MeuqAu6HgdUe6' }} 
        style={styles.background}
        imageStyle={{ opacity: 0.3 }}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Admin Dashboard</Text>
          
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => navigation.navigate('ManageItems')}
          >
            <Text style={styles.buttonText}>Add Items</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.button} 
            onPress={() => navigation.navigate('ListItems')}
          >
            <Text style={styles.buttonText}>List Items</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.button} 
            onPress={() => navigation.navigate('ManageBanners')}
          >
            <Text style={styles.buttonText}>Manage Banners</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.button} 
            onPress={() => navigation.navigate('ManageBannerItems')}
          >
            <Text style={styles.buttonText}>Manage Banner Items</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.logoutButton]} 
            onPress={() => navigation.replace('Welcome')}
          >
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
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
    fontSize: 32,
    color: '#fde047',
    fontWeight: 'bold',
    marginBottom: 40,
    textShadowColor: '#4338ca',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },
  button: {
    backgroundColor: '#1e293b',
    padding: 20,
    width: '100%',
    maxWidth: 300,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#94a3b8',
    borderRadius: 8,
  },
  logoutButton: {
    backgroundColor: '#991b1b',
    borderColor: '#f87171',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AdminScreen;
