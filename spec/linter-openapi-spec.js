'use babel';

import { join } from 'path';
import { provideLinter } from '../lib/index';

const { lint } = provideLinter();

describe('LinterOpenapi', () => {
  let workspaceElement, activationPromise;

  beforeEach(async () => {
    atom.workspace.destroyActivePaneItem();
    await atom.packages.activatePackage('language-yaml');
    await atom.packages.activatePackage('linter-openapi');
  });

  it('parses valid file with no error', async () => {
    const OPENAPI = join(__dirname, 'fixtures', 'petstore.yaml');
    const editor = await atom.workspace.open(OPENAPI);
    const messages = await lint(editor);

    expect(messages.length).toEqual(0);
  });
});
