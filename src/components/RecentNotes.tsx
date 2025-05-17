import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { WebView } from 'react-native-webview';

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
const OLD_STORAGE_KEY = '@notes_list';

const RecentNote: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);

  const loadNotes = async () => {
    try {
      // Essayer de migrer les anciennes notes depuis @notes_list
      const oldData = await AsyncStorage.getItem(OLD_STORAGE_KEY);
      if (oldData) {
        const oldNotes: Note[] = JSON.parse(oldData);
        const migratedNotes: Note[] = oldNotes.map(note => ({
          ...note,
          type: note.type || 'text',
          date: note.date || new Date().toISOString(),
        }));
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(migratedNotes));
        await AsyncStorage.removeItem(OLD_STORAGE_KEY);
        console.log('Notes migrées depuis @notes_list:', migratedNotes);
        setNotes(migratedNotes);
        return;
      }

      // Charger les notes depuis la clé 'notes'
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsedNotes: Note[] = JSON.parse(data);
        setNotes(parsedNotes);
        console.log('Notes chargées:', parsedNotes);
      } else {
        console.log('Aucune note trouvée.');
        setNotes([]);
      }
    } catch (error) {
      console.error('Erreur de chargement des notes :', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadNotes();
    }, [])
  );

  const renderDrawing = (content: string) => {
    // Vérifier si content est un dataURL SVG valide
    if (!content || !content.startsWith('data:image/svg+xml;base64,')) {
      console.warn('Contenu SVG invalide:', content);
      return (
        <View style={styles.webviewContainer}>
          <Text style={styles.errorText}>Dessin non valide</Text>
        </View>
      );
    }

    // Extraire le contenu base64 et le décoder
    const base64Content = content.replace('data:image/svg+xml;base64,', '');
    let svgContent = '';
    try {
      svgContent = atob(base64Content);
    } catch (error) {
      console.error('Erreur de décodage base64:', error);
      return (
        <View style={styles.webviewContainer}>
          <Text style={styles.errorText}>Erreur de chargement du dessin</Text>
        </View>
      );
    }

    const html = `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <style>
            body, html {
              margin: 0; padding: 0; overflow: hidden; background: transparent;
            }
            svg {
              width: 100% !important;
              height: 100% !important;
              display: block;
            }
          </style>
        </head>
        <body>${svgContent}</body>
      </html>
    `;

    return (
      <View style={styles.webviewContainer}>
        <WebView
          originWhitelist={['*']}
          source={{ html }}
          style={styles.webview}
          scrollEnabled={false}
          automaticallyAdjustContentInsets={false}
        />
      </View>
    );
  };

  const renderItem = ({ item }: { item: Note }) => (
    <View style={styles.noteItem}>
      <Text style={styles.title}>{item.title}</Text>

      {item.type === 'drawing' ? (
        renderDrawing(item.content)
      ) : (
        <Text numberOfLines={2} style={styles.content}>
          {item.content}
        </Text>
      )}

      <Text style={styles.date}>{item.date}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notes récentes</Text>
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>Aucune note trouvée.</Text>}
      />
    </View>
  );
};

export default RecentNote;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  noteItem: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
  },
  title: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  content: { fontSize: 14, color: '#555', marginTop: 6 },
  date: { fontSize: 12, color: '#999', marginTop: 8 },
  empty: { textAlign: 'center', marginTop: 20, color: '#777' },
  webviewContainer: {
    height: 150,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  errorText: {
    fontSize: 14,
    color: '#e74c3c',
    textAlign: 'center',
    marginTop: 60,
  },
});
