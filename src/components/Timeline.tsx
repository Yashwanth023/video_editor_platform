
import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { setZoom, selectClip, TimelineClip, reorderClips } from '../store/timelineSlice';
import { setCurrentTime } from '../store/videoSlice';
import { Card, CardContent } from './ui/card';
import { Slider } from './ui/slider';
import { formatTime } from '../utils/fileUtils';
import { ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from './ui/button';

const Timeline: React.FC = () => {
  const dispatch = useDispatch();
  const timelineRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedClipId, setDraggedClipId] = useState<string | null>(null);

  const { clips, zoom, selectedClipId } = useSelector((state: RootState) => state.timeline);
  const { duration, currentTime } = useSelector((state: RootState) => state.video);

  const handleZoomChange = (value: number[]) => {
    dispatch(setZoom(value[0]));
  };

  const handleZoomIn = () => {
    dispatch(setZoom(Math.min(zoom + 0.5, 5)));
  };

  const handleZoomOut = () => {
    dispatch(setZoom(Math.max(zoom - 0.5, 1)));
  };

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current || !duration) return;
    
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const timelineWidth = rect.width;
    const clickedTime = (x / timelineWidth) * duration;
    
    dispatch(setCurrentTime(clickedTime));
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, clipId: string) => {
    e.dataTransfer.setData('clipId', clipId);
    setDraggedClipId(clipId);
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
    e.preventDefault();
    const sourceClipId = e.dataTransfer.getData('clipId');
    
    if (sourceClipId && sourceClipId !== clips[targetIndex].id) {
      const sourceIndex = clips.findIndex(clip => clip.id === sourceClipId);
      
      if (sourceIndex !== -1) {
        // Create new array and reorder clips
        const newClips = [...clips];
        const [movedClip] = newClips.splice(sourceIndex, 1);
        newClips.splice(targetIndex, 0, movedClip);
        
        dispatch(reorderClips(newClips));
      }
    }
    
    setIsDragging(false);
    setDraggedClipId(null);
  };

  const handleClipClick = (clipId: string) => {
    dispatch(selectClip(clipId));
  };

  // Calculate the position of the playhead based on current time
  const playheadPosition = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <Card className="border border-white/10 bg-black/30 backdrop-blur-md overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Timeline</h3>
          
          <div className="flex items-center gap-2">
            <Button 
              size="icon" 
              variant="ghost"
              className="text-gray-400 hover:text-white"
              onClick={handleZoomOut}
            >
              <ZoomOut size={18} />
            </Button>
            
            <div className="w-32">
              <Slider
                value={[zoom]}
                min={1}
                max={5}
                step={0.1}
                onValueChange={handleZoomChange}
              />
            </div>
            
            <Button 
              size="icon" 
              variant="ghost"
              className="text-gray-400 hover:text-white"
              onClick={handleZoomIn}
            >
              <ZoomIn size={18} />
            </Button>
          </div>
        </div>
        
        <div className="relative">
          {/* Timeline ruler */}
          <div className="h-6 border-b border-gray-700 flex">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex-1 border-l border-gray-700 text-xs text-gray-400 pl-1">
                {formatTime(i * (duration / 10))}
              </div>
            ))}
          </div>
          
          {/* Timeline content */}
          <div 
            ref={timelineRef} 
            className="h-24 relative timeline-grid mt-1"
            onClick={handleTimelineClick}
          >
            {/* Playhead */}
            <div 
              className="absolute top-0 bottom-0 w-0.5 bg-ember z-10"
              style={{ left: `${playheadPosition}%` }}
            >
              <div className="w-3 h-3 bg-ember transform -translate-x-1 -translate-y-1 rotate-45" />
            </div>
            
            {/* Clips */}
            <div className="relative h-full">
              {clips.map((clip, index) => {
                const clipStart = (clip.startTime / duration) * 100;
                const clipWidth = ((clip.endTime - clip.startTime) / duration) * 100;
                
                return (
                  <div
                    key={clip.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, clip.id)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                    className={`absolute h-16 rounded cursor-grab ${
                      selectedClipId === clip.id
                        ? 'ring-2 ring-ember-light'
                        : isDragging && draggedClipId === clip.id
                        ? 'opacity-50'
                        : ''
                    }`}
                    style={{
                      left: `${clipStart * zoom}%`,
                      width: `${clipWidth * zoom}%`,
                      top: index * 20 + '%',
                      background: clip.type === 'video' 
                        ? 'linear-gradient(45deg, #1a1a2e, #4a4a6e)'
                        : 'linear-gradient(45deg, #2e1a2e, #6e4a6e)',
                      borderLeft: '4px solid #8B5CF6'
                    }}
                    onClick={() => handleClipClick(clip.id)}
                  >
                    <div className="p-2 text-xs text-white truncate">
                      {clip.name}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Timeline;
