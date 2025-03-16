import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light'
  }
})

// Import components
import BasicInformationForm from './components/LessonPlan/BasicInformationForm.vue'
import FrameworkSelector from './components/LessonPlan/FrameworkSelector.vue'

const app = createApp(App)

// Register components globally
app.component('BasicInformationForm', BasicInformationForm)
app.component('FrameworkSelector', FrameworkSelector)
app.use(router)
app.use(store)
app.use(vuetify)
app.mount('#app')
