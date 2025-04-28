
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { 
  setIsRendering, 
  setRenderProgress, 
  setIsExporting, 
  setExportUrl
} from '../store/projectSlice';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Progress } from './ui/progress';
import { Download } from 'lucide-react';
import { toast } from '../hooks/use-toast';

const ExportPanel: React.FC = () => {
  const dispatch = useDispatch();
  const { isRendering, renderProgress, isExporting, exportUrl } = useSelector((state: RootState) => state.project);
  const [exportFormat, setExportFormat] = useState('mp4');
  const [exportQuality, setExportQuality] = useState('high');
  
  const handleRender = () => {
    if (!isRendering) {
      dispatch(setIsRendering(true));
      dispatch(setRenderProgress(0));
      
      // Simulate rendering progress
      const intervalId = setInterval(() => {
        dispatch(setRenderProgress((prev) => {
          const newProgress = prev + 2;
          if (newProgress >= 100) {
            clearInterval(intervalId);
            
            setTimeout(() => {
              dispatch(setIsRendering(false));
              dispatch(setIsExporting(true));
              
              // Simulate export completion after a delay
              setTimeout(() => {
                dispatch(setIsExporting(false));
                dispatch(setExportUrl('video-export.mp4')); // Dummy URL
                
                toast({
                  title: "Export complete!",
                  description: "Your video has been successfully exported.",
                });
              }, 1500);
            }, 500);
            
            return 100;
          }
          return newProgress;
        }));
      }, 200);
    }
  };

  return (
    <Card className="border border-white/10 bg-black/30 backdrop-blur-md">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Export Video</h3>
        </div>
        
        <div className="space-y-4 mb-4">
          <div>
            <Label htmlFor="export-format">Format</Label>
            <Select 
              value={exportFormat} 
              onValueChange={setExportFormat}
            >
              <SelectTrigger id="export-format" className="bg-black/20 border-gray-700 mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="mp4">MP4 (H.264)</SelectItem>
                <SelectItem value="webm">WebM</SelectItem>
                <SelectItem value="mov">MOV (QuickTime)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="export-quality">Quality</Label>
            <Select 
              value={exportQuality} 
              onValueChange={setExportQuality}
            >
              <SelectTrigger id="export-quality" className="bg-black/20 border-gray-700 mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="low">Low (480p)</SelectItem>
                <SelectItem value="medium">Medium (720p)</SelectItem>
                <SelectItem value="high">High (1080p)</SelectItem>
                <SelectItem value="ultra">Ultra HD (4K)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {isRendering && (
          <div className="mb-4">
            <Label className="mb-2 block">Rendering... {renderProgress}%</Label>
            <Progress value={renderProgress} className="h-2 bg-gray-700">
              <div 
                className="h-full bg-gradient-to-r from-glow-blue to-ember-light rounded-md"
                style={{ width: `${renderProgress}%` }}
              />
            </Progress>
          </div>
        )}
        
        <div className="flex gap-2">
          <Button 
            className="flex-1 bg-ember hover:bg-ember-light"
            onClick={handleRender}
            disabled={isRendering || isExporting}
          >
            {isRendering ? 'Rendering...' : isExporting ? 'Finalizing...' : 'Render & Export'}
          </Button>
          
          {exportUrl && (
            <Button variant="outline" className="flex-1" disabled={isRendering || isExporting}>
              <Download size={18} className="mr-2" />
              Download
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExportPanel;
