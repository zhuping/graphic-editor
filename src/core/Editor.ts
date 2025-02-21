// src/core/Editor.ts - 编辑器核心类
import { EditorState, Plugin, Command, Editor as EditorInterface } from '../types';

export class Editor implements EditorInterface {
  private state: EditorState;
  private history: {
    undoStack: Command[];
    redoStack: Command[];
  };
  private plugins: Map<string, Plugin>;
  private listeners: Array<(state: EditorState) => void> = [];
  
  constructor() {
    this.state = this.getInitialState();
    this.history = { undoStack: [], redoStack: [] };
    this.plugins = new Map();
  }

  getState(): EditorState {
    return {...this.state};
  }
  
  private getInitialState(): EditorState {
    return {
      canvas: {
        elements: {},
        width: 600,
        height: 400,
        background: '#fff'
      },
      selectedElements: []
    };
  }

  // 注册插件
  registerPlugin(plugin: Plugin): void {
    this.plugins.set(plugin.id, plugin);
  }

  // 获取所有已注册插件
  getPlugins(): Plugin[] {
    return Array.from(this.plugins.values());
  }

  // 执行命令
  executeCommand(command: Command): void {
    command.execute();
    this.history.undoStack.push(command);
    this.history.redoStack = []; // 清空重做栈
    this.notifyStateChange();
  }

  // 撤销操作
  undo(): void {
    const command = this.history.undoStack.pop();
    if (command) {
      command.undo();
      this.history.redoStack.push(command);
      this.notifyStateChange();
    }
  }

  // 重做操作
  redo(): void {
    const command = this.history.redoStack.pop();
    if (command) {
      command.redo();
      this.history.undoStack.push(command);
      this.notifyStateChange();
    }
  }
  
  // 状态变更通知
  onStateChange(callback: (state: EditorState) => void): void {
    this.listeners.push(callback);
  }
  
  offStateChange(callback: (state: EditorState) => void): void {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }
  
  // 通知状态变化
  private notifyStateChange(): void {
    const state = this.getState();
    this.listeners.forEach(listener => listener(state));
  }
  
  // 更新编辑器状态
  updateState(updater: (state: EditorState) => EditorState): void {
    this.state = updater({...this.state});
    this.notifyStateChange();
  }
}