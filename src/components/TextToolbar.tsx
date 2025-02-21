// src/components/TextToolbar.tsx - 文本工具栏
import React from 'react';
import { editor } from '../core';
import { CanvasElement } from '../types';
import { TextCommandOptions } from '../plugins/AddTextPlugin';

interface TextToolbarProps {
  selectedElement: CanvasElement | null;
}

export default function TextToolbar({ selectedElement }: TextToolbarProps) {
  if (!selectedElement || selectedElement.type !== 'text') {
    return null;
  }
  
  const { id, properties } = selectedElement;
  const { 
    fontSize = 16, 
    fontFamily = 'Arial', 
    color = '#000000',
    fontWeight = 'normal',
    fontStyle = 'normal',
    textAlign = 'left'
  } = properties;
  
  // 应用文本样式
  const applyStyle = (styleChanges: Partial<TextCommandOptions['styleChanges']>) => {
    const plugin = editor.getPlugins().find(p => p.id === 'add-text');
    if (plugin) {
      const command = plugin.execute(editor, {
        action: 'style',
        elementId: id,
        styleChanges
      } as TextCommandOptions);
      editor.executeCommand(command);
    }
  };
  
  // 字体大小调整
  const handleFontSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    applyStyle({ fontSize: parseInt(e.target.value) });
  };
  
  // 字体家族调整
  const handleFontFamilyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    applyStyle({ fontFamily: e.target.value });
  };
  
  // 颜色调整
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    applyStyle({ color: e.target.value });
  };
  
  // 粗体切换
  const toggleBold = () => {
    applyStyle({ fontWeight: fontWeight === 'bold' ? 'normal' : 'bold' });
  };
  
  // 斜体切换
  const toggleItalic = () => {
    applyStyle({ fontStyle: fontStyle === 'italic' ? 'normal' : 'italic' });
  };
  
  // 文本对齐方式
  const setTextAlign = (align: 'left' | 'center' | 'right') => {
    applyStyle({ textAlign: align });
  };
  
  return (
    <div className="text-toolbar">
      <div className="toolbar-group">
        <select value={fontSize} onChange={handleFontSizeChange}>
          {[8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 42, 48, 64].map(size => (
            <option key={size} value={size}>{size}px</option>
          ))}
        </select>
        
        <select value={fontFamily} onChange={handleFontFamilyChange}>
          <option value="Arial">Arial</option>
          <option value="Helvetica">Helvetica</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Courier New">Courier New</option>
          <option value="Georgia">Georgia</option>
          <option value="Verdana">Verdana</option>
          <option value="Impact">Impact</option>
        </select>
        
        <input 
          type="color"
          value={color}
          onChange={handleColorChange}
          title="文本颜色"
        />
      </div>
      
      <div className="toolbar-group">
        <button 
          className={`format-button ${fontWeight === 'bold' ? 'active' : ''}`}
          onClick={toggleBold}
          title="粗体"
        >
          B
        </button>
        
        <button 
          className={`format-button ${fontStyle === 'italic' ? 'active' : ''}`}
          onClick={toggleItalic}
          title="斜体"
        >
          I
        </button>
      </div>
      
      <div className="toolbar-group">
        <button 
          className={`align-button ${textAlign === 'left' ? 'active' : ''}`}
          onClick={() => setTextAlign('left')}
          title="左对齐"
        >
          ⬅️
        </button>
        
        <button 
          className={`align-button ${textAlign === 'center' ? 'active' : ''}`}
          onClick={() => setTextAlign('center')}
          title="居中"
        >
          ⬆️
        </button>
        
        <button 
          className={`align-button ${textAlign === 'right' ? 'active' : ''}`}
          onClick={() => setTextAlign('right')}
          title="右对齐"
        >
          ➡️
        </button>
      </div>
    </div>
  );
}