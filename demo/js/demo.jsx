import { useState } from 'react'
import ReactDOM from 'react-dom'

import Lowlight from '../../src/Lowlight'
import javascript from 'highlight.js/lib/languages/javascript'

Lowlight.registerLanguage('js', javascript)

const App = () => {
  const [value, setValue] = useState(getDefaultValue())

  const handleChange = (e) => {
    setValue(e.target.value)
  }

  return (
    <div>
      <div className='input'>
        <h1>Input</h1>
        <textarea value={value} onChange={handleChange} />
      </div>
      <div className='output'>
        <h1>Output</h1>
        <Lowlight language='js' value={value} />
      </div>
    </div>
  )
}

ReactDOM.render(
  <App />,
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
