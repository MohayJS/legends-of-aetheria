import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Image, Modal, FlatList, Alert, ActivityIndicator } from 'react-native';
import api, { BASE_URL } from '../services/api';
import bannerImages from '../config/bannerImages';

const GachaScreen = ({ navigation, route }: any) => {
  // Fallback if params are missing (e.g. direct navigation during dev)
  const user = route.params.user;
  const banner = route.params.banner;

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Helper to get image source
  const getBannerImage = (path: string) => {
    if (!path) return null;
    const filename = path.split('/').pop();
    return bannerImages[path] || (filename ? bannerImages[filename] : null) || { uri: `${BASE_URL}/assets/${path}` };
  };

  const handleSummon = async (amount: number) => {
    if (!user.id) {
      Alert.alert('Summon Failed', 'Failed to draw: Player ID is missing.');
      return;
    }

    const cost = amount === 1 ? 150 : 1500;
    if (user.gems < cost) {
      Alert.alert('Insufficient Gems', 'You do not have enough gems for this summon.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/gacha/summon', {
        playerId: user.id, 
        bannerId: banner.banner_id,
        amount: amount
      });

      setResults(response.data.items);
      console.log(response.data.items);
      setShowResults(true);
      
      // Update user gems locally
      user.gems -= cost; 

    } catch (error: any) {
      Alert.alert('Summon Failed', error.response?.data?.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await api.get(`/gacha/history/${user.id}`);
      setHistory(response.data);
      setShowHistory(true);
    } catch {
      Alert.alert('Error', 'Failed to fetch history');
    }
  };

  const renderResultItem = ({ item }: { item: any }) => (
    <TouchableOpacity onPress={() => setSelectedItem(item)}>
      <View style={styles.resultItem}>
        <Image 
          source={{ uri: `${BASE_URL}/assets/${item.image_path}` }} 
          style={styles.resultImage}
          resizeMode="contain"
        />
        <View style={styles.resultInfo}>
          <Text style={[styles.resultName, { color: getRarityColor(item.rarity) }]}>{item.name}</Text>
          <Text style={styles.resultRarity}>{item.rarity}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const getRarityColor = (rarity: string) => {
    switch (rarity?.toLowerCase()) {
      case 'legendary': return '#fbbf24'; // Gold
      case 'epic': return '#a855f7'; // Purple
      case 'rare': return '#3b82f6'; // Blue
      default: return '#9ca3af'; // Gray
    }
  };

  return (
    <ImageBackground 
      source={require('../../srcassets/main_menu_background.png')} 
      style={styles.container}
    >
      <View style={styles.overlay}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>{'< Back'}</Text>
          </TouchableOpacity>
          <View style={styles.currencyContainer}>
             <Image source={require('../../srcassets/gems/single_gem.png')} style={styles.currencyIcon} />
             <Text style={styles.currencyText}>{user.gems}</Text>
          </View>
        </View>

        {/* Banner Display */}
        <View style={styles.bannerContainer}>
          <Image source={getBannerImage(banner.image_path)} style={styles.bannerImage} resizeMode="contain" />
          <Text style={styles.bannerTitle}>{banner.name}</Text>
        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.summonButton} 
            onPress={() => handleSummon(1)}
            disabled={loading}
          >
            <Text style={styles.summonButtonText}>Summon 1x</Text>
            <View style={styles.costContainer}>
              <Image source={require('../../srcassets/gems/single_gem.png')} style={styles.costIcon} />
              <Text style={styles.costText}>150</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.summonButton, styles.summon10Button]} 
            onPress={() => handleSummon(10)}
            disabled={loading}
          >
            <Text style={styles.summonButtonText}>Summon 10x</Text>
            <View style={styles.costContainer}>
              <Image source={require('../../srcassets/gems/single_gem.png')} style={styles.costIcon} />
              <Text style={styles.costText}>1500</Text>
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.historyButton} onPress={fetchHistory}>
          <Text style={styles.historyButtonText}>Draw History</Text>
        </TouchableOpacity>

        {/* Results Modal */}
        <Modal visible={showResults} transparent={true} animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.resultsContainer}>
              <Text style={styles.resultsTitle}>Summon Results</Text>
              <FlatList
                data={results}
                renderItem={renderResultItem}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.resultsList}
              />
              <TouchableOpacity 
                style={styles.closeButton} 
                onPress={() => setShowResults(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* History Modal */}
        <Modal visible={showHistory} transparent={true} animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.historyContainer}>
              <Text style={styles.resultsTitle}>Draw History</Text>
              <FlatList
                data={history}
                keyExtractor={(item) => item.draw_id.toString()}
                renderItem={({ item }) => (
                  <View style={styles.historyItem}>
                    <Text style={styles.historyName}>{item.item_name}</Text>
                    <Text style={styles.historyDate}>{new Date(item.draw_time).toLocaleDateString()}</Text>
                  </View>
                )}
              />
              <TouchableOpacity 
                style={styles.closeButton} 
                onPress={() => setShowHistory(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Item Details Modal */}
        <Modal visible={!!selectedItem} transparent={true} animationType="fade" onRequestClose={() => setSelectedItem(null)}>
          <View style={styles.modalOverlay}>
            <View style={styles.detailsContainer}>
              {selectedItem && (
                <>
                  <Text style={[styles.detailsTitle, { color: getRarityColor(selectedItem.rarity) }]}>{selectedItem.name}</Text>
                  <Image 
                    source={{ uri: `${BASE_URL}/assets/${selectedItem.image_path}` }} 
                    style={styles.detailsImage}
                    resizeMode="contain"
                  />
                  <Text style={styles.detailsRarity}>{selectedItem.rarity}</Text>
                  {selectedItem.description && <Text style={styles.detailsDescription}>{selectedItem.description}</Text>}
                </>
              )}
              <TouchableOpacity 
                style={styles.closeButton} 
                onPress={() => setSelectedItem(null)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#a413ec" />
          </View>
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1c1122' },
  overlay: { flex: 1, backgroundColor: 'rgba(28, 17, 34, 0.8)', padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  backButton: { padding: 10 },
  backButtonText: { color: 'white', fontSize: 16, fontFamily: 'monospace' },
  currencyContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)', padding: 8, borderRadius: 20 },
  currencyIcon: { width: 20, height: 20, marginRight: 5 },
  currencyText: { color: '#fde047', fontFamily: 'monospace', fontWeight: 'bold' },
  bannerContainer: { alignItems: 'center', marginBottom: 30 },
  bannerImage: { width: '100%', height: 200, borderRadius: 10, borderWidth: 2, borderColor: '#a413ec' },
  bannerTitle: { color: 'white', fontSize: 20, fontFamily: 'monospace', marginTop: 10, fontWeight: 'bold' },
  actionsContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
  summonButton: { backgroundColor: '#4a392c', padding: 15, borderRadius: 10, alignItems: 'center', width: '45%', borderWidth: 2, borderColor: '#80644b' },
  summon10Button: { backgroundColor: '#6d2828', borderColor: '#b94747' },
  summonButtonText: { color: 'white', fontFamily: 'monospace', fontWeight: 'bold', marginBottom: 5 },
  costContainer: { flexDirection: 'row', alignItems: 'center' },
  costIcon: { width: 16, height: 16, marginRight: 4 },
  costText: { color: '#fde047', fontFamily: 'monospace' },
  historyButton: { alignSelf: 'center', padding: 10 },
  historyButtonText: { color: '#9ca3af', textDecorationLine: 'underline', fontFamily: 'monospace' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  resultsContainer: { width: '100%', backgroundColor: '#2d1b36', borderRadius: 10, padding: 20, maxHeight: '80%' },
  resultsTitle: { color: 'white', fontSize: 24, fontFamily: 'monospace', textAlign: 'center', marginBottom: 20 },
  resultsList: { paddingBottom: 20 },
  resultItem: { flexDirection: 'row', alignItems: 'center', padding: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' },
  resultImage: { width: 60, height: 60, marginRight: 12, borderRadius: 8, backgroundColor: 'rgba(0,0,0,0.3)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  resultInfo: { flex: 1 },
  resultName: { fontSize: 16, fontFamily: 'monospace', fontWeight: 'bold' },
  resultRarity: { color: '#9ca3af', fontFamily: 'monospace' },
  closeButton: { backgroundColor: '#a413ec', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  closeButtonText: { color: 'white', fontWeight: 'bold', fontFamily: 'monospace' },
  historyContainer: { width: '100%', backgroundColor: '#2d1b36', borderRadius: 10, padding: 20, maxHeight: '80%' },
  historyItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' },
  historyName: { color: 'white', fontFamily: 'monospace' },
  historyDate: { color: '#9ca3af', fontSize: 12, fontFamily: 'monospace' },
  loadingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  detailsContainer: { width: '90%', backgroundColor: '#2d1b36', borderRadius: 10, padding: 20, alignItems: 'center', borderWidth: 2, borderColor: '#a413ec' },
  detailsTitle: { fontSize: 24, fontFamily: 'monospace', fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  detailsImage: { width: 200, height: 200, marginBottom: 15, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 10 },
  detailsRarity: { color: '#fde047', fontSize: 18, fontFamily: 'monospace', marginBottom: 10, fontWeight: 'bold' },
  detailsDescription: { color: '#d1d5db', fontFamily: 'monospace', textAlign: 'center', marginBottom: 20 },
});

export default GachaScreen;
