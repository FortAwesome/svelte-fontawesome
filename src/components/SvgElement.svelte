<script>
  export let tag
  export let props
  export let children
  export let style = null
  export let ref = null

  if (tag !== 'svg') {
    throw new Error('SvgElement requires a tag of "svg"')
  }

  function processChildren(children) {
    return children?.reduce((acc, child) => {
      return acc + (child.tag ? generateMarkup(child) : child)
    }, '') || ''
  }

  function generateMarkup({ tag, props, children }) {
    // Generate a string setting key = value for each prop
    const attributes = Object.keys(props)
      .map((key) => `${key}="${props[key]}"`)
      .join(' ')

    return `<${tag} ${attributes}>${processChildren(children)}</${tag}>`
  }

  const markup = processChildren(children)

  const elementStyle = props?.style ? `${props.style}${style || ''}` : style
  const elementProps = { ...props, style: elementStyle }
</script>

<svg bind:this={ref} {...elementProps}>
  {@html markup}
</svg>
