import Vue from 'vue'
import App from './App.vue'
// 通过这个。可以知道.import js 相当于把代码放在这里
import './plugins/element.js'
import router from "./router"
import "./assets/css/global.css"

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
