import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, FlatList } from 'react-native';
import api from '../services/api';

const TeamScreen = () => {
  const [team, setTeam] = useState<any[]>(Array(4).fill(null)); // 4 slots
  const [inventory, setInventory] = useState<any[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const playerId = 1;
      const invRes = await api.get(`/inventory/${playerId}`);
      const characters = invRes.data.filter((i: any) => i.type === 'Character');
      setInventory(characters);

      // Fetch existing team (mock logic for now, or implement if backend ready)
      // For MVP, just start empty or load if available
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectSlot = (index: number) => {
    setSelectedSlot(index);
  };

  const handleSelectCharacter = (character: any) => {
    if (selectedSlot !== null) {
      const newTeam = [...team];
      newTeam[selectedSlot] = character;
      setTeam(newTeam);
      setSelectedSlot(null);
    }
  };

  const handleSaveTeam = async () => {
    try {
      const playerId = 1;
      const members = team
        .map((char, index) => char ? { slot_index: index + 1, inventory_id: char.inventory_id } : null)
        .filter(Boolean);
      
      await api.post('/team/save', { playerId, teamId: 1, members }); // Assuming teamId 1 exists
      Alert.alert('Success', 'Team saved!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save team');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Team Formation</Text>
      
      <View style={styles.slotsContainer}>
        {team.map((char, index) => (
          <TouchableOpacity 
            key={index} 
            style={[styles.slot, selectedSlot === index && styles.selectedSlot]}
            onPress={() => handleSelectSlot(index)}
          >
            {char ? (
              <View>
                <Text style={styles.slotName}>{char.name}</Text>
                <Text style={styles.slotLevel}>Lvl {char.level}</Text>
              </View>
            ) : (
              <Text style={styles.emptyText}>Empty</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.saveBtn} onPress={handleSaveTeam}>
        <Text style={styles.btnText}>Save Team</Text>
      </TouchableOpacity>

      <Text style={styles.subtitle}>Available Characters</Text>
      <FlatList
        data={inventory}
        keyExtractor={(item) => item.inventory_id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.charItem} onPress={() => handleSelectCharacter(item)}>
            <Text style={styles.charName}>{item.name}</Text>
            <Text style={styles.charLevel}>Lvl {item.level}</Text>
          </TouchableOpacity>
        )}
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
  title: {
    fontSize: 30,
    color: '#fde047',
    textAlign: 'center',
    marginBottom: 20,
  },
  slotsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  slot: {
    width: 80,
    height: 100,
    borderWidth: 2,
    borderColor: '#4b5563',
    backgroundColor: '#1f2937',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedSlot: {
    borderColor: '#fde047',
  },
  slotName: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
  },
  slotLevel: {
    color: '#10b981',
    fontSize: 10,
  },
  emptyText: {
    color: '#6b7280',
  },
  saveBtn: {
    backgroundColor: '#15803d',
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'white',
  },
  btnText: {
    color: 'white',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 20,
    color: 'white',
    marginBottom: 10,
  },
  charItem: {
    padding: 15,
    backgroundColor: '#1f2937',
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  charName: {
    color: 'white',
    fontSize: 16,
  },
  charLevel: {
    color: '#10b981',
  },
});

export default TeamScreen;
