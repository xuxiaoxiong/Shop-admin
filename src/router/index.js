import Vue from "vue"
import VueRouter from "vue-router"

const Home = () => import("../views/home/Home");
const Login = () => import("../views/login/Login");

Vue.use(VueRouter);
const routes = [

    {path: "/", redirect: "/home"},
    {path: "/login", component: Login},
    {path: "/home", component: Home}
];

const router = new VueRouter({
    mode: "history",
    routes
});

//这个实现权限管理
router.beforeEach((to, from, next) => {
    // 注意要加next
    if(to.path === '/login') return next();

    let token = window.sessionStorage.getItem("token");
    if(!token) return next('/login');
    next();
})

export default router