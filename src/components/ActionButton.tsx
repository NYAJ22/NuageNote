// components/ActionButton.tsx
import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { styles } from '../styles';

interface ActionButtonProps {
  icon: string;
  title: string;
  subtitle: string;
  onPress: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({ icon, title, subtitle, onPress }) => {
  return (
    <TouchableOpacity style={styles.actionButton} onPress={onPress}>
      <View style={styles.buttonIconContainer}>
        <Text style={styles.buttonIcon}>{icon}</Text>
      </View>
      <View style={styles.buttonTextContainer}>
        <Text style={styles.actionButtonText}>{title}</Text>
        <Text style={styles.actionButtonSubtext}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ActionButton;
