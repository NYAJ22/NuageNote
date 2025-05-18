import React, { useState } from 'react';
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../styles'; // ou adapte selon ton projet

const SettingsPage: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  const toggleDarkMode = () => {
    const newValue = !isDarkMode;
    setIsDarkMode(newValue);
    Alert.alert('Thème changé', newValue ? 'Mode sombre activé' : 'Mode clair activé');

    // (optionnel) Sauvegarder le thème
    // AsyncStorage.setItem('dark_mode', JSON.stringify(newValue));
  };

  const clearAllNotes = async () => {
    Alert.alert(
      'Confirmation',
      'Voulez-vous vraiment supprimer toutes les notes ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.clear(); // ou removeItem('notes') si tu as une clé spécifique
              await AsyncStorage.setItem('last_note', ''); // Vide aussi le widget

              Alert.alert('Succès', 'Toutes les notes ont été supprimées.');

              // (Optionnel) Rafraîchir le widget via un module natif ici
              // NativeModules.WidgetUpdater.updateWidget();
            } catch (error) {
              console.error('Erreur lors de la suppression des notes:', error);
              Alert.alert('Erreur', 'Impossible de supprimer les notes.');
            }
          },
        },
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
