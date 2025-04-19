import './app.css'
import App from './App.svelte'

// Importing types from the API library along with other exports
import {
  library
} from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import {
  faCog,
  faSpinner,
  faQuoteLeft,
  faSquare,
  faCheckSquare
} from '@fortawesome/free-solid-svg-icons'
import { mount } from "svelte";

library.add(
  fab,
  faCog,
  faSpinner,
  faQuoteLeft,
  faSquare,
  faCheckSquare
)

const app = mount(App, {
  target: document.getElementById('app')
})

export default app
