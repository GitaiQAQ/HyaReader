// https://github.com/shelljs/shelljs
require('./check-versions')()
require('shelljs/global')
env.NODE_ENV = 'production'

var path = require('path')
var config = require('../config')
var ora = require('ora')
var webpack = require('webpack')
var webpackConfig = require('./webpack.prod.conf')

console.log(
  '  You have to configure the deployment settings in `config/index.js` first!\n' +
  '  Example:\n' +
  '     deploy:\n' +
  '         repo: <repository url>\n' +
  '         branch: [branch]\n' 
)

rm('-rf', `${config.build.assetsRoot}/.git`)
cd(config.build.assetsRoot)

if (exec('git init').code !== 0) {
  echo('Error: Git init failed');
  exit(1);
}

if (exec('git add -A').code !== 0) {
  echo('Error: Git add failed');
  exit(1);
}

if (exec(`git commit -am "${config.deploy.message || "Auto-commit"}"`).code !== 0) {
  echo('Error: Git commit failed');
  exit(1);
}

if (exec(`git push -u "${config.deploy.repo}" HEAD:${config.deploy.branch} --force`).code !== 0) {
  echo('Error: Git push failed');
  exit(1);
}