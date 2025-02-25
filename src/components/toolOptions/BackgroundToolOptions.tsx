// src/components/toolOptions/BackgroundToolOptions.tsx
import React, { useState } from 'react';
import { editor } from '../../core';
import { BackgroundCommandOptions } from '../../plugins/BackgroundPlugin';

interface BackgroundToolOptionsProps {
  onClose: () => void;
}

export default function BackgroundToolOptions({ onClose }: BackgroundToolOptionsProps) {
  const [selectedColor, setSelectedColor] = useState('#ffffff');
  const [imageUrl, setImageUrl] = useState('');
  
  const colors = [
    '#ffffff', '#f8f9fa', '#e9ecef', '#dee2e6', 
    '#ced4da', '#adb5bd', '#6c757d', '#495057', 
    '#343a40', '#212529', '#f8d7da', '#d1e7dd',
    '#cfe2ff', '#fff3cd', '#d1ecf1', '#ffccbc',
    '#bbdefb', '#c8e6c9', '#f0f4c3', '#ffecb3'
  ];
  
  const defaultImages = [
    '/images/bg1.jpg',
    '/images/bg2.jpg',
    '/images/bg3.jpg',
    '/images/bg4.jpg'
  ];
  
  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    
    const plugin = editor.getPlugins().find(p => p.id === 'background');
    if (plugin) {
      const command = plugin.execute(editor, {
        action: 'change-color',
        color
      } as BackgroundCommandOptions);
      
      editor.executeCommand(command);
      onClose();
    }
  };
  
  const handleImageSelect = (imageUrl: string) => {
    const plugin = editor.getPlugins().find(p => p.id === 'background');
    if (plugin) {
      const command = plugin.execute(editor, {
        action: 'add-image',
        imageUrl
      } as BackgroundCommandOptions);
      
      editor.executeCommand(command);
      onClose();
    }
  };
  
  const handleCustomImageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (imageUrl) {
      handleImageSelect(imageUrl);
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">背景颜色</h4>
        <div className="grid grid-cols-5 gap-2">
          {colors.map(color => (
            <button
              key={color}
              className={`w-12 h-12 rounded-full border ${
                selectedColor === color ? 'ring-2 ring-blue-500' : 'ring-1 ring-gray-200'
              }`}
              style={{ backgroundColor: color }}
              onClick={() => handleColorChange(color)}
              aria-label={`选择颜色 ${color}`}
            />
          ))}
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">背景图片</h4>
        <div className="grid grid-cols-2 gap-3">
          {defaultImages.map(img => (
            <button
              key={img}
              className="w-full h-24 border border-gray-200 rounded-md overflow-hidden"
              onClick={() => handleImageSelect(img)}
            >
              <div 
                className="w-full h-full bg-cover bg-center" 
                style={{ backgroundImage: `url(${img})` }}
              />
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">自定义图片</h4>
        <form onSubmit={handleCustomImageSubmit} className="flex space-x-2">
          <input
            type="text"
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
            placeholder="输入图片URL"
            value={imageUrl}
            onChange={e => setImageUrl(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm"
            disabled={!imageUrl}
          >
            添加
          </button>
        </form>
      </div>
    </div>
  );
}