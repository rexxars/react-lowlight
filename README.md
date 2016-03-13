# react-lowlight

Syntax highlighter for React, utilizing VDOM for efficient updates

[![npm version](http://img.shields.io/npm/v/react-lowlight.svg?style=flat-square)](http://browsenpm.org/package/react-lowlight)[![Build Status](http://img.shields.io/travis/rexxars/react-lowlight/master.svg?style=flat-square)](https://travis-ci.org/rexxars/react-lowlight)

* Thin wrapper on top of [lowlight](https://github.com/wooorm/lowlight) (Syntax highlighting using VDOM)
* Lowlight uses [highlight.js](https://github.com/isagalaev/highlight.js) under the hood, thus supports all the same syntaxes
* About ~18KB (6.5KB gziped) when using a single language syntax. Each language tends to pack on another ~2KB uncompressed.

Feel free to check out a [super-simple demo](http://rexxars.github.io/react-lowlight/).

## Installation

```
npm install --save react-lowlight highlight.js
```

You'll also need to provide the [highlight.js](https://github.com/isagalaev/highlight.js/blob/master/docs/css-classes-reference.rst#language-names-and-aliases) language definitions you want to use. We don't bundle these in order to not bloat the component with unused definitions.

## Usage

```js
import Lowlight from 'react-lowlight'

// Load any languages you want to use (see https://github.com/isagalaev/highlight.js/tree/master/src/languages)
import js from 'highlight.js/lib/languages/javascript'

// Then register them with lowlight
Lowlight.registerLanguage('js', js)

ReactDOM.render(
  <Lowlight
    language="js"
    value="/* Code to highlight */"
  />,
  document.getElementById('target')
)
```

Note that the `language` property is optional, but significantly increases the speed and reliability of rendering.

## Styling

Stylesheets are not automatically handled for you - but there is [a bunch of premade styles](https://github.com/isagalaev/highlight.js/tree/master/src/styles) for highlight.js which you can simply drop in and they'll "just work". You can either grab these from the source, of pull them in using a CSS loader - whatever works best for you. They're also available on [cdnjs](https://cdnjs.com/libraries/highlight.js):

```html
<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.2.0/styles/default.min.css">
```

## Props

| Name        | Description                                                                            |
|:------------|:---------------------------------------------------------------------------------------|
| `className` | Class name for the outermost `pre` tag. Default: `lowlight`                            |
| `language`  | Language to use for syntax highlighting this value. Must be registered prior to usage. |
| `value`     | The code snippet to syntax highlight                                                   |
| `prefix`    | Class name prefix for individual node. Default: `hljs-`                                |
| `subset`    | Array of languages to limit the auto-detection to.                                     |

## License

MIT-licensed. See LICENSE.
