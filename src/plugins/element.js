import 'element-ui/lib/theme-chalk/index.css';

import Vue from 'vue'
import {
    Button, Form, FormItem, Input, Message, Container, Header, Main, Aside,
    Menu, MenuItem, MenuItemGroup, Submenu, Breadcrumb, BreadcrumbItem, Card,
    Row, Col, Table, TableColumn, Switch, Tooltip, Pagination, Dialog, Tag, MessageBox,Select,Option,
    Tree,Cascader,Alert,Tabs,TabPane,Steps,Step,Checkbox,Upload
} from 'element-ui'
//必须加.js后缀
//必须加.js后缀
import Timeline from "./timeline/index.js"
import TimelineItem from "./timeline-item/index.js"

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)

Vue.use(Container)
Vue.use(Header)
Vue.use(Main)
Vue.use(Aside)

Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Submenu)
Vue.use(MenuItemGroup)

Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)

Vue.use(Card)
Vue.use(Row)
Vue.use(Col)

Vue.use(Table)
Vue.use(TableColumn)

Vue.use(Switch)

Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Timeline)
Vue.use(TimelineItem)
Vue.use(Step)
Vue.use(Steps)
Vue.use(Checkbox)
Vue.use(Upload)
//这个使用情况不一样。需要把Message挂载到Vue对象中

Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm;
