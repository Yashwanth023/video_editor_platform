
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { 
  addTextOverlay, 
  updateTextOverlay, 
  removeTextOverlay 
} from '../store/overlaysSlice';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Slider } from './ui/slider';
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Trash2, 
  Plus 
} from 'lucide-react';
import { generateRandomId } from '../utils/fileUtils';
import { toast } from '../hooks/use-toast';

const TextOverlayEditor: React.FC = () => {
  const dispatch = useDispatch();
  const { textOverlays, selectedOverlayId, selectedOverlayType } = useSelector((state: RootState) => state.overlays);
  const { currentTime, duration } = useSelector((state: RootState) => state.video);
  
  const [newText, setNewText] = useState('');
  
  const selectedTextOverlay = selectedOverlayType === 'text' ? 
    textOverlays.find(overlay => overlay.id === selectedOverlayId) : null;
  
  const handleAddText = () => {
    if (!newText.trim()) {
      toast({
        title: "Please enter text",
        variant: "destructive",
      });
      return;
    }
    
    const newOverlay = {
      id: generateRandomId(),
      text: newText,
      startTime: currentTime,
      endTime: currentTime + 5 > duration ? duration : currentTime + 5,
      position: { x: 50, y: 50 },
      style: {
        fontFamily: 'Arial',
        fontSize: 24,
        color: '#FFFFFF',
        bold: false,
        italic: false,
        underline: false,
      },
    };
    
    dispatch(addTextOverlay(newOverlay));
    setNewText('');
    
    toast({
      title: "Text overlay added",
    });
  };
  
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedTextOverlay) {
      dispatch(updateTextOverlay({
        id: selectedTextOverlay.id,
        overlay: { text: e.target.value }
      }));
    } else {
      setNewText(e.target.value);
    }
  };
  
  const handleFontSizeChange = (value: number[]) => {
    if (selectedTextOverlay) {
      dispatch(updateTextOverlay({
        id: selectedTextOverlay.id,
        overlay: { 
          style: { 
            ...selectedTextOverlay.style, 
            fontSize: value[0]
          } 
        }
      }));
    }
  };
  
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedTextOverlay) {
      dispatch(updateTextOverlay({
        id: selectedTextOverlay.id,
        overlay: { 
          style: { 
            ...selectedTextOverlay.style, 
            color: e.target.value
          } 
        }
      }));
    }
  };
  
  const toggleStyle = (style: 'bold' | 'italic' | 'underline') => {
    if (selectedTextOverlay) {
      dispatch(updateTextOverlay({
        id: selectedTextOverlay.id,
        overlay: { 
          style: { 
            ...selectedTextOverlay.style, 
            [style]: !selectedTextOverlay.style[style]
          } 
        }
      }));
    }
  };
  
  const handleRemoveText = () => {
    if (selectedTextOverlay) {
      dispatch(removeTextOverlay(selectedTextOverlay.id));
      toast({
        title: "Text overlay removed",
      });
    }
  };
  
  return (
    <Card className="border border-white/10 bg-black/30 backdrop-blur-md">
      <CardContent className="p-4">
        <Tabs defaultValue="add">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="add">Add Text</TabsTrigger>
            <TabsTrigger value="edit" disabled={!selectedTextOverlay}>Edit Text</TabsTrigger>
          </TabsList>
          
          <TabsContent value="add">
            <div className="space-y-4">
              <div>
                <Label htmlFor="new-text">Text Content</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="new-text"
                    value={newText}
                    onChange={e => setNewText(e.target.value)}
                    placeholder="Enter text..."
                    className="bg-black/20"
                  />
                  
                  <Button 
                    className="bg-ember hover:bg-ember-light"
                    onClick={handleAddText}
                  >
                    <Plus size={16} className="mr-2" />
                    Add
                  </Button>
                </div>
              </div>
              
              <div className="text-sm text-gray-400">
                <p>Text will be added at the current playhead position.</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="edit">
            {selectedTextOverlay && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-text">Text Content</Label>
                  <Input
                    id="edit-text"
                    value={selectedTextOverlay.text}
                    onChange={handleTextChange}
                    className="bg-black/20 mb-2"
                  />
                </div>
                
                <div>
                  <Label>Font Size: {selectedTextOverlay.style.fontSize}px</Label>
                  <Slider
                    value={[selectedTextOverlay.style.fontSize]}
                    min={12}
                    max={72}
                    step={1}
                    onValueChange={handleFontSizeChange}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="text-color">Text Color</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      id="text-color"
                      type="color"
                      value={selectedTextOverlay.style.color}
                      onChange={handleColorChange}
                      className="w-12 h-8 p-1 bg-black/20"
                    />
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant={selectedTextOverlay.style.bold ? "default" : "outline"}
                        className={`h-8 w-8 ${selectedTextOverlay.style.bold ? 'bg-ember' : ''}`}
                        onClick={() => toggleStyle('bold')}
                      >
                        <Bold size={16} />
                      </Button>
                      
                      <Button
                        size="icon"
                        variant={selectedTextOverlay.style.italic ? "default" : "outline"}
                        className={`h-8 w-8 ${selectedTextOverlay.style.italic ? 'bg-ember' : ''}`}
                        onClick={() => toggleStyle('italic')}
                      >
                        <Italic size={16} />
                      </Button>
                      
                      <Button
                        size="icon"
                        variant={selectedTextOverlay.style.underline ? "default" : "outline"}
                        className={`h-8 w-8 ${selectedTextOverlay.style.underline ? 'bg-ember' : ''}`}
                        onClick={() => toggleStyle('underline')}
                      >
                        <Underline size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="pt-2">
                  <Button 
                    variant="destructive"
                    onClick={handleRemoveText}
                  >
                    <Trash2 size={16} className="mr-2" />
                    Remove Text
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TextOverlayEditor;
