<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="success" plain @click="showAddCateDialog">添加商品</el-button>
    <el-table :data="categoriesList" stripe style="width: 100%">
      <!-- file-icon指的就是叶子节点的图标
            folder-icon指的就是可展开的项的图标
            prop 指的就是当前列要显示的数据的属性名称
            label 指的就是表头 
            treeKey 节点的唯一表示
            parentKey 数据的父节点id
            childKey 当前节点的所有子节点存放的属性的名字 默认是children

            indent-size是用来设置每个层级之间的缩进距离的
            设置indent-size 需要同时制定 层级属性

            level-key:    设置为数据中标识层级的属性名即可
      -->
      <el-table-tree-column
        file-icon="el-icon-notebook-2"
        folder-icon="el-icon-folder"
        prop="cat_name"
        label="分类名称"
        width="220"
        :indent-size="50"
        level-key="cat_level"
        parent-key="cat_pid"
        tree-key="cat_id"
      >></el-table-tree-column>
      <el-table-column label="是否有效" width="120">
        <template v-slot="{row}">{{row.cat_deleted ? "否" : "是"}}</template>
      </el-table-column>
      <el-table-column prop="cat_level" label="成级"></el-table-column>
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
      @current-change="pagechange"
    ></el-pagination>

    <!-- 添加用户的模态框 -->
    <el-dialog title="添加分类" :visible.sync="isShowAddCateDialog">
      <el-form ref="addCateForm" :model="addCateFormData" label-width="100px">
        <!-- 清空表单里的内容   加 prop -->
        <el-form-item label="分类名称" prop="cat_name">
          <el-input autocomplete="off" v-model="addCateFormData.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级名称" prop="parentArr">
          <el-cascader
            v-model="addCateFormData.parentArr"
            :options="cateOptions"
            :props="defaultProps"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowAddCateDialog = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";
// 当前页面中要用到 一个第三方的表格插件（ElementUI的插件）
// element-tree-grid

// 安装  npm i element-tree-grid -S

// 使用：
// 如果需要全局使用，可能很多页面里面都会用到这个组件，那么就把下面这两句代码放到main.js中
// const ElTreeGrid = require('element-tree-grid');
// Vue.component(ElTreeGrid.name, ElTreeGrid)

// 如果只是需要某个页面中使用，只需要进行局部注册组件即可
// 在使用到这个组件的页面中，引入该组件，然后进行 components 局部注册即可
var ElTreeGrid = require("element-tree-grid");
// console.log(ElTreeGrid.name);
// el-table-tree-column

// 页面中使用该组件，只需要用  el-table-tree-column 标签即可
export default {
  components: {
    [ElTreeGrid.name]: ElTreeGrid
  },
  data() {
    return {
      categoriesList: [],
      pagenum: 1,
      pagesize: 5,
      total: 0,
      isShowAddCateDialog: false,
      addCateFormData: {
        cat_name: "",
        parentArr: []
      },
      // 添加分类的时候，所有的父类列表 最终是要展示在级联选择器中的
      cateOptions: [],
      defaultProps: {
        value: "cat_id",
        label: "cat_name",
        // 父级名称只选中一项
        checkStrictly: true
      }
    };
  },
  created() {
    this.getCtegoryList();
  },
  methods: {
    async addCate() {
      // 1. 获取表单数据
      let cat_name = this.addCateFormData.cat_name;
      console.log(cat_name);
      // cat_level其实可以直接用 parentArr.length
      let cat_level = this.addCateFormData.parentArr.length;
      // 我们只需要最后一个就可以
      let cat_pid = this.addCateFormData.parentArr.pop() || 0;
      console.log(cat_level);
      // 2. 向后台提交
      let res = await axios({
        url: "categories",
        method: "post",
        data: {
          cat_name,
          cat_level,
          cat_pid
        }
      });
      console.log(res);
      if (res.data.meta.status === 201) {
        this.$message({
          type: "success",
          message: res.data.meta.msg,
          duration: 1000
        });
        // 模态框关闭
        this.isShowAddCateDialog = false;
        // 重置表单
        this.$refs.addCateForm.resetFields();
        // 重新获取数据
        this.getCtegoryList();
      }
    },

    async showAddCateDialog() {
      // 1. 获取分类列表数据
      // 由于添加分类的时候，最多可能添加的是3级分类
      // 所以请求回来的数据，只需要有前两级即可，不需要第三级
      let res = await axios({
        url: "categories",
        params: {
          type: 2
        }
      });
      // console.log(res);
      this.cateOptions = res.data.data;
      this.isShowAddCateDialog = true;
    },
    async getCtegoryList() {
      let res = await axios({
        url: "categories",
        params: {
          type: 3,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      });
      // console.log(res);
      this.categoriesList = res.data.data.result;
      this.total = res.data.data.total;
    },
    pagechange(currentpage) {
      this.pagenum = currentpage;
      this.getCtegoryList();
    }
  }
};
</script>

