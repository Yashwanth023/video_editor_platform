
export const generateThumbnail = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.src = URL.createObjectURL(file);
    
    video.addEventListener('loadeddata', () => {
      video.currentTime = 1; // Seek to 1 second
    });
    
    video.addEventListener('seeked', () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        URL.revokeObjectURL(video.src);
        resolve(dataUrl);
      } else {
        resolve('');
      }
    });
    
    video.load();
  });
};

export const formatTime = (timeInSeconds: number): string => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  const milliseconds = Math.floor((timeInSeconds % 1) * 1000);
  
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
};

export const generateRandomId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

export const saveProjectToLocalStorage = (projectData: any) => {
  try {
    localStorage.setItem('emberStudioProject', JSON.stringify(projectData));
  } catch (error) {
    console.error('Failed to save project to local storage', error);
  }
};

export const loadProjectFromLocalStorage = () => {
  try {
    const projectData = localStorage.getItem('emberStudioProject');
    return projectData ? JSON.parse(projectData) : null;
  } catch (error) {
    console.error('Failed to load project from local storage', error);
    return null;
  }
};
