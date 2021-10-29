'use strict'

function longMoo (count) {
  if (count < 1) {
    return ''
  }

  let result = ''
  let pattern = 'oO0o'
  while (count > 1) {
    if (count & 1) {
      result += pattern
    }

    count >>= 1, pattern += pattern
  }

  return 'M' + result + pattern
}

console.log(longMoo(5))
// "MoO0ooO0ooO0ooO0ooO0o"
