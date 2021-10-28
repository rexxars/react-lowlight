'use strict'

const React = require('react')
const PropTypes = require('prop-types')
const low = require('lowlight/lib/core')
const mapChildren = require('./mapChildren')
const addMarkers = require('./addMarkers')
const h = React.createElement

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

  const codeProps = result.language ? { className: 'hljs ' + result.language } : { className: 'hljs' }

  if (props.inline) {
    codeProps.style = { display: 'inline' }
    codeProps.className = props.className
  }

  let ast = result.value
  if (props.markers && props.markers.length > 0) {
    ast = addMarkers(ast, { prefix: props.prefix, markers: props.markers })
  }

  const value = ast.length === 0 ? props.value : ast.map(mapChildren.depth(0))

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
  return !!low.getLanguage(lang)
}

module.exports = Lowlight
