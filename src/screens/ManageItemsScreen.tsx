import React, { useState, useEffect } from 'react';
import { Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import api from '../services/api';

import PixelSelect from '../components/PixelSelect';

const ManageItemsScreen = () => {
  const [name, setName] = useState('');
  const [rarity, setRarity] = useState('Common');
  const [type, setType] = useState('Character');
  const [description, setDescription] = useState('');
  const [imagePath, setImagePath] = useState('');
  
  // Dynamic stats based on type
  const [hp, setHp] = useState('');
  const [atk, setAtk] = useState('');
  const [def, setDef] = useState('');
  const [spd, setSpd] = useState('');
  const [critRate, setCritRate] = useState('');

  useEffect(() => {
    const fillStats = () => {
      let newHp = '';
      let newAtk = '';
      let newDef = '';
      let newSpd = '';
      let newCritRate = '';

      if (type === 'Character') {
        switch (rarity) {
          case 'Common': newHp = '100'; newAtk = '10'; newDef = '5'; newSpd = '10'; break;
          case 'Rare': newHp = '200'; newAtk = '20'; newDef = '10'; newSpd = '12'; break;
          case 'Epic': newHp = '500'; newAtk = '50'; newDef = '25'; newSpd = '15'; break;
          case 'Legendary': newHp = '1000'; newAtk = '100'; newDef = '50'; newSpd = '20'; break;
        }
      } else if (type === 'Weapon') {
        switch (rarity) {
          case 'Common': newAtk = '10'; newCritRate = '0.01'; break;
          case 'Rare': newAtk = '30'; newCritRate = '0.05'; break;
          case 'Epic': newAtk = '80'; newCritRate = '0.10'; break;
          case 'Legendary': newAtk = '150'; newCritRate = '0.20'; break;
        }
      } else if (type === 'Equipment') {
        switch (rarity) {
          case 'Common': newHp = '50'; newDef = '5'; break;
          case 'Rare': newHp = '100'; newDef = '10'; break;
          case 'Epic': newHp = '250'; newDef = '25'; break;
          case 'Legendary': newHp = '500'; newDef = '50'; break;
        }
      }

      setHp(newHp);
      setAtk(newAtk);
      setDef(newDef);
      setSpd(newSpd);
      setCritRate(newCritRate);
    };

    fillStats();
  }, [rarity, type]);

  const handleAddItem = async () => {
    let baseStats = {};

    if (type === 'Character') {
      baseStats = { 
        hp: parseInt(hp, 10), 
        atk: parseInt(atk, 10), 
        def: parseInt(def, 10), 
        spd: parseInt(spd, 10) 
      };
    } else if (type === 'Weapon') {
      baseStats = { 
        atk: parseInt(atk, 10), 
        critRate: parseFloat(critRate) 
      };
    } else if (type === 'Equipment') {
      baseStats = { 
        hp: parseInt(hp, 10), 
        def: parseInt(def, 10) 
      };
    }

    try {
      await api.post('/admin/items', {
        name,
        rarity,
        type,
        base_stats: baseStats,
        image_path: imagePath,
        description
      });
      Alert.alert('Success', 'Item added successfully');
      // Reset form
      setName('');
      setDescription('');
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to add item');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add New Item</Text>

      <Text style={styles.label}>Name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <PixelSelect 
        label="Rarity" 
        value={rarity} 
        options={['Common', 'Rare', 'Epic', 'Legendary']} 
        onSelect={setRarity} 
      />

      <PixelSelect 
        label="Type" 
        value={type} 
        options={['Character', 'Weapon', 'Equipment']} 
        onSelect={setType} 
      />

      <Text style={styles.label}>Description</Text>
      <TextInput style={styles.input} value={description} onChangeText={setDescription} multiline />

      <Text style={styles.label}>Image URL</Text>
      <TextInput style={styles.input} value={imagePath} onChangeText={setImagePath} />

      <Text style={styles.sectionTitle}>Base Stats</Text>
      
      {(type === 'Character' || type === 'Equipment') && (
        <>
          <Text style={styles.label}>HP</Text>
          <TextInput style={styles.input} value={hp} onChangeText={setHp} keyboardType="numeric" />
        </>
      )}

      {(type === 'Character' || type === 'Weapon' || type === 'Equipment') && (
        <>
           {/* Equipment usually has HP/Def, but let's allow Def for all for now if needed, but per spec:
               Character: HP, Atk, Def, Spd
               Weapon: Atk, CritRate
               Equipment: HP, Def
           */}
           {(type === 'Character' || type === 'Equipment') && (
             <>
               <Text style={styles.label}>Defense</Text>
               <TextInput style={styles.input} value={def} onChangeText={setDef} keyboardType="numeric" />
             </>
           )}
        </>
      )}

      {(type === 'Character' || type === 'Weapon') && (
        <>
          <Text style={styles.label}>Attack</Text>
          <TextInput style={styles.input} value={atk} onChangeText={setAtk} keyboardType="numeric" />
        </>
      )}

      {type === 'Character' && (
        <>
          <Text style={styles.label}>Speed</Text>
          <TextInput style={styles.input} value={spd} onChangeText={setSpd} keyboardType="numeric" />
        </>
      )}

      {type === 'Weapon' && (
        <>
          <Text style={styles.label}>Crit Rate (0.0 - 1.0)</Text>
          <TextInput style={styles.input} value={critRate} onChangeText={setCritRate} keyboardType="numeric" />
        </>
      )}

      <TouchableOpacity style={styles.button} onPress={handleAddItem}>
        <Text style={styles.buttonText}>Add Item</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101622',
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: '#fde047',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    color: '#fde047',
    marginTop: 20,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  label: {
    color: '#e5e7eb',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#1e293b',
    color: 'white',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#475569',
  },
  button: {
    backgroundColor: '#fde047',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  buttonText: {
    color: '#1e1b4b',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ManageItemsScreen;
