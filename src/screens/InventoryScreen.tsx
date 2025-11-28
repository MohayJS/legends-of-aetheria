import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import api from '../services/api';

const InventoryScreen = () => {
  const [inventory, setInventory] = useState<any[]>([]);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const playerId = 1; // Hardcoded for MVP
      const response = await api.get(`/inventory/${playerId}`);
      setInventory(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const renderItem = ({ item }: any) => (
    <View style={[styles.card, { borderColor: getRarityColor(item.rarity) }]}>
      <Text style={[styles.rarity, { color: getRarityColor(item.rarity) }]}>{item.rarity}</Text>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.type}>{item.type}</Text>
      <Text style={styles.level}>Lvl {item.level}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inventory</Text>
      <FlatList
        data={inventory}
        renderItem={renderItem}
        keyExtractor={(item) => item.inventory_id.toString()}
        numColumns={2}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case 'Legendary': return '#fbbf24';
    case 'Epic': return '#a855f7';
    case 'Rare': return '#3b82f6';
    default: return '#9ca3af';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101622',
    padding: 10,
  },
  title: {
    fontSize: 30,
    color: '#fde047',
    textAlign: 'center',
    marginBottom: 20,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    flex: 1,
    margin: 5,
    backgroundColor: '#1f2937',
    borderWidth: 2,
    padding: 10,
    alignItems: 'center',
    minHeight: 150,
    justifyContent: 'space-between',
  },
  rarity: {
    fontSize: 12,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
  },
  name: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 5,
  },
  type: {
    color: '#9ca3af',
    fontSize: 12,
  },
  level: {
    color: '#10b981',
    fontWeight: 'bold',
  },
});

export default InventoryScreen;
