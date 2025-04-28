
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AudioTrack {
  id: string;
  name: string;
  src: string;
  startTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
}

export interface AudioState {
  tracks: AudioTrack[];
  selectedTrackId: string | null;
  mainVolume: number;
  isMuted: boolean;
}

const initialState: AudioState = {
  tracks: [],
  selectedTrackId: null,
  mainVolume: 1,
  isMuted: false,
};

export const audioSlice = createSlice({
  name: 'audio',
  initialState,
  reducers: {
    addAudioTrack: (state, action: PayloadAction<AudioTrack>) => {
      state.tracks.push(action.payload);
    },
    updateAudioTrack: (state, action: PayloadAction<{ id: string; track: Partial<AudioTrack> }>) => {
      const index = state.tracks.findIndex(track => track.id === action.payload.id);
      if (index !== -1) {
        state.tracks[index] = { ...state.tracks[index], ...action.payload.track };
      }
    },
    removeAudioTrack: (state, action: PayloadAction<string>) => {
      state.tracks = state.tracks.filter(track => track.id !== action.payload);
    },
    selectAudioTrack: (state, action: PayloadAction<string | null>) => {
      state.selectedTrackId = action.payload;
    },
    setMainVolume: (state, action: PayloadAction<number>) => {
      state.mainVolume = action.payload;
    },
    toggleMute: (state, action: PayloadAction<boolean>) => {
      state.isMuted = action.payload;
    },
  },
});

export const {
  addAudioTrack,
  updateAudioTrack,
  removeAudioTrack,
  selectAudioTrack,
  setMainVolume,
  toggleMute,
} = audioSlice.actions;

export default audioSlice.reducer;
