// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import switchTheWrapper from './commands/switch-the-wrapper';
import removeAttributes from './commands/remove-attributes';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "wrapper-switcher" is now active!');

  const commands = [
    { id: 'wrapper-switcher.switchQuotes', method: switchTheWrapper },
    { id: 'wrapper-switcher.prune', method: removeAttributes },
  ];

  commands.forEach(({ id, method }) => {
    const disposable = vscode.commands.registerCommand(id, method);

    context.subscriptions.push(disposable);
  });
}

// This method is called when your extension is deactivated
export function deactivate() {}
