// src/components/MobileCanvas.tsx
import React, { useState, useRef, useEffect } from 'react';
import { CanvasData, CanvasElement } from '../types';
import { editor } from '../core';
import TextEditor from './TextEditor';
import { TextCommandOptions } from '../plugins/AddTextPlugin';

interface MobileCanvasProps {
  state: CanvasData;
}

export default function MobileCanvas({ state }: MobileCanvasProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Calculate canvas size based on container dimensions
  useEffect(() => {
    const calculateSize = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        // Maintain aspect ratio based on original canvas dimensions
        const height = (width / state.width) * state.height;
        setCanvasSize({ width, height });
      }
    };
    
    calculateSize();
    window.addEventListener('resize', calculateSize);
    return () => window.removeEventListener('resize', calculateSize);
  }, [state.width, state.height]);
  
  // Handle editor state changes
  useEffect(() => {
    const handleStateChange = (editorState) => {
      setSelectedIds(editorState.selectedElements);
    };
    
    editor.onStateChange(handleStateChange);
    return () => editor.offStateChange(handleStateChange);
  }, []);
  
  // Handle element interactions
  const handleElementClick = (elementId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    editor.updateState(state => ({
      ...state,
      selectedElements: [elementId]
    }));
  };
  
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      editor.updateState(state => ({
        ...state,
        selectedElements: []
      }));
    }
  };
  
  const handleAddText = (e: React.MouseEvent) => {
    if (e.detail === 2 && e.target === canvasRef.current) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const x = (e.clientX - rect.left) * (state.width / canvasSize.width);
        const y = (e.clientY - rect.top) * (state.height / canvasSize.height);
        
        const textPlugin = editor.getPlugins().find(p => p.id === 'add-text');
        if (textPlugin) {
          const command = textPlugin.execute(editor, {
            action: 'add',
            text: '双击编辑文本',
            x,
            y
          } as TextCommandOptions);
          
          editor.executeCommand(command);
        }
      }
    }
  };
  
  // Determine background style
  const getBackgroundStyle = () => {
    const { background } = state;
    
    if (typeof background === 'object' && background.type === 'image') {
      return {
        backgroundImage: `url(${background.url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      };
    }
    
    return { backgroundColor: background };
  };
  
  // Scale elements based on canvas size
  const getScaledStyle = (element: CanvasElement) => {
    const scaleX = canvasSize.width / state.width;
    const scaleY = canvasSize.height / state.height;
    
    return {
      left: element.x * scaleX,
      top: element.y * scaleY,
      width: element.width * scaleX,
      height: element.height * scaleY
    };
  };
  
  return (
    <div 
      ref={containerRef}
      className="w-full max-w-lg mx-auto pb-20"
    >
      <div 
        ref={canvasRef}
        className="relative overflow-hidden shadow-lg" 
        style={{ 
          width: canvasSize.width,
          height: canvasSize.height,
          ...getBackgroundStyle()
        }}
        onClick={handleCanvasClick}
        onDoubleClick={handleAddText}
      >
        {Object.values(state.elements).map(element => (
          <div 
            key={element.id}
            onClick={(e) => handleElementClick(element.id, e)}
            style={{
              position: 'absolute',
              ...getScaledStyle(element)
            }}
          >
            <MobileCanvasElement 
              element={element} 
              isSelected={selectedIds.includes(element.id)}
              scaleFactor={{ 
                x: canvasSize.width / state.width,
                y: canvasSize.height / state.height
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// Canvas Element Component
interface MobileElementProps {
  element: CanvasElement;
  isSelected: boolean;
  scaleFactor: { x: number; y: number };
}

function MobileCanvasElement({ element, isSelected, scaleFactor }: MobileElementProps) {
  // Scale font size based on canvas scaling
  const getScaledFontSize = (fontSize: number) => {
    return fontSize * scaleFactor.x;
  };
  
  switch (element.type) {
    case 'image':
      return <MobileImageElement element={element} isSelected={isSelected} />;
    case 'text':
      return (
        <TextEditor 
          element={{
            ...element,
            properties: {
              ...element.properties,
              fontSize: getScaledFontSize(element.properties.fontSize)
            }
          }} 
          isSelected={isSelected} 
        />
      );
    default:
      return null;
  }
}

// Image Element Component
function MobileImageElement({ element, isSelected }: { element: CanvasElement, isSelected: boolean }) {
  const { properties } = element;
  
  return (
    <div 
      className={`w-full h-full ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      style={{
        backgroundImage: `url(${properties.src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: properties.backgroundRemoved ? 'drop-shadow(0 0 5px rgba(0,0,0,0.3))' : 'none',
      }}
    />
  );
}