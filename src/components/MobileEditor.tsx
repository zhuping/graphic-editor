// src/components/MobileEditor.tsx
import React, { useEffect, useState } from 'react';
import { EditorState, CanvasElement } from '../types';
import { editor } from '../core';
import MobileToolbar from './MobileToolbar';
import MobileCanvas from './MobileCanvas';

export default function MobileEditor() {
  const [editorState, setEditorState] = useState<EditorState>(editor.getState());
  const [selectedElement, setSelectedElement] = useState<CanvasElement | null>(null);
  
  // Register state update listener
  useEffect(() => {
    const handleStateChange = (state: EditorState) => {
      setEditorState(state);
      
      // Get selected element
      const selectedId = state.selectedElements[0];
      if (selectedId && state.canvas.elements[selectedId]) {
        setSelectedElement(state.canvas.elements[selectedId]);
      } else {
        setSelectedElement(null);
      }
    };
    
    editor.onStateChange(handleStateChange);
    return () => editor.offStateChange(handleStateChange);
  }, []);
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-medium text-gray-900">移动端编辑器</h1>
          <div className="flex space-x-2">
            <button 
              onClick={() => editor.undo()}
              disabled={!editor.canUndo()}
              className="p-2 text-gray-500 disabled:opacity-30"
              aria-label="撤销"
            >
              ↩️
            </button>
            <button 
              onClick={() => editor.redo()}
              disabled={!editor.canRedo()}
              className="p-2 text-gray-500 disabled:opacity-30"
              aria-label="重做"
            >
              ↪️
            </button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1 p-4">
        <MobileCanvas state={editorState.canvas} />
      </main>
      
      {/* Toolbar */}
      <MobileToolbar />
    </div>
  );
}