<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>部门管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll" :disabled="this.delData.length===0">批量删除</el-button>
        <el-input v-model="query.departmentId" placeholder="部门ID" class="handle-input mr5" />
        <el-input v-model="query.parentId" placeholder="上级部门ID" class="handle-input mr5" />
        <el-input v-model="query.shortName" placeholder="简称" class="handle-input mr5" />
        <el-input v-model="query.name" placeholder="全称" class="handle-input mr5" />
        <el-input v-model="query.sort" placeholder="排序" class="handle-input mr5" />
        <el-input v-model="query.remark" placeholder="备注" class="handle-input mr5" />
        <el-button type="primary" icon="search" @click="getList">搜索</el-button>
        <el-button type="primary" @click="addDialogVisible=true">新建用户</el-button>
      </div>
      <el-table :data="tableData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange" v-loading="isShowloading">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column prop="departmentId" label="部门ID" sortable width="150" />
        <el-table-column prop="parentId" label="上级部门ID" sortable width="150" />
        <el-table-column prop="shortName" label="简称" sortable width="150" />
        <el-table-column prop="name" label="全称" sortable width="150" />
        <el-table-column prop="sort" label="排序" sortable width="150" />
        <el-table-column prop="remark" label="备注" sortable width="150" />
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
          <el-form-item label="部门ID" :label-width="formLabelWidth" prop="departmentId">
            <el-input v-model="form.departmentId" autocomplete="off" />
          </el-form-item>
          <el-form-item label="上级部门ID" :label-width="formLabelWidth" prop="parentId">
            <el-input v-model="form.parentId" autocomplete="off" />
          </el-form-item>
          <el-form-item label="简称" :label-width="formLabelWidth" prop="shortName">
            <el-input v-model="form.shortName" autocomplete="off" />
          </el-form-item>
          <el-form-item label="全称" :label-width="formLabelWidth" prop="name">
            <el-input v-model="form.name" autocomplete="off" />
          </el-form-item>
          <el-form-item label="排序" :label-width="formLabelWidth" prop="sort">
            <el-input v-model="form.sort" autocomplete="off" />
          </el-form-item>
          <el-form-item label="备注" :label-width="formLabelWidth" prop="remark">
            <el-input v-model="form.remark" autocomplete="off" />
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
          <el-form-item label="部门ID" :label-width="formLabelWidth" prop="departmentId">
            <el-input v-model="form.departmentId" autocomplete="off" />
          </el-form-item>
          <el-form-item label="上级部门ID" :label-width="formLabelWidth" prop="parentId">
            <el-input v-model="form.parentId" autocomplete="off" />
          </el-form-item>
          <el-form-item label="简称" :label-width="formLabelWidth" prop="shortName">
            <el-input v-model="form.shortName" autocomplete="off" />
          </el-form-item>
          <el-form-item label="全称" :label-width="formLabelWidth" prop="name">
            <el-input v-model="form.name" autocomplete="off" />
          </el-form-item>
          <el-form-item label="排序" :label-width="formLabelWidth" prop="sort">
            <el-input v-model="form.sort" autocomplete="off" />
          </el-form-item>
          <el-form-item label="备注" :label-width="formLabelWidth" prop="remark">
            <el-input v-model="form.remark" autocomplete="off" />
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
        departmentId: [{ required: true, message: "请输入部门ID", trigger: "blur" }],
        parentId: [{ required: true, message: "请输入上级部门ID", trigger: "blur" }],
        shortName: [{ required: true, message: "请输入简称", trigger: "blur" }],
        name: [{ required: true, message: "请输入全称", trigger: "blur" }],
        sort: [{ required: true, message: "请输入排序", trigger: "blur" }],
        remark: [{ required: true, message: "请输入备注", trigger: "blur" }],
      },
      editRule: {
        departmentId: [{ required: true, message: "请输入部门ID", trigger: "blur" }],
        parentId: [{ required: true, message: "请输入上级部门ID", trigger: "blur" }],
        shortName: [{ required: true, message: "请输入简称", trigger: "blur" }],
        name: [{ required: true, message: "请输入全称", trigger: "blur" }],
        sort: [{ required: true, message: "请输入排序", trigger: "blur" }],
        remark: [{ required: true, message: "请输入备注", trigger: "blur" }],
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
        url: "/department/page",
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
        url: "/department/save",
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
            url: "/department/update",
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
          url: "/department/delete",
          method: "get",
          params: { id: row.departmentId }
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
        let ids = this.delData.map(item => item.departmentId).toString();
        axios({
          url: "/department/delete",
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
