// App.tsx
import React from 'react';
import { SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { styles } from './src/styles';

const App = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <AppNavigator /> {/* ✅ Navigation globale ici */}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default App;
