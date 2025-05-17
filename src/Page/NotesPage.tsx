// screens/NotesPage.tsx
import React from 'react';
import { ScrollView, View } from 'react-native';
import ActionButton from '../components/ActionButton';
import RecentNotes from '../components/RecentNotes';
import { styles } from '../styles';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Définit les types de routes
type RootStackParamList = {
  NotesPage: undefined;
  NotesScreen: undefined;
};

const NotesPage = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <ActionButton
            icon="📝"
            title="Saisie Texte"
            subtitle="Créer une note textuelle"
            onPress={() => navigation.navigate('NotesScreen')}
          />
        </View>

        <RecentNotes />
      </ScrollView>
    </>
  );
};

export default NotesPage;
