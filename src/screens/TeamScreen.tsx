import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, TextInput, Alert } from 'react-native';
import api, { BASE_URL } from '../services/api';
import { useNavigation, useRoute } from '@react-navigation/native';

const TeamScreen = () => {
  const route = useRoute();
  const navigation = useNavigation<any>();
  const [team, setTeam] = useState<any[]>(Array(4).fill(null));
  const [inventory, setInventory] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [teamName, setTeamName] = useState('My Team');
  const [selectedCharacterStats, setSelectedCharacterStats] = useState<any>(null);

  useEffect(() => {
    fetchInventory();
    const params = route.params as { team?: any } | undefined;
    if (params?.team) {
      loadTeam(params.team);
    }
  }, [route.params]);

  const fetchInventory = async () => {
    try {
      const playerId = 1;
      const invRes = await api.get(`/inventory/${playerId}`);
      const characters = invRes.data.filter((i: any) => i.type === 'Character');
      setInventory(characters);
    } catch (error) {
      console.error(error);
    }
  };

  const loadTeam = (loadedTeam: any) => {
    setTeamName(loadedTeam.name);
    const newTeam = Array(5).fill(null);
    if (loadedTeam.members) {
        loadedTeam.members.forEach((m: any) => {
            if (m.slot_index >= 1 && m.slot_index <= 5) {
                newTeam[m.slot_index - 1] = m;
            }
        });
    }
    setTeam(newTeam);
    // Select first character if exists
    const firstChar = newTeam.find(c => c !== null);
    if (firstChar) setSelectedCharacterStats(firstChar);
  };

  const handleSelectSlot = (index: number) => {
    if (team[index]) {
      const newTeam = [...team];
      newTeam[index] = null;
      setTeam(newTeam);
      setSelectedCharacterStats(null);
      setSelectedSlot(null);
    } else {
      setSelectedSlot(index);
    }
  };

  const handleSelectCharacter = (character: any) => {
    if (selectedSlot !== null) {
      const newTeam = [...team];
      // Check if character is already in another slot
      const existingIndex = newTeam.findIndex(c => c && c.inventory_id === character.inventory_id);
      if (existingIndex !== -1) {
        newTeam[existingIndex] = null; // Remove from old slot
      }
      
      newTeam[selectedSlot] = character;
      setTeam(newTeam);
      setSelectedCharacterStats(character);
      setSelectedSlot(null);
    } else {
        // Just view stats
        setSelectedCharacterStats(character);
    }
  };

  const handleSaveTeam = async () => {
    try {
      const playerId = 1;
      await api.post('/team/save', { 
          playerId, 
          teamName, 
          members: team 
      });
      Alert.alert('Success', 'Team saved!');
      navigation.navigate('TeamList');
    } catch {
      Alert.alert('Error', 'Failed to save team');
    }
  };

  const handleAutoFill = () => {
      // Simple auto fill: take first 5 characters not in team
      const newTeam = [...team];
      let invIndex = 0;
      for (let i = 0; i < 5; i++) {
          if (!newTeam[i]) {
              while (invIndex < inventory.length) {
                  const char = inventory[invIndex];
                  if (!newTeam.find(c => c && c.inventory_id === char.inventory_id)) {
                      newTeam[i] = char;
                      invIndex++;
                      break;
                  }
                  invIndex++;
              }
          }
      }
      setTeam(newTeam);
  };

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backIcon}>{'<'}</Text>
        </TouchableOpacity>
        <TextInput 
            style={styles.headerTitle} 
            value={teamName} 
            onChangeText={setTeamName} 
            placeholder="Team Name"
            placeholderTextColor="#555"
        />
        <TouchableOpacity onPress={() => navigation.navigate('TeamList')}>
            <Text style={styles.listIcon}>List</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.subtitle}>Arrange your heroes for the upcoming battle.</Text>

      {/* Slots */}
      <View style={styles.slotsContainer}>
        {team.map((char, index) => (
          <TouchableOpacity 
            key={index} 
            style={[
                styles.slot, 
                selectedSlot === index && styles.selectedSlot,
                char ? styles.filledSlot : styles.emptySlot
            ]}
            onPress={() => handleSelectSlot(index)}
          >
            {char ? (
               <Image source={{ uri: `${BASE_URL}/assets/${char.image_path}` }} style={styles.slotImage} />
            ) : (
              <Text style={styles.addIcon}>+</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Stats */}
      {selectedCharacterStats && (
          <View style={styles.statsContainer}>
            <View style={styles.statsHeader}>
                <View>
                    <Text style={styles.charName}>{selectedCharacterStats.name}</Text>
                    <Text style={styles.charLevel}>Lvl. {selectedCharacterStats.level || 1} Class</Text>
                </View>
                <View style={styles.types}>
                    {/* Icons placeholders */}
                    <Text style={styles.iconGold}>🛡️</Text>
                    <Text style={styles.iconBlue}>💧</Text>
                </View>
            </View>
            <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>HP</Text>
                    <Text style={styles.statValue}>2400 / 2400</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>ATK</Text>
                    <Text style={styles.statValue}>850</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>DEF</Text>
                    <Text style={styles.statValue}>620</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>SPD</Text>
                    <Text style={styles.statValue}>450</Text>
                </View>
            </View>
          </View>
      )}

      {/* Inventory */}
      <View style={styles.inventoryContainer}>
        <View style={styles.inventoryHeader}>
            <Text style={styles.inventoryTitle}>YOUR HEROES</Text>
            <TouchableOpacity style={styles.autoFillBtn} onPress={handleAutoFill}>
                <Text style={styles.autoFillText}>AUTO-FILL</Text>
            </TouchableOpacity>
        </View>
        <FlatList
            data={inventory}
            numColumns={4}
            keyExtractor={(item) => item.inventory_id.toString()}
            renderItem={({ item }) => (
            <TouchableOpacity style={styles.invItem} onPress={() => handleSelectCharacter(item)}>
                <Image source={{ uri: `${BASE_URL}/assets/${item.image_path}` }} style={styles.invImage} />
            </TouchableOpacity>
            )}
        />
      </View>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
          <TouchableOpacity style={styles.saveBtn} onPress={handleSaveTeam}>
            <Text style={styles.saveBtnText}>SAVE TEAM</Text>
          </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111722' },
  topBar: { flexDirection: 'row', alignItems: 'center', padding: 16, justifyContent: 'space-between' },
  backIcon: { color: 'white', fontSize: 24 },
  headerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold', textTransform: 'uppercase', fontFamily: 'Space Grotesk', borderBottomWidth: 1, borderBottomColor: '#333', minWidth: 150, textAlign: 'center' },
  listIcon: { color: '#92a4c9', fontSize: 16, textTransform: 'uppercase' },
  subtitle: { color: '#92a4c9', textAlign: 'center', marginBottom: 10 },
  slotsContainer: { flexDirection: 'row', justifyContent: 'center', gap: 10, padding: 10 },
  slot: { width: 60, height: 60, backgroundColor: '#1e293b', borderWidth: 2, borderColor: '#92a4c9', justifyContent: 'center', alignItems: 'center' },
  selectedSlot: { borderColor: '#fbbf24' },
  filledSlot: {},
  emptySlot: {},
  slotImage: { width: '100%', height: '100%' },
  addIcon: { color: '#324467', fontSize: 30 },
  
  statsContainer: { margin: 16, padding: 16, backgroundColor: '#1e293b', borderWidth: 2, borderColor: '#92a4c9' },
  statsHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  charName: { color: 'white', fontSize: 18, fontWeight: 'bold', textTransform: 'uppercase' },
  charLevel: { color: '#92a4c9', fontSize: 14 },
  types: { flexDirection: 'row', gap: 5 },
  iconGold: { color: 'gold' },
  iconBlue: { color: 'blue' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  statItem: { width: '50%', padding: 5, borderTopWidth: 1, borderTopColor: '#324467' },
  statLabel: { color: '#92a4c9', fontSize: 12, textTransform: 'uppercase' },
  statValue: { color: 'white', fontSize: 14, fontWeight: 'bold' },

  inventoryContainer: { flex: 1, padding: 16 },
  inventoryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  inventoryTitle: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  autoFillBtn: { backgroundColor: '#1e293b', padding: 5, borderWidth: 2, borderColor: '#324467' },
  autoFillText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  invItem: { width: 60, height: 60, margin: 5, backgroundColor: '#1e293b', borderWidth: 2, borderColor: '#92a4c9' },
  invImage: { width: '100%', height: '100%' },

  bottomActions: { padding: 16, backgroundColor: '#111722' },
  saveBtn: { backgroundColor: '#fbbf24', padding: 15, alignItems: 'center', borderWidth: 4, borderColor: '#b45309' },
  saveBtnText: { color: '#111722', fontSize: 18, fontWeight: 'bold' }
});

export default TeamScreen;
