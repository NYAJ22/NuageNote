import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  RefreshControl,
  TextInput,
  StatusBar,
  Share,
  StyleSheet,
  View,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { format, isValid } from 'date-fns';
import { fr } from 'date-fns/locale';

import { RootStackParamList } from '../navigation/AppNavigator';

const STORAGE_KEY = 'notes';

type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'AllNotes'>;

export type NoteType = 'text' | 'drawing' | 'audio';

export interface Note {
  id: number;
  title: string;
  content: string;
  date: string;
  type: NoteType;
  url?: string;
  color?: string;
  tags?: string[];
}

interface FilterButtonProps {
  label: string;
  value: 'all' | NoteType;
  isActive: boolean;
  onPress: () => void;
}

interface NoteItemProps {
  item: Note;
  onPress: (id: number, type: NoteType) => void;
  onLongPress: (id: number, title: string) => void;
  onShare: (note: Note) => void;
}

const FilterButton: React.FC<FilterButtonProps> = ({ label, value: _value, isActive, onPress }) => (
  <TouchableOpacity
    style={[styles.filterButton, isActive && styles.filterButtonActive]}
    onPress={onPress}
  >
    <Text style={isActive ? styles.filterTextActive : styles.filterText}>{label}</Text>
  </TouchableOpacity>
);

