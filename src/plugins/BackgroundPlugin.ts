// src/plugins/BackgroundPlugin.ts
import { Plugin, Command, Editor } from '../types';
import { 
  ChangeBackgroundColorCommand, 
  AddBackgroundImageCommand, 
  RemoveBackgroundCommand 
} from '../commands/BackgroundCommands';

export interface BackgroundCommandOptions {
  action: 'change-color' | 'add-image' | 'remove-bg';
  color?: string;
  imageUrl?: string;
  elementId?: string;
}

export class BackgroundPlugin implements Plugin {
  id = "background";
  name = "背景";
  icon = "image-icon";
  
  execute(editor: Editor, options: BackgroundCommandOptions): Command {
    const { action } = options;
    
    switch (action) {
      case 'change-color':
        if (!options.color) {
          throw new Error('改变背景颜色需要指定颜色');
        }
        return new ChangeBackgroundColorCommand(editor, options.color);
      
      case 'add-image':
        if (!options.imageUrl) {
          throw new Error('添加背景图片需要指定图片URL');
        }
        return new AddBackgroundImageCommand(editor, options.imageUrl);
      
      case 'remove-bg':
        if (!options.elementId) {
          throw new Error('移除背景需要指定元素ID');
        }
        return new RemoveBackgroundCommand(editor, options.elementId);
      
      default:
        throw new Error(`未知的背景操作: ${action}`);
    }
  }
}