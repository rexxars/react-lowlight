'use strict'

var React = require('react')
var ReactDOM = require('react-dom')
var Lowlight = require('../../')
var $ = React.createElement

Lowlight.registerLanguage('js', require('highlight.js/lib/languages/javascript'))

var defaultValue = getDefaultValue()

var DemoApp = React.createClass({
  displayName: 'ReactLowlightDemo',

  getInitialState: function () {
    return {value: defaultValue}
  },

  setValue: function (e) {
    this.setState({
      value: e.target.value
    })
  },

  render: function () {
    return $('div', null,
      // Input
      $('div', {className: 'input'},
        $('h1', null, 'Input'),
        $('textarea', {
          defaultValue: defaultValue,
          onChange: this.setValue
        })
      ),

      // Output
      $('div', {className: 'output'},
        $('h1', null, 'Output'),
        $('div', {className: 'out'},
          $(Lowlight, {value: this.state.value, language: 'js'})
        )
      )
    )
  }
})

var Demo = React.createFactory(DemoApp)

ReactDOM.render(
  Demo(),
  document.getElementById('root')
)

// Hiding this ugliness down here.
function getDefaultValue () {
  return [
    '\'use strict\'\n',

    'function longMoo(count) {',
    '  if (count < 1) {',
    '    return \'\'',
    '  }\n',

    '  var result = \'\', pattern = \'oO0o\'',
    '  while (count > 1) {',
    '    if (count & 1) {',
    '      result += pattern',
    '    }\n',

    '    count >>= 1, pattern += pattern',
    '  }\n',

    '  return \'M\' + result + pattern',
    '}\n',

    'console.log(longMoo(5))',
    '// "MoO0ooO0ooO0ooO0ooO0o"'
  ].join('\n')
}
