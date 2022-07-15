import FontAwesomeIcon from '../FontAwesomeIcon'
import { styleToObject } from '../../converter'
import { cleanup, render, screen } from '@testing-library/svelte'
import { parse } from '@fortawesome/fontawesome-svg-core'
import semver from 'semver'

const SVG_ICONS_VERSION = semver.parse(
  require('@fortawesome/free-solid-svg-icons/package.json').version
)

export const REFERENCE_ICON_BY_STYLE = 0x00
export const ICON_ALIASES = 0x01
export const REFERENCE_ICON_USING_STRING = 0x02

export function coreHasFeature(feature) {
  if (feature === ICON_ALIASES) {
    // Aliases were not introduced until version 6 so we need to check the
    // installed free-solid-svg-icons package as well.
    return parse.icon && SVG_ICONS_VERSION.major >= 6
  }

  if (
    feature === REFERENCE_ICON_BY_STYLE ||
    feature === REFERENCE_ICON_USING_STRING
  ) {
    return parse.icon
  }
}

function matchReactTests(name) {
  switch (name) {
    case 'class':
      return 'className'
    case 'clippath':
      return 'clipPath'
    default:
      return name
  }
}

function convertToTestResult(component) {
  const attributes = component.getAttributeNames().reduce((acc, name) => {
    // Map class to className, so it's easy to copy over any new tests from react-fontawesome
    return {
      ...acc,
      [matchReactTests(name)]: component.getAttribute(name)
    }
  }, {})

  attributes.style = styleToObject(attributes.style)

  return {
    id: component.id,
    type: component.nodeName,
    props: attributes,
    children: component.children.length
      ? Array.from(component.children).map((child) =>
        convertToTestResult(child)
      )
      : [component.innerHTML]
  }
}

export function mount(props = {}, { createNodeMock } = {}) {
  let result = null
  render(FontAwesomeIcon, { props })
  const component = screen.queryByRole('img', { hidden: true })
  if (component) {
    result = convertToTestResult(component)
  }

  cleanup()

  return result
}
