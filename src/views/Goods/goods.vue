<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-table ref="singleTable" :data="goodList" stripe highlight-current-row style="width: 200">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column property="goods_name" label="商品名称"></el-table-column>
      <el-table-column property="goods_price" label="商品价格"></el-table-column>
      <el-table-column property="goods_weight" label="商品重量"></el-table-column>
      <el-table-column property="add_time" label="创建时间"></el-table-column>
      <el-table-column label="操作"></el-table-column>
    </el-table>
  </div>
</template>
<script>
import axios from "axios";

export default {
  data() {
    return {
      goodList: [],
      pagenum: 1,
      pagesize: 5
    };
  },
  async created() {
    let res = await axios({
      url: "goods",
      params: {
        pagenum: this.pagenum,
        pagesize: this.pagesize
      }
    });
    console.log(res);
    this.goodList = res.data.data.goods;
  }
};
</script>