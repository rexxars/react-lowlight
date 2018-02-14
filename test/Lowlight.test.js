var React = require('react')
var mocha = require('mocha')
var stderr = require('test-console').stderr
var ReactDOM = require('react-dom/server')
var js = require('highlight.js/lib/languages/javascript')
var haml = require('highlight.js/lib/languages/haml')
var expect = require('chai').expect
var Lowlight = require('../')

var describe = mocha.describe
var before = mocha.before
var it = mocha.it

describe('react-lowlight', function () {
  before('should warn if trying to use unloaded language', function () {
    var inspect = stderr.inspect()

    expect(render({value: ''}, {withWrapper: true})).to.equal(
      '<pre class="lowlight"><code class="hljs"></code></pre>'
    )

    inspect.restore()
    expect(inspect.output).to.eql([
      'No language definitions seems to be registered, did you forget to call `Lowlight.registerLanguage`?\n'
    ])
  })

  before('should allow registering languages through API', function () {
    Lowlight.registerLanguage('js', js)
    Lowlight.registerLanguage('haml', haml)
  })

  it('should render empty if no code is given', function () {
    expect(render({value: ''}, {withWrapper: true})).to.equal(
      '<pre class="lowlight"><code class="hljs"></code></pre>'
    )
  })

  it('should render simple JS snippet correct', function () {
    expect(render({value: '"use strict";'}, {withWrapper: true})).to.equal(
      '<pre class="lowlight">' +
        '<code class="hljs js">' +
        '<span class="hljs-meta">&quot;use strict&quot;</span>;' +
        '</code>' +
        '</pre>'
    )
  })

  it('should use the specified language', function () {
    expect(render({value: '', language: 'haml'}, {withWrapper: true})).to.equal(
      '<pre class="lowlight"><code class="hljs haml"></code></pre>'
    )
  })

  it('should be able to render inline', function () {
    expect(
      render(
        {value: 'var foo = "bar"', language: 'js', inline: true, className: 'moop'},
        {withWrapper: true}
      )
    ).to.equal(
      '<code class="moop" style="display:inline"><span class="hljs-keyword">var</span> foo = <span class="hljs-string">&quot;bar&quot;</span></code>'
    )
  })

  it('should render value as-is if unable to highlight in auto mode', function () {
    const code = 'StoriesController stories = client.Stories;\n'
    expect(render({value: code}, {withWrapper: true})).to.equal(
      '<pre class="lowlight"><code class="hljs">' + code + '</code></pre>'
    )
  })

  it('should be able to highlight specific lines with markers', function () {
    const code = '{\n  title: "Sanity",\n  url: "https://sanity.io/"\n}\n'
    const markers = [2, {line: 3, className: 'url'}]
    expect(render({value: code, markers}, {withWrapper: true})).to.equal(
      [
        '<pre class="lowlight"><code class="hljs js">{\n<div class="hljs-marker">',
        '  <span class="hljs-attr">title</span>: <span class="hljs-string">',
        '&quot;Sanity&quot;</span>,\n</div><div class="url">  ',
        '<span class="hljs-attr">url</span>: <span class="hljs-string">',
        '&quot;https://sanity.io/&quot;</span>\n</div>}\n</code></pre>'
      ].join('')
    )
  })
})

function render (props, options) {
  var opts = options || {}
  var html = opts.reactAttrs
    ? ReactDOM.renderToString(React.createElement(Lowlight, props))
    : ReactDOM.renderToStaticMarkup(React.createElement(Lowlight, props))

  if (!opts.withWrapper) {
    return html.replace(/.*?<code.*?>([\s\S]*)<\/code>.*/g, '$1')
  }

  return html
}
