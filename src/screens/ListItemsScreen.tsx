import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Image } from 'react-native';
import api, { BASE_URL } from '../services/api';

interface Item {
  item_id: number;
  name: string;
  rarity: string;
  type: string;
  description: string;
  image_path: string;
}

const ListItemsScreen = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    try {
      const response = await api.get('/admin/items');
      setItems(response.data);
    } catch (error: any) {
      Alert.alert('Error', 'Failed to fetch items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = (id: number) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this item? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/admin/items/${id}`);
              Alert.alert('Success', 'Item deleted successfully');
              fetchItems(); // Refresh list
            } catch (error: any) {
              Alert.alert('Error', error.response?.data?.error || 'Failed to delete item');
            }
          },
        },
      ]
    );
  };

  const getImageUrl = (path: string) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    // Replace backslashes with forward slashes
    const normalizedPath = path.replace(/\\/g, '/');
    return `${BASE_URL}/assets/${normalizedPath}`;
  };

  const renderItem = ({ item }: { item: Item }) => (
    <View style={styles.itemContainer}>
      {item.image_path ? (
        <Image 
          source={{ uri: getImageUrl(item.image_path) || undefined }} 
          style={styles.itemImage}
          onError={(e) => console.log('Image load error:', e.nativeEvent.error, getImageUrl(item.image_path))}
        />
      ) : (
        <View style={[styles.itemImage, styles.placeholderImage]} />
      )}
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDetails}>{item.rarity} - {item.type}</Text>
      </View>
      <TouchableOpacity 
        style={styles.deleteButton} 
        onPress={() => handleDelete(item.item_id)}
      >
        <Text style={styles.deleteButtonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#fde047" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Item List</Text>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.item_id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.emptyText}>No items found.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101622',
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#101622',
  },
  title: {
    fontSize: 24,
    color: '#fde047',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 20,
  },
  itemContainer: {
    backgroundColor: '#1e293b',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#475569',
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 4,
    marginRight: 15,
    backgroundColor: '#334155',
  },
  placeholderImage: {
    backgroundColor: '#334155',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemDetails: {
    color: '#94a3b8',
    fontSize: 14,
    marginTop: 4,
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginLeft: 10,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  emptyText: {
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});

export default ListItemsScreen;
