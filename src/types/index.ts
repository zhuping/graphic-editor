// src/types/index.ts - 修正后的核心类型定义
export interface Command {
  execute(): void;
  undo(): void;
  redo(): void;
}

// 先定义Editor接口
export interface Editor {
  getState(): EditorState;
  registerPlugin(plugin: Plugin): void;
  getPlugins(): Plugin[];
  executeCommand(command: Command): void;
  undo(): void;
  redo(): void;
  onStateChange(callback: (state: EditorState) => void): void;
  offStateChange(callback: (state: EditorState) => void): void;
  updateState(updater: (state: EditorState) => EditorState): void;
}

// 然后定义Plugin接口，使用上面的Editor接口
export interface Plugin {
  id: string;
  name: string;
  icon?: string;
  execute(editor: Editor, ...args: any[]): Command;
}

export interface EditorState {
  canvas: CanvasData;
  selectedElements: string[];
  // 其他状态...
}

export interface CanvasData {
  elements: Record<string, CanvasElement>;
  width: number;
  height: number;
  background: string;
}

export interface CanvasElement {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  properties: Record<string, any>;
}