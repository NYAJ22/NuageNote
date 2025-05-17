import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  BackHandler,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import Signature from 'react-native-signature-canvas';
import Icon from 'react-native-vector-icons/MaterialIcons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Types pour la navigation et les paramètres
type RootStackParamList = {
  Notes: undefined;
  Drawing: { noteId?: number; initialDrawing?: string };
};

type DrawingScreenRouteProp = RouteProp<RootStackParamList, 'Drawing'>;
type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

const STORAGE_KEY = 'notes';

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

const DrawingScreen: React.FC = () => {
  const signatureRef = useRef<any>(null);
  const [penColor, setPenColor] = useState<string>('black');
  const [isErasing, setIsErasing] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('Dessin');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [initialSignature, setInitialSignature] = useState<string | null>(null);

  const navigation = useNavigation<NavigationProps>();
  const route = useRoute<DrawingScreenRouteProp>();
  const { noteId } = route.params || {};

  const loadExistingDrawing = React.useCallback(async () => {
    try {
      const storedNotes = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedNotes) {
        const notesArray = JSON.parse(storedNotes) as Note[];
        const existingNote = notesArray.find(note => note.id === noteId);
        if (existingNote) {
          setTitle(existingNote.title);
          setInitialSignature(existingNote.content); // Charger le dataURL
          console.log('Dessin existant chargé:', existingNote.content);
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement du dessin:', error);
      Alert.alert('Erreur', 'Impossible de charger le dessin existant.');
    }
  }, [noteId]);

  const handleBackPress = React.useCallback(() => {
    Alert.alert(
      'Annuler',
      'Voulez-vous quitter sans enregistrer votre dessin ?',
      [
        { text: 'Continuer à dessiner', style: 'cancel' },
        { text: 'Quitter', style: 'destructive', onPress: () => navigation.goBack() },
      ]
    );
    return true;
  }, [navigation]);

  useEffect(() => {
    if (noteId) {
      setIsEditing(true);
      loadExistingDrawing();
    }
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => backHandler.remove();
  }, [noteId, loadExistingDrawing, handleBackPress]);

  // Synchroniser la couleur du stylo avec le canvas
  useEffect(() => {
    if (signatureRef.current) {
      const color = isErasing ? 'white' : penColor;
      signatureRef.current.changePenColor(color);
      console.log('Couleur du stylo changée:', color);
    }
  }, [penColor, isErasing]);

  const toggleEraser = () => {
    setIsErasing(!isErasing);
    console.log('Mode gomme:', !isErasing);
  };

  const formatDate = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const handleOK = async (signature: string) => {
    try {
      if (!signature) {
        Alert.alert('Erreur', 'Aucun dessin à enregistrer.');
        return;
      }
      const storedNotes = await AsyncStorage.getItem(STORAGE_KEY);
      const notes: Note[] = storedNotes ? JSON.parse(storedNotes) : [];
      const newNote: Note = {
        id: isEditing ? noteId! : Date.now(),
        title: title,
        content: signature,
        date: formatDate(),
        type: 'drawing',
      };
      let updatedNotes: Note[];
      if (isEditing) {
        updatedNotes = notes.map(note =>
          note.id === noteId ? newNote : note
        );
        Alert.alert('Succès', 'Dessin mis à jour avec succès.');
      } else {
        updatedNotes = [newNote, ...notes];
        Alert.alert('Succès', 'Dessin enregistré comme note.');
      }
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
      console.log('Dessin sauvegardé:', signature);
      navigation.goBack();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la note :", error);
      Alert.alert('Erreur', "Impossible d'enregistrer le dessin.");
    }
  };

  const handleSave = () => {
    signatureRef.current?.readSignature();
  };

  const handleEmpty = () => {
    Alert.alert('Erreur', 'Aucun dessin détecté.');
  };

  const handleClear = () => {
    Alert.alert(
      'Confirmation',
      'Êtes-vous sûr de vouloir effacer le dessin ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Effacer',
          style: 'destructive',
          onPress: () => signatureRef.current?.clearSignature(),
        },
      ]
    );
  };

  const handleUndo = () => {
    signatureRef.current?.undo();
  };

  const webStyle = `
    .m-signature-pad--footer { display: none; }
    body, html { 
      height: 100%; 
      background-color: white;
    }
    .m-signature-pad--body {
      border: none;
    }
    .m-signature-pad {
      box-shadow: none;
      border: none;
    }
  `;

  const renderFooter = () => (
    <View style={styles.bottomBar}>
      <TouchableOpacity onPress={handleUndo} style={styles.bottomButton}>
        <Icon name="undo" size={24} color="#fff" />
        <Text style={styles.bottomText}>Annuler</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={toggleEraser}
        style={[styles.bottomButton, isErasing ? styles.eraserButtonActive : styles.eraserButton]}
      >
        <Icon name="brush" size={24} color="#fff" />
        <Text style={styles.bottomText}>{isErasing ? 'Dessiner' : 'Gomme'}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleClear}
        style={[styles.bottomButton, styles.clearButton]}
      >
        <Icon name="clear" size={24} color="#fff" />
        <Text style={styles.bottomText}>Effacer</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleSave}
        style={[styles.bottomButton, styles.saveButton]}
      >
        <Icon name="save" size={24} color="#fff" />
        <Text style={styles.bottomText}>{isEditing ? 'Mettre à jour' : 'Enregistrer'}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBackPress}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>
          {isEditing ? 'Modifier le dessin' : 'Nouveau dessin'}
        </Text>
        <View style={styles.actions}>
          <TouchableOpacity onPress={handleUndo} style={styles.actionButton}>
            <Icon name="undo" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleClear} style={styles.actionButton}>
            <Icon name="delete" size={24} color="#e74c3c" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.colorPalette}>
        {['black', 'red', 'blue', 'green', 'purple', 'orange'].map((color) => (
          <TouchableOpacity
            key={color}
            style={[
              styles.colorButton,
              { backgroundColor: color },
              penColor === color && !isErasing && styles.selectedColor,
            ]}
            onPress={() => {
              setPenColor(color);
              setIsErasing(false);
            }}
          />
        ))}
      </View>

      <Signature
        ref={signatureRef}
        onOK={handleOK}
        onEmpty={handleEmpty}
        descriptionText=""
        clearText=""
        confirmText=""
        webStyle={webStyle}
        autoClear={false}
        backgroundColor="white"
        penColor={isErasing ? 'white' : penColor}
        imageType="image/svg+xml"
        dataURL={initialSignature ?? undefined}
        style={styles.signature}
      />

      {renderFooter()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  signature: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: {
    paddingRight: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: 16,
    padding: 5,
  },
  colorPalette: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  colorButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  selectedColor: {
    borderColor: '#000',
    borderWidth: 3,
    transform: [{ scale: 1.2 }],
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  bottomButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 8,
    minWidth: 100,
    justifyContent: 'center',
  },
  bottomText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '600',
  },
  eraserButton: {
    backgroundColor: '#666',
  },
  eraserButtonActive: {
    backgroundColor: '#999',
  },
  clearButton: {
    backgroundColor: '#c0392b',
  },
  saveButton: {
    backgroundColor: '#27ae60',
  },
});

export default DrawingScreen;
