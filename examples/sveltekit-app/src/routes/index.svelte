<script>
  import { FontAwesomeIcon } from '@seantimm/svelte-fontawesome'
  import { faThumbsUp } from '@fortawesome/free-solid-svg-icons'
  import { config } from '@fortawesome/fontawesome-svg-core'

  import '@fortawesome/fontawesome-svg-core/styles.css' // Import the CSS
  config.autoAddCss = false // Tell Font Awesome to skip adding the CSS automatically since it's being imported above
</script>

<div>
  <p>
    <FontAwesomeIcon icon={faThumbsUp} /> Hello SvelteKit
  </p>
</div>
