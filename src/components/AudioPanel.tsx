
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { addAudioTrack, updateAudioTrack, removeAudioTrack, selectAudioTrack } from '../store/audioSlice';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Upload, VolumeX, Volume2, Trash2 } from 'lucide-react';
import { generateRandomId } from '../utils/fileUtils';
import { toast } from '../hooks/use-toast';

const AudioPanel: React.FC = () => {
  const dispatch = useDispatch();
  const { tracks, selectedTrackId } = useSelector((state: RootState) => state.audio);
  const [isExpanded, setIsExpanded] = useState(true);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (!file.type.startsWith('audio/')) {
        toast({
          title: "Invalid file type",
          description: "Please upload an audio file",
          variant: "destructive",
        });
        return;
      }
      
      const audioURL = URL.createObjectURL(file);
      const audio = new Audio(audioURL);
      
      audio.onloadedmetadata = () => {
        dispatch(addAudioTrack({
          id: generateRandomId(),
          name: file.name,
          src: audioURL,
          startTime: 0,
          duration: audio.duration,
          volume: 1,
          isMuted: false
        }));
        
        toast({
          title: "Audio track added",
          description: `${file.name} (${Math.round(audio.duration)}s)`,
        });
      };
      
      audio.onerror = () => {
        toast({
          title: "Error loading audio",
          description: "The audio file could not be processed",
          variant: "destructive",
        });
      };
    }
  };
  
  const handleVolumeChange = (trackId: string, volume: number) => {
    dispatch(updateAudioTrack({
      id: trackId,
      track: { volume: volume / 100 }
    }));
  };
  
  const toggleMute = (trackId: string, isMuted: boolean) => {
    dispatch(updateAudioTrack({
      id: trackId,
      track: { isMuted: !isMuted }
    }));
  };
  
  const removeTrack = (trackId: string) => {
    dispatch(removeAudioTrack(trackId));
    toast({
      title: "Audio track removed",
    });
  };
  
  const selectTrack = (trackId: string) => {
    dispatch(selectAudioTrack(trackId));
  };

  return (
    <Card className="border border-white/10 bg-black/30 backdrop-blur-md">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Audio Tracks</h3>
          
          <Button
            size="sm"
            className="bg-ember hover:bg-ember-light"
            onClick={() => audioInputRef.current?.click()}
          >
            <Upload size={16} className="mr-2" />
            Add Audio
          </Button>
          
          <input
            type="file"
            ref={audioInputRef}
            className="hidden"
            accept="audio/*"
            onChange={handleAudioUpload}
          />
        </div>
        
        <div className="space-y-3">
          {tracks.length === 0 ? (
            <div className="text-center py-4 text-gray-400">
              No audio tracks added
            </div>
          ) : (
            tracks.map(track => (
              <div 
                key={track.id} 
                className={`p-3 rounded-md transition-colors ${
                  selectedTrackId === track.id 
                    ? 'bg-ember bg-opacity-20 neon-border' 
                    : 'bg-black/20 hover:bg-black/30'
                }`}
                onClick={() => selectTrack(track.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-white truncate max-w-[200px]">
                    {track.name}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 text-gray-400 hover:text-white"
                      onClick={() => toggleMute(track.id, track.isMuted)}
                    >
                      {track.isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    </Button>
                    
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 text-gray-400 hover:text-destructive"
                      onClick={() => removeTrack(track.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="w-full h-8 waveform-bg rounded-md" />
                </div>
                
                <div className="mt-2">
                  <Slider 
                    value={[track.isMuted ? 0 : track.volume * 100]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) => handleVolumeChange(track.id, value[0])}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AudioPanel;
