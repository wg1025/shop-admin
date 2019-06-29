
  <template>
  <el-table :data="userList" stripe style="width: 100%">
    <el-table-column prop="username" label="姓名" width="180"></el-table-column>
    <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
    <el-table-column prop="mobile" label="电话"></el-table-column>
    <el-table-column label="用户状态">
      <template v-slot="scope">
        <!-- {{row}} -->
        <!-- //  在这里无法获取每一行的数据，这个数在el-table 表格组件中
        如果需要获取每一行的数据，那么我们就需要通过作用域插槽的方法，吧数据 收到-->
        <el-switch v-model="scope.row.type" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <el-button type="primary" size="mini" plain icon="el-icon-edit"></el-button>
      <el-button type="danger" icon="el-icon-delete" plain circle size="mini"></el-button>
      <el-button type="success" icon="el-icon-check" size="mini" plain>角色权限</el-button>
    </el-table-column>
  </el-table>
</template>
 <script>
import axios from "axios";
export default {
  data() {
    return {
      userList: []
    };
  },
  created() {
    axios({
      url: "http://localhost:8888/api/private/v1/users",
      params: {
        pagenum: 1,
        pagesize: 5
      },
      //   github  axios   header
      headers: {
        Authorization: localStorage.getItem("token")
      }
    }).then(res => {
      this.userList = res.data.data.users;
    });
  }
};
</script>
 
