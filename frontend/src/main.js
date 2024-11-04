import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import NavBarComponent from './components/NavBar.vue'

import 'bootstrap/dist/css/bootstrap.min.css'
// Import Bootstrap JS (Optional)
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

const app = createApp(App)

app.use(router)
app.component('NavBarComponent', NavBarComponent)

app.mount('#app')
