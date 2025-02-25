// src/components/MobileToolbar.tsx
import React, { useState } from 'react';
import { editor } from '../core';
import BottomSheet from './BottomSheet';
import BackgroundToolOptions from './toolOptions/BackgroundToolOptions';
import TextToolOptions from './toolOptions/TextToolOptions';

interface ToolOption {
  id: string;
  name: string;
  icon: string;
  component: React.ComponentType<{onClose: () => void}>;
}

export default function MobileToolbar() {
  const [activeSheet, setActiveSheet] = useState<string | null>(null);
  
  const tools: ToolOption[] = [
    {
      id: 'text',
      name: '文字',
      icon: 'font-icon',
      component: TextToolOptions
    },
    {
      id: 'background',
      name: '背景',
      icon: 'image-icon',
      component: BackgroundToolOptions
    },
    // 可以添加更多工具选项
  ];
  
  const handleToolClick = (toolId: string) => {
    setActiveSheet(toolId);
  };
  
  const closeSheet = () => {
    setActiveSheet(null);
  };
  
  const ActiveComponent = activeSheet 
    ? tools.find(tool => tool.id === activeSheet)?.component 
    : null;
  
  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-10">
        <div className="flex justify-around p-2">
          {tools.map(tool => (
            <button
              key={tool.id}
              className={`flex flex-col items-center p-2 rounded-md ${
                activeSheet === tool.id ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
              }`}
              onClick={() => handleToolClick(tool.id)}
            >
              <span className="text-2xl">
                {tool.icon === 'font-icon' && '𝓣'}
                {tool.icon === 'image-icon' && '🖼️'}
              </span>
              <span className="text-xs mt-1">{tool.name}</span>
            </button>
          ))}
        </div>
      </div>
      
      {ActiveComponent && (
        <BottomSheet 
          isOpen={activeSheet !== null} 
          onClose={closeSheet}
          title={activeSheet ? tools.find(t => t.id === activeSheet)?.name || '' : ''}
        >
          <ActiveComponent onClose={closeSheet} />
        </BottomSheet>
      )}
    </>
  );
}