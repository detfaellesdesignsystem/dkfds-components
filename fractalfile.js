'use strict';
const pkg = require('./package.json');
const path = require('path');
const fractal = require('@frctl/fractal').create();

const context = {
  'package': {
    name: pkg.name,
    version: pkg.version,
  },
  dkfds: {
    path: '../../dist',
  },
};

fractal.set('project.title', 'Frontend Styleguide');

const components = fractal.components;
components.set('ext', '.njk');
components.set('path', 'src/components');
components.set('default.preview', '@dkfds');
components.set('default.context', context);

// use Nunjucks as the templating engine
// path: when doing {{ include 'filename'}}, fractal should search in these folders. Exmaple {% include "all-svg-icons.svg"  %}
components.engine(require('@frctl/nunjucks')({
  filters: {
    jsonify: d => JSON.stringify(d, null, '  '),
    dataurl: (d, type) => `data:${type},${encodeURIComponent(d)}`,
  },
  paths: [
    'src/components',
    'src/img'
  ]
}));



const docs = fractal.docs;
docs.set('path', 'docs');

const web = fractal.web;

web.theme(require('@frctl/mandelbrot')({
  lang: 'en-US',
  skin: 'white',
  // display context data in YAML
  format: 'yaml',
  // which panels to show
  panels: [
    'html',
    'notes',
    'view',
    'context',
    'resources',
    'info',
  ],
}));

web.set('static.path', 'dist');
web.set('static.mount', 'dist');
// output files to /build
web.set('builder.dest', 'build');

module.exports = fractal;
