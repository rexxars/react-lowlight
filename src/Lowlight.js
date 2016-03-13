var React = require('react')
var low = require('lowlight/lib/core')
var mapChildren = require('./mapChildren')

function Lowlight (props) {
  var result = props.language
    ? low.highlight(props.language, props.value, {prefix: props.prefix})
    : low.highlightAuto(props.value, {prefix: props.prefix, subset: props.subset})

  var preOpts = props.className ? {className: props.className} : null
  return (
    React.createElement('pre', preOpts,
      React.createElement('code', null,
        result.value.map(mapChildren)
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

Lowlight.registerLanguage = low.registerLanguage

module.exports = Lowlight
