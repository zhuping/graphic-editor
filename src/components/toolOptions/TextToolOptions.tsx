// src/components/toolOptions/TextToolOptions.tsx
import React, { useState } from 'react';
import { editor } from '../../core';
import { TextCommandOptions } from '../../plugins/AddTextPlugin';

interface TextToolOptionsProps {
  onClose: () => void;
}

export default function TextToolOptions({ onClose }: TextToolOptionsProps) {
  const [text, setText] = useState('点击输入文字');
  
  const fontFamilies = [
    { value: 'Arial', label: 'Arial' },
    { value: 'Helvetica', label: 'Helvetica' },
    { value: 'Times New Roman', label: 'Times New Roman' },
    { value: 'Georgia', label: 'Georgia' },
    { value: 'Verdana', label: 'Verdana' }
  ];
  
  const fontSizes = [12, 14, 16, 18, 20, 24, 28, 32, 36, 42];
  
  const handleAddText = () => {
    const plugin = editor.getPlugins().find(p => p.id === 'add-text');
    if (plugin) {
      // Get the canvas center coordinates
      const state = editor.getState();
      const x = state.canvas.width / 2 - 100; // Center horizontally
      const y = state.canvas.height / 2 - 25; // Center vertically
      
      const command = plugin.execute(editor, {
        action: 'add',
        text,
        x,
        y,
        options: {
          fontSize: 20,
          fontFamily: 'Arial',
          textAlign: 'center'
        }
      } as TextCommandOptions);
      
      editor.executeCommand(command);
      onClose();
    }
  };
  
  const textTemplates = [
    '点击编辑文本',
    '双击修改文字',
    '标题文字',
    '描述文字',
    '重要提示',
    '温馨提醒'
  ];
  
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          文本内容
        </label>
        <input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          placeholder="输入文本内容"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          快速模板
        </label>
        <div className="flex flex-wrap gap-2">
          {textTemplates.map(template => (
            <button
              key={template}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100"
              onClick={() => setText(template)}
            >
              {template}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm"
          onClick={handleAddText}
        >
          添加文本
        </button>
      </div>
    </div>
  );
}