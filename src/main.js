import { defineCustomElement } from 'vue'

import Widget from './components/Widget.ce.vue'

const LightningWidgetElement = defineCustomElement(Widget)

customElements.define('lightning-widget', LightningWidgetElement)
