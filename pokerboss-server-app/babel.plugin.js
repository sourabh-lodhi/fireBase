// We use this custom babel plugin to remove various imports,
// which are not relevant in production. See babel.config.js
// for more details on how this is used.
//
module.exports = function (_babel, opts) {
  const remove = Array.isArray(opts.remove) ? opts.remove : [opts.remove]
  return {
    name: 'babel-plugin-transform-remove-imports',
    visitor: {
      ImportDeclaration: function (path) {
        const importPath = path.node.source.value
        for (const pattern of remove) {
          if (typeof pattern === 'string' && importPath.indexOf(pattern) > -1) path.remove()
          if (pattern instanceof RegExp && importPath.search(pattern) > -1) path.remove()
        }
      },
    },
  }
}
