// src/pages/index.tsx
import { useEffect } from "react";
import { editor } from '../core';
import { 
  BackgroundPlugin,
  AddTextPlugin 
} from '../plugins';
import MobileEditor from '../components/MobileEditor';
import '../styles/text-plugin.css';

export default function Home() {
  // Register plugins on initial render
  useEffect(() => {
    // Make sure plugins are only registered once
    editor.registerPlugin(new BackgroundPlugin());
    editor.registerPlugin(new AddTextPlugin());
    
    // Initialize editor with a mobile-friendly canvas size
    editor.updateState(state => ({
      ...state,
      canvas: {
        ...state.canvas,
        width: 375, // Mobile width
        height: 600, // Mobile height
        background: '#ffffff'
      }
    }));
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      <MobileEditor />
    </div>
  );
}