// // The module 'vscode' contains the VS Code extensibility API
// // Import the module and reference it with the alias vscode in your code below
// import * as vscode from 'vscode';

// // This method is called when your extension is activated
// // Your extension is activated the very first time the command is executed
// export function activate(context: vscode.ExtensionContext) {

// 	// Use the console to output diagnostic information (console.log) and errors (console.error)
// 	// This line of code will only be executed once when your extension is activated
// 	console.log('Congratulations, your extension "dna-editor" is now active!');

// 	// The command has been defined in the package.json file
// 	// Now provide the implementation of the command with registerCommand
// 	// The commandId parameter must match the command field in package.json
// 	const disposable = vscode.commands.registerCommand('dna-editor.helloWorld', () => {
// 		// The code you place here will be executed every time your command is executed
// 		// Display a message box to the user
// 		vscode.window.showInformationMessage('Hello World from dna-editor!');
// 	});

// 	context.subscriptions.push(disposable);
// }

// // This method is called when your extension is deactivated
// export function deactivate() {}

import * as vscode from 'vscode';
import { exec } from 'child_process';
import * as path from 'path';

// Define decoration types
const highlightDecorationType = vscode.window.createTextEditorDecorationType({
    backgroundColor: 'yellow'
});

const underlineDecorationType = vscode.window.createTextEditorDecorationType({
    textDecoration: 'underline'
});

// This method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "dna-editor" is now active!');

    // Command to show the current working directory
    const showWorkingDirectory = vscode.commands.registerCommand('dna-editor.showWorkingDirectory', () => {
        const cwd = process.cwd();
        vscode.window.showInformationMessage(`Current working directory: ${cwd}`);
        console.log(`Current working directory: ${cwd}`);
    });
    context.subscriptions.push(showWorkingDirectory);

    // Command to show sequence length
    const showLength = vscode.commands.registerCommand('dna-editor.showLength', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const selection = editor.selection;
            const text = editor.document.getText(selection);
            vscode.window.showInformationMessage(`Selected sequence length: ${text.length} characters`);
        }
    });
    context.subscriptions.push(showLength);

    // Command to generate reverse complement
    const reverseComplement = vscode.commands.registerCommand('dna-editor.reverseComplement', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const selection = editor.selection;
            const text = editor.document.getText(selection);
            const revComp = reverseComplementSequence(text);
            editor.edit(editBuilder => {
                editBuilder.replace(selection, revComp);
            });
        }
    });
    context.subscriptions.push(reverseComplement);

    // Command to show GC content
    const showGCContent = vscode.commands.registerCommand('dna-editor.showGCContent', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const selection = editor.selection;
            const text = editor.document.getText(selection);
            const gcContent = calculateGCContent(text);
            vscode.window.showInformationMessage(`GC content: ${gcContent.toFixed(2)}%`);
        }
    });
    context.subscriptions.push(showGCContent);

    // Command to highlight selected text
    const highlightText = vscode.commands.registerCommand('dna-editor.highlightText', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const selection = editor.selection;
            editor.setDecorations(highlightDecorationType, [selection]);
        }
    });
    context.subscriptions.push(highlightText);

	 // Command to clear highlight from selected text
	 const clearHighlightText = vscode.commands.registerCommand('dna-editor.clearHighlightText', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            editor.setDecorations(highlightDecorationType, []);
        }
    });
    context.subscriptions.push(clearHighlightText);

    // Command to underline selected text
    const underlineText = vscode.commands.registerCommand('dna-editor.underlineText', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const selection = editor.selection;
            editor.setDecorations(underlineDecorationType, [selection]);
        }
    });
    context.subscriptions.push(underlineText);

    // Command to clear underline from selected text
    const clearUnderlineText = vscode.commands.registerCommand('dna-editor.clearUnderlineText', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const selection = editor.selection;
            editor.setDecorations(underlineDecorationType, []);
        }
    });
    context.subscriptions.push(clearUnderlineText);

    // Command to call a plotting function
    const plotSequence = vscode.commands.registerCommand('dna-editor.plotSequence', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const selection = editor.selection;
            const text = editor.document.getText(selection);
            runPythonPlotScript(text);
        }
    });
    context.subscriptions.push(plotSequence);

	// Command to generate random base pairs with 50% GC content
	const generateRandomSequence = vscode.commands.registerCommand('dna-editor.generateRandomSequence', async () => {
		const lengthInput = await vscode.window.showInputBox({ prompt: 'Enter the desired length of the sequence' });
		if (lengthInput) {
			const length = parseInt(lengthInput, 10);
			if (!isNaN(length) && length > 0) {
				const randomSequence = generateRandomBasePairs(length);
				const editor = vscode.window.activeTextEditor;
				if (editor) {
					editor.edit(editBuilder => {
						editBuilder.insert(editor.selection.active, randomSequence);
					});
					vscode.window.showInformationMessage(`Generated random sequence: ${randomSequence}`);
				}
			} else {
				vscode.window.showErrorMessage('Please enter a valid number greater than 0');
			}
		}
	});
	context.subscriptions.push(generateRandomSequence);
}

// This method is called when your extension is deactivated
export function deactivate() {}

// Function to calculate reverse complement
function reverseComplementSequence(sequence: string): string {
    const complementMap: { [key: string]: string } = {
        'A': 'T', 'T': 'A', 'G': 'C', 'C': 'G',
        'a': 't', 't': 'a', 'g': 'c', 'c': 'g'
    };
    return sequence.split('').reverse().map(base => complementMap[base] || base).join('');
}

// Function to calculate GC content
function calculateGCContent(sequence: string): number {
    const gcCount = (sequence.match(/[GCgc]/g) || []).length;
    return (gcCount / sequence.length) * 100;
}

// Function to generate random base pairs with 50% GC content
function generateRandomBasePairs(length: number): string {
    const gcBases = ['G', 'C'];
    const atBases = ['A', 'T'];
    const halfLength = Math.floor(length / 2);
    let sequence = '';

    for (let i = 0; i < halfLength; i++) {
        sequence += gcBases[Math.floor(Math.random() * gcBases.length)];
    }

    for (let i = 0; i < length - halfLength; i++) {
        sequence += atBases[Math.floor(Math.random() * atBases.length)];
    }

    // Shuffle the sequence
    sequence = sequence.split('').sort(() => 0.5 - Math.random()).join('');
    return sequence;
}


// Function to run the Python plot script
function runPythonPlotScript(sequence: string) {
    const pythonPath = '/Users/zanechan/anaconda3/bin/python'; // Replace with the full path to your Python interpreter
    const scriptPath = path.join(__dirname, 'predict_structure.py');
    exec(`${pythonPath} ${scriptPath} ${sequence}`, (error, stdout, stderr) => {
        if (error) {
            vscode.window.showErrorMessage(`Error: ${stderr}`);
            return;
        }
        vscode.window.showInformationMessage(`MFE Structure: ${stdout.trim()}`);
    });
}