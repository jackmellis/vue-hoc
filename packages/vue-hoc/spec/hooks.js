/* globals require */
const hooks = require('require-extension-hooks');
const browserEnv = require('browser-env');
browserEnv();
hooks('js').plugin('babel');
