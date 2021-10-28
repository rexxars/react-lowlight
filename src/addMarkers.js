'use strict'

const lineNumberify = function lineNumberify (ast) {
  let lineNumber = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1

  return ast.reduce(function (result, node) {
    if (node.type === 'text') {
      if (node.value.indexOf('\n') === -1) {
        node.lineNumber = lineNumber
        result.nodes.push(node)
        return result
      }

      const lines = node.value.split('\n')
      for (let i = 0; i < lines.length; i++) {
        result.nodes.push({
          type: 'text',
          value: i === lines.length - 1 ? lines[i] : lines[i] + '\n',
          lineNumber: i === 0 ? lineNumber : ++lineNumber
        })
      }

      result.lineNumber = lineNumber
      return result
    }

    if (node.children) {
      node.lineNumber = lineNumber
      const processed = lineNumberify(node.children, lineNumber)
      node.children = processed.nodes
      result.lineNumber = processed.lineNumber
      result.nodes.push(node)
      return result
    }

    result.nodes.push(node)
    return result
  }, { nodes: [], lineNumber: lineNumber })
}

const wrapLines = function wrapLines (ast, markers, options) {
  let i = 0
  const wrapped = markers.reduce(function (nodes, marker) {
    const line = marker.line
    const children = []
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
      properties: { className: [marker.className || (options.prefix + 'marker')] },
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
  const markers = options.markers.map(function (marker) {
    return marker.line ? marker : { line: marker }
  }).sort(function (nodeA, nodeB) {
    return nodeA.line - nodeB.line
  })

  const numbered = lineNumberify(ast).nodes
  const wrapped = wrapLines(numbered, markers, options)
  return wrapped
}
