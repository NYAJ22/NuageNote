// hooks/useDrawing.ts - Hook pour gérer le dessin
import { COLORS } from '../types/constants';
import { useState as reactUseState } from 'react';

// Define or import ERASER_SIZES
const ERASER_SIZES = [
  { label: 'Small', value: 5 },
  { label: 'Medium', value: 10 },
  { label: 'Large', value: 20 },
];

// ...your hook implementation
function useDrawing(/* ... */) {
  const [_penColor, _setPenColor] = useState<string>(COLORS.black);
  const [_isErasing, _setIsErasing] = useState<boolean>(false);
  const [_eraserSize, _setEraserSize] = useState<number>(ERASER_SIZES[1].value);

  // hook logic
}

export { useDrawing };
function useState<T>(initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
    return reactUseState(initialValue);
}

