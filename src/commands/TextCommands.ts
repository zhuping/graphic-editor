// src/commands/TextCommands.ts - 文本相关命令
import { BaseCommand } from './BaseCommand';
import { Editor, EditorState, CanvasElement } from '../types';

export class AddTextCommand extends BaseCommand {
  private newElement: CanvasElement;
  private addedToSelection: boolean = false;
  
  constructor(editor: Editor, text: string, x: number, y: number, options: TextOptions = {}) {
    super(editor);
    
    const {
      fontSize = 16,
      fontFamily = 'Arial',
      color = '#000000',
      fontWeight = 'normal',
      fontStyle = 'normal',
      textAlign = 'left',
      width = 200,
      height = 50
    } = options;
    
    // 创建新文本元素
    this.newElement = {
      id: `text-${Date.now()}`,
      type: 'text',
      x,
      y,
      width,
      height,
      properties: {
        text,
        fontSize,
        fontFamily,
        color,
        fontWeight,
        fontStyle,
        textAlign,
        editable: true
      }
    };
  }
  
  execute(): void {
    this.editor.updateState(state => {
      // 添加新元素
      const newState = this.deepCloneState(state);
      newState.canvas.elements[this.newElement.id] = this.newElement;
      
      // 选中新添加的文本
      newState.selectedElements = [this.newElement.id];
      this.addedToSelection = true;
      
      return newState;
    });
  }
  
  undo(): void {
    this.editor.updateState(state => {
      const newState = this.deepCloneState(state);
      
      // 移除添加的文本元素
      delete newState.canvas.elements[this.newElement.id];
      
      // 如果当前选中的是这个元素，则清空选择
      if (this.addedToSelection && newState.selectedElements.includes(this.newElement.id)) {
        newState.selectedElements = newState.selectedElements.filter(id => id !== this.newElement.id);
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

export class EditTextCommand extends BaseCommand {
  private elementId: string;
  private newText: string;
  private previousText: string;
  
  constructor(editor: Editor, elementId: string, newText: string) {
    super(editor);
    this.elementId = elementId;
    this.newText = newText;
    
    // 保存操作前的文本
    const state = editor.getState();
    const element = state.canvas.elements[elementId];
    this.previousText = element?.properties.text || '';
  }
  
  execute(): void {
    this.editor.updateState(state => {
      const newState = this.deepCloneState(state);
      
      if (newState.canvas.elements[this.elementId]) {
        newState.canvas.elements[this.elementId].properties.text = this.newText;
      }
      
      return newState;
    });
  }
  
  undo(): void {
    this.editor.updateState(state => {
      const newState = this.deepCloneState(state);
      
      if (newState.canvas.elements[this.elementId]) {
        newState.canvas.elements[this.elementId].properties.text = this.previousText;
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

export class StyleTextCommand extends BaseCommand {
  private elementId: string;
  private styleChanges: Partial<TextProperties>;
  private previousStyles: Partial<TextProperties>;
  
  constructor(editor: Editor, elementId: string, styleChanges: Partial<TextProperties>) {
    super(editor);
    this.elementId = elementId;
    this.styleChanges = styleChanges;
    
    // 保存操作前的样式
    const state = editor.getState();
    const element = state.canvas.elements[elementId];
    
    if (element && element.type === 'text') {
      this.previousStyles = {};
      // 只记录将被修改的属性
      Object.keys(styleChanges).forEach(key => {
        this.previousStyles[key] = element.properties[key];
      });
    } else {
      this.previousStyles = {};
    }
  }
  
  execute(): void {
    this.editor.updateState(state => {
      const newState = this.deepCloneState(state);
      
      if (newState.canvas.elements[this.elementId]) {
        const element = newState.canvas.elements[this.elementId];
        element.properties = {
          ...element.properties,
          ...this.styleChanges
        };
      }
      
      return newState;
    });
  }
  
  undo(): void {
    this.editor.updateState(state => {
      const newState = this.deepCloneState(state);
      
      if (newState.canvas.elements[this.elementId]) {
        const element = newState.canvas.elements[this.elementId];
        element.properties = {
          ...element.properties,
          ...this.previousStyles
        };
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

// 类型定义
export interface TextOptions {
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  fontWeight?: 'normal' | 'bold';
  fontStyle?: 'normal' | 'italic';
  textAlign?: 'left' | 'center' | 'right';
  width?: number;
  height?: number;
}

export interface TextProperties {
  text: string;
  fontSize: number;
  fontFamily: string;
  color: string;
  fontWeight: string;
  fontStyle: string;
  textAlign: string;
  editable: boolean;
}