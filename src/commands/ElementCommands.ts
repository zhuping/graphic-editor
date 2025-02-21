// src/commands/ElementCommands.ts - 元素操作相关命令
import { BaseCommand } from './BaseCommand';
import { Editor } from '../core/Editor';
import { CanvasElement, EditorState } from '../types';

export class RemoveBackgroundCommand extends BaseCommand {
  private elementId: string;
  private previousElement: CanvasElement;
  
  constructor(editor: Editor, elementId: string) {
    super(editor);
    this.elementId = elementId;
    
    // 保存操作前的状态
    const state = editor.getState();
    this.previousElement = {...state.canvas.elements[elementId]};
  }
  
  execute(): void {
    this.editor.updateState(state => {
      // 深拷贝状态避免直接修改
      const newState = this.deepCloneState(state);
      
      // 实现背景移除逻辑
      if (newState.canvas.elements[this.elementId]) {
        newState.canvas.elements[this.elementId].properties.backgroundRemoved = true;
        // 其他背景移除相关处理...
      }
      
      return newState;
    });
  }
  
  undo(): void {
    this.editor.updateState(state => {
      const newState = this.deepCloneState(state);
      
      // 恢复元素到之前的状态
      if (newState.canvas.elements[this.elementId]) {
        newState.canvas.elements[this.elementId] = {...this.previousElement};
      }
      
      return newState;
    });
  }
  
  private deepCloneState(state: EditorState): EditorState {
    return {
      ...state,
      canvas: {
        ...state.canvas,
        elements: {
          ...state.canvas.elements
        }
      },
      selectedElements: [...state.selectedElements]
    };
  }
}

export class AddTextCommand extends BaseCommand {
  private newElement: CanvasElement;
  
  constructor(editor: Editor, text: string, x: number, y: number) {
    super(editor);
    
    // 创建新文本元素
    this.newElement = {
      id: `text-${Date.now()}`,
      type: 'text',
      x,
      y,
      width: 200,
      height: 50,
      properties: {
        text,
        fontSize: 16,
        fontFamily: 'Arial',
        color: '#fff'
      }
    };
  }
  
  execute(): void {
    this.editor.updateState(state => {
      const newState = {
        ...state,
        canvas: {
          ...state.canvas,
          elements: {
            ...state.canvas.elements,
            [this.newElement.id]: this.newElement
          }
        }
      };
      return newState;
    });
  }
  
  undo(): void {
    this.editor.updateState(state => {
      const newState = {
        ...state,
        canvas: {
          ...state.canvas,
          elements: {...state.canvas.elements}
        }
      };
      
      // 移除添加的文本元素
      delete newState.canvas.elements[this.newElement.id];
      
      return newState;
    });
  }
}