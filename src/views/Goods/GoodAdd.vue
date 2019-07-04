<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-steps :active="activeStep" finish-status="success">
      <el-step title="第一步" description="基本信息">11</el-step>
      <el-step title="第二部" description="商品图片"></el-step>
      <el-step title="第三部" description="商品内容"></el-step>
    </el-steps>
    <el-tabs
      tab-position="left"
      style=" margin-top: 20px;"
      @tab-click="changeTab"
      v-model="activeName"
    >
      <el-tab-pane label="基本信息" name="one">
        <el-form ref="form" v-model="addGoodsFormData" label-width="80px">
          <el-form-item label="商品名称">
            <el-input v-model="addGoodsFormData.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="addGoodsFormData.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="addGoodsFormData.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="addGoodsFormData.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader
              v-model="addGoodsFormData.catArr"
              :options="cateOpation"
              :props="defaultProps"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="是否促销">
            <el-radio v-model="addGoodsFormData.is_promote" label="1">是</el-radio>
            <el-radio v-model="addGoodsFormData.is_promote" label="0">否</el-radio>
          </el-form-item>
        </el-form>
        <el-button type="primary" style="margin-top: 12px;" @click="next(1,'two')">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane label="商品图片" name="two">
        <!-- action 图片上传的地址 -->
        <!-- action中必须要写完整的url， 因为之前设置的baseURL和这个没关系，那个只是给axios -->
        <el-upload
          class="upload-demo"
          action="http://localhost:8888/api/private/v1/upload"
          list-type="picture-card"
          :headers="headers"
          :on-success="onFileUpLoadSuccess"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
        <el-button type="primary" style="margin-top: 12px;" @click="next(2,'three')">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane label="商品内容" name="three">
        <quill-editor v-model="addGoodsFormData.goods_instroduce"></quill-editor>
        <el-button type="primary" @click="addDoods">确定</el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import axios from "axios";

import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";
export default {
  components: {
    quillEditor
  },
  data() {
    return {
      headers: {
        Authorization: localStorage.getItem("token")
      },
      activeStep: 0,
      activeName: "one",
      addGoodsFormData: {
        goods_name: "",
        goods_cart: [],
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_instroduce: "",
        pics: [],
        is_promote: 0
      },
      cateOpation: [],
      defaultProps: {
        value: "cat_id",
        label: "cat_name"
      }
    };
  },
  async created() {
    let res = await axios({
      url: "categories",
      params: {
        type: 3
      }
    });
    // console.log(res);
    this.cateOpation = res.data.data;
  },
  methods: {
    onFileUpLoadSuccess(res) {
      // console.log(res);
      this.addGoodsFormData.pics.push({
        pic: res.data.data.tmp_path
      });
    },
    next(index, activeName) {
      this.activeStep = index;
      this.activeName = activeName;
    },
    changeTab(tab) {
      console.log(tab);
      this.activeStep = +tab.index;
    },
    addDoods() {}
  }
};
</script>
<style>
.el-steps.el-steps--horizontal {
  margin-top: 10px;
}
.el-form {
  height: 100%;
}
</style>