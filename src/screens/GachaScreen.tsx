import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert, Modal } from 'react-native';
import api from '../services/api';

const GachaScreen = () => {
  const [banners, setBanners] = useState<any[]>([]);
  const [selectedBanner, setSelectedBanner] = useState<any>(null);
  const [summonResult, setSummonResult] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await api.get('/gacha/banners');
      setBanners(response.data);
      if (response.data.length > 0) {
        setSelectedBanner(response.data[0]);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch banners');
    }
  };

  const handleSummon = async (cost: number, currencyType: string) => {
    if (!selectedBanner) return;
    try {
      // Hardcoded playerId for MVP, in real app get from context/auth
      const playerId = 1; 
      const response = await api.post('/gacha/summon', {
        playerId,
        bannerId: selectedBanner.banner_id,
        cost,
        currencyType
      });
      setSummonResult(response.data.item);
      setModalVisible(true);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Summon failed');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Summon</Text>
      
      <ScrollView horizontal style={styles.bannerList}>
        {banners.map((banner) => (
          <TouchableOpacity 
            key={banner.banner_id} 
            onPress={() => setSelectedBanner(banner)}
            style={[styles.bannerItem, selectedBanner?.banner_id === banner.banner_id && styles.selectedBanner]}
          >
            <Text style={styles.bannerName}>{banner.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {selectedBanner && (
        <View style={styles.bannerDetail}>
          <Text style={styles.bannerTitle}>{selectedBanner.name}</Text>
          <Text style={styles.bannerDesc}>{selectedBanner.description}</Text>
          {/* Image would go here */}
          
          <View style={styles.summonButtons}>
            <TouchableOpacity style={styles.summonBtn} onPress={() => handleSummon(100, 'gems')}>
              <Text style={styles.btnText}>Summon x1 (100 Gems)</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.summonBtn} onPress={() => handleSummon(1000, 'gems')}>
              <Text style={styles.btnText}>Summon x10 (1000 Gems)</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Summon Result!</Text>
          {summonResult && (
            <View style={styles.resultCard}>
              <Text style={[styles.rarity, { color: getRarityColor(summonResult.rarity) }]}>
                {summonResult.rarity}
              </Text>
              <Text style={styles.itemName}>{summonResult.name}</Text>
              <Text style={styles.itemType}>{summonResult.type}</Text>
            </View>
          )}
          <TouchableOpacity
            style={[styles.button, styles.buttonClose]}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.textStyle}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case 'Legendary': return '#fbbf24'; // Gold
    case 'Epic': return '#a855f7'; // Purple
    case 'Rare': return '#3b82f6'; // Blue
    default: return '#9ca3af'; // Gray
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101622',
    padding: 20,
  },
  title: {
    fontSize: 30,
    color: '#fde047',
    textAlign: 'center',
    marginBottom: 20,
  },
  bannerList: {
    maxHeight: 60,
    marginBottom: 20,
  },
  bannerItem: {
    padding: 10,
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#4b5563',
    backgroundColor: '#1f2937',
  },
  selectedBanner: {
    borderColor: '#fde047',
    backgroundColor: '#374151',
  },
  bannerName: {
    color: 'white',
  },
  bannerDetail: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#92a4c9',
    padding: 20,
    backgroundColor: '#192233',
  },
  bannerTitle: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  bannerDesc: {
    color: '#d1d5db',
    textAlign: 'center',
    marginBottom: 30,
  },
  summonButtons: {
    width: '100%',
  },
  summonBtn: {
    backgroundColor: '#4f46e5',
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  btnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalView: {
    margin: 20,
    marginTop: 100,
    backgroundColor: '#1f2937',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 4,
    borderColor: '#fde047',
  },
  modalTitle: {
    fontSize: 24,
    color: 'white',
    marginBottom: 15,
  },
  resultCard: {
    alignItems: 'center',
    marginBottom: 20,
  },
  rarity: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  itemName: {
    fontSize: 28,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  itemType: {
    color: '#9ca3af',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default GachaScreen;
