<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll" :disabled="this.delData.length===0">批量删除</el-button>
        <el-input v-model="query.userId" placeholder="用户ID" class="handle-input mr5" />
        <el-input v-model="query.departmentId" placeholder="部门ID" class="handle-input mr5" />
        <el-input v-model="query.account" placeholder="登录名" class="handle-input mr5" />
        <el-input v-model="query.name" placeholder="姓名" class="handle-input mr5" />
        <el-input v-model="query.password" placeholder="密码" class="handle-input mr5" />
        <el-input v-model="query.phone" placeholder="电话" class="handle-input mr5" />
        <el-input v-model="query.admin" placeholder="管理员(0非管理员, 1管理员)" class="handle-input mr5" />
        <el-input v-model="query.createTime" placeholder="创建时间" class="handle-input mr5" />
        <el-input v-model="query.updateTime" placeholder="修改时间" class="handle-input mr5" />
        <el-input v-model="query.lastLoginTime" placeholder="最后登录时间" class="handle-input mr5" />
        <el-input v-model="query.loginTimes" placeholder="登录次数" class="handle-input mr5" />
        <el-input v-model="query.status" placeholder="状态(0未启用, 1启用)" class="handle-input mr5" />
        <el-input v-model="query.del" placeholder="删除状态(0正常, 1删除)" class="handle-input mr5" />
        <el-button type="primary" icon="search" @click="getList">搜索</el-button>
        <el-button type="primary" @click="addDialogVisible=true">新建用户</el-button>
      </div>
      <el-table :data="tableData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange" v-loading="isShowloading">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column prop="userId" label="用户ID" sortable width="150" />
        <el-table-column prop="departmentId" label="部门ID" sortable width="150" />
        <el-table-column prop="account" label="登录名" sortable width="150" />
        <el-table-column prop="name" label="姓名" sortable width="150" />
        <el-table-column prop="password" label="密码" sortable width="150" />
        <el-table-column prop="phone" label="电话" sortable width="150" />
        <el-table-column prop="admin" label="管理员(0非管理员, 1管理员)" sortable width="150" />
        <el-table-column prop="createTime" label="创建时间" sortable width="150" />
        <el-table-column prop="updateTime" label="修改时间" sortable width="150" />
        <el-table-column prop="lastLoginTime" label="最后登录时间" sortable width="150" />
        <el-table-column prop="loginTimes" label="登录次数" sortable width="150" />
        <el-table-column prop="status" label="状态(0未启用, 1启用)" sortable width="150" />
        <el-table-column prop="del" label="删除状态(0正常, 1删除)" sortable width="150" />
        <el-table-column label="操作" width="220" align="center">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background @current-change="currentChange" layout="total, sizes, prev, pager, next, jumper" :total="total" :page-size="pageSize"></el-pagination>
      </div>

      <!-- 编辑框 -->
      <el-dialog title="修改信息" :visible.sync="editDialogVisible" ref="editform" :before-close="confirmClose" v-dialogDrag>
        <el-form :model="form" :rules="editRule" ref="editform">
          <el-form-item label="用户ID" :label-width="formLabelWidth" prop="userId">
            <el-input v-model="form.userId" autocomplete="off" />
          </el-form-item>
          <el-form-item label="部门ID" :label-width="formLabelWidth" prop="departmentId">
            <el-input v-model="form.departmentId" autocomplete="off" />
          </el-form-item>
          <el-form-item label="登录名" :label-width="formLabelWidth" prop="account">
            <el-input v-model="form.account" autocomplete="off" />
          </el-form-item>
          <el-form-item label="姓名" :label-width="formLabelWidth" prop="name">
            <el-input v-model="form.name" autocomplete="off" />
          </el-form-item>
          <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
            <el-input v-model="form.password" autocomplete="off" />
          </el-form-item>
          <el-form-item label="电话" :label-width="formLabelWidth" prop="phone">
            <el-input v-model="form.phone" autocomplete="off" />
          </el-form-item>
          <el-form-item label="管理员(0非管理员, 1管理员)" :label-width="formLabelWidth" prop="admin">
            <el-input v-model="form.admin" autocomplete="off" />
          </el-form-item>
          <el-form-item label="创建时间" :label-width="formLabelWidth" prop="createTime">
            <el-input v-model="form.createTime" autocomplete="off" />
          </el-form-item>
          <el-form-item label="修改时间" :label-width="formLabelWidth" prop="updateTime">
            <el-input v-model="form.updateTime" autocomplete="off" />
          </el-form-item>
          <el-form-item label="最后登录时间" :label-width="formLabelWidth" prop="lastLoginTime">
            <el-input v-model="form.lastLoginTime" autocomplete="off" />
          </el-form-item>
          <el-form-item label="登录次数" :label-width="formLabelWidth" prop="loginTimes">
            <el-input v-model="form.loginTimes" autocomplete="off" />
          </el-form-item>
          <el-form-item label="状态(0未启用, 1启用)" :label-width="formLabelWidth" prop="status">
            <el-input v-model="form.status" autocomplete="off" />
          </el-form-item>
          <el-form-item label="删除状态(0正常, 1删除)" :label-width="formLabelWidth" prop="del">
            <el-input v-model="form.del" autocomplete="off" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible=false">取 消</el-button>
          <el-button type="primary" @click.native="edit">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 新建用户 -->
      <el-dialog title="新建用户" :visible.sync="addDialogVisible" ref="form" v-dialogDrag>
        <el-form :model="form" :rules="addRule">
          <el-form-item label="用户ID" :label-width="formLabelWidth" prop="userId">
            <el-input v-model="form.userId" autocomplete="off" />
          </el-form-item>
          <el-form-item label="部门ID" :label-width="formLabelWidth" prop="departmentId">
            <el-input v-model="form.departmentId" autocomplete="off" />
          </el-form-item>
          <el-form-item label="登录名" :label-width="formLabelWidth" prop="account">
            <el-input v-model="form.account" autocomplete="off" />
          </el-form-item>
          <el-form-item label="姓名" :label-width="formLabelWidth" prop="name">
            <el-input v-model="form.name" autocomplete="off" />
          </el-form-item>
          <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
            <el-input v-model="form.password" autocomplete="off" />
          </el-form-item>
          <el-form-item label="电话" :label-width="formLabelWidth" prop="phone">
            <el-input v-model="form.phone" autocomplete="off" />
          </el-form-item>
          <el-form-item label="管理员(0非管理员, 1管理员)" :label-width="formLabelWidth" prop="admin">
            <el-input v-model="form.admin" autocomplete="off" />
          </el-form-item>
          <el-form-item label="创建时间" :label-width="formLabelWidth" prop="createTime">
            <el-input v-model="form.createTime" autocomplete="off" />
          </el-form-item>
          <el-form-item label="修改时间" :label-width="formLabelWidth" prop="updateTime">
            <el-input v-model="form.updateTime" autocomplete="off" />
          </el-form-item>
          <el-form-item label="最后登录时间" :label-width="formLabelWidth" prop="lastLoginTime">
            <el-input v-model="form.lastLoginTime" autocomplete="off" />
          </el-form-item>
          <el-form-item label="登录次数" :label-width="formLabelWidth" prop="loginTimes">
            <el-input v-model="form.loginTimes" autocomplete="off" />
          </el-form-item>
          <el-form-item label="状态(0未启用, 1启用)" :label-width="formLabelWidth" prop="status">
            <el-input v-model="form.status" autocomplete="off" />
          </el-form-item>
          <el-form-item label="删除状态(0正常, 1删除)" :label-width="formLabelWidth" prop="del">
            <el-input v-model="form.del" autocomplete="off" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="save">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import qs from "qs";

