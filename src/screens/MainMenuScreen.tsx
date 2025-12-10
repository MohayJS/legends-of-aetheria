import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Image, ScrollView, SafeAreaView, Modal } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import api, { BASE_URL } from '../services/api';
import bannerImages from '../config/bannerImages';

const MainMenuScreen = ({ navigation, route }: any) => {
  // Fallback for user if not passed correctly
  const [user, setUser] = useState(route.params.user);

  useEffect(() => {
    if (route.params?.user) {
      setUser(route.params.user);
    }
  }, [route.params?.user]);

  useEffect(() => {
    console.log(user);
  }, [user]);

  const fetchUserData = useCallback(async () => {
    if (!user.player_id) return;
    try {
      const response = await api.get(`/player/${user.player_id}`);
      setUser((prev: any) => ({ ...prev, ...response.data }));
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  }, [user.player_id]);

  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [fetchUserData])
  );

  const [banners, setBanners] = useState<any[]>([]);
  const [isBannerModalVisible, setBannerModalVisible] = useState(false);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await api.get('/gacha/banners');
        setBanners(response.data);
      } catch (error) {
        console.error('Failed to fetch banners:', error);
      }
    };

    fetchBanners();
  }, []);

  const handleSummonPress = () => {
    setBannerModalVisible(true);
  };

  const handleBannerSelect = (banner: any) => {
    setBannerModalVisible(false);
    navigation.navigate('Gacha', { banner, user });
  };

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
            <View style={styles.profileContainer}>
              <View style={styles.avatarContainer}>
                <Image 
                  source={require('../../srcassets/profile_pic_knight.png')} 
                  style={styles.avatar} 
                />
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.username}>{user.name || user.username}</Text>
                <View style={styles.levelContainer}>
                  <Text style={styles.levelText}>Lvl {user.level}</Text>
                  <View style={{ flex: 1 }}>
                    <View style={[styles.xpBarBackground, { flex: 0, width: '100%' }]}>
                      <View style={[styles.xpBarFill, { width: `${Math.min(((user.xp) / ((user.level) * 100)) * 100, 100)}%` }]} />
                    </View>
                    <Text style={{ color: '#fff', fontSize: 9, fontFamily: 'monospace', textAlign: 'right', marginTop: 2 }}>
                      {user.xp || 0}/{((user.level) * 100)} XP
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Currency Stats */}
            <View style={styles.currencyContainer}>
              <View style={styles.currencyItem}>
                <Image source={require('../../srcassets/gems/single_gem.png')} style={styles.currencyIconImage} />
                <Text style={styles.currencyText}>{user.gems !== undefined ? user.gems : 1500}</Text>
              </View>
            </View>
          </View>

          {/* Main Content - Banners */}
          <View style={styles.mainContent}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              style={styles.bannerScroll}
              contentContainerStyle={styles.bannerScrollContent}
            >
              {banners.map((banner) => {
                // Extract filename if path is provided (e.g. "srcassets/image.png" -> "image.png")
                const filename = banner.image_path.split('/').pop();
                const localImage = bannerImages[banner.image_path] || (filename ? bannerImages[filename] : null);

                return (
                  <TouchableOpacity 
                    key={banner.banner_id} 
                    style={styles.bannerCard}
                    onPress={() => navigation.navigate('Gacha', { banner, user })}
                  >
                    <Image 
                      source={localImage || { uri: `${BASE_URL}/assets/${banner.image_path}` }} 
                      style={styles.bannerImage} 
                    />
                    <View style={styles.bannerTextContainer}>
                      <Text style={styles.bannerTitle}>{banner.name}</Text>
                      <Text style={styles.bannerSubtitle}>Ends: {new Date(banner.end_date).toLocaleDateString()}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            
            {/* Pagination Dots */}
            <View style={styles.pagination}>
              <View style={[styles.dot, styles.activeDot]} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            {/* Primary Actions */}
            <View style={styles.primaryActions}>
              <TouchableOpacity style={[styles.actionButton, styles.battleButton]} onPress={() => navigation.navigate('Team')}>
                <Text style={styles.actionIcon}>⚔️</Text>
                <Text style={styles.actionText}>BATTLE</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.actionButton, styles.summonButton]} onPress={handleSummonPress}>
                {/* <View style={styles.badge}><Text style={styles.badgeText}>!</Text></View> */}
                <Text style={styles.actionIcon}>✨</Text>
                <Text style={styles.actionText}>SUMMON</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.actionButton, styles.inventoryButton]} onPress={() => navigation.navigate('Inventory')}>
                <Text style={styles.actionIcon}>🎒</Text>
                <Text style={styles.actionText}>INVENTORY</Text>
              </TouchableOpacity>
            </View>

            {/* Secondary Actions */}
            <View style={styles.secondaryActions}>
              <TouchableOpacity style={styles.secondaryButton}>
                <Text style={styles.secondaryIcon}>📜</Text>
                <Text style={styles.secondaryText}>Quests</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('Shop', { user })}>
                <Text style={styles.secondaryIcon}>🏪</Text>
                <Text style={styles.secondaryText}>Shop</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('Settings', { user })}>
                <Text style={styles.secondaryIcon}>⚙️</Text>
                <Text style={styles.secondaryText}>Settings</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Modal
            animationType="fade"
            transparent={true}
            visible={isBannerModalVisible}
            onRequestClose={() => setBannerModalVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Select a Banner</Text>
                <ScrollView contentContainerStyle={styles.modalScrollContent}>
                  {banners.map((banner) => {
                    const filename = banner.image_path.split('/').pop();
                    const localImage = bannerImages[banner.image_path] || (filename ? bannerImages[filename] : null);
                    return (
                      <TouchableOpacity
                        key={banner.banner_id}
                        style={styles.modalBannerCard}
                        onPress={() => handleBannerSelect(banner)}
                      >
                        <Image
                          source={localImage || { uri: `${BASE_URL}/assets/${banner.image_path}` }}
                          style={styles.modalBannerImage}
                        />
                        <View style={styles.modalBannerTextContainer}>
                            <Text style={styles.modalBannerTitle}>{banner.name}</Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setBannerModalVisible(false)}
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
    backgroundColor: 'rgba(28, 17, 34, 0.5)', // Darken background slightly
    padding: 16,
    justifyContent: 'space-between',
  },
  header: {
    marginBottom: 20,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 12,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 4,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'monospace', // Pixel font fallback
    marginBottom: 4,
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelText: {
    color: '#fde047', // Yellow-300
    fontSize: 12,
    fontFamily: 'monospace',
    marginRight: 8,
  },
  xpBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: '#553267',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.5)',
  },
  xpBarFill: {
    height: '100%',
    backgroundColor: '#a413ec',
    borderRadius: 4,
  },
  xpBarFillWidth: {
    width: '60%',
  },
  currencyContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 8,
  },
  currencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    minWidth: 100,
  },
  currencyIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  currencyIconImage: {
    width: 20,
    height: 20,
    marginRight: 8,
    resizeMode: 'contain',
  },
  currencyText: {
    color: '#fde047',
    fontSize: 14,
    fontFamily: 'monospace',
    textAlign: 'right',
    flex: 1,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
  },
  bannerScroll: {
    flexGrow: 0,
  },
  bannerScrollContent: {
    paddingHorizontal: 4,
  },
  bannerCard: {
    width: 280,
    marginRight: 12,
    backgroundColor: 'transparent',
  },
  bannerImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#553267',
    marginBottom: 8,
  },
  bannerTextContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  bannerTitle: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'monospace',
    marginBottom: 2,
  },
  bannerSubtitle: {
    color: '#b792c9',
    fontSize: 10,
    fontFamily: 'monospace',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#553267',
  },
  activeDot: {
    width: 16,
    backgroundColor: '#a413ec',
  },
  footer: {
    marginTop: 20,
  },
  primaryActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderBottomWidth: 4, // Simulate 3D effect
  },
  battleButton: {
    backgroundColor: '#6d2828',
    borderColor: '#b94747',
  },
  summonButton: {
    backgroundColor: '#ca8a04', // yellow-600
    borderColor: '#facc15', // yellow-400
  },
  inventoryButton: {
    backgroundColor: '#4a392c',
    borderColor: '#80644b',
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 4,
    color: '#fff',
  },
  actionText: {
    color: '#fff', // Adjust based on button color
    fontSize: 10,
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#dc2626', // red-600
    borderWidth: 1,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  secondaryActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  secondaryButton: {
    alignItems: 'center',
    opacity: 0.8,
  },
  secondaryIcon: {
    fontSize: 20,
    color: '#9ca3af', // gray-400
    marginBottom: 2,
  },
  secondaryText: {
    color: '#9ca3af',
    fontSize: 10,
    fontFamily: 'monospace',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#2d1b36',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxHeight: '80%',
    borderWidth: 2,
    borderColor: '#553267',
  },
  modalTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalScrollContent: {
    paddingBottom: 20,
  },
  modalBannerCard: {
    marginBottom: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#553267',
  },
  modalBannerImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  modalBannerTextContainer: {
    padding: 8,
    alignItems: 'center',
  },
  modalBannerTitle: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'monospace',
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#6d2828',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#b94747',
  },
  closeButtonText: {
    color: '#fff',
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
});

export default MainMenuScreen;
