
import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { 
  addImageOverlay, 
  updateImageOverlay, 
  removeImageOverlay 
} from '../store/overlaysSlice';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Upload, Image as ImageIcon, Trash2 } from 'lucide-react';
import { generateRandomId } from '../utils/fileUtils';
import { toast } from '../hooks/use-toast';

const ImageOverlayEditor: React.FC = () => {
  const dispatch = useDispatch();
  const { imageOverlays, selectedOverlayId, selectedOverlayType } = useSelector((state: RootState) => state.overlays);
  const { currentTime, duration } = useSelector((state: RootState) => state.video);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const selectedImageOverlay = selectedOverlayType === 'image' ? 
    imageOverlays.find(overlay => overlay.id === selectedOverlayId) : null;
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file",
          variant: "destructive",
        });
        return;
      }
      
      const imageUrl = URL.createObjectURL(file);
      const img = new Image();
      
      img.onload = () => {
        const aspectRatio = img.width / img.height;
        const width = 200;
        const height = width / aspectRatio;
        
        dispatch(addImageOverlay({
          id: generateRandomId(),
          src: imageUrl,
          startTime: currentTime,
          endTime: currentTime + 5 > duration ? duration : currentTime + 5,
          position: { x: 50, y: 50 },
          size: { width, height },
          style: {
            opacity: 1,
            borderColor: '#ffffff',
            borderWidth: 0
          }
        }));
        
        toast({
          title: "Image overlay added",
          description: file.name
        });
      };
      
      img.src = imageUrl;
    }
  };
  
  const handleOpacityChange = (value: number[]) => {
    if (selectedImageOverlay) {
      dispatch(updateImageOverlay({
        id: selectedImageOverlay.id,
        overlay: { 
          style: { 
            ...selectedImageOverlay.style, 
            opacity: value[0] / 100
          } 
        }
      }));
    }
  };
  
  const handleBorderWidthChange = (value: number[]) => {
    if (selectedImageOverlay) {
      dispatch(updateImageOverlay({
        id: selectedImageOverlay.id,
        overlay: { 
          style: { 
            ...selectedImageOverlay.style, 
            borderWidth: value[0]
          } 
        }
      }));
    }
  };
  
  const handleBorderColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedImageOverlay) {
      dispatch(updateImageOverlay({
        id: selectedImageOverlay.id,
        overlay: { 
          style: { 
            ...selectedImageOverlay.style, 
            borderColor: e.target.value
          } 
        }
      }));
    }
  };
  
  const handleRemoveImage = () => {
    if (selectedImageOverlay) {
      dispatch(removeImageOverlay(selectedImageOverlay.id));
      toast({
        title: "Image overlay removed",
      });
    }
  };

  return (
    <Card className="border border-white/10 bg-black/30 backdrop-blur-md">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Image Overlay</h3>
          
          <Button
            size="sm"
            className="bg-ember hover:bg-ember-light"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={16} className="mr-2" />
            Add Image
          </Button>
          
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleImageUpload}
          />
        </div>
        
        {selectedImageOverlay ? (
          <div className="space-y-4">
            <div className="flex justify-center mb-4">
              <img 
                src={selectedImageOverlay.src} 
                alt="Selected overlay" 
                className="max-h-32 border border-gray-600"
                style={{ 
                  opacity: selectedImageOverlay.style.opacity,
                  borderWidth: selectedImageOverlay.style.borderWidth || 0,
                  borderColor: selectedImageOverlay.style.borderColor
                }}
              />
            </div>
            
            <div>
              <Label>Opacity: {Math.round(selectedImageOverlay.style.opacity * 100)}%</Label>
              <Slider
                value={[selectedImageOverlay.style.opacity * 100]}
                min={10}
                max={100}
                step={1}
                onValueChange={handleOpacityChange}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label>Border Width: {selectedImageOverlay.style.borderWidth || 0}px</Label>
              <Slider
                value={[selectedImageOverlay.style.borderWidth || 0]}
                min={0}
                max={10}
                step={1}
                onValueChange={handleBorderWidthChange}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="border-color">Border Color</Label>
              <Input
                id="border-color"
                type="color"
                value={selectedImageOverlay.style.borderColor}
                onChange={handleBorderColorChange}
                className="w-full h-8 mt-1 bg-black/20"
                disabled={!selectedImageOverlay.style.borderWidth}
              />
            </div>
            
            <div className="pt-2">
              <Button 
                variant="destructive"
                onClick={handleRemoveImage}
              >
                <Trash2 size={16} className="mr-2" />
                Remove Image
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-gray-400">
            <ImageIcon size={32} className="mb-2" />
            <p>No image overlay selected</p>
            <p className="text-sm mt-2">Upload an image or select one from the timeline</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImageOverlayEditor;
