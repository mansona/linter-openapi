'use babel'

const Enforcer = require('openapi-enforcer');
const yaml = require('yaml');

const options = {};


export function activate() {
  // Fill something here, optional
}

export function deactivate() {
  // Fill something here, optional
}

function walkErrorTree(error, key = []) {
  let collectedErrors = [];

  if(!error || !error.children) {
    return collectedErrors;
  }

  if(error.children.message.length) {
    error.children.message.forEach((message) => {
      collectedErrors.push({
        key,
        message
      })
    })
  }

  for (let localKey in error.children.at) {
    if(error.children.at[localKey].count) {
      let newKey = [...key, localKey];
      let subErrors = walkErrorTree(error.children.at[localKey], newKey);

      collectedErrors = [...collectedErrors, ...subErrors];
    }
  }

  return collectedErrors;
}

function getNode(items, key) {
  let nextNode = items.find((item) => item.key.value === key[0]);

  if (key.length === 1) {
    return nextNode;
  }

  if (key.length === 0) {
    console.error('something went wrong');
    return
  }

  return getNode(nextNode.value.items, key.slice(1))
}

function extractErrors(items, severity, parsed, editorPath) {
  return items.map((error) => {
    let node = getNode(parsed.contents.items, error.key);

    let errorObject = {
      severity,
      location: {
        file: editorPath,
        position: [
          [node.value.cstNode.rangeAsLinePos.start.line -1, node.value.cstNode.rangeAsLinePos.start.col - 1],
          [node.value.cstNode.rangeAsLinePos.end.line -1, node.value.cstNode.rangeAsLinePos.end.col - 1]
        ],
      },
      excerpt: error.message,
      description: `${severity} at path: ${error.key}
Error: ${error.message}`
    };

    return errorObject;
  })
}

export function provideLinter() {
  return {
    name: 'openapi',
    scope: 'file', // or 'project'
    lintsOnChange: false, // or true
    grammarScopes: ['source.yaml'],
    async lint(textEditor) {
      const editorPath = textEditor.getPath()

      const doc = yaml.parse(textEditor.getText());

      if(!doc.openapi) {
        // only validate openapi yaml files
        return [];
      }

      const parsed = yaml.parseDocument(textEditor.getText(), { keepCstNodes: true})

      let { error, warning } = await Enforcer(textEditor.getPath(), { fullResult: true })

      let errors = walkErrorTree(error);
      let warnings = walkErrorTree(warning);

      return [
        ...extractErrors(errors, 'error', parsed, editorPath),
        ...extractErrors(warnings, 'warning', parsed, editorPath),
      ]
    }
  }
}