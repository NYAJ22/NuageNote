import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Modal, Alert, StyleSheet, StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';

interface Note {
  id: number;
  title: string;
  content: string;
  date: string;
  type: 'text' | 'drawing' | 'audio';
  url?: string;
  color?: string;
  tags?: string[];
}

const STORAGE_KEY = 'notes';

const NotesScreen: React.FC = () => {
  const route = useRoute<any>();
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadNotes();
  }, []);

  useEffect(() => {
    const { noteId } = route.params || {};
    if (noteId && notes.length > 0) {
      const note = notes.find(n => n.id === noteId);
      if (note) {
        setEditingNote(note);
        setModalVisible(true);
      }
    }
  }, [route.params, notes]);

  const saveNotes = async (updatedNotes: Note[]) => {
    try {
      const serializedNotes = JSON.stringify(updatedNotes);
      await AsyncStorage.setItem(STORAGE_KEY, serializedNotes);
      console.log('Notes sauvegardées avec succès:', updatedNotes);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des notes:', error);
      Alert.alert('Erreur', 'Impossible de sauvegarder les notes. Vérifiez l\'espace de stockage.');
    }
  };

  const loadNotes = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsedNotes: Note[] = JSON.parse(data);
        setNotes(parsedNotes);
        console.log('Notes chargées dans NotesScreen:', parsedNotes);
      } else {
        console.log('Aucune note trouvée dans AsyncStorage.');
        setNotes([]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des notes:', error);
      Alert.alert('Erreur', 'Impossible de charger les notes.');
    }
  };

  const formatDate = () => {
    const now = new Date();
    return now.toISOString();
  };

  const handleAddNote = () => {
    if (!newNote.title.trim() || !newNote.content.trim()) {
      Alert.alert('Erreur', 'Titre et contenu obligatoires.');
      return;
    }
    const note: Note = {
      id: Date.now(),
      title: newNote.title,
      content: newNote.content,
      date: formatDate(),
      type: 'text',
    };
    const updatedNotes = [note, ...notes];
    setNotes(updatedNotes);
    saveNotes(updatedNotes);
    setNewNote({ title: '', content: '' });
    setModalVisible(false);
  };

  const handleEditNote = () => {
    if (!editingNote) {
      return;
    }
    if (!editingNote.title.trim() || !editingNote.content.trim()) {
      Alert.alert('Erreur', 'Titre et contenu obligatoires.');
      return;
    }
    const updatedNotes = notes.map(note =>
      note.id === editingNote.id
        ? { ...editingNote, date: formatDate(), type: 'text' as 'text' }
        : note
    );
    setNotes(updatedNotes);
    saveNotes(updatedNotes);
    setEditingNote(null);
    setModalVisible(false);
  };

  const openAddModal = () => {
    setEditingNote(null);
    setNewNote({ title: '', content: '' });
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mes Notes</Text>
      </View>

      <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingNote ? 'Modifier la note' : 'Nouvelle note'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeIcon}>×</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Titre"
              value={editingNote ? editingNote.title : newNote.title}
              onChangeText={(text) =>
                editingNote
                  ? setEditingNote({ ...editingNote, title: text })
                  : setNewNote({ ...newNote, title: text })
              }
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Contenu"
              multiline
              value={editingNote ? editingNote.content : newNote.content}
              onChangeText={(text) =>
                editingNote
                  ? setEditingNote({ ...editingNote, content: text })
                  : setNewNote({ ...newNote, content: text })
              }
            />
            <TouchableOpacity
              style={styles.saveButton}
              onPress={editingNote ? handleEditNote : handleAddNote}
            >
              <Text style={styles.saveButtonText}>
                {editingNote ? 'Mettre à jour' : 'Ajouter'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#ddd' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#007AFF',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  addButtonText: { fontSize: 32, color: '#fff', marginTop: -2 },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#00000088',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modalTitle: { fontSize: 18, fontWeight: 'bold' },
  closeIcon: { fontSize: 22, color: '#999' },
  input: {
    backgroundColor: '#F0F0F0',
    borderRadius: 6,
    padding: 12,
    marginTop: 12,
    fontSize: 16,
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  saveButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 14,
    marginTop: 20,
    alignItems: 'center',
  },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default NotesScreen;
