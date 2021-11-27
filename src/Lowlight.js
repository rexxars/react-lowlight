import { createElement as h, forwardRef } from 'react'
import { lowlight as low } from 'lowlight/lib/core.js'

import { mapWithDepth } from './mapChildren.js'
import addMarkers from './addMarkers.js'

const Lowlight = forwardRef((props, ref) => {
  if (process.env.NODE_ENV !== 'production') {
    if (!props.language && low.listLanguages().length === 0) {
      console.warn(
        'No language definitions seems to be registered, ' +
        'did you forget to call `Lowlight.registerLanguage`?'
      )
    }
  }

  const result = props.language
    ? low.highlight(props.language, props.value, { prefix: props.prefix })
    : low.highlightAuto(props.value, { prefix: props.prefix, subset: props.subset })

  let ast = result.children
  if (props.markers && props.markers.length && ast.length) {
    ast = addMarkers(ast, { prefix: props.prefix, markers: props.markers })
  }

  const value = ast.length === 0 ? props.value : ast.map(mapWithDepth(0))

  const codeProps = {
    className: 'hljs',
    style: {},
    ref: null
  }

  const preProps = {
    ref,
    className: props.className
  }

  if (result.data.language) {
    codeProps.className += (' ' + result.data.language)
  }

  if (props.inline) {
    codeProps.style = { display: 'inline' }
    codeProps.className = props.className
    codeProps.ref = ref
  }

  const code = h('code', codeProps, value)
  return props.inline ? code : h('pre', preProps, code)
})

Lowlight.displayName = 'Lowlight'

Lowlight.defaultProps = {
  className: 'lowlight',
  inline: false,
  prefix: 'hljs-'
}

Lowlight.registerLanguage = low.registerLanguage

Lowlight.hasLanguage = (lang) => {
  return low.listLanguages().includes(lang)
}

export default Lowlight
