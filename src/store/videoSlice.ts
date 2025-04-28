
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface VideoState {
  videoUrl: string | null;
  isUploading: boolean;
  uploadProgress: number;
  duration: number;
  currentTime: number;
  isPlaying: boolean;
  thumbnail: string | null;
}

const initialState: VideoState = {
  videoUrl: null,
  isUploading: false,
  uploadProgress: 0,
  duration: 0,
  currentTime: 0,
  isPlaying: false,
  thumbnail: null,
};

export const videoSlice = createSlice({
  name: 'video',
  initialState,
  reducers: {
    setVideoUrl: (state, action: PayloadAction<string | null>) => {
      state.videoUrl = action.payload;
    },
    setIsUploading: (state, action: PayloadAction<boolean>) => {
      state.isUploading = action.payload;
    },
    setUploadProgress: (state, action: PayloadAction<number>) => {
      state.uploadProgress = action.payload;
    },
    setDuration: (state, action: PayloadAction<number>) => {
      state.duration = action.payload;
    },
    setCurrentTime: (state, action: PayloadAction<number>) => {
      state.currentTime = action.payload;
    },
    setIsPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
    setThumbnail: (state, action: PayloadAction<string | null>) => {
      state.thumbnail = action.payload;
    },
  },
});

export const {
  setVideoUrl,
  setIsUploading,
  setUploadProgress,
  setDuration,
  setCurrentTime,
  setIsPlaying,
  setThumbnail,
} = videoSlice.actions;

export default videoSlice.reducer;
