// src/components/Toolbar.tsx - 工具栏组件
import React from 'react';
import { editor } from '../core';

export default function Toolbar() {
  const plugins = editor.getPlugins();
  
  const handlePluginClick = (pluginId: string) => {
    const plugin = plugins.find(p => p.id === pluginId);
    if (plugin && editor.getState().selectedElements.length > 0) {
      const elementId = editor.getState().selectedElements[0];
      const command = plugin.execute(editor, elementId);
      editor.executeCommand(command);
    }
  };
  
  return (
    <div className="editor-toolbar">
      {plugins.map(plugin => (
        <button 
          key={plugin.id}
          onClick={() => handlePluginClick(plugin.id)}
          className="toolbar-button"
        >
          {plugin.icon && <i className={plugin.icon}></i>}
          <span>{plugin.name}</span>
        </button>
      ))}
    </div>
  );
}