/* eslint-disable @typescript-eslint/naming-convention */
import * as vscode from 'vscode';

const substitution: Record<string, Record<string, string>> = {
  '(': { opening: '{{', closing: '}}' },
  '{{': { opening: '(', closing: ')' },
  '"': { opening: "'", closing: "'" },
  "'": { opening: '"', closing: '"' },
};

const closing: Record<string, string> = {
  '(': ')',
  '{{': '}}',
  '"': '"',
  "'": "'",
};

function figureOut(text: string, position: vscode.Position, document: vscode.TextDocument): [string, number, number] | null {
  const line = document.lineAt(position.line).text;

  if (!line) {
    vscode.window.showInformationMessage('Please select a range, including the wrappers.');

    return null;
  }

  const beforeCursor = line.substring(0, position.character);

  const matches = [...beforeCursor.matchAll(/{{|[\("']/g)];

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

  if (!isSingleQuoted && !isDoubleQuoted) { return text; }

  const innerContent = text.slice(1, -1);

  return isSingleQuoted
    ? `"${innerContent.replace(/"/g, '\\"')}"`
    : `'${innerContent.replace(/'/g, "\\'")}'`;
}

function switchBraces(text: string): string {
  const surrondedByCurlyBraces = text.startsWith("{") && text.endsWith("}");
  const surrondedByParentheses = text.startsWith('(') && text.endsWith(')');

  if (!surrondedByCurlyBraces && !surrondedByParentheses) { return text; }

  const innerContent = text.slice(1, -1);
  return surrondedByCurlyBraces ? `(${innerContent})` : `{${innerContent}}`;
}

function update(text: string, position: vscode.Position, document: vscode.TextDocument): string {
  const situation = figureOut(text, position, document);
  if (!situation) { return text; }

  const [character, startIndex, stopIndex] = situation;

  if (!character) { return text; }

  const { opening, closing } = substitution[character];

  const before = text.substring(0, startIndex);
  const content = text.substring(startIndex + character.length, stopIndex);
  const after = text.substring(stopIndex + character.length);

  return `${before}${opening}${content}${closing}${after}`;
}

const switchTheWrapper = () => {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    // Display a message box to the user
    vscode.window.showInformationMessage('No Editor!');
    return;
  }

  const { document, selections } = editor;

  // Create a WorkspaceEdit to accumulate the edit operations
  const workspaceEdit = new vscode.WorkspaceEdit();

  selections.forEach((selection, index) => {
    if (selection.isEmpty) {
      const position = selection.active;
      const line = document.lineAt(position.line);

      const switchedText = update(line.text, position, document);
      workspaceEdit.replace(document.uri, line.range, switchedText);
    } else {
      const text = document.getText(selection);
      const switchedText = switchBraces(switchQuotes(text));
      workspaceEdit.replace(document.uri, selection, switchedText);
    }
  });

  // Apply all edit operations together
  vscode.workspace.applyEdit(workspaceEdit);
};

export default switchTheWrapper;
