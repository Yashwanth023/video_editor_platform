
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setProjectName } from '../store/projectSlice';
import { RootState } from '../store/store';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Film, Save, Settings } from 'lucide-react';

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const { name, isDirty } = useSelector((state: RootState) => state.project);
  const [isEditing, setIsEditing] = React.useState(false);
  const [projectName, setProjectNameState] = React.useState(name);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProjectNameState(e.target.value);
  };

  const handleNameSave = () => {
    dispatch(setProjectName(projectName));
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleNameSave();
    }
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-black/30 backdrop-blur-md border-b border-white/10">
      <div className="flex items-center gap-3">
        <div className="text-ember-light animate-glow-pulse">
          <Film size={24} />
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <Input
              className="bg-black/30 border-ember h-8 text-white w-48"
              value={projectName}
              onChange={handleNameChange}
              onBlur={handleNameSave}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          ) : (
            <h1 
              className="text-lg font-semibold text-white text-glow hover:text-ember-light cursor-pointer" 
              onClick={() => setIsEditing(true)}
            >
              {name} {isDirty && '*'}
            </h1>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button size="sm" variant="ghost" className="text-gray-300 hover:text-white">
          <Settings size={18} className="mr-2" />
          Settings
        </Button>
        <Button size="sm" className="bg-ember hover:bg-ember-light transition-colors">
          <Save size={18} className="mr-2" />
          Save Project
        </Button>
      </div>
    </header>
  );
};

export default Header;
