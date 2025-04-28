
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { setIsDirty } from '../store/projectSlice';
import Header from '../components/Header';
import VideoUploader from '../components/VideoUploader';
import VideoPreview from '../components/VideoPreview';
import Timeline from '../components/Timeline';
import AudioPanel from '../components/AudioPanel';
import TextOverlayEditor from '../components/TextOverlayEditor';
import ImageOverlayEditor from '../components/ImageOverlayEditor';
import ExportPanel from '../components/ExportPanel';
import { saveProjectToLocalStorage, loadProjectFromLocalStorage } from '../utils/fileUtils';

const VideoEditor: React.FC = () => {
  const dispatch = useDispatch();
  const state = useSelector((state: RootState) => state);
  
  // Save project to localStorage when state changes
  useEffect(() => {
    if (state.video.videoUrl) {
      saveProjectToLocalStorage({
        timeline: state.timeline,
        overlays: state.overlays,
        audio: state.audio,
        project: state.project
      });
    }
  }, [state]);
  
  // Load project from localStorage on mount
  useEffect(() => {
    const savedProject = loadProjectFromLocalStorage();
    if (savedProject) {
      // Restore project state from localStorage
      // This would be implemented with proper actions
      console.log('Project loaded from localStorage', savedProject);
      dispatch(setIsDirty(true));
    }
  }, [dispatch]);

  return (
    <div className="min-h-screen overflow-hidden">
      <Header />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4">
        {/* Main content area */}
        <div className="lg:col-span-8 space-y-4 animate-fade-in">
          <VideoPreview />
          <Timeline />
        </div>
        
        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-4 animate-slide-in-right">
          <VideoUploader />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
            <AudioPanel />
            <TextOverlayEditor />
            <ImageOverlayEditor />
            <ExportPanel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoEditor;
