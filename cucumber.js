const config = require('./support/config');

const common = {
  require: [
    'support/world.js',
    'support/hooks.js',
    'step_definitions/**/*.js',
  ],
  format: [
    'summary',
    'allure-cucumberjs/reporter',
  ],
  formatOptions: {
    resultsDir: './allure-results',
  },
  publishQuiet: true,
};

module.exports = {
  default: {
    ...common,
    paths: ['features/**/*.feature'],
  },
  smoke: {
    ...common,
    paths: ['features/**/*.feature'],
    tags: '@smoke',
  },
  regression: {
    ...common,
    paths: ['features/**/*.feature'],
    tags: '@regression',
  },
  negative: {
    ...common,
    paths: ['features/**/*.feature'],
    tags: '@negative',
  },
  parallel: {
    ...common,
    paths: ['features/**/*.feature'],
    parallel: config.parallel.workers,
  },
};
