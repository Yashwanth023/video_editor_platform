
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { TextOverlay as TextOverlayType } from '../../store/overlaysSlice';

interface TextOverlayProps {
  overlay: TextOverlayType;
  containerRef: React.RefObject<HTMLDivElement>;
}

export const TextOverlay: React.FC<TextOverlayProps> = ({ overlay, containerRef }) => {
  const isSelected = useSelector((state: RootState) => 
    state.overlays.selectedOverlayId === overlay.id && 
    state.overlays.selectedOverlayType === 'text'
  );

  const style = {
    left: `${overlay.position.x}%`,
    top: `${overlay.position.y}%`,
    fontFamily: overlay.style.fontFamily,
    fontSize: `${overlay.style.fontSize}px`,
    color: overlay.style.color,
    fontWeight: overlay.style.bold ? 'bold' : 'normal',
    fontStyle: overlay.style.italic ? 'italic' : 'normal',
    textDecoration: overlay.style.underline ? 'underline' : 'none',
    transform: 'translate(-50%, -50%)',
    textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
  };

  return (
    <div 
      className={`absolute p-2 ${isSelected ? 'ring-2 ring-ember' : ''}`} 
      style={style}
    >
      {overlay.text}
    </div>
  );
};
