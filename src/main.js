import Vue from 'vue'
import App from './App.vue'
import axios from "axios"
// 通过这个。可以知道.import js 相当于把代码放在这里
// 导入elementiu
import './plugins/element.js'
import router from "./router"

// 导入全局样式
import "./assets/css/global.css"

// 导入字体图标
import "./assets/fonts/iconfont.css"

axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/"
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem("token");
  return config;
});
Vue.prototype.$http = axios;
//配置请求的根路径


Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
