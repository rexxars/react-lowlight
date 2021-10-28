import { createElement } from 'react'

function mapChild (child, i, depth) {
  if (child.tagName) {
    return createElement(
      child.tagName,
      assign({ key: 'lo-' + depth + '-' + i }, child.properties),
      child.children && child.children.map(mapWithDepth(depth + 1))
    )
  }

  return child.value
}

function mapWithDepth (depth) {
  return function mapChildrenWithDepth (child, i) {
    return mapChild(child, i, depth)
  }
}

function assign (dst, src) {
  for (const key in src) {
    dst[key] = src[key]
  }

  return dst
}

export default {
  depth: mapWithDepth
}
