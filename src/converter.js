import camelize from './utils/camelize'

function capitalize(val) {
  return val.charAt(0).toUpperCase() + val.slice(1)
}

export function styleToObject(style) {
  return style
    ? style
      .split(';')
      .map((s) => s.trim())
      .filter((s) => s)
      .reduce((acc, pair) => {
        const i = pair.indexOf(':')
        const prop = camelize(pair.slice(0, i))
        const value = pair.slice(i + 1).trim()

        prop.startsWith('webkit')
          ? (acc[capitalize(prop)] = value)
          : (acc[prop] = value)

        return acc
      }, {})
    : null
}

export function styleToString(style) {
  if (typeof style === 'string') {
    return style
  }

  return Object.keys(style).reduce((acc, key) => (
    acc + key.split(/(?=[A-Z])/).join('-').toLowerCase() + ':' + style[key] + ';'
  ), '')
}

function convert(createElement, element, extraProps = {}) {
  if (typeof element === 'string') {
    return element
  }

  const children = (element.children || []).map((child) => {
    return convert(createElement, child)
  })

  /* eslint-disable dot-notation */
  const mixins = Object.keys(element.attributes || {}).reduce(
    (acc, key) => {
      const val = element.attributes[key]

      if (key === 'style') {
        acc.attrs['style'] = styleToString(val)
      } else {
        if (key.indexOf('aria-') === 0 || key.indexOf('data-') === 0) {
          acc.attrs[key.toLowerCase()] = val
        } else {
          acc.attrs[camelize(key)] = val
        }
      }

      return acc
    },
    { attrs: {} }
  )

  /* eslint-enable */

  return createElement(element.tag, { ...mixins.attrs }, children)
}

export default convert
