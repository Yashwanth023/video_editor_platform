
import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  setVideoUrl, 
  setIsUploading, 
  setUploadProgress, 
  setDuration,
  setThumbnail 
} from '../store/videoSlice';
import { addClip } from '../store/timelineSlice';
import { RootState } from '../store/store';
import { Card, CardContent } from './ui/card';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { Upload, Video, X } from 'lucide-react';
import { generateThumbnail, generateRandomId } from '../utils/fileUtils';
import { toast } from '../hooks/use-toast';

const VideoUploader: React.FC = () => {
  const dispatch = useDispatch();
  const { videoUrl, isUploading, uploadProgress } = useSelector((state: RootState) => state.video);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleRemoveVideo = () => {
    dispatch(setVideoUrl(null));
    dispatch(setDuration(0));
    dispatch(setThumbnail(null));
  };

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('video/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a video file",
        variant: "destructive",
      });
      return;
    }

    dispatch(setIsUploading(true));
    dispatch(setUploadProgress(0));

    // Simulate upload progress
    const intervalId = setInterval(() => {
      dispatch(setUploadProgress((prev) => {
        const newProgress = prev + 5;
        if (newProgress >= 100) {
          clearInterval(intervalId);
          return 100;
        }
        return newProgress;
      }));
    }, 100);

    // Process the video
    try {
      const videoURL = URL.createObjectURL(file);
      const thumbnail = await generateThumbnail(file);
      
      // Get video duration
      const video = document.createElement('video');
      video.src = videoURL;
      
      video.onloadedmetadata = () => {
        const duration = video.duration;
        dispatch(setDuration(duration));
        dispatch(setVideoUrl(videoURL));
        dispatch(setThumbnail(thumbnail));
        dispatch(setIsUploading(false));
        
        // Add to timeline
        dispatch(addClip({
          id: generateRandomId(),
          type: 'video',
          startTime: 0,
          endTime: duration,
          originalStart: 0,
          originalEnd: duration,
          src: videoURL,
          name: file.name,
        }));

        toast({
          title: "Video uploaded successfully",
          description: `Duration: ${Math.round(duration)}s`,
        });
      };
      
      video.onerror = () => {
        clearInterval(intervalId);
        dispatch(setIsUploading(false));
        toast({
          title: "Error processing video",
          description: "Please try another file",
          variant: "destructive",
        });
      };
    } catch (error) {
      clearInterval(intervalId);
      dispatch(setIsUploading(false));
      toast({
        title: "Upload failed",
        description: "An error occurred during upload",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className={`border border-white/10 bg-black/30 backdrop-blur-md overflow-hidden transition-all ${isDragging ? 'neon-border' : ''}`}>
      <CardContent className="p-4">
        {videoUrl ? (
          <div className="relative">
            <video 
              src={videoUrl} 
              className="w-full h-48 object-cover rounded-md" 
              controls
            />
            <Button 
              size="icon"
              variant="destructive" 
              className="absolute top-2 right-2" 
              onClick={handleRemoveVideo}
            >
              <X size={16} />
            </Button>
          </div>
        ) : (
          <div
            className={`h-48 flex flex-col items-center justify-center border-2 border-dashed rounded-md transition-colors ${
              isDragging ? 'border-ember bg-black/50' : 'border-gray-600 bg-black/20'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Video className="mb-2 text-ember-light" size={32} />
            <p className="text-gray-400 mb-2">Drag & drop video file here</p>
            <Button
              className="bg-ember hover:bg-ember-light transition-colors"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              <Upload size={18} className="mr-2" />
              Browse Files
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="video/*"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </div>
        )}

        {isUploading && (
          <div className="mt-4">
            <p className="text-sm text-gray-400 mb-2">Uploading... {uploadProgress}%</p>
            <Progress value={uploadProgress} className="h-2 bg-gray-700">
              <div 
                className="h-full bg-gradient-to-r from-glow-blue to-ember-light rounded-md"
                style={{ width: `${uploadProgress}%` }}
              />
            </Progress>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VideoUploader;
