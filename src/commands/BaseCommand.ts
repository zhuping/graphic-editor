// src/commands/BaseCommand.ts - 基础命令类
import { Command } from '../types';
import { Editor } from '../core/Editor';

export abstract class BaseCommand implements Command {
  protected editor: Editor;
  
  constructor(editor: Editor) {
    this.editor = editor;
  }
  
  abstract execute(): void;
  abstract undo(): void;
  
  redo(): void {
    this.execute();
  }
}