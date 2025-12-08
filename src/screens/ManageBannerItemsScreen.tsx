import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Alert, 
  FlatList, 
  Image,
  ActivityIndicator 
} from 'react-native';
import api, { BASE_URL } from '../services/api';

interface Banner {
  banner_id: number;
  name: string;
  type: string;
  image_path: string;
}

interface Item {
  item_id: number;
  name: string;
  rarity: string;
  type: string;
  image_path: string;
}

interface ItemConfig {
  drop_rate: string;
  is_featured: string;
}

const ManageBannerItemsScreen = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Data
  const [banners, setBanners] = useState<Banner[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  
  // Selections
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [selectedItemIds, setSelectedItemIds] = useState<number[]>([]);
  const [itemConfigs, setItemConfigs] = useState<Record<number, ItemConfig>>({});
  
  // Filter
  const [filterType, setFilterType] = useState<string>('All');

  useEffect(() => {
    fetchBanners();
    fetchItems();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await api.get('/admin/banners');
      setBanners(response.data);
    } catch (error) {
      console.error('Failed to fetch banners', error);
    }
  };

  const fetchItems = async () => {
    try {
      const response = await api.get('/admin/items');
      setItems(response.data);
    } catch (error) {
      console.error('Failed to fetch items', error);
    }
  };

  const getImageUrl = (path: string) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const normalizedPath = path.replace(/\\/g, '/');
    return `${BASE_URL}/assets/${normalizedPath}`;
  };

  const getDefaultConfig = (rarity: string): ItemConfig => {
    let drop_rate = '0.00';
    let is_featured = '0';

    switch (rarity) {
      case 'Legendary':
        drop_rate = '0.10';
        is_featured = '1';
        break;
      case 'Epic':
        drop_rate = '0.20';
        break;
      case 'Rare':
        drop_rate = '0.40';
        break;
      case 'Common':
        drop_rate = '0.60';
        break;
    }

    return { drop_rate, is_featured };
  };

  const handleSelectBanner = (banner: Banner) => {
    setSelectedBanner(banner);
    setStep(2);
  };

  const handleToggleItem = (item: Item) => {
    const isSelected = selectedItemIds.includes(item.item_id);
    if (isSelected) {
      setSelectedItemIds(prev => prev.filter(id => id !== item.item_id));
      const newConfigs = { ...itemConfigs };
      delete newConfigs[item.item_id];
      setItemConfigs(newConfigs);
    } else {
      setSelectedItemIds(prev => [...prev, item.item_id]);
      setItemConfigs(prev => ({
        ...prev,
        [item.item_id]: getDefaultConfig(item.rarity)
      }));
    }
  };

  const handleConfigChange = (itemId: number, field: keyof ItemConfig, value: string) => {
    setItemConfigs(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [field]: value
      }
    }));
  };

  const handleSubmit = async () => {
    if (!selectedBanner) return;
    
    setLoading(true);
    let successCount = 0;
    let failCount = 0;

    for (const itemId of selectedItemIds) {
      const config = itemConfigs[itemId];
      try {
        await api.post('/admin/banner-items', {
          banner_id: selectedBanner.banner_id,
          item_id: itemId,
          drop_rate: parseFloat(config.drop_rate),
          is_featured: parseInt(config.is_featured, 10)
        });
        successCount++;
      } catch (error) {
        console.error(`Failed to add item ${itemId}`, error);
        failCount++;
      }
    }

    setLoading(false);
    Alert.alert(
      'Completed',
      `Successfully added ${successCount} items. Failed: ${failCount}`,
      [
        { 
          text: 'OK', 
          onPress: () => {
            setStep(1);
            setSelectedBanner(null);
            setSelectedItemIds([]);
            setItemConfigs({});
          } 
        }
      ]
    );
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Step 1: Select a Banner</Text>
      <FlatList
        data={banners}
        keyExtractor={(item) => item.banner_id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.bannerItem} 
            onPress={() => handleSelectBanner(item)}
          >
            <Text style={styles.bannerName}>{item.name}</Text>
            <Text style={styles.bannerType}>{item.type}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );

  const renderStep2 = () => {
    const filteredItems = items.filter(item => 
      filterType === 'All' || item.type === filterType
    );

    return (
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>Step 2: Select Items</Text>
        
        <View style={styles.filterContainer}>
          {['All', 'Weapon', 'Character', 'Equipment'].map(type => (
            <TouchableOpacity 
              key={type} 
              style={[styles.filterButton, filterType === type && styles.filterButtonActive]}
              onPress={() => setFilterType(type)}
            >
              <Text style={[styles.filterText, filterType === type && styles.filterTextActive]}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.item_id.toString()}
          numColumns={3}
          renderItem={({ item }) => {
            const isSelected = selectedItemIds.includes(item.item_id);
            return (
              <TouchableOpacity 
                style={[styles.gridItem, isSelected && styles.gridItemSelected]} 
                onPress={() => handleToggleItem(item)}
              >
                <Image 
                  source={{ uri: getImageUrl(item.image_path) || undefined }} 
                  style={styles.itemImage} 
                />
                <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                <Text style={[styles.itemRarity, { color: getRarityColor(item.rarity) }]}>
                  {item.rarity}
                </Text>
                {isSelected && (
                  <View style={styles.checkMark}>
                    <Text style={styles.checkMarkText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          }}
        />
        
        <TouchableOpacity 
          style={[styles.button, selectedItemIds.length === 0 && styles.buttonDisabled]} 
          onPress={() => selectedItemIds.length > 0 && setStep(3)}
          disabled={selectedItemIds.length === 0}
        >
          <Text style={styles.buttonText}>Next ({selectedItemIds.length} selected)</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderStep3 = () => {
    const selectedItemsList = items.filter(item => selectedItemIds.includes(item.item_id));

    return (
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>Step 3: Configure Items</Text>
        <Text style={styles.subTitle}>Banner: {selectedBanner?.name}</Text>
        
        <ScrollView style={styles.configList}>
          {selectedItemsList.map(item => (
            <View key={item.item_id} style={styles.configItem}>
              <View style={styles.configHeader}>
                <Image 
                  source={{ uri: getImageUrl(item.image_path) || undefined }} 
                  style={styles.smallImage} 
                />
                <View>
                  <Text style={styles.configName}>{item.name}</Text>
                  <Text style={[styles.configRarity, { color: getRarityColor(item.rarity) }]}>
                    {item.rarity}
                  </Text>
                </View>
              </View>
              
              <View style={styles.inputRow}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Drop Rate</Text>
                  <TextInput
                    style={styles.input}
                    value={itemConfigs[item.item_id]?.drop_rate}
                    onChangeText={(text) => handleConfigChange(item.item_id, 'drop_rate', text)}
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Featured (0/1)</Text>
                  <TextInput
                    style={styles.input}
                    value={itemConfigs[item.item_id]?.is_featured}
                    onChangeText={(text) => handleConfigChange(item.item_id, 'is_featured', text)}
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => setStep(2)}>
            <Text style={styles.secondaryButtonText}>Back</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            {loading ? (
              <ActivityIndicator color="#1e1b4b" />
            ) : (
              <Text style={styles.buttonText}>Add to Banner</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Legendary': return '#fbbf24'; // amber-400
      case 'Epic': return '#a78bfa'; // violet-400
      case 'Rare': return '#60a5fa'; // blue-400
      default: return '#9ca3af'; // gray-400
    }
  };

  return (
    <View style={styles.container}>
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101622',
    padding: 10,
  },
  stepContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 24,
    color: '#fde047',
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 18,
    color: '#e5e7eb',
    marginBottom: 15,
    textAlign: 'center',
  },
  // Step 1 Styles
  bannerItem: {
    backgroundColor: '#1e293b',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  bannerName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bannerType: {
    color: '#94a3b8',
    fontSize: 14,
  },
  // Step 2 Styles
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 15,
    backgroundColor: '#1e293b',
  },
  filterButtonActive: {
    backgroundColor: '#fde047',
  },
  filterText: {
    color: '#94a3b8',
    fontSize: 12,
  },
  filterTextActive: {
    color: '#1e1b4b',
    fontWeight: 'bold',
  },
  gridItem: {
    flex: 1,
    margin: 4,
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    maxWidth: '31%',
  },
  gridItemSelected: {
    borderColor: '#fde047',
    backgroundColor: '#334155',
  },
  itemImage: {
    width: 60,
    height: 60,
    marginBottom: 5,
    borderRadius: 4,
    backgroundColor: '#0f172a',
  },
  itemName: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 2,
  },
  itemRarity: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  checkMark: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#fde047',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMarkText: {
    color: '#1e1b4b',
    fontSize: 12,
    fontWeight: 'bold',
  },
  // Step 3 Styles
  configList: {
    flex: 1,
  },
  configItem: {
    backgroundColor: '#1e293b',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  configHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  smallImage: {
    width: 40,
    height: 40,
    marginRight: 10,
    borderRadius: 4,
    backgroundColor: '#0f172a',
  },
  configName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  configRarity: {
    fontSize: 12,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputGroup: {
    flex: 1,
    marginHorizontal: 5,
  },
  inputLabel: {
    color: '#94a3b8',
    fontSize: 12,
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#0f172a',
    color: 'white',
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#334155',
  },
  // Buttons
  button: {
    backgroundColor: '#fde047',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    flex: 1,
    marginLeft: 5,
  },
  buttonDisabled: {
    backgroundColor: '#94a3b8',
    opacity: 0.5,
  },
  buttonText: {
    color: '#1e1b4b',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  secondaryButton: {
    backgroundColor: '#334155',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    flex: 1,
    marginRight: 5,
  },
  secondaryButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ManageBannerItemsScreen;
