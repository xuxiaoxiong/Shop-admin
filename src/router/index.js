import Vue from "vue"
import VueRouter from "vue-router"

const Home = () => import("views/home/Home");
const Login = () => import("views/login/Login");
const Welcome = () => import("views/home/childComps/Welcome");
const User = () => import("views/users/User");
const Rights = () => import("views/power/Rights");
const Role = () => import("views/role/Role");
Vue.use(VueRouter);
const routes = [

  {path: "/", redirect: "/home"},
  {path: "/login", component: Login},
  {
    path: "/home",
    component: Home,
    redirect: "/welcome",
    //注意childen是一个数组。不带s。
    children: [
      //里面是对象
      {
        path: "/welcome",
        component: Welcome
      },
      {
        path: "/users",
        component: User
      },
        {
            path: "/rights",
            component: Rights
        },
        {
            path: "/roles",
            component: Role
        }

    ]

  }
];

const router = new VueRouter({
  mode: "history",
  routes
});

//这个实现权限管理
router.beforeEach((to, from, next) => {
  // 注意要加next
  if (to.path === '/login') return next();

  let token = window.sessionStorage.getItem("token");
  if (!token) return next('/login');
  next();
})

export default router
