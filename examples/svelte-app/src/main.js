import './app.css'
import App from './App.svelte'

import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import {
  faCoffee,
  faCog,
  faSpinner,
  faQuoteLeft,
  faSquare,
  faCheckSquare
} from '@fortawesome/free-solid-svg-icons'

import { fad } from '@fortawesome/pro-duotone-svg-icons'

library.add(
  fab,
  fad,
  faCoffee,
  faCog,
  faSpinner,
  faQuoteLeft,
  faSquare,
  faCheckSquare
)

const app = new App({
  target: document.getElementById('app')
})

export default app
