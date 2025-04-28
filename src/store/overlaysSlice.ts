
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface TextOverlay {
  id: string;
  text: string;
  startTime: number;
  endTime: number;
  position: { x: number; y: number };
  style: {
    fontFamily: string;
    fontSize: number;
    color: string;
    bold: boolean;
    italic: boolean;
    underline: boolean;
  };
}

export interface ImageOverlay {
  id: string;
  src: string;
  startTime: number;
  endTime: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
  style: {
    opacity: number;
    borderColor?: string;
    borderWidth?: number;
  };
}

export interface OverlaysState {
  textOverlays: TextOverlay[];
  imageOverlays: ImageOverlay[];
  selectedOverlayId: string | null;
  selectedOverlayType: 'text' | 'image' | null;
}

const initialState: OverlaysState = {
  textOverlays: [],
  imageOverlays: [],
  selectedOverlayId: null,
  selectedOverlayType: null,
};

export const overlaysSlice = createSlice({
  name: 'overlays',
  initialState,
  reducers: {
    addTextOverlay: (state, action: PayloadAction<TextOverlay>) => {
      state.textOverlays.push(action.payload);
    },
    updateTextOverlay: (state, action: PayloadAction<{ id: string; overlay: Partial<TextOverlay> }>) => {
      const index = state.textOverlays.findIndex(overlay => overlay.id === action.payload.id);
      if (index !== -1) {
        state.textOverlays[index] = { ...state.textOverlays[index], ...action.payload.overlay };
      }
    },
    removeTextOverlay: (state, action: PayloadAction<string>) => {
      state.textOverlays = state.textOverlays.filter(overlay => overlay.id !== action.payload);
    },
    addImageOverlay: (state, action: PayloadAction<ImageOverlay>) => {
      state.imageOverlays.push(action.payload);
    },
    updateImageOverlay: (state, action: PayloadAction<{ id: string; overlay: Partial<ImageOverlay> }>) => {
      const index = state.imageOverlays.findIndex(overlay => overlay.id === action.payload.id);
      if (index !== -1) {
        state.imageOverlays[index] = { ...state.imageOverlays[index], ...action.payload.overlay };
      }
    },
    removeImageOverlay: (state, action: PayloadAction<string>) => {
      state.imageOverlays = state.imageOverlays.filter(overlay => overlay.id !== action.payload);
    },
    selectOverlay: (state, action: PayloadAction<{ id: string; type: 'text' | 'image' } | null>) => {
      if (action.payload === null) {
        state.selectedOverlayId = null;
        state.selectedOverlayType = null;
      } else {
        state.selectedOverlayId = action.payload.id;
        state.selectedOverlayType = action.payload.type;
      }
    },
  },
});

export const {
  addTextOverlay,
  updateTextOverlay,
  removeTextOverlay,
  addImageOverlay,
  updateImageOverlay,
  removeImageOverlay,
  selectOverlay,
} = overlaysSlice.actions;

export default overlaysSlice.reducer;
