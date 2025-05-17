
// components/ToolsBar.tsx - Barre d'outils
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../types/constants';

export type ToolsBarProps = {
  onUndo: () => void;
  onClear: () => void;
  onSave: () => void;
  toggleEraser: () => void;
  isErasing: boolean;
  isEditing: boolean;
};

export const ToolsBar: React.FC<ToolsBarProps> = ({
  onUndo,
  onClear,
  onSave,
  toggleEraser,
  isErasing,
  isEditing,
}) => {
  return (
    <View style={toolsBarStyles.container}>
      <TouchableOpacity onPress={onUndo} style={toolsBarStyles.button}>
        <Icon name="undo" size={24} color={COLORS.white} />
        <Text style={toolsBarStyles.buttonText}>Annuler</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={toggleEraser}
        style={[
          toolsBarStyles.button,
          isErasing ? toolsBarStyles.activeButton : null,
        ]}
      >
        <Icon name={isErasing ? 'edit' : 'brush'} size={24} color={COLORS.white} />
        <Text style={toolsBarStyles.buttonText}>{isErasing ? 'Dessiner' : 'Gomme'}</Text>
      </TouchableOpacity>

      {/* Eraser size options removed because ERASER_SIZES is not available */}

      <TouchableOpacity
        onPress={onClear}
        style={[toolsBarStyles.button, toolsBarStyles.clearButton]}
      >
        <Icon name="clear" size={24} color={COLORS.white} />
        <Text style={toolsBarStyles.buttonText}>Effacer</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onSave}
        style={[toolsBarStyles.button, toolsBarStyles.saveButton]}
      >
        <Icon name="save" size={24} color={COLORS.white} />
        <Text style={toolsBarStyles.buttonText}>{isEditing ? 'Mettre à jour' : 'Enregistrer'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const toolsBarStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 12,
    backgroundColor: COLORS.dark,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.black,
  },
  button: {
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
  },
  activeButton: {
    backgroundColor: COLORS.secondary,
  },
  buttonText: {
    fontSize: 12,
    color: COLORS.white,
    marginTop: 4,
    fontWeight: '500',
  },
  eraserSizeContainer: {
    flexDirection: 'row',
  },
  eraserSizeButton: {
    backgroundColor: COLORS.darkSecondary,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginHorizontal: 2,
    borderRadius: 6,
  },
  eraserSizeButtonActive: {
    backgroundColor: COLORS.primary,
  },
  eraserSizeText: {
    fontSize: 12,
    color: COLORS.white,
    fontWeight: '500',
  },
  clearButton: {
    backgroundColor: COLORS.warningDark,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButton: {
    backgroundColor: COLORS.secondaryDark,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
});