const NoteItem: React.FC<NoteItemProps> = React.memo(({ item, onPress, onLongPress, onShare }) => {
  const getIconForNoteType = (type: NoteType): string => {
    switch (type) {
      case 'audio': return '🎵';
      case 'drawing': return '🎨';
      default: return '📝';
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return isValid(date)
      ? format(date, 'dd MMM yyyy HH:mm', { locale: fr })
      : 'Date inconnue';
  };

  return (
    <TouchableOpacity
      style={[styles.noteItem, { backgroundColor: item.color || '#fff' }]}
      onPress={() => onPress(item.id, item.type)}
      onLongPress={() => onLongPress(item.id, item.title)}
      activeOpacity={0.7}
    >
      <View style={styles.rowCenter}>
        <Text style={styles.iconText}>{getIconForNoteType(item.type)}</Text>
        <View style={styles.flex1}>
          <Text style={styles.boldTitle} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.dateText}>{formatDate(item.date)}</Text>
          {item.type === 'audio' && <Text style={styles.audioNoteText}>Note vocale - Appuyez pour écouter</Text>}
          {item.type === 'text' && item.content && <Text style={styles.previewText} numberOfLines={2}>{item.content}</Text>}
          <TouchableOpacity onPress={() => onShare(item)} style={styles.shareButton}>
            <Text style={styles.shareText}>Partager 📤</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const EmptyNotesState: React.FC = () => (
  <View style={styles.emptyContainer}>
    <Text style={styles.emptyText}>Aucune note trouvée</Text>
    <Text style={styles.emptySubtext}>Créez une nouvelle note en utilisant le bouton + en bas de l'écran</Text>
  </View>
);

const Separator: React.FC = () => <View style={styles.separator} />;

const AllNotesScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProps>();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | NoteType>('all');

  const loadNotes = useCallback(async () => {
    try {
      const storedNotes = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedNotes) {
        const parsedNotes: Note[] = JSON.parse(storedNotes);
        const sortedNotes = parsedNotes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setNotes(sortedNotes);
      } else {
        setNotes([]);
      }
    } catch (error) {
      console.error('Failed to load notes:', error);
      Alert.alert('Erreur', 'Impossible de charger les notes.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { loadNotes(); }, [loadNotes]);

  useFocusEffect(
    useCallback(() => {
      loadNotes();
      return () => {};
    }, [loadNotes])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadNotes();
  }, [loadNotes]);

  const deleteNote = useCallback(async (noteId: number) => {
    try {
      const updated = notes.filter(note => note.id !== noteId);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setNotes(updated);
    } catch (error) {
      console.error('Failed to delete note:', error);
      Alert.alert('Erreur', 'Impossible de supprimer la note.');
    }
  }, [notes]);

  const confirmDelete = useCallback((noteId: number, title: string) => {
    Alert.alert(
      'Supprimer',
      `Supprimer la note "${title}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Supprimer', onPress: () => deleteNote(noteId), style: 'destructive' },
      ],
      { cancelable: true }
    );
  }, [deleteNote]);

  const shareNote = useCallback(async (note: Note) => {
    try {
      let message = `Titre : ${note.title}\nDate : ${note.date}`;
      if (note.type === 'text') {
        message += `\nContenu : ${note.content}`;
      }
      if ((note.type === 'audio' || note.type === 'drawing') && note.url) {
        message += `\nLien : ${note.url}`;
      }
      await Share.share({ message, title: `Partager la note : ${note.title}` });
    } catch (error) {
      console.error('Failed to share note:', error);
      Alert.alert('Erreur', 'Le partage a échoué.');
    }
  }, []);

  const navigateToNote = useCallback((noteId: number, type: NoteType) => {
    if (type === 'text') {
      navigation.navigate('TextNote', { noteId });
    } else if (type === 'drawing') {
      navigation.navigate('DrawingScreen', { noteId });
    } else if (type === 'audio') {
      navigation.navigate('AudioScreen', { noteId });
    }
  }, [navigation]);

  const filteredNotes = useMemo(() => {
    return notes.filter(note => {
      if (selectedFilter !== 'all' && note.type !== selectedFilter) {
        return false;
      }
      if (searchText) {
        const lower = searchText.toLowerCase();
        return (
          note.title.toLowerCase().includes(lower) ||
          (note.content?.toLowerCase().includes(lower) || false) ||
          (note.tags?.some(tag => tag.toLowerCase().includes(lower)) || false)
        );
      }
      return true;
    });
  }, [notes, selectedFilter, searchText]);

  if (loading) {
    return <View style={styles.centerContainer}><ActivityIndicator size="large" color="#3B82F6" /></View>;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'} backgroundColor="#3B82F6" />
      <View style={styles.filterRow}>
        <FilterButton label="Toutes" value="all" isActive={selectedFilter === 'all'} onPress={() => setSelectedFilter('all')} />
        <FilterButton label="Textes" value="text" isActive={selectedFilter === 'text'} onPress={() => setSelectedFilter('text')} />
        <FilterButton label="Dessins" value="drawing" isActive={selectedFilter === 'drawing'} onPress={() => setSelectedFilter('drawing')} />
        <FilterButton label="Audio" value="audio" isActive={selectedFilter === 'audio'} onPress={() => setSelectedFilter('audio')} />
      </View>
      <TextInput
        placeholder="Rechercher..."
        value={searchText}
        onChangeText={setSearchText}
        style={styles.searchInput}
        placeholderTextColor="#999"
        returnKeyType="search"
        clearButtonMode="while-editing"
      />
      <FlatList
        data={filteredNotes}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <NoteItem item={item} onPress={navigateToNote} onLongPress={confirmDelete} onShare={shareNote} />
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#3B82F6']} />}
        ListEmptyComponent={<EmptyNotesState />}
        ItemSeparatorComponent={Separator}
        contentContainerStyle={styles.flatListContent}
      />
    </SafeAreaView>
  );
};

export default AllNotesScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  filterRow: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10, backgroundColor: '#eee' },
  filterButton: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 12 },
  filterButtonActive: { backgroundColor: '#3B82F6' },
  filterText: { color: '#333' },
  filterTextActive: { color: '#fff' },
  searchInput: { backgroundColor: '#f0f0f0', margin: 10, borderRadius: 10, padding: 10 },
  noteItem: { padding: 12, borderRadius: 12, margin: 8, backgroundColor: '#fff', elevation: 2 },
  iconText: { fontSize: 24, marginRight: 10 },
  rowCenter: { flexDirection: 'row', alignItems: 'center' },
  flex1: { flex: 1 },
  boldTitle: { fontWeight: 'bold', fontSize: 16 },
  dateText: { fontSize: 12, color: '#555' },
  audioNoteText: { color: '#3B82F6', fontSize: 14 },
  previewText: { color: '#333', marginTop: 4 },
  shareButton: { marginTop: 8, alignSelf: 'flex-start' },
  shareText: { color: '#3B82F6' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  emptyText: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  emptySubtext: { fontSize: 14, textAlign: 'center', color: '#666' },
  separator: { height: 1, backgroundColor: '#ccc', marginHorizontal: 10 },
  flatListContent: { flexGrow: 1 },
});
