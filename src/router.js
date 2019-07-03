import Vue from "vue";
import Router from "vue-router";
import Login from "./views/Login/login.vue";
import Home from "./views/Home/home.vue";
import User from "./views/User/user.vue";
import Roles from "./views/Roles/roles.vue";
import Rights from "./views/Rights/rights.vue";
import Goods from "./views/Goods/goods.vue";
Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/login",
      component: Login
    },
    {
      path: "/home",
      component: Home,
      children: [
        {
          path: "/user",
          component: User
        },
        {
          path: "/roles",
          component: Roles
        },
        {
          path: "/rights",
          component: Rights
        },
        {
          path: "/goods",
          component: Goods
        }
      ]
    },
    {
      path: "/",
      redirect: "/home"
    }
  ]
});
