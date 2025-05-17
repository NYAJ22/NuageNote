
// hooks/useNotes.ts - Hook pour gérer les notes
import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { STORAGE_KEY } from '../types/constants';
import type { Note } from '../types/Note';

export const useNotes = (noteId?: number) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [note, setNote] = useState<Note | null>(null);

  const loadNote = useCallback(async () => {
    if (!noteId) {
      return null;
    }
    try {
      setIsLoading(true);
      const storedNotes = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedNotes) {
        const notesArray = JSON.parse(storedNotes) as Note[];
        const existingNote = notesArray.find(n => Number(n.id) === Number(noteId));
        if (existingNote) {
          setNote(existingNote);
          return existingNote;
        }
      }
      return null;
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de charger le dessin existant.');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [noteId]);

  const saveNote = useCallback(async (noteData: Omit<Note, 'id' | 'date'>, isEditing = false) => {
    try {
      setIsLoading(true);
      const storedNotes = await AsyncStorage.getItem(STORAGE_KEY);
      const notes: Note[] = storedNotes ? JSON.parse(storedNotes) : [];
      const formatDate = () => {
        const now = new Date();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        return `${now.toLocaleDateString()} ${now.getHours()}:${minutes}`;
      };
      const newNote: Note = {
        id: isEditing && noteId ? String(noteId) : String(Date.now()),
        ...noteData,
        date: formatDate(),
      };
      const updatedNotes = isEditing && noteId
        ? notes.map(n => (n.id === String(noteId) ? newNote : n))
        : [newNote, ...notes];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
      return newNote;
    } catch (error) {
      Alert.alert('Erreur', "Impossible d'enregistrer la note.");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [noteId]);

  return { note, loadNote, saveNote, isLoading };
};
