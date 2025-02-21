// src/components/Editor.tsx - 更新后的主编辑器组件
import React, { useEffect, useState } from 'react';
import { EditorState, CanvasElement } from '../types';
import { editor } from '../core';
import Toolbar from './Toolbar';
import TextToolbar from './TextToolbar';
import Canvas from './Canvas';

export default function EditorComponent() {
  const [editorState, setEditorState] = useState<EditorState>(editor.getState());
  const [selectedElement, setSelectedElement] = useState<CanvasElement | null>(null);
  
  // 注册状态更新监听
  useEffect(() => {
    const handleStateChange = (state: EditorState) => {
      setEditorState(state);
      
      // 获取选中的元素
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
    <div className="editor-container">
      <Toolbar />
      
      {/* 文本工具栏，仅当选中文本元素时显示 */}
      {selectedElement?.type === 'text' && (
        <TextToolbar selectedElement={selectedElement} />
      )}
      
      <div className="editor-workspace">
        <Canvas state={editorState.canvas} />
      </div>
      
      <div className="editor-footer">
        <button 
          onClick={() => editor.undo()}
          disabled={editorState.history?.undoStack?.length === 0}
          className="footer-button"
        >
          撤销
        </button>
        <button 
          onClick={() => editor.redo()}
          disabled={editorState.history?.redoStack?.length === 0}
          className="footer-button"
        >
          重做
        </button>
      </div>
    </div>
  );
}