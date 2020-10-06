'use babel'

export function activate() {
  console.log('activate')
  let depsCallbackID;
  const linterSwaggerDeps = () => {
    idleCallbacks.delete(depsCallbackID);
    // Load package dependencies
    require('atom-package-deps').install('linter-openapi');
    // Initialize dependencies
    loadDependencies();
  };
  depsCallbackID = window.requestIdleCallback(linterSwaggerDeps);
  idleCallbacks.add(depsCallbackID);
}


export function deactivate() {
  // Fill something here, optional
}

export function provideLinter() {
  console.log('providing that liter')
  return {
    name: 'Example',
    scope: 'file', // or 'project'
    lintsOnChange: false, // or true
    grammarScopes: ['source.yaml'],
    lint(textEditor) {
      console.log('got it working');
      const editorPath = textEditor.getPath()

      // Do something sync
      return [{
        severity: 'info',
        location: {
          file: editorPath,
          position: [[0, 0], [0, 1]],
        },
        excerpt: `A random value is ${Math.random()}`,
        description: `### What is this?\nThis is a randomly generated value`
      }]

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
    }
  }
}