export default {
  data() {
    return {
      url: "",
      query: {},
      tableData: [],
      total: 0,
      page: 1,
      pageSize: 20,
      isShowloading: false,
      delData: [], //删除的数据
      editDialogVisible: false, //是否显示编辑
      addDialogVisible: false, //新建用户框
      form: {
        status: "1"
      },
      addRule: {
        userId: [{ required: true, message: "请输入用户ID", trigger: "blur" }],
        departmentId: [{ required: true, message: "请输入部门ID", trigger: "blur" }],
        account: [{ required: true, message: "请输入登录名", trigger: "blur" }],
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        phone: [{ required: true, message: "请输入电话", trigger: "blur" }],
        admin: [{ required: true, message: "请输入管理员(0非管理员, 1管理员)", trigger: "blur" }],
        createTime: [{ required: true, message: "请输入创建时间", trigger: "blur" }],
        updateTime: [{ required: true, message: "请输入修改时间", trigger: "blur" }],
        lastLoginTime: [{ required: true, message: "请输入最后登录时间", trigger: "blur" }],
        loginTimes: [{ required: true, message: "请输入登录次数", trigger: "blur" }],
        status: [{ required: true, message: "请输入状态(0未启用, 1启用)", trigger: "blur" }],
        del: [{ required: true, message: "请输入删除状态(0正常, 1删除)", trigger: "blur" }],
      },
      editRule: {
        userId: [{ required: true, message: "请输入用户ID", trigger: "blur" }],
        departmentId: [{ required: true, message: "请输入部门ID", trigger: "blur" }],
        account: [{ required: true, message: "请输入登录名", trigger: "blur" }],
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        phone: [{ required: true, message: "请输入电话", trigger: "blur" }],
        admin: [{ required: true, message: "请输入管理员(0非管理员, 1管理员)", trigger: "blur" }],
        createTime: [{ required: true, message: "请输入创建时间", trigger: "blur" }],
        updateTime: [{ required: true, message: "请输入修改时间", trigger: "blur" }],
        lastLoginTime: [{ required: true, message: "请输入最后登录时间", trigger: "blur" }],
        loginTimes: [{ required: true, message: "请输入登录次数", trigger: "blur" }],
        status: [{ required: true, message: "请输入状态(0未启用, 1启用)", trigger: "blur" }],
        del: [{ required: true, message: "请输入删除状态(0正常, 1删除)", trigger: "blur" }],
      },
      formLabelWidth: "120px"
    };
  },
  methods: {
    // 分页查询相关
    currentChange(val) {
      this.page = val;
      this.getList();
    },
    getList() {
      this.isShowloading = true;
      axios({
        url: "/user/page",
        method: "post",
        data: this.query
      }).then(res => {
        this.tableData = res.data.records;
        this.total = res.data.total;
        this.isShowloading = false;
      });
    },
    // 保存用户
    save() {
      axios({
        url: "/user/save",
        method: "post",
        data: this.form
      }).then(res => {
        this.$message({
          message: "添加成功",
          type: "success"
        });
        this.addDialogVisible = false;
        this.form = {};
        this.getList();
      });
    },
    // 修改用户
    handleEdit(index, row) {
      this.editDialogVisible = true;
      this.form = Object.assign({}, row);
    },
    edit() {
      this.$refs["editform"].validate(valid => {
        if (valid) {
          axios({
            url: "/user/update",
            method: "post",
            data: this.form
          }).then(res => {
            this.$message({
              type: "success",
              message: "修改用户成功"
            });
            this.getList();
            this.editDialogVisible = false;
            this.form = {};
          });
        }
      });
    },
    confirmClose(done) {
      this.$confirm("确认关闭将丢失已编辑内容？", "提示", {
        type: "warning"
      }).then(() => {
        this.form = {};
        done();
      });
    },
    // 删除单个用户
    handleDelete(index, row) {
      this.$confirm("确认删除该用户？", "提示", {
        type: "warning"
      }).then(() => {
        axios({
          url: "/user/delete",
          method: "get",
          params: { id: row.userId }
        }).then(res => {
          this.$message({
            type: "success",
            message: "删除成功"
          });
          this.getList();
        });
      });
    },
    // 批量删除用户
    handleSelectionChange(delData) {
      this.delData = delData;
    },
    delAll() {
      this.$confirm("确认删除该用户吗?", "提示", {
        type: "warning"
      }).then(() => {
        this.isShowloading = true;
        let ids = this.delData.map(item => item.userId).toString();
        axios({
          url: "/user/delete",
          method: "get",
          params: { id: ids }
        }).then(res => {
          this.isShowloading = false;
          this.$message({
            message: "删除成功",
            type: "success"
          });
          this.getList();
        });
      });
    }
  },
  mounted() {
    this.getList();
  }
};
</script>
<style scoped>
.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 120px;
}

.handle-input {
  width: 300px;
  display: inline-block;
}
.del-dialog-cnt {
  font-size: 16px;
  text-align: center;
}
.table {
  width: 100%;
  font-size: 14px;
}
.red {
  color: #ff0000;
}
.mr10 {
  margin-right: 10px;
}
</style>
