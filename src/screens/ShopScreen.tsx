import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Image, SafeAreaView, FlatList, Modal, Alert } from 'react-native';
import api from '../services/api';

const ShopScreen = ({ navigation, route }: any) => {
  const [user, setUser] = useState(route.params?.user || { username: 'BladeMaster', level: 10, gems: 1500 });
  const [modalVisible, setModalVisible] = useState(false);
  const [purchasedItem, setPurchasedItem] = useState<any>(null);

  const shopItems = [
    {
      id: '1',
      name: 'Handful of Gems',
      amount: 100,
      price: '₱49.00',
      image: require('../../srcassets/gems/single_gem.png'),
    },
    {
      id: '2',
      name: 'Pouch of Gems',
      amount: 500,
      price: '₱199.00',
      image: require('../../srcassets/gems/3_gems.png'),
    },
    {
      id: '3',
      name: 'Chest of Gems',
      amount: 1200,
      price: '₱499.00',
      image: require('../../srcassets/gems/chest_gems.png'),
    },
    {
      id: '4',
      name: 'Mountain of Gems',
      amount: 2500,
      price: '₱999.00',
      image: require('../../srcassets/gems/mountain_gems.png'),
    },
  ];

  const handleBuy = async (item: any) => {
    try {
      // For dev purpose, we just add gems. In production, this would verify payment first.
      const response = await api.post('/player/add-gems', {
        userId: user.id,
        amount: item.amount
      });

      const newGems = response.data.gems;
      const updatedUser = { ...user, gems: newGems };
      setUser(updatedUser);
      setPurchasedItem(item);
      setModalVisible(true);
    } catch (error) {
      console.error('Error buying gems:', error);
      Alert.alert('Error', 'Failed to purchase gems. Please try again.');
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.itemCard}>
      <View style={styles.itemImageContainer}>
        <Image source={item.image} style={styles.itemImage} resizeMode="contain" />
      </View>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemAmount}>{item.amount} Gems</Text>
      </View>
      <TouchableOpacity style={styles.buyButton} onPress={() => handleBuy(item)}>
        <Text style={styles.buyButtonText}>{item.price}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ImageBackground 
      source={require('../../srcassets/main_menu_background.png')} 
      style={styles.container}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.overlay}>
          
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('MainMenu', { user })}>
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Gem Shop</Text>
            <View style={styles.currencyContainer}>
               <Image source={require('../../srcassets/gems/single_gem.png')} style={styles.currencyIconImage} />
               <Text style={styles.currencyText}>{user.gems !== undefined ? user.gems : 1500}</Text>
            </View>
          </View>

          {/* Shop Content */}
          <View style={styles.content}>
            <FlatList
              data={shopItems}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              numColumns={2}
              columnWrapperStyle={styles.row}
              contentContainerStyle={styles.listContent}
            />
          </View>

          {/* Purchase Success Modal */}
          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Thank You!</Text>
                <Text style={styles.modalSubtitle}>Purchase Successful</Text>
                
                {purchasedItem && (
                  <View style={styles.modalItemContainer}>
                    <Image source={purchasedItem.image} style={styles.modalImage} resizeMode="contain" />
                    <Text style={styles.modalAmount}>+{purchasedItem.amount} Gems</Text>
                  </View>
                )}
                
                <TouchableOpacity 
                  style={styles.closeButton} 
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

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
    backgroundColor: 'rgba(28, 17, 34, 0.85)', // Darker overlay for shop
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#fff',
    fontFamily: 'monospace',
    fontSize: 14,
  },
  headerTitle: {
    color: '#fde047',
    fontSize: 20,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  currencyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#fde047',
  },
  currencyIconImage: {
    width: 16,
    height: 16,
    marginRight: 5,
  },
  currencyText: {
    color: '#fff',
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  itemCard: {
    width: '48%',
    backgroundColor: 'rgba(85, 50, 103, 0.6)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#a413ec',
  },
  itemImageContainer: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 40,
  },
  itemImage: {
    width: 60,
    height: 60,
  },
  itemInfo: {
    alignItems: 'center',
    marginBottom: 10,
  },
  itemName: {
    color: '#fff',
    fontFamily: 'monospace',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 4,
  },
  itemAmount: {
    color: '#fde047',
    fontFamily: 'monospace',
    fontSize: 14,
    fontWeight: 'bold',
  },
  buyButton: {
    backgroundColor: '#ca8a04',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#facc15',
    width: '100%',
    alignItems: 'center',
  },
  buyButtonText: {
    color: '#fff',
    fontFamily: 'monospace',
    fontWeight: 'bold',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#2d1b36',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#a413ec',
    shadowColor: '#a413ec',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    color: '#fde047',
    fontSize: 24,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'monospace',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalItemContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  modalImage: {
    width: 100,
    height: 100,
    marginBottom: 12,
  },
  modalAmount: {
    color: '#fde047',
    fontSize: 20,
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#ca8a04',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#facc15',
  },
  closeButtonText: {
    color: '#fff',
    fontFamily: 'monospace',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ShopScreen;
