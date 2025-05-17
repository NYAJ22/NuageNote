// screens/HomePage.tsx
import React from 'react';
import { ScrollView, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import ActionButton from '../components/ActionButton';
import RecentNotes from '../components/RecentNotes';
import TabBar from '../components/TabBar';
import { styles } from '../styles';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const HomePage = () => {
  const navigation = useNavigation<NavigationProps>();

  return (
    <>
      <Header />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <ActionButton
            icon="📝"
            title="Saisie Texte"
            subtitle="Créer une note textuelle"
            onPress={() => navigation.navigate('NotesPage')}
          />
          <ActionButton
            icon="🎨"
            title="Dessin"
            subtitle="Dessiner une note manuscrite"
            onPress={() => navigation.navigate('Drawing')}
          />
          <ActionButton
            icon="🎤"
            title="Enregistrement Audio"
            subtitle="Créer une note vocale"
            onPress={() => navigation.navigate('Audio')}
          />
          <ActionButton
  icon="📚"
  title="Toutes les Notes"
  subtitle="Voir toutes vos notes"
  onPress={() => navigation.navigate('AllNotes')}
/>
        </View>

        {/* ✅ Notes récentes */}
        <RecentNotes />
      </ScrollView>

      <TabBar
        activeTab="home"
        setActiveTab={(tab) => {
          if (tab === 'settings') { navigation.navigate('Settings'); }
          else if (tab === 'notes') { navigation.navigate('NotesPage'); }
          else if (tab === 'audio') { navigation.navigate('Audio'); }
          else if (tab === 'paint') { navigation.navigate('Drawing'); }
        }}
      />
    </>
  );
};

export default HomePage;
