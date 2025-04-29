
# Ember Studio - Professional Video Editor

A modern, dark-themed video editor with a sleek interface designed for content creators. Ember Studio features a futuristic UI with fluid animations, purple/blue gradients, and neon accents that make video editing both efficient and visually pleasing.

## Features in Detail

### Video Management
- **Video Upload & Import**: Support for multiple video formats (MP4, WebM, MOV) with drag-and-drop functionality and file browsing
- **Video Preview**: Real-time preview player with playback controls, including play/pause, seek, and fullscreen options
- **Video Processing**: Automatic thumbnail generation and metadata extraction

### Timeline Editing
- **Multi-track Timeline**: Drag-and-drop interface for arranging multiple video and audio clips
- **Clip Manipulation**: Trim, split, and merge video clips directly on the timeline
- **Timeline Navigation**: Zoom controls and time markers for precise editing
- **Frame-by-Frame Navigation**: Move through your video with frame-level precision

### Audio Capabilities
- **Multiple Audio Tracks**: Add and manage multiple audio tracks simultaneously
- **Volume Control**: Adjust volume levels for individual tracks or the main output
- **Audio Waveform Visualization**: Visual representation of audio for precise editing
- **Audio Effects**: Apply fade-in/fade-out and other basic audio effects

### Customization and Overlays
- **Text Overlays**: Add customizable text with various fonts, colors, and styles
- **Text Animation**: Apply entrance and exit animations to text elements
- **Image Overlays**: Import and position images as overlays with adjustable opacity
- **Positioning Controls**: Precise control over the position and timing of all overlay elements

### Export Capabilities
- **Multiple Format Support**: Export your video in different formats (MP4, WebM, MOV)
- **Quality Settings**: Choose from various quality presets (480p, 720p, 1080p, 4K)
- **Progress Tracking**: Visual progress bar during rendering and export
- **Download Options**: Direct download of the exported video file

### Project Management
- **Auto-Save**: Project progress is automatically saved to local storage
- **Project Naming**: Custom project naming for easy organization
- **Project Recovery**: Recover unsaved changes if the browser closes unexpectedly

## Technical Specifications

### Core Technologies
- **Frontend Framework**: React with TypeScript for type safety
- **State Management**: Redux Toolkit for predictable state handling
- **Styling**: Tailwind CSS for responsive and customizable UI components
- **UI Components**: Shadcn UI components for consistent design language
- **Data Persistence**: Local storage API for saving project data
- **Video Processing**: HTML5 Video API with custom controls

### Performance Optimizations
- **Efficient Rendering**: Optimized component rendering to handle complex timelines
- **Memory Management**: Smart handling of video assets to prevent memory leaks
- **Background Processing**: Non-blocking operations for video rendering

### UI/UX Design
- **Dark Theme**: Eye-friendly dark interface designed for long editing sessions
- **Responsive Layout**: Adaptable interface that works on various screen sizes
- **Intuitive Controls**: Context-sensitive tools that appear when needed
- **Visual Feedback**: Loading states, progress indicators, and success notifications

## Getting Started

### System Requirements
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Minimum 8GB RAM recommended for smooth performance with HD video
- Stable internet connection for initial load (after that, works offline)

### Installation

1. Clone the repository:
```sh
git clone https://github.com/yourusername/ember-studio.git
cd ember-studio
```

2. Install dependencies:
```sh
npm install
```

3. Start the development server:
```sh
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:5173/
```

## Building for Production

```sh
npm run build
```

This creates an optimized production build in the `dist` directory.

## Project Structure

- `/src/components`: React components organized by feature
  - `/ui`: Reusable UI components like buttons, cards, etc.
  - `/overlays`: Components for text and image overlays
- `/src/store`: Redux store configuration and state slices
  - `videoSlice.ts`: State management for video upload and playback
  - `timelineSlice.ts`: Timeline and clip arrangement logic
  - `audioSlice.ts`: Audio track management
  - `overlaysSlice.ts`: Text and image overlay handling
  - `projectSlice.ts`: Project-wide settings and export options
- `/src/utils`: Utility functions and helpers
- `/src/hooks`: Custom React hooks for shared functionality
- `/src/pages`: Page-level components and routing

## Usage Guide

1. **Upload Video**: Click the upload area or drag and drop a video file
2. **Edit Timeline**: Arrange clips on the timeline using drag and drop
3. **Add Overlays**: Use the text and image panels to add overlays to your video
4. **Add Audio**: Import audio tracks and adjust their position and volume
5. **Preview**: Use the video preview to see how your edits look in real-time
6. **Export**: Select your desired format and quality, then render and export

## License

MIT License

Copyright (c) 2025 Ember Studio

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
