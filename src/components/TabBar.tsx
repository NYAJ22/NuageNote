// components/TabBar.tsx
import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { styles } from '../styles';

interface TabBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabBar: React.FC<TabBarProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { key: 'home', label: 'Accueil', icon: '🏠' },
    { key: 'notes', label: 'Notes', icon: '📋' },
    { key: 'audio', label: 'Audio', icon: '🎧' },
    { key: 'paint', label: 'Dessin', icon: '🎨'},
    { key: 'settings', label: 'Réglages', icon: '⚙️' },
  ];

  return (
    <View style={styles.tabBar}>
      {tabs.map(tab => (
        <TouchableOpacity
          key={tab.key}
          style={[styles.tabItem, activeTab === tab.key && styles.activeTab]}
          onPress={() => setActiveTab(tab.key)}
        >
          <Text style={styles.tabIcon}>{tab.icon}</Text>
          <Text style={styles.tabText}>{tab.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default TabBar;
