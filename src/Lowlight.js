import { createElement as h } from 'react'
import PropTypes from 'prop-types'
import { lowlight as low } from 'lowlight/lib/core.js'

import { mapWithDepth } from './mapChildren.js'
import addMarkers from './addMarkers.js'

let registeredLanguages = 0

function Lowlight (props) {
  if (process.env.NODE_ENV !== 'production') {
    if (!props.language && registeredLanguages === 0) {
      console.warn(
        'No language definitions seems to be registered, ' +
        'did you forget to call `Lowlight.registerLanguage`?'
      )
    }
  }

  const result = props.language
    ? low.highlight(props.language, props.value, { prefix: props.prefix })
    : low.highlightAuto(props.value, { prefix: props.prefix, subset: props.subset })

  const codeProps = result.data.language ? { className: 'hljs ' + result.data.language } : { className: 'hljs' }

  if (props.inline) {
    codeProps.style = { display: 'inline' }
    codeProps.className = props.className
  }

  let ast = result.children
  if (props.markers && props.markers.length > 0) {
    ast = addMarkers(ast, { prefix: props.prefix, markers: props.markers })
  }

  const value = ast.length === 0 ? props.value : ast.map(mapWithDepth(0))

  const code = h('code', codeProps, value)
  return props.inline ? code : h('pre', { className: props.className }, code)
}

Lowlight.propTypes = {
  className: PropTypes.string,
  inline: PropTypes.bool,
  language: PropTypes.string,
  prefix: PropTypes.string,
  subset: PropTypes.arrayOf(PropTypes.string),
  value: PropTypes.string.isRequired,
  markers: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.shape({
        line: PropTypes.number.isRequired,
        className: PropTypes.string
      })
    ])
  )
}

Lowlight.defaultProps = {
  className: 'lowlight',
  inline: false,
  prefix: 'hljs-'
}

Lowlight.registerLanguage = function () {
  registeredLanguages++
  low.registerLanguage.apply(low, arguments)
}

Lowlight.hasLanguage = function (lang) {
  return low.listLanguages().includes(lang)
}

export default Lowlight
