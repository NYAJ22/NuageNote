// styles.ts
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#5D8AA8' },
  container: { flex: 1, backgroundColor: '#87CEEB' },
  headerContainer: {
    paddingHorizontal: 20, paddingTop: 15, paddingBottom: 10, backgroundColor: '#5D8AA8',
  },
  header: { fontSize: 24, fontWeight: 'bold', color: 'white', marginBottom: 4 },
  subHeader: { fontSize: 14, color: 'rgba(255,255,255,0.8)' },
  content: { padding: 20, paddingBottom: 80 },
  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#2A4B7C', marginBottom: 15, paddingLeft: 5 },
  actionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)', borderRadius: 12, padding: 15, marginBottom: 15,
    flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(42, 75, 124, 0.2)',
    shadowColor: '#2A4B7C', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
  },
  buttonIconContainer: {
    backgroundColor: 'rgba(42, 75, 124, 0.1)', borderRadius: 10, width: 50, height: 50,
    justifyContent: 'center', alignItems: 'center', marginRight: 15,
  },
  buttonIcon: { fontSize: 24 },
  buttonTextContainer: { flex: 1 },
  actionButtonText: { fontSize: 18, fontWeight: 'bold', color: '#2A4B7C', marginBottom: 3 },
  actionButtonSubtext: { fontSize: 14, color: '#555' },
  placeholderBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)', borderRadius: 10, padding: 30,
    justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(42, 75, 124, 0.1)', borderStyle: 'dashed',
  },
  placeholderText: { color: '#2A4B7C', fontSize: 16, opacity: 0.6 },
  tabBar: {
    flexDirection: 'row', height: 70, backgroundColor: '#5D8AA8',
    borderTopWidth: 1, borderTopColor: '#2A4B7C', position: 'absolute', bottom: 0, left: 0, right: 0,
  },
  tabItem: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 8 },
  activeTab: { backgroundColor: '#2A4B7C' },
  tabIcon: { fontSize: 20, marginBottom: 4 },
  tabText: { color: 'white', fontSize: 12, fontWeight: '500' },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  settingsContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 15,
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
  },
  deleteButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#ff4d4d',
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  aboutSection: {
    marginTop: 40,
    alignItems: 'center',
  },
  aboutText: {
    fontSize: 14,
    color: '#777',
    marginVertical: 2,
  },
});
