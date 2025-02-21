// src/components/TextEditor.tsx
import React, { useState, useEffect, useRef } from 'react';
import { editor } from '../core';
import { CanvasElement } from '../types';
import { TextCommandOptions } from '../plugins/AddTextPlugin';

interface TextEditorProps {
  element: CanvasElement;
  isSelected: boolean;
}

export default function TextEditor({ element, isSelected }: TextEditorProps) {
  const { id, x, y, width, height, properties } = element;
  const { 
    text, 
    fontSize, 
    fontFamily, 
    color, 
    fontWeight, 
    fontStyle,
    textAlign,
    editable
  } = properties;
  
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(text);
  const textRef = useRef<HTMLDivElement>(null);
  
  // 当编辑状态或选中状态变化时更新
  useEffect(() => {
    if (!editing && isSelected && editable) {
      // 监听双击事件进入编辑模式
      const handleDoubleClick = () => {
        setEditing(true);
      };
      
      const element = textRef.current;
      if (element) {
        element.addEventListener('dblclick', handleDoubleClick);
        return () => {
          element.removeEventListener('dblclick', handleDoubleClick);
        };
      }
    }
  }, [editing, isSelected, editable]);
  
  // 自动聚焦于编辑区域
  useEffect(() => {
    if (editing && textRef.current) {
      textRef.current.focus();
      // 将光标放到文本末尾
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(textRef.current);
      range.collapse(false);
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  }, [editing]);
  
  // 处理文本变化
  const handleTextChange = (e: React.FormEvent<HTMLDivElement>) => {
    setValue(e.currentTarget.innerText);
  };
  
  // 处理编辑完成
  const handleBlur = () => {
    if (editing) {
      setEditing(false);
      
      // 文本变化时创建编辑命令
      if (value !== text) {
        const plugin = editor.getPlugins().find(p => p.id === 'add-text');
        if (plugin) {
          const command = plugin.execute(editor, {
            action: 'edit',
            elementId: id,
            text: value
          } as TextCommandOptions);
          editor.executeCommand(command);
        }
      }
    }
  };
  
  // 按下Enter键完成编辑
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      textRef.current?.blur();
    }
  };
  
  return (
    <div
      ref={textRef}
      className={`canvas-text ${isSelected ? 'selected' : ''} ${editing ? 'editing' : ''}`}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        minHeight: height,
        fontSize: `${fontSize}px`,
        fontFamily,
        color,
        fontWeight,
        fontStyle,
        textAlign,
        padding: '4px',
        border: isSelected ? '1px solid #09f' : '1px solid transparent',
        outline: 'none',
        userSelect: editing ? 'text' : 'none',
        cursor: editing ? 'text' : (editable && isSelected) ? 'pointer' : 'default',
        boxSizing: 'border-box',
        overflow: 'visible',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word'
      }}
      contentEditable={editing}
      suppressContentEditableWarning={true}
      onInput={handleTextChange}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
    >
      {text}
    </div>
  );
}