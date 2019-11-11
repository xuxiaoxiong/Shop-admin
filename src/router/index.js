import Vue from "vue"
import VueRouter from "vue-router"
const Home = () => import("../views/home/Home");
const Login = () => import("../views/login/Login");

Vue.use(VueRouter);
const routes =[
    {
        path:"/login",
        component: Login
    }
];

const router = new VueRouter({
    mode: "history",
    routes
});

export default router