import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity, Alert } from 'react-native';
import { styles } from '../styles';

const SettingsPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    Alert.alert('Thème changé', isDarkMode ? 'Mode clair activé' : 'Mode sombre activé');
  };

  const clearAllNotes = () => {
    Alert.alert(
      'Confirmation',
      'Voulez-vous vraiment supprimer toutes les notes ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Supprimer', style: 'destructive', onPress: () => {
          // Implémente la suppression réelle ici
          Alert.alert('Succès', 'Toutes les notes ont été supprimées.');
        }},
      ]
    );
  };

  return (
    <View style={styles.settingsContainer}>
      <Text style={styles.title}>Réglages</Text>

      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Mode sombre</Text>
        <Switch
          value={isDarkMode}
          onValueChange={toggleDarkMode}
        />
      </View>

      <TouchableOpacity style={styles.deleteButton} onPress={clearAllNotes}>
        <Text style={styles.deleteButtonText}>🗑️ Supprimer toutes les notes</Text>
      </TouchableOpacity>

      <View style={styles.aboutSection}>
        <Text style={styles.aboutText}>📝 Application de prise de notes</Text>
        <Text style={styles.aboutText}>Version 1.0.0</Text>
        <Text style={styles.aboutText}>Développé par le GROUPE 8</Text>
      </View>
    </View>
  );
};

export default SettingsPage;
