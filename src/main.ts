import Vue from "vue";
import Vuex from "vuex";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store/index";
import VTooltip from 'v-tooltip'
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPlay, faStop, faExclamationTriangle, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faPlay);
library.add(faStop);
library.add(faExclamationTriangle);
library.add(faInfoCircle);

Vue.component("font-awesome-icon", FontAwesomeIcon);

Vue.use(VTooltip);
Vue.config.productionTip = false;
Vue.use(Vuex);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
