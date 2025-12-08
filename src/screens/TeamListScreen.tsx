import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import api from '../services/api';
import { useNavigation } from '@react-navigation/native';

const TeamListScreen = () => {
  const [teams, setTeams] = useState<any[]>([]);
  const navigation = useNavigation<any>();
  const playerId = 1; // Hardcoded for now

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchTeams();
    });
    return unsubscribe;
  }, [navigation]);

  const fetchTeams = async () => {
    try {
      const res = await api.get(`/team/${playerId}`);
      setTeams(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (teamId: number) => {
    try {
      await api.post('/team/delete', { teamId, playerId });
      fetchTeams();
    } catch {
      Alert.alert('Error', 'Failed to delete team');
    }
  };

  const handleEdit = (team: any) => {
    navigation.navigate('Team', { team });
  };

  const handleCreate = () => {
    navigation.navigate('Team', { team: null });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Teams</Text>
      <TouchableOpacity style={styles.createBtn} onPress={handleCreate}>
        <Text style={styles.btnText}>Create New Team</Text>
      </TouchableOpacity>
      <FlatList
        data={teams}
        keyExtractor={(item) => item.team_id.toString()}
        renderItem={({ item }) => (
          <View style={styles.teamItem}>
            <Text style={styles.teamName}>{item.name}</Text>
            <View style={styles.actions}>
                <TouchableOpacity onPress={() => handleEdit(item)} style={styles.editBtn}>
                    <Text style={styles.btnText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.team_id)} style={styles.deleteBtn}>
                    <Text style={styles.btnText}>Delete</Text>
                </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#101622', padding: 20 },
  title: { fontSize: 24, color: 'white', marginBottom: 20, textAlign: 'center', fontFamily: 'Space Grotesk' },
  createBtn: { backgroundColor: '#135bec', padding: 15, borderRadius: 0, marginBottom: 20, alignItems: 'center', borderWidth: 2, borderColor: '#324467' },
  teamItem: { backgroundColor: '#1e293b', padding: 15, borderRadius: 0, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 2, borderColor: '#324467' },
  teamName: { color: 'white', fontSize: 18, fontFamily: 'Space Grotesk' },
  actions: { flexDirection: 'row', gap: 10 },
  editBtn: { backgroundColor: '#fbbf24', padding: 8, borderRadius: 0 },
  deleteBtn: { backgroundColor: '#ef4444', padding: 8, borderRadius: 0 },
  btnText: { color: '#101622', fontWeight: 'bold', textTransform: 'uppercase', fontFamily: 'Space Grotesk' },
});

export default TeamListScreen;
