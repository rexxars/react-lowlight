var React = require('react')
var mocha = require('mocha')
var ReactDOM = require('react-dom/server')
var expect = require('chai').expect
var Lowlight = require('../')

var describe = mocha.describe
var it = mocha.it

describe('react-lowlight', function () {
  it('should render', function () {
    expect(render({value: ''})).to.equal('<pre class="lowlight"><code></code></pre>')
  })
})

function render (props) {
  return ReactDOM.renderToStaticMarkup(
    React.createElement(Lowlight, props)
  )
}
