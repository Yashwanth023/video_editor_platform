
import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Upload, X } from 'lucide-react';
import { 
  setVideoUrl, 
  setIsUploading, 
  setUploadProgress, 
  setDuration, 
  setThumbnail 
} from '../store/videoSlice';
import { AppDispatch } from '../store/store';
import { toast } from '../hooks/use-toast';

const VideoUploader: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploadingState] = useState(false);
  const [uploadProgress, setUploadProgressState] = useState(0);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files[0]);
    }
  };

  const handleFiles = (file: File) => {
    if (file.type.startsWith('video/')) {
      setVideoFile(file);
      setIsUploadingState(true);
      dispatch(setIsUploading(true));
      dispatch(setUploadProgress(0));

      // Simulate file upload progress
      let progress = 0;
      const interval = setInterval(() => {
        dispatch((dispatch) => {
          progress += 5;
          setUploadProgressState(progress);
          dispatch(setUploadProgress(progress));
          
          if (progress >= 100) {
            clearInterval(interval);
            
            // Create object URL from the file
            const objectUrl = URL.createObjectURL(file);
            dispatch(setVideoUrl(objectUrl));
            
            // Create a video element to get duration and create thumbnail
            const video = document.createElement('video');
            video.src = objectUrl;
            
            video.onloadedmetadata = () => {
              dispatch(setDuration(video.duration));
              
              // Create thumbnail at 0.5 seconds
              video.currentTime = 0.5;
              
              video.onseeked = () => {
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                
                const ctx = canvas.getContext('2d');
                if (ctx) {
                  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                  const thumbnailUrl = canvas.toDataURL();
                  dispatch(setThumbnail(thumbnailUrl));
                }
              };
            };
            
            video.onerror = () => {
              toast({
                title: "Error",
                description: "Failed to load video metadata",
                variant: "destructive"
              });
              URL.revokeObjectURL(objectUrl);
              dispatch(setVideoUrl(null));
            };
            
            setIsUploadingState(false);
            dispatch(setIsUploading(false));
            
            toast({
              title: "Upload complete",
              description: `${file.name} has been uploaded successfully.`
            });
          }
        });
      }, 150);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a video file",
        variant: "destructive"
      });
    }
  };

  const cancelUpload = () => {
    setVideoFile(null);
    setIsUploadingState(false);
    setUploadProgressState(0);
    dispatch(setIsUploading(false));
    dispatch(setUploadProgress(0));
  };

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Card className="border border-white/10 bg-black/30 backdrop-blur-md">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Add Media</h3>
        </div>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="video/*"
          className="hidden"
        />
        
        {isUploading ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300 truncate max-w-[200px]">
                {videoFile?.name}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-400 hover:text-white"
                onClick={cancelUpload}
              >
                <X size={16} />
              </Button>
            </div>
            
            <div>
              <span className="text-xs text-gray-400 mb-1 block">
                Uploading... {uploadProgress}%
              </span>
              <Progress value={uploadProgress} className="h-2 bg-gray-700">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-md"
                  style={{ width: `${uploadProgress}%` }}
                />
              </Progress>
            </div>
          </div>
        ) : (
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragActive
                ? 'border-purple-500 bg-purple-500/10'
                : 'border-gray-700 hover:border-gray-600'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={openFileDialog}
          >
            <Upload className="mx-auto h-10 w-10 text-gray-400 mb-2" />
            <p className="text-sm text-gray-300">
              Drag & drop a video file here, or click to browse
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Supports MP4, WebM, MOV formats
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VideoUploader;
