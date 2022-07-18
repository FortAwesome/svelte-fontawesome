<script>
  export let tag
  export let props
  export let children
  export let style = null
  export let ref = null

  const elementStyle = props?.style ? `${props.style}${style || ''}` : style
  const elementProps = { ...props, style: elementStyle }
</script>

<svelte:element bind:this={ref} this={tag} {...elementProps}>
  {#each children as child}
    {#if child.tag}
      <svelte:self {...child} />
    {:else}
      {child}
    {/if}
  {/each}
</svelte:element>
