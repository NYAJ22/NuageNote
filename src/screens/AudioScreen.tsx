import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Alert,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Modal,
  Animated,
} from 'react-native';
import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
} from 'react-native-audio-recorder-player';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const STORAGE_KEY = 'notes';

interface Note {
  id: number;
  title: string;
  content: string;
  date: string;
  type: 'text' | 'audio';
  url?: string;
  duration?: string;
  color?: string;
  tags?: string[];
}

const audioRecorderPlayer = new AudioRecorderPlayer();

const NotesScreen: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [recording, setRecording] = useState(false);
  const [recordedUri, setRecordedUri] = useState<string | undefined>();
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [recordingTime, setRecordingTime] = useState('00:00');
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackPosition, setPlaybackPosition] = useState('00:00');
  const [playbackDuration, setPlaybackDuration] = useState('00:00');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [recordingAnimation] = useState(new Animated.Value(1));

  // Charger les notes au montage
  useEffect(() => {
    const loadNotes = async () => {
      try {
        const data = await AsyncStorage.getItem(STORAGE_KEY);
        if (data) {
          setNotes(JSON.parse(data));
        }
      } catch (error) {
        console.error('Erreur chargement notes:', error);
      }
    };
    loadNotes();
  }, []);

  // Animation pour l'enregistrement
  useEffect(() => {
    let animation: Animated.CompositeAnimation;
    if (recording) {
      animation = Animated.loop(
        Animated.sequence([
          Animated.timing(recordingAnimation, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(recordingAnimation, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();
    }
    return () => {
      if (animation) {
        animation.stop();
      }
    };
  }, [recording, recordingAnimation]);

  // Démarrer l'enregistrement
  const startRecording = async () => {
    try {
      const audioSet = {
        AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
        AudioSourceAndroid: AudioSourceAndroidType.MIC,
        AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
        AVNumberOfChannelsKeyIOS: 2,
        AVFormatIDKeyIOS: AVEncodingOption.aac,
      };
      audioRecorderPlayer.addRecordBackListener((e) => {
        const time = audioRecorderPlayer.mmssss(Math.floor(e.currentPosition));
        setRecordingTime(time.substring(0, 5));
      });
      const result = await audioRecorderPlayer.startRecorder(undefined, audioSet, true);
      setRecording(true);
      console.log('Recording started:', result);
    } catch (error) {
      console.error('Erreur enregistrement:', error);
      Alert.alert('Erreur', "Impossible de démarrer l'enregistrement");
    }
  };

  // Arrêter l'enregistrement
  const stopRecording = async () => {
    try {
      const uri = await audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();
      setRecording(false);
      setRecordedUri(uri);
      setRecordingTime('00:00');
      console.log('Recording saved to:', uri);
    } catch (error) {
      console.error('Erreur arrêt enregistrement:', error);
      Alert.alert('Erreur', "Impossible d'arrêter l'enregistrement");
    }
  };

  // Lecture audio
  const playAudio = async (uri: string, noteId: number) => {
    try {
      if (isPlaying) {
        await stopAudio();
        if (playingId === noteId) {
          return;
        }
      }
      audioRecorderPlayer.addPlayBackListener((e) => {
        if (e.currentPosition === e.duration) {
          stopAudio();
        }
        setPlaybackPosition(audioRecorderPlayer.mmss(Math.floor(e.currentPosition)));
        setPlaybackDuration(audioRecorderPlayer.mmss(Math.floor(e.duration)));
      });
      await audioRecorderPlayer.startPlayer(uri);
      setIsPlaying(true);
      setPlayingId(noteId);
    } catch (error) {
      console.error('Erreur lecture audio:', error);
      Alert.alert('Erreur', "Impossible de lire l'audio");
    }
  };

  // Arrêter la lecture audio
  const stopAudio = async () => {
    try {
      await audioRecorderPlayer.stopPlayer();
      audioRecorderPlayer.removePlayBackListener();
      setIsPlaying(false);
      setPlayingId(null);
      setPlaybackPosition('00:00');
    } catch (error) {
      console.error('Erreur arrêt lecture:', error);
    }
  };

  // Ajouter une nouvelle note et la sauvegarder dans AsyncStorage
  const handleAddNote = async () => {
    if (!newNote.title.trim() && !newNote.content.trim() && !recordedUri) {
      Alert.alert('Information manquante', 'Veuillez ajouter du texte ou enregistrer une note vocale.');
      return;
    }

    const now = new Date();
    const note: Note = {
      id: Date.now(),
      title: newNote.title.trim() || 'Note vocale',
      content: newNote.content.trim(),
      date: now.toISOString(),
      type: recordedUri ? 'audio' : 'text',
      url: recordedUri,
      duration: recordingTime !== '00:00' ? recordingTime : undefined,
      color: undefined,
      tags: [],
    };

    try {
      const storedNotes = await AsyncStorage.getItem(STORAGE_KEY);
      let notesArray: Note[] = [];
      if (storedNotes) {
        notesArray = JSON.parse(storedNotes);
      }
      notesArray.unshift(note);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(notesArray));
      setNotes(notesArray);
      setNewNote({ title: '', content: '' });
      setRecordedUri(undefined);
      setRecordingTime('00:00');
      Alert.alert('Succès', 'Note ajoutée avec succès !');
    } catch (error) {
      Alert.alert('Erreur', "Impossible d'enregistrer la note");
      console.error('Erreur sauvegarde note:', error);
    }
  };

  // Supprimer une note (et la retirer du stockage)
  const handleDeleteNote = async (id: number) => {
    Alert.alert(
      'Confirmation',
      'Êtes-vous sûr de vouloir supprimer cette note ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          onPress: async () => {
            if (playingId === id) {
              await stopAudio();
            }
            const newNotes = notes.filter(note => note.id !== id);
            setNotes(newNotes);
            setIsModalVisible(false);
            try {
              await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newNotes));
            } catch (error) {
              console.error('Erreur suppression note:', error);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  // Formater la date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Ouvrir le modal de détail d'une note
  const openNoteDetail = (note: Note) => {
    setSelectedNote(note);
    setIsModalVisible(true);
  };

  // Rendu d'un élément de la liste
  const renderNote = ({ item }: { item: Note }) => (
    <TouchableOpacity style={styles.noteItem} onPress={() => openNoteDetail(item)}>
      <View style={styles.noteHeader}>
        <Text style={styles.noteTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.noteDate}>{formatDate(item.date)}</Text>
      </View>
      {item.content ? (
        <Text style={styles.noteContent} numberOfLines={2}>
          {item.content}
        </Text>
      ) : null}
      {item.type === 'audio' && item.url && (
        <View style={styles.audioContainer}>
          <Icon name="microphone" size={18} color="#3B82F6" />
          {item.duration && <Text style={styles.audioDuration}>{item.duration}</Text>}
          <TouchableOpacity
            style={[
              styles.audioButton,
              playingId === item.id && isPlaying ? styles.audioButtonPlaying : null,
            ]}
            onPress={() =>
              playingId === item.id && isPlaying
                ? stopAudio()
                : playAudio(item.url!, item.id)
            }
          >
            <Icon
              name={playingId === item.id && isPlaying ? 'stop' : 'play'}
              size={20}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );

  // Modal de détail d'une note
  const renderNoteDetailModal = () => (
    <Modal
      visible={isModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setIsModalVisible(false)}
    >
      {selectedNote && (
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedNote.title}</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Icon name="close" size={24} color="#111827" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalDate}>
              Créée le {formatDate(selectedNote.date)}
            </Text>

            {selectedNote.content ? (
              <Text style={styles.modalContentText}>{selectedNote.content}</Text>
            ) : (
              <Text style={styles.noContentText}>Pas de contenu textuel</Text>
            )}

            {selectedNote.type === 'audio' && selectedNote.url && (
              <View style={styles.modalAudioContainer}>
                <View style={styles.audioPlayerContainer}>
                  <TouchableOpacity
                    style={[
                      styles.audioPlayerButton,
                      playingId === selectedNote.id && isPlaying
                        ? styles.audioButtonPlaying
                        : null,
                    ]}
                    onPress={() =>
                      playingId === selectedNote.id && isPlaying
                        ? stopAudio()
                        : playAudio(selectedNote.url!, selectedNote.id)
                    }
                  >
                    <Icon
                      name={playingId === selectedNote.id && isPlaying ? 'stop' : 'play'}
                      size={28}
                      color="#FFFFFF"
                    />
                  </TouchableOpacity>
                  <View style={styles.audioProgressContainer}>
                    <Text style={styles.audioTimestamp}>
                      {playingId === selectedNote.id
                        ? `${playbackPosition} / ${playbackDuration}`
                        : selectedNote.duration || '00:00'}
                    </Text>
                    <Text style={styles.audioLabel}>Enregistrement audio</Text>
                  </View>
                </View>
              </View>
            )}

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteNote(selectedNote.id)}
              >
                <Icon name="delete" size={20} color="#FFFFFF" />
                <Text style={styles.deleteButtonText}>Supprimer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </Modal>
  );

  // Rendu principal
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#F3F4F6" barStyle="dark-content" />
      <View style={styles.container}>
        <Text style={styles.header}>📝 Carnet de Notes</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Titre de la note"
            placeholderTextColor="#9CA3AF"
            value={newNote.title}
            onChangeText={text => setNewNote({ ...newNote, title: text })}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Contenu (optionnel)"
            placeholderTextColor="#9CA3AF"
            value={newNote.content}
            onChangeText={text => setNewNote({ ...newNote, content: text })}
            multiline
          />

          <View style={styles.recordingSection}>
            {recording ? (
              <View style={styles.recordingInfo}>
                <Animated.View
                  style={[
                    styles.recordingIndicator,
                    { transform: [{ scale: recordingAnimation }] },
                  ]}
                />
                <Text style={styles.recordingTimeText}>{recordingTime}</Text>
                <Text style={styles.recordingLabel}>Enregistrement en cours...</Text>
              </View>
            ) : recordedUri ? (
              <View style={styles.recordingComplete}>
                <Icon name="check-circle" size={24} color="#10B981" />
                <Text style={styles.recordingCompleteText}>Audio prêt</Text>
              </View>
            ) : null}

            <TouchableOpacity
              style={[
                styles.actionButton,
                recording ? styles.stopButton : styles.recordButton,
              ]}
              onPress={recording ? stopRecording : startRecording}
            >
              <Icon
                name={recording ? 'stop' : 'microphone'}
                size={24}
                color="#FFFFFF"
              />
              <Text style={styles.buttonText}>
                {recording ? 'Arrêter' : 'Enregistrer une note vocale'}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.saveButton,
              (!newNote.title.trim() && !newNote.content.trim() && !recordedUri)
                ? styles.disabledButton
                : null,
            ]}
            onPress={handleAddNote}
            disabled={!newNote.title.trim() && !newNote.content.trim() && !recordedUri}
          >
            <Icon name="content-save" size={24} color="#FFFFFF" />
            <Text style={styles.buttonText}>Enregistrer la note</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.notesListContainer}>
          <Text style={styles.sectionTitle}>Mes notes ({notes.length})</Text>
          <FlatList
            data={notes}
            keyExtractor={item => item.id.toString()}
            renderItem={renderNote}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.notesList}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Icon name="notebook" size={60} color="#D1D5DB" />
                <Text style={styles.emptyText}>Aucune note disponible.</Text>
                <Text style={styles.emptySubText}>
                  Ajoutez votre première note ci-dessus !
                </Text>
              </View>
            }
          />
        </View>

        {renderNoteDetailModal()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 16,
    textAlign: 'center',
    color: '#111827',
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
    color: '#111827',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  recordingSection: {
    marginVertical: 8,
  },
  recordingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#FEF2F2',
    padding: 12,
    borderRadius: 12,
  },
  recordingIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#EF4444',
    marginRight: 8,
  },
  recordingTimeText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  recordingLabel: {
    color: '#B91C1C',
    fontSize: 14,
  },
  recordingComplete: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#ECFDF5',
    padding: 12,
    borderRadius: 12,
  },
  recordingCompleteText: {
    color: '#10B981',
    fontSize: 16,
    marginLeft: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
  recordButton: {
    backgroundColor: '#10B981',
  },
  stopButton: {
    backgroundColor: '#EF4444',
  },
  saveButton: {
    backgroundColor: '#3B82F6',
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  notesListContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#374151',
  },
  notesList: {
    paddingBottom: 16,
  },
  noteItem: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 12,
    borderRadius: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    flex: 1,
  },
  noteDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  noteContent: {
    fontSize: 15,
    color: '#374151',
    marginBottom: 10,
  },
  audioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    padding: 10,
    borderRadius: 12,
  },
  audioDuration: {
    fontSize: 14,
    color: '#3B82F6',
    marginLeft: 8,
    marginRight: 'auto',
  },
  audioButton: {
    backgroundColor: '#3B82F6',
    padding: 8,
    borderRadius: 20,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  audioButtonPlaying: {
    backgroundColor: '#EF4444',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 12,
    fontWeight: 'bold',
  },
  emptySubText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
    flex: 1,
  },
  modalDate: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  modalContentText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 20,
  },
  noContentText: {
    fontSize: 16,
    color: '#9CA3AF',
    fontStyle: 'italic',
    marginBottom: 20,
  },
  modalAudioContainer: {
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  audioPlayerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  audioPlayerButton: {
    backgroundColor: '#3B82F6',
    padding: 12,
    borderRadius: 30,
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  audioProgressContainer: {
    flex: 1,
  },
  audioTimestamp: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E40AF',
    marginBottom: 4,
  },
  audioLabel: {
    fontSize: 14,
    color: '#3B82F6',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF4444',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default NotesScreen;
