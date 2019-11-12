import 'element-ui/lib/theme-chalk/index.css';

import Vue from 'vue'
import { Button,Form,FormItem,Input,Message} from 'element-ui'


Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
//这个使用情况不一样。需要把Message挂载到Vue对象中

Vue.prototype.$message = Message;