<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-table :data="rolesList" stripe style="width: 100%" ref="roleTable">
      <el-table-column type="expand">
        <template v-slot="{row}">
          <!-- 一级菜单行元素 -->
          <el-row class="level1" type="flex" v-for="level1 in row.children" :key="level1.id">
            <el-col :span="6">
              <el-tag closable @close="deleteRight(row,level1.id)">{{level1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col>
              <!-- 二级菜单行元素 -->
              <el-row class="level2" type="flex" v-for="level2 in level1.children" :key="level2.id">
                <el-col :span="6">
                  <el-tag
                    closable
                    type="success"
                    @close="deleteRight(row,level2.id)"
                  >{{level2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col>
                  <el-tag
                    closable
                    class="level3"
                    type="warning"
                    v-for="level3 in level2.children"
                    :key="level3.id"
                    @close="deleteRight(row,level3.id)"
                  >{{level3.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>

      <!-- type="index"  设置下标 -->
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="180"></el-table-column>
      <el-table-column prop="roleDesc" label="描述" width="180"></el-table-column>
      <el-table-column label="操作">
        <template v-slot="{row}">
          <el-button type="primary" size="mini" plain icon="el-icon-edit"></el-button>
          <el-button type="danger" icon="el-icon-delete" plain circle size="mini"></el-button>
          <el-button
            type="success"
            icon="el-icon-check"
            size="mini"
            plain
            @click="showAssionRightDialog(row)"
          >分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="收货地址" :visible.sync="isShowAssionDialogShow">
      <!-- data用来绑定数据的,
      show-checkbox 是用来设置是否要显示的 CheckBox
      node-key 值得是当前唯一的标识
      deafault-expanded-keys   这是一个数组  标识默认让那些节点展开
      default-checked-keys  这是一个数据  表示默认选中那些节点
      props   children用来指定子级树的数据属性名,  label以及节点要展示到的文字的属性名-->
      <!-- default-expand-all  是否默然展开所有的节点-->
      <el-tree
        :data="rightList"
        show-checkbox
        node-key="id"
        :default-checked-keys="checkedRights"
        :props="defaultProps"
        :default-expand-all="true"
        ref="rightsTree"
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowAssionDialogShow = false">取 消</el-button>
        <el-button type="primary" @click="updataRolesRights">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
 <script>
import axios from "axios";
export default {
  data() {
    return {
      rolesList: [],
      // 是否显示模态框
      isShowAssionDialogShow: false,
      rightList: [],
      // 这个是用来设置tree组件的,数据展示 子节点以及展示的文字
      defaultProps: {
        // 子级元素的属性名
        children: "children",
        // 当前节点的文字的属性名
        label: "authName"
      },
      checkedRights: [],
      //  用来存储要编辑的role的id
      currentEditRoleId: -1
    };
  },

  methods: {
    async deleteRight(row, id) {
      // console.log(row, id);
      // 接口信息
      //  roles/:id/rights/:rightID
      // method: delete
      let res = await axios({
        url: `roles/${row.id}/rights/${id}`,
        method: "delete"
      });
      console.log(res);
      if (res.data.meta.status === 200) {
        this.$message({
          type: "success",
          message: res.data.meta.msg,
          duration: 1000
        });
        this.getRolesList(() => {
          this.$nextTick(() => {
            //让表格对应的项展开即可
            this.$refs.roleTable.toggleRowExpansion(
              this.roleList.find(v => v.id == row.id),
              true
            );
          });
        });
      }
    },
    async updataRolesRights() {
      // 1.获取到当前tree中  所有被勾选的节点id
      // element-UI  提供
      let Ids = [
        ...this.$refs.rightsTree.getCheckedKeys(),
        ...this.$refs.rightsTree.getHalfCheckedKeys()
      ].join(",");
      console.log(Ids);
      //2.将id 拼接成字符串后 ,发送ajax请求,修改角色权限
      let res = await axios({
        url: `roles/${this.currentEditRoleId}/rights`,
        method: "post",
        data: {
          rids: Ids
        }
      });
      // console.log(res);
      // 3.更新成功后重新获取列表数据
      this.getRolesList();
      // 4.关掉模态框
      this.isShowAssionDialogShow = false;
      // 5.提示成功
      this.$message({
        type: "success",
        message: res.data.meta.msg,
        duration: 1000
      });
    },
    async showAssionRightDialog(row) {
      // 0把当前正编辑的id=role的id
      this.currentEditRoleId = row.id;
      // 1.打开模态框
      this.isShowAssionDialogShow = true;
      // 2.获取所有的权限信息()树结构
      let res = await axios({
        url: "rights/tree"
      });
      //  把权限列表绑定了tree组件
      this.rightList = res.data.data;
      4; //  需要让tree组件默选中当前角色拥有的权限信息
      // checkedRights :   我们需要把当前角色row中所有的权限的id, 组合成一个数组,复制赋值给checkedRights
      console.log(row);
      let level1Ids = [];
      let level2Ids = [];
      let level3Ids = [];
      // // 获取二级权限的id，组合成数组
      row.children.forEach(level1 => {
        level1.children.forEach(level2 => {
          level2.children.forEach(level3 => {
            level3Ids.push(level3.id);
          });
        });
      });
      console.log(level1Ids);
      this.checkedRights = [...level3Ids];
    },
    async getRolesList() {
      let res = await axios({
        url: "roles"
      });
      // console.log(res);
      this.rolesList = res.data.data;
    }
  },
  created() {
    this.getRolesList();
  }
};
</script>
<style>
.level1 {
  padding: 10px 0;
  border-bottom: 1px dashed #ccc;
}
.level1:last-child {
  border-bottom: none;
}
.level2 {
  margin-bottom: 20px;
}
.level3 {
  margin-right: 15px;
  margin-bottom: 10px;
}
</style>