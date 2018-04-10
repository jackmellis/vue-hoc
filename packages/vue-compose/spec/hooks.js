const hooks = require('require-extension-hooks');
const browserEnv = require('browser-env');
const moduleAlias = require('module-alias');
const path = require('path');
browserEnv();
// moduleAlias.addAlias('vue', 'vue/dist/vue.runtime.min.js');
moduleAlias.addAlias('vue', 'vue/dist/vue.runtime.js');
moduleAlias.addAlias('vue-compose', path.join(__dirname, '../src'));

hooks('js').exclude('**/node_modules/**/*.*').plugin('babel');
