// src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomePage from '../Page/HomePage';
import NotesScreen from '../screens/NotesScreen';
import AllNotesScreen from '../screens/AllNotesScreen';
import DrawingScreen from '../screens/DrawingScreen';
import AudioScreen from '../screens/AudioScreen';
import NotesPage from '../Page/NotesPage';
import AudioPage from '../Page/AudioPage';
import DrawingPage from '../Page/DrawingPage';
import SettingsPage from '../Page/SettingsPage';

export type RootStackParamList = {
  Home: undefined;
  NotesPage: undefined;
  NotesScreen: undefined;
  Audio: undefined;
  Drawing: undefined;
  Settings: undefined;
  AllNotes: undefined;
  TextNote: { noteId: number };
  DrawingScreen: { noteId: number };
  AudioScreen: { noteId: number };

};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomePage} options={{ headerShown: false }} />
      <Stack.Screen name="NotesPage" component={NotesPage} options={{ title: 'Saisie texte' }} />
      <Stack.Screen name="NotesScreen" component={NotesScreen} options={{ title: 'Ajout de notes' }} />
      <Stack.Screen name="Audio" component={AudioPage} options={{ title: 'Audio' }} />
      <Stack.Screen name="AudioScreen" component={AudioScreen} options={{ title: 'Ajout vocal' }} />
      <Stack.Screen name="Drawing" component={DrawingPage} options={{ title: 'Dessin' }} />
      <Stack.Screen name="DrawingScreen" component={DrawingScreen} options={{ title: 'Ajout de dessin' }} />
      <Stack.Screen name="Settings" component={SettingsPage} options={{ title: 'Paramètres' }} />
       <Stack.Screen name="AllNotes" component={AllNotesScreen} options={{ title: 'Toutes les Notes' }} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
