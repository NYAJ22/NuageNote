// components/Header.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../styles';

const Header = () => {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.header}>Nuage Note</Text>
      <Text style={styles.subHeader}>Votre espace de notes intelligent</Text>
    </View>
  );
};

export default Header;
