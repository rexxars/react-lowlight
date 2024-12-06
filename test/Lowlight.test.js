import { describe, it, expect, vi } from 'vitest'
import React from 'react'
import ReactDOM from 'react-dom/server'

import javascript from 'highlight.js/lib/languages/javascript'
import haml from 'highlight.js/lib/languages/haml'

import Lowlight from '../src/Lowlight'

describe('react-lowlight', () => {
  it('should warn if trying to use unloaded language', () => {
    const originalConsoleWarn = console.warn
    console.warn = vi.fn()

    expect(render({ value: '' }, { withWrapper: true })).toBe(
      '<pre class="lowlight"><code class="hljs"></code></pre>'
    )

    expect(console.warn).toHaveBeenCalledWith(
      'No language definitions seems to be registered, did you forget to call `Lowlight.registerLanguage`?'
    )

    console.warn = originalConsoleWarn
  })

  it('should allow registering languages through API', () => {
    Lowlight.registerLanguage('js', javascript)
    Lowlight.registerLanguage('haml', haml)
  })

  it('should be able to check registered language via hasLanguage API', () => {
    expect(Lowlight.hasLanguage('js')).toBe(true)
    expect(Lowlight.hasLanguage('css')).toBe(false)
  })

  it('should render empty if no code is given', () => {
    expect(render({ value: '' }, { withWrapper: true })).toBe(
      '<pre class="lowlight"><code class="hljs"></code></pre>'
    )
  })

  it('should render simple JS snippet correct', () => {
    expect(render({ value: '"use strict";' }, { withWrapper: true })).toBe(
      '<pre class="lowlight">' +
      '<code class="hljs js">' +
      '<span class="hljs-meta">&quot;use strict&quot;</span>;' +
      '</code>' +
      '</pre>'
    )
  })

  it('should use the specified language', () => {
    expect(render({ value: '', language: 'haml' }, { withWrapper: true })).toBe(
      '<pre class="lowlight"><code class="hljs haml"></code></pre>'
    )
  })

  it('should be able to render inline', () => {
    expect(
      render(
        { value: 'var foo = "bar"', language: 'js', inline: true, className: 'moop' },
        { withWrapper: true }
      )
    ).toBe(
      '<code class="moop" style="display:inline"><span class="hljs-keyword">var</span> foo = <span class="hljs-string">&quot;bar&quot;</span></code>'
    )
  })

  it('should render value as-is if unable to highlight in auto mode', () => {
    const code = 'StoriesController stories = client.Stories;\n'
    expect(render({ value: code }, { withWrapper: true })).toBe(
      '<pre class="lowlight"><code class="hljs">' + code + '</code></pre>'
    )
  })

  it('should be able to highlight specific lines with markers', () => {
    const code = '{\n  title: "Sanity",\n  url: "https://sanity.io/"\n}\n'
    const markers = [2, { line: 3, className: 'url' }]
    expect(render({ value: code, markers, language: 'js' }, { withWrapper: true })).toBe(
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

function render (props, options = {}) {
  const html = options.reactAttrs
    ? ReactDOM.renderToString(React.createElement(Lowlight, props))
    : ReactDOM.renderToStaticMarkup(React.createElement(Lowlight, props))

  if (!options.withWrapper) {
    return html.replace(/.*?<code.*?>([\s\S]*)<\/code>.*/g, '$1')
  }

  return html
}
