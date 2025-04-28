
import React, { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { setCurrentTime, setIsPlaying, setDuration } from '../store/videoSlice';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Play, Pause, SkipBack, Volume2, VolumeX } from 'lucide-react';
import { formatTime } from '../utils/fileUtils';
import { TextOverlay } from './overlays/TextOverlay';
import { ImageOverlay } from './overlays/ImageOverlay';

const VideoPreview: React.FC = () => {
  const dispatch = useDispatch();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { videoUrl, isPlaying, currentTime, duration } = useSelector((state: RootState) => state.video);
  const textOverlays = useSelector((state: RootState) => state.overlays.textOverlays);
  const imageOverlays = useSelector((state: RootState) => state.overlays.imageOverlays);
  const { mainVolume, isMuted } = useSelector((state: RootState) => state.audio);

  // Play/Pause control
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Volume control
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = isMuted ? 0 : mainVolume;
    }
  }, [mainVolume, isMuted]);

  // Update current time
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      dispatch(setCurrentTime(videoRef.current.currentTime));
    }
  };

  const handlePlayPause = () => {
    dispatch(setIsPlaying(!isPlaying));
  };

  const handleSeek = (value: number[]) => {
    const newTime = value[0];
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      dispatch(setCurrentTime(newTime));
    }
  };

  const handleRewind = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      dispatch(setCurrentTime(0));
    }
  };

  const handleVolumeToggle = () => {
    dispatch({ type: 'audio/toggleMute', payload: !isMuted });
  };

  // Get visible overlays for current time
  const visibleTextOverlays = textOverlays.filter(
    overlay => currentTime >= overlay.startTime && currentTime <= overlay.endTime
  );

  const visibleImageOverlays = imageOverlays.filter(
    overlay => currentTime >= overlay.startTime && currentTime <= overlay.endTime
  );

  return (
    <Card className="border border-white/10 bg-black/30 backdrop-blur-md overflow-hidden">
      <CardContent className="p-4">
        <div className="relative" ref={containerRef}>
          {videoUrl ? (
            <video
              ref={videoRef}
              src={videoUrl}
              className="w-full aspect-video object-contain bg-black rounded-md"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={() => {
                if (videoRef.current) {
                  dispatch(setDuration(videoRef.current.duration));
                }
              }}
              onEnded={() => dispatch(setIsPlaying(false))}
            />
          ) : (
            <div className="w-full aspect-video bg-black/50 rounded-md flex items-center justify-center">
              <p className="text-gray-400">No video loaded</p>
            </div>
          )}
          
          {/* Render overlays */}
          <div className="absolute inset-0 pointer-events-none">
            {visibleTextOverlays.map(overlay => (
              <TextOverlay key={overlay.id} overlay={overlay} containerRef={containerRef} />
            ))}
            
            {visibleImageOverlays.map(overlay => (
              <ImageOverlay key={overlay.id} overlay={overlay} containerRef={containerRef} />
            ))}
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">{formatTime(currentTime)}</span>
            <span className="text-sm text-gray-400">{formatTime(duration)}</span>
          </div>
          
          <Slider
            value={[currentTime]}
            min={0}
            max={duration || 100}
            step={0.01}
            onValueChange={handleSeek}
            disabled={!videoUrl}
            className="mb-4"
          />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="ghost"
                className="text-gray-400 hover:text-white"
                onClick={handleRewind}
                disabled={!videoUrl}
              >
                <SkipBack size={20} />
              </Button>
              
              <Button
                size="icon"
                className="bg-ember hover:bg-ember-light text-white rounded-full w-10 h-10"
                onClick={handlePlayPause}
                disabled={!videoUrl}
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </Button>
              
              <Button
                size="icon"
                variant="ghost"
                className="text-gray-400 hover:text-white"
                onClick={handleVolumeToggle}
                disabled={!videoUrl}
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </Button>
            </div>
            
            <div className="w-24">
              <Slider
                value={[isMuted ? 0 : mainVolume * 100]}
                min={0}
                max={100}
                step={1}
                onValueChange={(value) => {
                  const newVolume = value[0] / 100;
                  dispatch({ type: 'audio/setMainVolume', payload: newVolume });
                  if (newVolume > 0 && isMuted) {
                    dispatch({ type: 'audio/toggleMute', payload: false });
                  }
                }}
                disabled={!videoUrl}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoPreview;
