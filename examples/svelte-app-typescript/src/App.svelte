<script lang="ts">
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';

  // Importing types from the API library along with other exports
  import {
    type IconLookup,
    type IconDefinition,
    findIconDefinition,
    library
  } from '@fortawesome/fontawesome-svg-core'
  import {
    faCoffee,
  } from '@fortawesome/free-solid-svg-icons'

  // We're only adding faCoffee to the library so we can look it up.
  // And we're only doing that to demonstrate how the API types might be used.
  // This is not a realistic scenario. You wouldn't normally do things in such a round about way.
  // It's really just to demonstrate use of the types.
  library.add(faCoffee)
  const coffeeLookup: IconLookup = { prefix: 'fas', iconName: 'coffee' }
  const coffeeIconDefinition: IconDefinition = findIconDefinition(coffeeLookup)
</script>

<div id="app">
  <main class="w-100 min-vh-100 bg-gray8 white sans-serif pa6 flex flex-column justify-center items-center">
    <div class="mw8 center overflow-hidden">
      <h2 class="tc ttu tracked3 b f2 mt0 mb2 teal0 o-30">
        svelte-fontawesome (TypeScript edition)
      </h2>

      <ul class="list ma0 pa0 flex flex-row flex-wrap teal4">
        <li class="pv3 ph2 ma0 link grow">
          <FontAwesomeIcon icon={['fab', 'font-awesome']} size="4x" />
        </li>
        <li class="pv3 ph2 ma0 link grow">
          <FontAwesomeIcon icon={coffeeIconDefinition} size="4x" />
        </li>
        <li class="pv3 ph2 ma0 link grow">
          <FontAwesomeIcon icon={['fad', 'stroopwafel']} size="4x" />
        </li>
        <li class="pv3 ph2 ma0 link grow">
          <FontAwesomeIcon
            icon={['fas', 'cog']}
            spin
            fixedWidth={false}
            size="4x"
          />
        </li>
        <li class="pv3 ph2 ma0 link grow">
          <FontAwesomeIcon
            icon={['fas', 'spinner']}
            pulse
            fixedWidth
            size="4x"
          />
        </li>
        <li class="pv3 ph2 ma0 link grow">
          <FontAwesomeIcon
            icon={['fab', 'fort-awesome']}
            rotation={90}
            size="4x"
          />
        </li>
        <li class="pv3 ph2 ma0 link grow">
          <FontAwesomeIcon
            icon={['fab', 'internet-explorer']}
            flip="both"
            size="4x"
          />
        </li>
        <li class="pv3 ph2 ma0 link grow">
          <FontAwesomeIcon
            icon={['fab', 'fort-awesome']}
            inverse
            size="4x"
          />
        </li>
        <li class="pv3 ph2 ma0 link grow">
          <FontAwesomeIcon
            icon={['fab', 'font-awesome']}
            size="4x"
            transform="left-1 rotate-15"
          />
        </li>
      </ul>
    </div>
  </main>
</div>
