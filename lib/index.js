'use babel'

const validator = require('oas-validator');
const yaml = require('yaml');

const options = {};


export function activate() {
  // Fill something here, optional
}

export function deactivate() {
  // Fill something here, optional
}

// let obj = yaml.parse(text);
//         validator.validate(obj, options)
//         .then(function(){
//             vscode.window.showInformationMessage('Your OpenAPI document is '+(lint ? 'excellent!' : 'valid.'));
//         })
// 	    .catch(function(ex){
//             dc.delete(editor.document.uri);
//             const diagnostics = [];
//             let range; // TODO
//             let error = new vscode.Diagnostic(range, ex.message, vscode.DiagnosticSeverity.Error);
//             error.source = 'openapi-lint';
//             diagnostics.push(error);
//             for (let warning of options.warnings||[]) {
//                 let warn = new vscode.Diagnostic(range, warning.message, vscode.DiagnosticSeverity.Warning);
//                 warn.source = 'openapi-lint';
//                 if (warning.rule.url) {
//                     warn.code = { value: warning.ruleName, target: vscode.Uri.parse(warning.rule.url+'#'+warning.ruleName) };
//                 }
//                 else {
//                     warn.code = warning.ruleName;
//                 }
//                 diagnostics.push(warn);
//             }
//             dc.set(editor.document.uri, diagnostics);
// 	    });

export function provideLinter() {
  return {
    name: 'openapi',
    scope: 'file', // or 'project'
    lintsOnChange: false, // or true
    grammarScopes: ['source.yaml'],
    async lint(textEditor) {
      const editorPath = textEditor.getPath()

      const parsed = yaml.parse(textEditor.getText())

      console.log('we parsed!', parsed)

      try {
        const result = await validator.validate(parsed, {});

        console.log(result);

        // // Do something sync
        // return [{
        //   severity: 'info',
        //   location: {
        //     file: editorPath,
        //     position: [[0, 0], [0, 1]],
        //   },
        //   excerpt: `A random value is ${Math.random()}`,
        //   description: `### What is this?\nThis is a randomly generated value`
        // }]

        // Do something async
        return new Promise(function(resolve) {
          resolve([{
            severity: 'info',
            location: {
              file: editorPath,
              position: [[0, 0], [0, 1]],
            },
            excerpt: `A random value is ${Math.random()}`,
            description: `### What is this?\nThis is a randomly generated value`
          }])
        })
      } catch (err) {
        console.error('got an error parsing', err);
        return [{
          severity: 'error',
          location: {
            file: editorPath,
            position: [[0, 0], [0, 1]],
          },
          excerpt: err.message,
          description: err.message
        }]
      }
    }
  }
}