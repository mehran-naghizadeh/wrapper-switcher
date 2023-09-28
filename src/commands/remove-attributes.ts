import * as vscode from 'vscode';

function update(text: string, position: vscode.Position, document: vscode.TextDocument): string {
  return text.replace(/<([^\s]+)[^>]*>/, `<$1>`);
}

const removeAttributes = () => {
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
      debugger;
    }
  });

  // Apply all edit operations together
  vscode.workspace.applyEdit(workspaceEdit);
};

export default removeAttributes;