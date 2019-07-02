import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";
//  1. 引入ElemnetUI库
import ElementUI from "element-ui";
// 2.引入css文件
import "element-ui/lib/theme-chalk/index.css";

import "./assets/css/index.css";

// 3. 安装ElementUI
Vue.use(ElementUI);

// 解决axios每次调用问题
/* 把axios加到vue原型上 */
// Vue.Prototype.$http = axios;

// 怎样解决集地址问题  每次都要写集地址?
axios.defaults.baseURL = "http://localhost:8888/api/private/v1/";

// 设置axios的请求拦截器
axios.interceptors.request.use(function (config) {
  // config 就是拦截到的请求相关的所有的信息
  // 这个信息是可以进行修改的
  // console.log(config);
  config.headers.Authorization = localStorage.getItem("token");
  // return config不能动，这个函数中必须有这个内容
  return config;
});

Vue.config.productionTip = false;

// 这册一个导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === "/login") {
    next();
    return;
  }
  if (localStorage.getItem("token")) {
    next();
  } else {
    router.push("/login");
  }
  // console.log(to, from);
  // console.log('111');
  // next  这是提供的方法是  供页面的跳转
  // 如果不调用这个方法就互惠调用
  // next()
});
new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
