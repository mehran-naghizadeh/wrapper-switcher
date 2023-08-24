/* eslint-disable @typescript-eslint/naming-convention */
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

const substitution: Record<string, Record<string, string>> = {
  '(': { opening: '{', closing: '}' },
  '{': { opening: '(', closing: ')' },
  '"': { opening: "'", closing: "'" },
  "'": { opening: '"', closing: '"' },
};

const closing: Record<string, string> = {
  '(': ')',
  '{': '}',
  '"': '"',
  "'": "'",
};

function figureOut(text: string, position: vscode.Position): [string, number, number] | null {
  const line = text.split('\n')[position.line];

  if (!line) { return null; }

  const beforeCursor = line.substring(0, position.character);

  const matches = [...beforeCursor.matchAll(/[\("']/g)];

  while(matches.length) {
    const match = matches.pop()!;

    const startIndex = match['index']!;
    const openingCharacter = match[0];
    const closingCharacter = closing[openingCharacter];

    const afterCursor = line.substring(position.character);
    const stopIndex = afterCursor.indexOf(closingCharacter);

    if (stopIndex !== -1) {
      return [openingCharacter, startIndex, stopIndex + beforeCursor.length];
    }
  }

  return null;
}

function switchQuotes(text: string): string {
  const isSingleQuoted = text.startsWith("'") && text.endsWith("'");
  const isDoubleQuoted = text.startsWith('"') && text.endsWith('"');

  console.log({ isSingleQuoted, isDoubleQuoted });

  if (!isSingleQuoted && !isDoubleQuoted) { return text; }

  const innerContent = text.slice(1, -1);

  return isSingleQuoted
    ? `"${innerContent.replace(/"/g, '\\"')}"`
    : `'${innerContent.replace(/'/g, "\\'")}'`;
}

function switchBraces(text: string): string {
  const surrondedByCurlyBraces = text.startsWith("{") && text.endsWith("}");
  const surrondedByParentheses = text.startsWith('(') && text.endsWith(')');

  console.log({ surrondedByCurlyBraces, surrondedByParentheses });

  if (!surrondedByCurlyBraces && !surrondedByParentheses) { return text; }

  const innerContent = text.slice(1, -1);
  return surrondedByCurlyBraces ? `(${innerContent})` : `{${innerContent}}`;
}

function update(text: string, position: vscode.Position): string {
  if (!text) { return 'xxx'; }

  const situation = figureOut(text, position);
  if (!situation) { return text; }

  const [character, startIndex, stopIndex] = situation;

  if (!character) { return text; }

  const { opening, closing } = substitution[character];

  const before = text.substring(0, startIndex);
  const content = text.substring(startIndex + 1, stopIndex);
  const after = text.substring(stopIndex + 1);

  return `${before}${opening}${content}${closing}${after}`;
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "wrapper-switcher" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const disposable = vscode.commands.registerCommand('wrapper-switcher.switchQuotes', () => {
    // The code you place here will be executed every time your command is executed
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
      // Display a message box to the user
      vscode.window.showInformationMessage('No Editor!');
      return;
    }

    const { document, selection } = editor;

    if (selection.isEmpty) {
      const position = editor.selection.active;
      const { document } = editor;
      const line = document.lineAt(position.line);

      const switchedText = update(line.text, position);
      editor.edit(editBuilder => editBuilder.replace(line.range, switchedText));
    } else {
      const text = document.getText(selection);
      const switchedText = switchBraces(switchQuotes(text));
      editor.edit((editBuilder) => editBuilder.replace(selection, switchedText));
    }
  });

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
