var React = require('react')
var low = require('lowlight/lib/core')
var mapChildren = require('./mapChildren')

var registeredLanguages = 0

function Lowlight (props) {
  if (process.env.NODE_ENV !== 'production') {
    if (!props.language && registeredLanguages === 0) {
      console.warn(
        'No language definitions seems to be registered, ' +
        'did you forget to call `Lowlight.registerLanguage`?'
      )
    }
  }

  var result = props.language
    ? low.highlight(props.language, props.value, {prefix: props.prefix})
    : low.highlightAuto(props.value, {prefix: props.prefix, subset: props.subset})

  var codeProps = result.language
    ? {className: 'hljs ' + result.language}
    : {className: 'hljs'}

  return (
    React.createElement('pre', {className: props.className},
      React.createElement('code', codeProps,
        result.value.map(mapChildren.depth(0))
      )
    )
  )
}

Lowlight.propTypes = {
  className: React.PropTypes.string,
  language: React.PropTypes.string,
  value: React.PropTypes.string.isRequired,
  prefix: React.PropTypes.string,
  subset: React.PropTypes.arrayOf(React.PropTypes.string)
}

Lowlight.defaultProps = {
  className: 'lowlight',
  prefix: 'hljs-'
}

Lowlight.registerLanguage = function () {
  registeredLanguages++
  low.registerLanguage.apply(low, arguments)
}

module.exports = Lowlight
