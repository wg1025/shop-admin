import Vue from "vue";
import Router from "vue-router";
import Login from "./views/Login/login.vue";
import Home from "./views/Home/home.vue";
import User from "./views/User/user.vue";
import Roles from "./views/Roles/roles.vue";
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
        }
      ]
    },
    {
      path: "/",
      redirect: "/home"
    }
  ]
});
