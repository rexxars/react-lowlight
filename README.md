# react-lowlight

Syntax highlighter for React, utilizing VDOM for efficient updates

[![npm version](https://badgen.net/npm/v/express?style=flat-square)](https://npmjs.com/package/react-lowlight)
[![Tests](https://github.com/rexxars/react-lowlight/actions/workflows/tests.yml/badge.svg)](https://github.com/rexxars/react-lowlight/actions/workflows/tests.yml)

- Thin wrapper on top of [lowlight](https://github.com/wooorm/lowlight) (Syntax highlighting using VDOM)
- Lowlight uses [highlight.js](https://github.com/isagalaev/highlight.js) under the hood, thus supports all the same syntaxes
- About ~18KB (6.5KB gziped) when using a single language syntax. Each language tends to pack on another ~2KB uncompressed.

Feel free to check out a [super-simple demo](http://rexxars.github.io/react-lowlight/).

## Installation

This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).
In Node.js (version 12.20+, 14.14+, or 16.0+), install with [npm](https://docs.npmjs.com/cli/install):

```bash
$ npm install react-lowlight highlight.js
```

You'll also need to provide the [highlight.js](https://github.com/highlightjs/highlight.js/blob/main/SUPPORTED_LANGUAGES.md) language definitions you want to use. We don't bundle these in order to not bloat the component with unused definitions.

## Usage

```js
import Lowlight from 'react-lowlight'

// Load any languages you want to use
// (see https://github.com/highlightjs/highlight.js/tree/main/src/languages)
import javascript from 'highlight.js/lib/languages/javascript'

// Then register them with lowlight
Lowlight.registerLanguage('js', javascript)

ReactDOM.render(
  <Lowlight language="js" value="/* Code to highlight */" />,
  document.getElementById('target')
)
```

Note that the `language` property is optional, but significantly increases the speed and reliability of rendering.

If you want to load multiple languages at once

```js
import Lowlight from 'react-lowlight'

import 'react-lowlight/common.js'
// import 'react-lowlight/all.js' // <- to import all languages

ReactDOM.render(
  <Lowlight language="js" value="/* Code to highlight */" />,
  document.getElementById('target')
)
```

Imports `react-lowlight/common.js` and `react-lowlight/all.js` are re-exports from lowlight. See here https://github.com/wooorm/lowlight#syntaxes for more details

## Styling

Stylesheets are not automatically handled for you - but there is [a bunch of premade styles](https://github.com/highlightjs/highlight.js/tree/main/src/styles) for highlight.js which you can simply drop in and they'll "just work". You can either grab these from the source, of pull them in using a CSS loader - whatever works best for you. They're also available on [cdnjs](https://cdnjs.com/libraries/highlight.js):

```html
<link
  rel="stylesheet"
  href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.3.1/styles/default.min.css"
/>
```

Note that when using the `markers` feature, there is an additional class name called `hljs-marker` which is not defined by highlight js as it's not a part of its feature set. You can either set it yourself, or you can explicitly set class names on markers.

## Props

| Name        | Description                                                                               |
| :---------- | :---------------------------------------------------------------------------------------- |
| `className` | Class name for the outermost `pre` tag. Default: `lowlight`                               |
| `language`  | Language to use for syntax highlighting this value. Must be registered prior to usage.    |
| `value`     | The code snippet to syntax highlight                                                      |
| `prefix`    | Class name prefix for individual node. Default: `hljs-`                                   |
| `subset`    | Array of languages to limit the auto-detection to.                                        |
| `inline`    | Whether code should be displayed inline (no `<pre>` tag, sets `display: inline`)          |
| `markers`   | Array of lines to mark. Can also be specified in `{line: <num>, className: <class>}` form |

## Dynamic loading

You can use `Lowlight.hasLanguage(language)` to check if a language has been registered. Combining this with Webpack's [code splitting abilities](https://webpack.js.org/guides/code-splitting/) (or something similar), you should be able to load definitions for languages on the fly.

## License

MIT-licensed. See [LICENSE](./LICENSE).
