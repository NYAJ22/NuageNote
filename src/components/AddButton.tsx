import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';

interface AddButtonProps {
  onPress: () => void;
  title: string;
}

const AddButton: React.FC<AddButtonProps> = ({ onPress, title }) => (
    <TouchableOpacity style={styles.fab} onPress={onPress}>
      <Text style={styles.fabText}>{title}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: -100,
    right: 20,
    backgroundColor: '#2a4b7c',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fabText: {
    height: 65,
    color: 'white',
    fontSize: 45,
    fontWeight: '400',
  },
});


export default AddButton;