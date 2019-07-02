<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-input
          placeholder="请输入内容"
          class="input-with-select"
          v-model="keyword"
          @keyup.enter.native="search"
        >
          <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
        </el-input>
      </el-col>
      <el-col :span="6">
        <el-button type="success" plain @click="openAddUserDialog">添加用户</el-button>
      </el-col>
    </el-row>
    <el-table :data="userList" stripe style="width: 100%">
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="用户状态">
        <template v-slot="{row}">
          <!-- {{row}} -->
          <!-- {{row}} -->
          <!-- //  在这里无法获取每一行的数据，这个数在el-table 表格组件中
          如果需要获取每一行的数据，那么我们就需要通过作用域插槽的方法，吧数据 收到-->
          <el-switch
            v-model="row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="toggleStatus(row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="{row}">
          <el-button
            type="primary"
            size="mini"
            plain
            icon="el-icon-edit"
            @click="openEditUserDialog(row.id)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            plain
            circle
            size="mini"
            @click="delUser(row.id)"
          ></el-button>
          <el-button type="success" icon="el-icon-check" size="mini" plain>角色权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pagesize"
      :current-page="currentpage"
      @current-change="onPagechange"
    ></el-pagination>
    <!-- 控制添加用户模态框的显示和隐藏的 -->
    <el-dialog title="添加用户" :visible.sync="isAddUserDialogShow">
      <el-form label-width="100px" :model="addUserData" :rules="addUserRules" ref="ruleForm">
        <el-form-item label="用户名" prop="username">
          <el-input autocomplete="off" v-model="addUserData.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" show-password autocomplete="off" v-model="addUserData.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input autocomplete="off" v-model="addUserData.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input autocomplete="off" v-model="addUserData.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isAddUserDialogShow= false">取 消</el-button>
        <el-button type="primary" @click="editUser ">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改用户信息的模态框 -->

    <el-dialog title="添加用户" :visible.sync="iseditDialogShow">
      <el-form label-width="100px" :model="editUserData" :rules="editUserRules" ref="ruleForm">
        <el-form-item label="用户名" prop="username">
          <el-tag type="info" v-text="editUserData.username"></el-tag>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input autocomplete="off" v-model="editUserData.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input autocomplete="off" v-model="editUserData.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="iseditUserDialogShow= false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
 <script>
//  prop  做表单效验绑定
import axios from "axios";
export default {
  data() {
    return {
      userList: [],
      query: "",
      total: 0,
      pagesize: 3,
      currentpage: 1,
      keyword: "",
      // 控制添加用户模态框的展示和隐藏的数据
      isAddUserDialogShow: false,
      addUserData: {
        usrename: "",
        password: "",
        email: "",
        mobile: ""
      },
      // 效验添加用户模态框表格的规则
      addUserRules: {
        username: [
          { required: true, message: "请输入活用户名", trigger: "blur" },
          {
            min: 5,
            max: 12,
            message: "长度在 5 到 12 个字符",
            trigger: "change"
          }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "change"
          }
        ],
        email: [
          {
            pattern: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
            message: "邮箱格式不正确",
            trigger: "change"
          }
        ],
        mobile: [
          {
            pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
            message: "手机格式不正确",
            trigger: "change"
          }
        ]
      },
      iseditDialogShow: false,
      editUserData: {
        id: 0,
        email: "",
        username: "",
        mobile: ""
      },
      editUserRules: {
        email: [
          {
            pattern: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
            message: "邮箱格式不正确",
            trigger: "change"
          }
        ],
        mobile: [
          {
            pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
            message: "手机号码格式不正确",
            trigger: "change"
          }
        ]
      }
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    getUserList() {
      axios({
        url: "http://localhost:8888/api/private/v1/users",
        params: {
          query: this.keyword,
          pagenum: this.currentpage,
          pagesize: this.pagesize
        },
        //   github  axios   header
        headers: {
          Authorization: localStorage.getItem("token")
        }
      }).then(res => {
        // console.log(res);
        this.userList = res.data.data.users;
        this.total = res.data.data.total;
      });
    },
    onPagechange(page) {
      this.currentpage = page;
      // 重新发送请求
      this.getUserList();
    },
    search() {
      console.log(this.keyword);
      this.getUserList();
    },
    async toggleStatus(user) {
      // console.log(users);
      let res = await axios({
        url: `http://localhost:8888/api/private/v1/users/${user.id}/state/${user.mg_state}`,
        method: "put",
        headers: {
          Authorization: localStorage.getItem("token")
        }
      });
      console.log(res);
      if (res.data.meta.status === 200) {
        this.$message({
          type: "success",
          message: res.data.meta.msg,
          duration: 1000
        });
      } else {
        this.$message({
          type: "error",
          message: res.data.meta.msg,
          duration: 1000
        });
        user.mg_state = !user.mg_state;
      }
    },
    async delUser(id) {
      try {
        await this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });
        let res = await axios({
          url: `http://localhost:8888/api/private/v1/users/${id}`,
          method: "delete",
          headers: {
            Authorization: localStorage.getItem("token")
          }
        });
        console.log(res);
        if (res.data.meta.status === 200) {
          this.$message({
            type: "success",
            message: res.data.meta.msg,
            duration: 1000
          });
          this.currentpage = 1;
          this.getUserList();
        }
      } catch (err) {
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      }
    },
    openAddUserDialog() {
      this.isAddUserDialogShow = true;
    },
    async editUser() {
      // 1.进行表单效验
      try {
        let valid = await this.$refs.ruleForm.validate();
        console.log(valid);
        // 2. 表单校验成功之后发送ajax请求
        let res = await axios({
          url: "http://localhost:8888/api/private/v1/users",
          method: "post",
          data: this.addUserData,
          headers: {
            Authorization: localStorage.getItem("token")
          }
        });
        console.log(res);
        if (res.data.meta.status === 201) {
          this.$message({
            type: "success",
            message: res.data.meta.msg,
            duration: 1000
          });

          this.isAddUserDialogShow = false;
          // 清空表格内容
          this.$refs.ruleForm.resetFileds();
        } else {
          this.$message({
            type: "error",
            message: res.data.meta.msg,
            duration: 1000
          });
        }
      } catch (err) {}
      // this.isAddUserDialogShow = false;
    },
    async openEditUserDialog(id) {
      this.iseditDialogShow = true;
      // 使用id去后台拿取数据
      let res = await axios({
        url: `http://localhost:8888/api/private/v1/users/${id}`,
        method: "get",
        // data: this.editUserData,
        headers: {
          Authorization: localStorage.getItem("token")
        }
      });
      console.log(res);
      this.editUserData = res.data.data;
    },
    async editUser() {
      // 表单效验
      try {
        this.$refs.ruleForm.validate();
        let res = await axios({
          url: `http://localhost:8888/api/private/v1/users/${this.editUserData.id}`,
          method: "put",
          data: {
            mobile: this.editUserData.mobile,
            email: this.editUserData.email
          },
          headers: {
            Authorization: localStorage.getItem("token")
          }
        });
        console.log(res);
        if (res.data.meta.status === 200) {
          this.$message({
            type: "success",
            message: res.data.meta.msg,
            duration: 1000
          });
          // 刷新列表
          this.getUserList();
          this.iseditDialogShow = false;
        } else {
          this.$message({
            type: "error",
            message: res.data.meta.msg,
            duration: 1000
          });
        }
      } catch (err) {}
    }
  }
};
</script>
 <style>
.el-breadcrumb.el-breadcrumb {
  background-color: #d4dae0;
  height: 50px;
  font-size: 16px;
  line-height: 50px;
  padding-left: 10px;
}
</style>
