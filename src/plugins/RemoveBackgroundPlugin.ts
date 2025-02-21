// src/plugins/RemoveBackgroundPlugin.ts
import { Plugin, Command } from '../types';
import { Editor } from '../core/Editor';
import { RemoveBackgroundCommand } from '../commands/ElementCommands';

export class RemoveBackgroundPlugin implements Plugin {
  id = "remove-background";
  name = "移除背景";
  icon = "eraser-icon";
  
  execute(editor: Editor, elementId: string): Command {
    return new RemoveBackgroundCommand(editor, elementId);
  }
}