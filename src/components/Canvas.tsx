// src/components/Canvas.tsx - 更新的画布组件，集成文字处理
import React, { useState, useRef } from 'react';
import { CanvasData, CanvasElement } from '../types';
import { editor } from '../core';
import TextEditor from './TextEditor';
import { TextCommandOptions } from '../plugins/AddTextPlugin';

interface CanvasProps {
  state: CanvasData;
}

export default function Canvas({ state }: CanvasProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const canvasRef = useRef<HTMLDivElement>(null);
  
  // 当编辑器状态更新时，同步选中状态
  React.useEffect(() => {
    const handleStateChange = (editorState) => {
      setSelectedIds(editorState.selectedElements);
    };
    
    editor.onStateChange(handleStateChange);
    return () => editor.offStateChange(handleStateChange);
  }, []);
  
  // 处理元素点击事件
  const handleElementClick = (elementId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // 更新编辑器选中元素
    editor.updateState(state => ({
      ...state,
      selectedElements: [elementId]
    }));
  };
  
  // 处理画布空白区域点击
  const handleCanvasClick = (e: React.MouseEvent) => {
    // 如果点击的是画布本身，而不是其中的元素
    if (e.target === canvasRef.current) {
      // 清除选择
      editor.updateState(state => ({
        ...state,
        selectedElements: []
      }));
    }
  };
  
  // 处理添加文本
  const handleAddText = (e: React.MouseEvent) => {
    // 仅在双击且点击的是画布本身时添加文本
    if (e.detail === 2 && e.target === canvasRef.current) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // 查找文本插件
        const textPlugin = editor.getPlugins().find(p => p.id === 'add-text');
        if (textPlugin) {
          // 创建并执行添加文本命令
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
  
  return (
    <div 
      ref={canvasRef}
      className="canvas" 
      style={{ 
        position: 'relative',
        width: state.width, 
        height: state.height,
        background: state.background,
        overflow: 'hidden'
      }}
      onClick={handleCanvasClick}
      onDoubleClick={handleAddText}
    >
      {Object.values(state.elements).map(element => (
        <div 
          key={element.id}
          onClick={(e) => handleElementClick(element.id, e)}
        >
          <CanvasElementComponent 
            element={element} 
            isSelected={selectedIds.includes(element.id)}
          />
        </div>
      ))}
    </div>
  );
}

// 画布元素组件
interface ElementProps {
  element: CanvasElement;
  isSelected: boolean;
}

function CanvasElementComponent({ element, isSelected }: ElementProps) {
  // 根据元素类型渲染不同组件
  switch (element.type) {
    case 'image':
      return <ImageElement element={element} isSelected={isSelected} />;
    case 'text':
      return <TextEditor element={element} isSelected={isSelected} />;
    default:
      return null;
  }
}

// 图片元素组件
function ImageElement({ element, isSelected }: ElementProps) {
  const { x, y, width, height, properties } = element;
  
  return (
    <div 
      className={`canvas-image ${isSelected ? 'selected' : ''}`}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        height,
        backgroundImage: `url(${properties.src})`,
        backgroundSize: 'cover',
        filter: properties.backgroundRemoved ? 'drop-shadow(0 0 5px rgba(0,0,0,0.3))' : 'none',
        border: isSelected ? '1px solid #09f' : 'none',
      }}
    />
  );
}