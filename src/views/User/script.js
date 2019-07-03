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
        }
        //   github  axios   header
        // headers: {
        //   Authorization: localStorage.getItem("token")
        // }
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
      // eslint-disable-next-line no-console
      console.log(this.keyword);
      this.currentpage = 1;
      this.getUserList();
    },
    async toggleStatus(user) {
      // console.log(users);
      let res = await axios({
        url: `http://localhost:8888/api/private/v1/users/${user.id}/state/${user.mg_state}`,
        method: "put"
        // headers: {
        //   Authorization: localStorage.getItem("token")
        // }
      });
      // eslint-disable-next-line no-console
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
          method: "delete"
          // headers: {
          //   Authorization: localStorage.getItem("token")
          // }
        });
        // eslint-disable-next-line no-console
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

    async addUser() {
      // 1.进行表单效验
      try {
        let valid = await this.$refs.ruleForm.validate();
        // eslint-disable-next-line no-console
        console.log(valid);
        // 2. 表单校验成功之后发送ajax请求
        let res = await axios({
          url: "http://localhost:8888/api/private/v1/users",
          method: "post",
          data: this.addUserData
          // headers: {
          //   Authorization: localStorage.getItem("token")
          // }
        });
        // eslint-disable-next-line no-console
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
        // eslint-disable-next-line no-empty
      } catch (err) { }
      this.isAddUserDialogShow = false;
    },
    async openEditUserDialog(id) {
      this.iseditDialogShow = true;
      // 使用id去后台拿取数据
      let res = await axios({
        url: `http://localhost:8888/api/private/v1/users/${id}`,
        method: "get"
        // data: this.editUserData,
        // headers: {
        //   Authorization: localStorage.getItem("token")
        // }
      });
      // eslint-disable-next-line no-console
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
          }
          // headers: {
          //   Authorization: localStorage.getItem("token")
          // }
        });
        // eslint-disable-next-line no-console
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
        // eslint-disable-next-line no-empty
      } catch (err) { }
    }
  }
};