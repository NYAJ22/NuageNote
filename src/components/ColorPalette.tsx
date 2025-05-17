
// components/ColorPalette.tsx - Palette de couleurs
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, DRAWING_COLORS } from '../types/constants';

interface ColorPaletteProps {
  selectedColor: string;
  isErasing: boolean;
  onSelectColor: (color: string) => void;
}

export const ColorPalette: React.FC<ColorPaletteProps> = ({
  selectedColor,
  isErasing,
  onSelectColor,
}) => {
  return (
    <View style={colorPaletteStyles.colorPalette}>
        {DRAWING_COLORS.map((color: string) => (
            <TouchableOpacity
                key={color}
                style={[
                    colorPaletteStyles.colorButton,
                    { backgroundColor: color },
                    selectedColor === color && !isErasing && colorPaletteStyles.selectedColor,
                ]}
                onPress={() => onSelectColor(color)}
                accessibilityLabel={`Couleur ${color}`}
            />
        ))}
    </View>
  );
};

const colorPaletteStyles = StyleSheet.create({
  colorPalette: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightSecondary,
  },
  colorButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: COLORS.lightSecondary,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  selectedColor: {
    borderColor: COLORS.black,
    borderWidth: 3,
    transform: [{ scale: 1.1 }],
  },
});
