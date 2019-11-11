import Vue from 'vue'
import App from './App.vue'
// 通过这个。可以知道.import js 相当于把代码放在这里
// 导入elementiu
import './plugins/element.js'
import router from "./router"

// 导入全局样式
import "./assets/css/global.css"

// 导入字体图标
import "./assets/fonts/iconfont.css"

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
