
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { ImageOverlay as ImageOverlayType } from '../../store/overlaysSlice';

interface ImageOverlayProps {
  overlay: ImageOverlayType;
  containerRef: React.RefObject<HTMLDivElement>;
}

export const ImageOverlay: React.FC<ImageOverlayProps> = ({ overlay, containerRef }) => {
  const isSelected = useSelector((state: RootState) => 
    state.overlays.selectedOverlayId === overlay.id && 
    state.overlays.selectedOverlayType === 'image'
  );

  const style = {
    left: `${overlay.position.x}%`,
    top: `${overlay.position.y}%`,
    width: `${overlay.size.width}px`,
    height: `${overlay.size.height}px`,
    opacity: overlay.style.opacity,
    transform: 'translate(-50%, -50%)',
    border: overlay.style.borderWidth ? `${overlay.style.borderWidth}px solid ${overlay.style.borderColor}` : 'none',
  };

  return (
    <div 
      className={`absolute ${isSelected ? 'ring-2 ring-ember' : ''}`} 
      style={style}
    >
      <img 
        src={overlay.src} 
        alt="Overlay" 
        className="w-full h-full object-contain"
      />
    </div>
  );
};
