// src/plugins/AddTextPlugin.ts
import { Plugin, Command, Editor } from '../types';
import { AddTextCommand, EditTextCommand, StyleTextCommand, TextOptions } from '../commands/TextCommands';

export class AddTextPlugin implements Plugin {
  id = "add-text";
  name = "添加文字";
  icon = "font-icon";
  
  execute(editor: Editor, options: TextCommandOptions): Command {
    const { action, ...params } = options;
    
    switch (action) {
      case 'add':
        return new AddTextCommand(
          editor, 
          params.text || '新文本', 
          params.x || 100, 
          params.y || 100,
          params.options
        );
      
      case 'edit':
        if (!params.elementId || !params.text) {
          throw new Error('编辑文本需要指定elementId和text');
        }
        return new EditTextCommand(editor, params.elementId, params.text);
      
      case 'style':
        if (!params.elementId || !params.styleChanges) {
          throw new Error('设置文本样式需要指定elementId和styleChanges');
        }
        return new StyleTextCommand(editor, params.elementId, params.styleChanges);
      
      default:
        // 默认行为是添加文本
        return new AddTextCommand(
          editor, 
          '新文本', 
          100, 
          100
        );
    }
  }
}

// 插件命令参数类型
export interface TextCommandOptions {
  action: 'add' | 'edit' | 'style';
  text?: string;
  elementId?: string;
  x?: number;
  y?: number;
  options?: TextOptions;
  styleChanges?: Partial<TextOptions>;
}