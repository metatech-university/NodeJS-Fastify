'use strict';

const fsp = require('node:fs').promises;
const vm = require('node:vm');
const path = require('node:path');

const dbBuilder = require('../lib/db.js');
const common = require('../lib/common.js');

const OPTIONS = {
  timeout: 5000,
  displayErrors: false,
};

const load = async (filePath, sandbox) => {
  const src = await fsp.readFile(filePath, 'utf8');
  const code = `'use strict';\n{\n${src}\n}`;
  const script = new vm.Script(code, { ...OPTIONS, lineOffset: -2 });
  const context = vm.createContext(Object.freeze({ ...sandbox }));
  const exported = script.runInContext(context, OPTIONS);
  return exported;
};

const loadDir = async (dir, sandbox) => {
  const files = await fsp.readdir(dir, { withFileTypes: true });
  const container = {};
  for (const file of files) {
    const { name } = file;
    if (file.isFile() && !name.endsWith('.js')) continue;
    const location = path.join(dir, name);
    const key = path.basename(name, '.js');
    const loader = file.isFile() ? load : loadDir;
    container[key] = await loader(location, sandbox);
  }
  return container;
};

const loadApplication = async (appPath, logger) => {
  const sandbox = {
    console: Object.freeze(logger),
    common: Object.freeze(common),
  };

  const apiPath = path.join(appPath, './api');
  const configPath = path.join(appPath, './config');

  const config = await loadDir(configPath, sandbox);
  sandbox.config = Object.freeze(config);

  const db = dbBuilder(config.db);
  sandbox.db = Object.freeze(db);

  const api = await loadDir(apiPath, sandbox);
  sandbox.api = Object.freeze(api);

  return sandbox;
};

module.exports = {
  load,
  loadDir,
  loadApplication,
};
