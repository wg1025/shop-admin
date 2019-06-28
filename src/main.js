import Vue from "vue";
import App from "./App.vue";
import router from "./router";
//  1. 引入ElemnetUI库
import ElementUI from "element-ui";
// 2.引入css文件
import "element-ui/lib/theme-chalk/index.css";

import "./assets/css/index.css";
// 3. 安装ElementUI
Vue.use(ElementUI);

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
})
new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
