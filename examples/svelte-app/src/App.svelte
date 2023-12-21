<script>
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
  import { faCoffee } from '@fortawesome/free-solid-svg-icons'

</script>

<div id="app">
  <main class="w-100 min-vh-100 bg-gray8 white sans-serif pa6 flex flex-column justify-center items-center">
    <div class="mw8 center overflow-hidden">
      <h2 class="tc ttu tracked3 b f2 mt0 mb2 teal0 o-30">
        svelte-fontawesome
      </h2>

      <FontAwesomeIcon
        icon={['fad', 'stroopwafel']}
        size="4x"
        --fa-primary-color='red'
      />

      <ul class="list ma0 pa0 flex flex-row flex-wrap teal4">
        <li class="pv3 ph2 ma0 link grow">
          <FontAwesomeIcon icon={['fab', 'font-awesome']} size="4x" />
        </li>
        <li class="pv3 ph2 ma0 link grow">
          <FontAwesomeIcon icon={faCoffee} size="4x" />
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
