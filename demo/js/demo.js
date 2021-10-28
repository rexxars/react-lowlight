'use strict'

const React = require('react')
const ReactDOM = require('react-dom')
const Lowlight = require('../../')
const $ = React.createElement

Lowlight.registerLanguage('js', require('highlight.js/lib/languages/javascript'))

const defaultValue = getDefaultValue()

const DemoApp = React.createClass({
  displayName: 'ReactLowlightDemo',

  getInitialState: function () {
    return { value: defaultValue }
  },

  setValue: function (e) {
    this.setState({
      value: e.target.value
    })
  },

  render: function () {
    return $('div', null,
      // Input
      $('div', { className: 'input' },
        $('h1', null, 'Input'),
        $('textarea', {
          defaultValue: defaultValue,
          onChange: this.setValue
        })
      ),

      // Output
      $('div', { className: 'output' },
        $('h1', null, 'Output'),
        $('div', { className: 'out' },
          $(Lowlight, { value: this.state.value, language: 'js' })
        )
      )
    )
  }
})

const Demo = React.createFactory(DemoApp)

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
