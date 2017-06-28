'use strict'

var lineNumberify = function lineNumberify (ast) {
  var lineNumber = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1

  return ast.reduce(function (result, node) {
    if (node.type === 'text') {
      if (node.value.indexOf('\n') === -1) {
        node.lineNumber = lineNumber
        result.nodes.push(node)
        return result
      }

      var lines = node.value.split('\n')
      for (var i = 0; i < lines.length; i++) {
        result.nodes.push({
          type: 'text',
          value: lines[i],
          lineNumber: i === 0 ? lineNumber : ++lineNumber
        })
      }

      result.lineNumber = lineNumber
      return result
    }

    if (node.children) {
      node.lineNumber = lineNumber
      var processed = lineNumberify(node.children, lineNumber)
      node.children = processed.nodes
      result.lineNumber = processed.lineNumber
      result.nodes.push(node)
      return result
    }

    result.nodes.push(node)
    return result
  }, {nodes: [], lineNumber: lineNumber})
}

var wrapLines = function wrapLines (ast, markers, options) {
  var i = 0
  var wrapped = markers.reduce(function (nodes, marker) {
    var line = marker.line
    var children = []
    for (; i < ast.length; i++) {
      if (ast[i].lineNumber < line) {
        nodes.push(ast[i])
        continue
      }

      if (ast[i].lineNumber === line) {
        children.push(ast[i])
        continue
      }

      if (ast[i].lineNumber > line) {
        break
      }
    }

    nodes.push({
      type: 'element',
      tagName: 'div',
      properties: {className: [marker.className || (options.prefix + 'marker')]},
      children: children,
      lineNumber: line
    })

    return nodes
  }, [])

  for (; i < ast.length; i++) {
    wrapped.push(ast[i])
  }

  return wrapped
}

module.exports = function (ast, options) {
  var markers = options.markers.map(function (marker) {
    return marker.line ? marker : {line: marker}
  }).sort(function (nodeA, nodeB) {
    return nodeA.line - nodeB.line
  })

  var numbered = lineNumberify(ast).nodes
  var wrapped = wrapLines(numbered, markers, options)
  return wrapped
}
