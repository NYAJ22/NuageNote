// screens/HomeScreen.tsx
import React from 'react';
import { ScrollView, View } from 'react-native';
import ActionButton from '../components/ActionButton';
import RecentNotes from '../components/RecentNotes';
import { styles } from '../styles';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Définit les types de routes
type RootStackParamList = {
  AudioPage: undefined;
  AudioScreen: undefined;
};

const AudioPage = () => {
   const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <ActionButton
            icon="🎤"
            title="Enregistrement Audio"
            subtitle="Créer une note Vocale"
            onPress={() => navigation.navigate('AudioScreen')}
          />
        </View>

        <RecentNotes />
      </ScrollView>
    </>
  );
};

export default AudioPage;
