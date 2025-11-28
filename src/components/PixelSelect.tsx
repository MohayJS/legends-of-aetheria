import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, FlatList } from 'react-native';

interface PixelSelectProps {
  label: string;
  value: string;
  options: string[];
  onSelect: (value: string) => void;
}

const PixelSelect: React.FC<PixelSelectProps> = ({ label, value, options, onSelect }) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity 
        style={styles.selector} 
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.valueText}>{value}</Text>
        <Text style={styles.arrow}>▼</Text>
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select {label}</Text>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={[styles.option, item === value && styles.selectedOption]}
                  onPress={() => {
                    onSelect(item);
                    setModalVisible(false);
                  }}
                >
                  <Text style={[styles.optionText, item === value && styles.selectedOptionText]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  label: {
    color: '#e5e7eb',
    marginBottom: 5,
    fontSize: 16,
  },
  selector: {
    backgroundColor: '#1e293b',
    padding: 12,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#475569',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  valueText: {
    color: 'white',
    fontSize: 16,
  },
  arrow: {
    color: '#94a3b8',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#1e293b',
    width: '100%',
    maxWidth: 300,
    borderRadius: 10,
    borderWidth: 4,
    borderColor: '#fde047',
    padding: 10,
    maxHeight: '80%',
  },
  modalTitle: {
    color: '#fde047',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#475569',
    paddingBottom: 10,
  },
  option: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  selectedOption: {
    backgroundColor: '#334155',
  },
  optionText: {
    color: '#cbd5e1',
    fontSize: 18,
    textAlign: 'center',
  },
  selectedOptionText: {
    color: '#fde047',
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 15,
    padding: 15,
    backgroundColor: '#991b1b',
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default PixelSelect;
