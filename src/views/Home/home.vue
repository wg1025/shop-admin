<template>
  <el-container>
    <el-header>
      <el-row type="flex" justify="space-between" align="middle">
        <el-col :span="6">
          <img src="../../assets/logo.png" alt />
        </el-col>
        <el-col>
          <h1>品优购管理后台系统</h1>
        </el-col>
        <el-col :span="6">
          <div class="one">
            欢迎39期星耀会员
            <a href="#" @click.prevent="logout">退出</a>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-col :span="12">
          <el-menu
            :default-active="$route.path"
            class="el-menu-vertical-demo"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            :unique-opened="true"
            :router="true"
          >
            <el-submenu v-for="menu1 in menusList" :key="menu1.id" :index="menu1.id+''">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>{{menu1.authName}}</span>
              </template>

              <el-menu-item v-for="menu2 in menu1.children" :key="menu2.id" :index="'/'+menu2.path">
                <i class="el-icon-menu"></i>
                <span>{{menu2.authName}}</span>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-col>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      menusList: []
    };
  },
  async created() {
    let res = await axios({
      url: "menus"
    });
    this.menusList = res.data.data;
  },
  methods: {
    logout() {
      localStorage.removeItem("token");
      this.$router.push("/login");
    }
  }
};
</script>
<style>
.el-container {
  height: 100%;
}
.el-container .el-header {
  background-color: #b3c1cd;
  padding: 0;
}
.el-container .el-header img {
  width: 200px;
}

.el-container .el-header h1 {
  color: #fff;
  font-size: 28px;
  font-weight: 700;
  margin: 0;
  padding: 0;
  text-align: center;
}
.el-container .el-header .one {
  font-weight: 700;
  text-align: right;
  padding-right: 20px;
}
.el-container .el-header .one a {
  color: orange;
}
.el-col.el-col-12 {
  width: 100%;
}
.el-col.el-col-12 {
  height: 100%;
}
.el-menu-vertical-demo.el-menu {
  height: 100%;
}
</style>