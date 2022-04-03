import { defineCustomElement } from 'vue'
import LightningWidget from './components/LightningWidget.ce.vue'

const LightningWidgetElement = defineCustomElement(LightningWidget)

customElements.define('lightning-widget', LightningWidgetElement)