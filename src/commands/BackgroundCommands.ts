// src/commands/BackgroundCommands.ts
import { BaseCommand } from './BaseCommand';
import { Editor } from '../core/Editor';
import { EditorState } from '../types';

export class ChangeBackgroundColorCommand extends BaseCommand {
  private newColor: string;
  private previousColor: string;
  
  constructor(editor: Editor, newColor: string) {
    super(editor);
    this.newColor = newColor;
    
    // Save the previous color
    const state = editor.getState();
    this.previousColor = state.canvas.background;
  }
  
  execute(): void {
    this.editor.updateState(state => {
      const newState = this.deepCloneState(state);
      newState.canvas.background = this.newColor;
      return newState;
    });
  }
  
  undo(): void {
    this.editor.updateState(state => {
      const newState = this.deepCloneState(state);
      newState.canvas.background = this.previousColor;
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

export class AddBackgroundImageCommand extends BaseCommand {
  private imageUrl: string;
  private previousBackground: string | { type: string; url: string };
  
  constructor(editor: Editor, imageUrl: string) {
    super(editor);
    this.imageUrl = imageUrl;
    
    // Save the previous background
    const state = editor.getState();
    this.previousBackground = state.canvas.background;
  }
  
  execute(): void {
    this.editor.updateState(state => {
      const newState = this.deepCloneState(state);
      // Set background as an object to differentiate between color and image
      newState.canvas.background = { 
        type: 'image', 
        url: this.imageUrl 
      };
      return newState;
    });
  }
  
  undo(): void {
    this.editor.updateState(state => {
      const newState = this.deepCloneState(state);
      newState.canvas.background = this.previousBackground;
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

export class RemoveBackgroundCommand extends BaseCommand {
  private elementId: string;
  private previousElement: any;
  
  constructor(editor: Editor, elementId: string) {
    super(editor);
    this.elementId = elementId;
    
    // Save the current state of the element
    const state = editor.getState();
    this.previousElement = {...state.canvas.elements[elementId]};
  }
  
  execute(): void {
    this.editor.updateState(state => {
      const newState = this.deepCloneState(state);
      
      if (newState.canvas.elements[this.elementId]) {
        newState.canvas.elements[this.elementId].properties.backgroundRemoved = true;
        // Additional background removal logic would go here in a real implementation
      }
      
      return newState;
    });
  }
  
  undo(): void {
    this.editor.updateState(state => {
      const newState = this.deepCloneState(state);
      
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