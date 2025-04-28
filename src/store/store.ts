
import { configureStore } from '@reduxjs/toolkit';
import videoReducer from './videoSlice';
import timelineReducer from './timelineSlice';
import audioReducer from './audioSlice';
import overlaysReducer from './overlaysSlice';
import projectReducer from './projectSlice';

export const store = configureStore({
  reducer: {
    video: videoReducer,
    timeline: timelineReducer,
    audio: audioReducer,
    overlays: overlaysReducer,
    project: projectReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
