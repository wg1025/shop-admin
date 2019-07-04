<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="success" plain @click="$router.push('/goods-add')">添加商品</el-button>
    <el-table ref="singleTable" :data="goodList" stripe highlight-current-row style="width: 200">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column property="goods_name" label="商品名称"></el-table-column>
      <el-table-column property="goods_price" label="商品价格"></el-table-column>
      <el-table-column property="goods_weight" label="商品重量"></el-table-column>
      <el-table-column property="add_time" label="创建时间"></el-table-column>
      <el-table-column label="操作">
        <template>
          <el-button type="primary" plain size="mini" icon="el-icon-edit"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" plain></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pagesize"
      :current-page="pagenum"
      @current-change="changePage"
    ></el-pagination>
  </div>
</template>
<script>
import axios from "axios";

export default {
  data() {
    return {
      goodList: [],
      pagenum: 1,
      pagesize: 6,
      total: 0
    };
  },
  methods: {
    changePage(currentPage) {
      this.pagenum = currentPage;
      this.getGoodList();
    },
    async getGoodList() {
      let res = await axios({
        url: "goods",
        params: {
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      });
      console.log(res);
      this.goodList = res.data.data.goods;
      this.total = res.data.data.total;
    }
  },

  created() {
    this.getGoodList();
  }
};
</script>
<style>
.el-button--success.is-plain {
  margin-top: 10px;
}
</style>