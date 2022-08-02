import FontAwesomeIcon from '../FontAwesomeIcon'
import { styleToObject, styleToString } from '../../converter'
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

function convertToTestResult(component, props) {
  const attributes = component.getAttributeNames().reduce((acc, name) => {
    return {
      ...acc,
      [name]: component.getAttribute(name)
    }
  }, {})

  attributes.style = styleToObject(attributes.style)

  let nodeName = component.nodeName.toLowerCase()
  if (component.nodeName === 'svelte:element') {
    // temp extreme silliness due to svelte-testing-library issue w/ svelte:options resulting
    // in svelte:element instead of proper nodeName - grossly inaccurate but works for now
    if (props?.symbol) {
      nodeName = 'symbol'
    } else if (props?.title) {
      nodeName = 'title'
    } else {
      nodeName = 'svg'
    }
  }

  return {
    id: component.id,
    type: nodeName,
    props: attributes,
    children: component.children.length
      ? Array.from(component.children).map((child) =>
        convertToTestResult(child, props)
      )
      : [component.innerHTML]
  }
}

export function mount(props = {}, { createNodeMock } = {}) {
  let result = null

  // Conversion for test values to make it easy to copy over new tests from react-fontawesome
  if (props.style) {
    props.style = styleToString(props.style)
  }

  props.class = props.class || props.className

  render(FontAwesomeIcon, { props })
  const domComponent = screen.queryByRole('img', { hidden: true })
  if (domComponent) {
    result = convertToTestResult(domComponent, props)
  }

  cleanup()

  return result
}
