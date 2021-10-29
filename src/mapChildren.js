import { createElement } from 'react'

function mapChild (child, i, depth) {
  if (child.tagName) {
    const props = Object.assign({ key: 'lo-' + depth + '-' + i }, child.properties)
    const children = child.children ? child.children.map(mapWithDepth(depth + 1)) : null

    return createElement(child.tagName, props, children)
  }

  return child.value
}

export const mapWithDepth = (depth) => {
  const mapChildrenWithDepth = (child, i) => {
    return mapChild(child, i, depth)
  }

  return mapChildrenWithDepth
}
