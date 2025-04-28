
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ProjectState {
  name: string;
  isRendering: boolean;
  renderProgress: number;
  isExporting: boolean;
  exportUrl: string | null;
  resolution: { width: number; height: number };
  framerate: number;
  isDirty: boolean;
}

const initialState: ProjectState = {
  name: 'Untitled Project',
  isRendering: false,
  renderProgress: 0,
  isExporting: false,
  exportUrl: null,
  resolution: { width: 1920, height: 1080 },
  framerate: 30,
  isDirty: false,
};

export const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setProjectName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
      state.isDirty = true;
    },
    setIsRendering: (state, action: PayloadAction<boolean>) => {
      state.isRendering = action.payload;
    },
    setRenderProgress: (state, action: PayloadAction<number>) => {
      state.renderProgress = action.payload;
    },
    setIsExporting: (state, action: PayloadAction<boolean>) => {
      state.isExporting = action.payload;
    },
    setExportUrl: (state, action: PayloadAction<string | null>) => {
      state.exportUrl = action.payload;
    },
    setResolution: (state, action: PayloadAction<{ width: number; height: number }>) => {
      state.resolution = action.payload;
      state.isDirty = true;
    },
    setFramerate: (state, action: PayloadAction<number>) => {
      state.framerate = action.payload;
      state.isDirty = true;
    },
    setIsDirty: (state, action: PayloadAction<boolean>) => {
      state.isDirty = action.payload;
    },
  },
});

export const {
  setProjectName,
  setIsRendering,
  setRenderProgress,
  setIsExporting,
  setExportUrl,
  setResolution,
  setFramerate,
  setIsDirty,
} = projectSlice.actions;

export default projectSlice.reducer;
