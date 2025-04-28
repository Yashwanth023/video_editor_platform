
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface TimelineClip {
  id: string;
  type: 'video' | 'audio';
  startTime: number;
  endTime: number;
  originalStart: number;
  originalEnd: number;
  src: string;
  name: string;
}

export interface TimelineState {
  clips: TimelineClip[];
  selectedClipId: string | null;
  zoom: number;
}

const initialState: TimelineState = {
  clips: [],
  selectedClipId: null,
  zoom: 1,
};

export const timelineSlice = createSlice({
  name: 'timeline',
  initialState,
  reducers: {
    addClip: (state, action: PayloadAction<TimelineClip>) => {
      state.clips.push(action.payload);
    },
    updateClip: (state, action: PayloadAction<{ id: string; clip: Partial<TimelineClip> }>) => {
      const index = state.clips.findIndex(clip => clip.id === action.payload.id);
      if (index !== -1) {
        state.clips[index] = { ...state.clips[index], ...action.payload.clip };
      }
    },
    removeClip: (state, action: PayloadAction<string>) => {
      state.clips = state.clips.filter(clip => clip.id !== action.payload);
    },
    selectClip: (state, action: PayloadAction<string | null>) => {
      state.selectedClipId = action.payload;
    },
    reorderClips: (state, action: PayloadAction<TimelineClip[]>) => {
      state.clips = action.payload;
    },
    setZoom: (state, action: PayloadAction<number>) => {
      state.zoom = action.payload;
    },
  },
});

export const {
  addClip,
  updateClip,
  removeClip,
  selectClip,
  reorderClips,
  setZoom,
} = timelineSlice.actions;

export default timelineSlice.reducer;
