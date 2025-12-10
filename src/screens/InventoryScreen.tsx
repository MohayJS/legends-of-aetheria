import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import api, { BASE_URL } from '../services/api';

const InventoryScreen = () => {
  const [inventory, setInventory] = useState<any[]>([]);
  const [selectedTab, setSelectedTab] = useState('Heroes'); // Heroes, Weapons, Items
  const [selectedItem, setSelectedItem] = useState<any>(null);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const playerId = 5; // Hardcoded for MVP
      const response = await api.get(`/inventory/${playerId}`);
      setInventory(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpgrade = async () => {
    if (!selectedItem) return;
    if (selectedItem.quantity <= 1) {
        Alert.alert('Cannot Upgrade', 'You need duplicates to upgrade this item.');
        return;
    }

    try {
        const amountToConsume = 1;
        await api.post('/inventory/upgrade', {
            inventoryId: selectedItem.inventory_id,
            amount: amountToConsume
        });
        fetchInventory(); // Refresh
    } catch (error: any) {
        Alert.alert('Error', error.response?.data?.message || 'Upgrade failed');
    }
  };

  const filteredInventory = useMemo(() => {
      return inventory.filter(item => {
          // Tab Filter
          if (selectedTab === 'Heroes' && item.type !== 'Character') return false;
          if (selectedTab === 'Weapons' && item.type !== 'Weapon') return false;
          if (selectedTab === 'Items' && item.type !== 'Equipment' && item.type !== 'Material') return false; // Assuming 'Material' or others

          return true;
      });
  }, [inventory, selectedTab]);

  const getStats = (item: any) => {
      if (!item?.base_stats) return {};
      if (typeof item.base_stats === 'string') {
          try {
              return JSON.parse(item.base_stats);
          } catch {
              return {};
          }
      }
      return item.base_stats;
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity 
        style={[styles.card, { borderColor: getRarityColor(item.rarity) }]}
        onPress={() => setSelectedItem(item)}
    >
      <View style={styles.cardImageContainer}>
        <Image source={{ uri: `${BASE_URL}/assets/${item.image_path}` }} style={styles.cardImage} resizeMode="contain" />
      </View>
      {item.quantity > 1 && (
          <View style={styles.quantityBadge}>
              <Text style={styles.quantityText}>{item.quantity}</Text>
          </View>
      )}
      <View style={styles.levelBadge}>
          <Text style={styles.levelText}>Lv.{item.level}</Text>
      </View>
    </TouchableOpacity>
  );

  const selectedStats = useMemo(() => getStats(selectedItem), [selectedItem]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
          <Text style={styles.headerTitle}>INVENTORY</Text>
          <View style={{ width: 24 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
          {['Heroes', 'Weapons', 'Items'].map(tab => (
              <TouchableOpacity 
                key={tab} 
                style={[styles.tab, selectedTab === tab && styles.activeTab]}
                onPress={() => setSelectedTab(tab)}
              >
                  <Text style={[styles.tabText, selectedTab === tab && styles.activeTabText]}>{tab.toUpperCase()}</Text>
              </TouchableOpacity>
          ))}
      </View>

      {/* Grid */}
      <FlatList
        data={filteredInventory}
        renderItem={renderItem}
        keyExtractor={(item) => item.inventory_id.toString()}
        numColumns={4}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.columnWrapper}
      />

      {/* Details Panel (Bottom Sheet style) */}
      {selectedItem && (
          <View style={styles.detailsPanel}>
              <View style={styles.detailsHeader}>
                  <View style={[styles.detailsImageContainer, { borderColor: getRarityColor(selectedItem.rarity) }]}>
                    <Image source={{ uri: `${BASE_URL}/assets/${selectedItem.image_path}` }} style={styles.detailsImage} />
                  </View>
                  <View style={styles.detailsInfo}>
                      <Text style={styles.detailsName}>{selectedItem.name}</Text>
                      <Text style={[styles.detailsRarity, { color: getRarityColor(selectedItem.rarity) }]}>
                          [{selectedItem.rarity.toUpperCase()}]
                      </Text>
                      
                      <View style={styles.statsGrid}>
                          <View style={styles.statRow}>
                              <Text style={styles.statLabel}>HP:</Text>
                              <Text style={styles.statValue}>{selectedStats.hp || 0}</Text>
                          </View>
                          <View style={styles.statRow}>
                              <Text style={styles.statLabel}>ATK:</Text>
                              <Text style={styles.statValue}>{selectedStats.atk || 0}</Text>
                          </View>
                          <View style={styles.statRow}>
                              <Text style={styles.statLabel}>DEF:</Text>
                              <Text style={styles.statValue}>{selectedStats.def || 0}</Text>
                          </View>
                          <View style={styles.statRow}>
                              <Text style={styles.statLabel}>SPD:</Text>
                              <Text style={styles.statValue}>{selectedStats.spd || 0}</Text>
                          </View>
                      </View>
                  </View>
              </View>

              <View style={styles.actionButtons}>
                  <TouchableOpacity style={styles.upgradeBtn} onPress={handleUpgrade}>
                      <Text style={styles.upgradeBtnText}>UPGRADE</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.detailsBtn} onPress={() => setSelectedItem(null)}>
                      <Text style={styles.detailsBtnText}>CLOSE</Text>
                  </TouchableOpacity>
              </View>
          </View>
      )}
    </View>
  );
};

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case 'Legendary': return '#fbbf24'; // Gold
    case 'Epic': return '#a855f7'; // Purple
    case 'Rare': return '#3b82f6'; // Blue
    case 'Common': return '#10b981'; // Green
    default: return '#9ca3af'; // Grey
  }
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#2d3748' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, backgroundColor: '#1a202c', borderBottomWidth: 2, borderBottomColor: '#4a5568' },
  menuIcon: { color: '#fbbf24', fontSize: 24 },
  headerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold', fontFamily: 'monospace' },
  settingsIcon: { color: '#fbbf24', fontSize: 24 },

  tabs: { flexDirection: 'row', backgroundColor: '#1a202c' },
  tab: { flex: 1, paddingVertical: 15, alignItems: 'center', borderBottomWidth: 3, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: '#fbbf24' },
  tabText: { color: '#a0aec0', fontWeight: 'bold' },
  activeTabText: { color: 'white' },

  filters: { flexDirection: 'row', padding: 10, backgroundColor: '#2d3748', gap: 10 },
  filterBtn: { backgroundColor: '#1a202c', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5, borderWidth: 1, borderColor: '#4a5568' },
  filterText: { color: '#cbd5e0', fontSize: 12, fontWeight: 'bold' },

  list: { padding: 10 },
  columnWrapper: { justifyContent: 'flex-start', gap: 10 },
  card: { width: '22%', aspectRatio: 1, backgroundColor: '#1a202c', borderWidth: 2, borderRadius: 5, padding: 2, marginBottom: 10 },
  cardImageContainer: { flex: 1, backgroundColor: '#2d3748' },
  cardImage: { width: '100%', height: '100%' },
  quantityBadge: { position: 'absolute', top: 0, right: 0, backgroundColor: 'red', borderRadius: 10, width: 20, height: 20, justifyContent: 'center', alignItems: 'center' },
  quantityText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  levelBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: 4, borderTopLeftRadius: 5 },
  levelText: { color: 'white', fontSize: 10, fontWeight: 'bold' },

  detailsPanel: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#1a202c', padding: 20, borderTopWidth: 4, borderTopColor: '#4a5568' },
  detailsHeader: { flexDirection: 'row', marginBottom: 20 },
  detailsImageContainer: { width: 100, height: 100, borderWidth: 3, marginRight: 20, backgroundColor: '#2d3748' },
  detailsImage: { width: '100%', height: '100%' },
  detailsInfo: { flex: 1, justifyContent: 'center' },
  detailsName: { color: 'white', fontSize: 20, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 5 },
  detailsRarity: { fontSize: 14, fontWeight: 'bold', marginBottom: 10 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 15 },
  statRow: { flexDirection: 'row', alignItems: 'center', width: '45%' },
  statLabel: { color: '#a0aec0', fontWeight: 'bold', marginRight: 5, fontSize: 12 },
  statValue: { color: '#fbbf24', fontWeight: 'bold', fontSize: 14 },

  actionButtons: { flexDirection: 'row', gap: 10 },
  upgradeBtn: { flex: 1, backgroundColor: '#fbbf24', padding: 15, alignItems: 'center', borderRadius: 2 },
  upgradeBtnText: { color: '#1a202c', fontWeight: 'bold', fontSize: 16 },
  detailsBtn: { flex: 1, backgroundColor: '#a0aec0', padding: 15, alignItems: 'center', borderRadius: 2 },
  detailsBtnText: { color: '#1a202c', fontWeight: 'bold', fontSize: 16 },
});

export default InventoryScreen;
