const plugins = [
  ['@babel/plugin-proposal-decorators', { legacy: true }],
  ['@babel/plugin-proposal-optional-catch-binding'],
  ['babel-plugin-module-resolver', { root: ['./'], alias: {} }],
]

const production = {
  plugins: [['babel-plugin-transform-remove-console'], ['./babel.plugin.js']],
}

module.exports = {
  presets: [['@babel/preset-env', { targets: { node: 'current' } }], '@babel/preset-typescript'],
  env: { production },
  plugins,
}
