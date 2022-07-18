<script>
  import classList from '../utils/get-class-list-from-props'
  import convert from '../converter'
  import { icon as coreIcon, parse } from '@fortawesome/fontawesome-svg-core'
  import log from '../logger'
  import normalizeIconArgs from '../utils/normalize-icon-args'
  import objectWithKey from '../utils/object-with-key'
  import Element from './Element.svelte'

  // Most of the props are passed via $$props, so not "unused"
  // svelte-ignore unused-export-let
  export let border = false
  export let className = ''
  export let mask = null
  export let maskId = null
  // svelte-ignore unused-export-let
  export let fixedWidth = false
  // svelte-ignore unused-export-let
  export let inverse = false
  // svelte-ignore unused-export-let
  export let flip = false
  export let icon = null
  // svelte-ignore unused-export-let
  export let listItem = false
  // svelte-ignore unused-export-let
  export let pull = null
  // svelte-ignore unused-export-let
  export let pulse = false
  // svelte-ignore unused-export-let
  export let rotation = null
  // svelte-ignore unused-export-let
  export let size = null
  // svelte-ignore unused-export-let
  export let spin = false
  // svelte-ignore unused-export-let
  export let spinPulse = false
  // svelte-ignore unused-export-let
  export let spinReverse = false
  // svelte-ignore unused-export-let
  export let beat = false
  // svelte-ignore unused-export-let
  export let fade = false
  // svelte-ignore unused-export-let
  export let beatFade = false
  // svelte-ignore unused-export-let
  export let bounce = false
  // svelte-ignore unused-export-let
  export let shake = false
  export let symbol = false
  export let title = ''
  export let titleId = null
  export let transform = null
  // svelte-ignore unused-export-let
  export let swapOpacity = false
  // TODO: Implement ref
  // svelte-ignore unused-export-let
  export let ref = null
  export let style = null

  const iconLookup = normalizeIconArgs(icon)

  const classes = objectWithKey('classes', [
    ...classList($$props),
    ...className.split(' ')
  ])
  const transformObj = objectWithKey(
    'transform',
    typeof transform === 'string' ? parse.transform(transform) : transform
  )
  const maskObj = objectWithKey('mask', normalizeIconArgs(mask))

  const renderedIcon = coreIcon(iconLookup, {
    ...classes,
    ...transformObj,
    ...maskObj,
    symbol,
    title,
    titleId,
    maskId
  })

  let result = null
  if (!renderedIcon) {
    log('Could not find icon', iconLookup)
  } else {
    const { abstract } = renderedIcon

    result = convert(
      (tag, props, children) => {
        return {
          tag,
          props,
          children
        }
      },
      abstract[0],
      $$restProps
    )
  }

  // TODO: Get types in place
  // FontAwesomeIcon.propTypes = {
  //   beat: PropTypes.bool,
  //   border: PropTypes.bool,
  //   beatFade: PropTypes.bool,
  //   bounce: PropTypes.bool,
  //   className: PropTypes.string,
  //   fade: PropTypes.bool,
  //   flash: PropTypes.bool,
  //   mask: PropTypes.oneOfType([
  //     PropTypes.object,
  //     PropTypes.array,
  //     PropTypes.string,
  //   ]),
  //   maskId: PropTypes.string,
  //   fixedWidth: PropTypes.bool,
  //   inverse: PropTypes.bool,
  //   flip: PropTypes.oneOf([true, false, 'horizontal', 'vertical', 'both']),
  //   icon: PropTypes.oneOfType([
  //     PropTypes.object,
  //     PropTypes.array,
  //     PropTypes.string,
  //   ]),
  //   listItem: PropTypes.bool,
  //   pull: PropTypes.oneOf(['right', 'left']),
  //   pulse: PropTypes.bool,
  //   rotation: PropTypes.oneOf([0, 90, 180, 270]),
  //   shake: PropTypes.bool,
  //   size: PropTypes.oneOf([
  //     '2xs',
  //     'xs',
  //     'sm',
  //     'lg',
  //     'xl',
  //     '2xl',
  //     '1x',
  //     '2x',
  //     '3x',
  //     '4x',
  //     '5x',
  //     '6x',
  //     '7x',
  //     '8x',
  //     '9x',
  //     '10x',
  //   ]),
  //   spin: PropTypes.bool,
  //   spinPulse: PropTypes.bool,
  //   spinReverse: PropTypes.bool,
  //   symbol: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  //   title: PropTypes.string,
  //   titleId: PropTypes.string,
  //   transform: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  //   swapOpacity: PropTypes.bool,
  // }
</script>

{#if result}
<Element {...result} {style} bind:ref={ref} />
{/if}
