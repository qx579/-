<template> 
  <div class="app-container">
    <!-- <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float:right"
          type="primary"
          @click="handleSearchList()"
          size="small">
          查询搜索
        </el-button>
        <el-button
          style="float:right;margin-right: 15px"
          @click="handleResetSearch()"
          size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="图片名称：">
            <el-input v-model="listQuery.image_name" class="input-width" placeholder="图片名称"></el-input>
          </el-form-item>
          <el-form-item label="图片位置：">
            <el-select v-model="listQuery.position" placeholder="全部" clearable class="input-width">
              <el-option v-for="item in typeOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card> -->
    <el-card class="operate-container" shadow="never">
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" @close="onDialogClose()">
            <el-form ref="dataForm" :rules="rules" :model="dataForm" label-width="80px">
                <el-form-item label="登录账号" prop="userName">
                    <el-input :disabled="isedit" v-model="dataForm.userName" placeholder="登录名"></el-input>
                </el-form-item>
                <el-form-item label="用户角色" prop="roleIds">
                    <el-select v-model="dataForm.type"  placeholder="请选择" style="width: 100%;">
                        <el-option
                        v-for="item in roles"
                        :key="item.id"
                        :label="item.roleName"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="登录密码" prop="password">
                    <el-input v-model="dataForm.password" placeholder="登录密码"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="goback">取 消</el-button>
                <el-button type="info" @click="editSubmit()" v-if="isedit">保存</el-button>
                <el-button v-else type="primary" @click="onDialogSubmit()">立即创建</el-button>
            </div>
        </el-dialog>
        <i class="el-icon-tickets"></i>
        <span>数据列表</span>
        <el-button size="mini" class="btn-add" @click="adduser">添加用户</el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="homeAdvertiseTable"
        :data="list"
        style="width: 100%;"
        v-loading="listLoading" border>
        <el-table-column
            type="index"
            align="center"
            width="50">
        </el-table-column>
        <el-table-column label="账号" align="center">
          <template slot-scope="scope">{{scope.row.userName}}</template>
        </el-table-column>
        <el-table-column label="权限" width="120" align="center">
          <template slot-scope="scope">{{scope.row.type}}</template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button size="mini"
              type="text"
              @click="handleUpdate(scope.row)">编辑
            </el-button>
            <el-button size="mini"
              type="text"
              @click="handleDelete(scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[4, 12, 40, 80]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>
<script>  
  import {getusers,getuser,register,edituser,deluser} from '../api/index'
  export default {
    data() {
      return {
        currentPage: 1,
        total: 0,
        pageSize: 12,
        isedit:false,
        list:'',
        dialogVisible:false,
        dataForm:{
            userName:'',
            type:'',
            password:''
        },
        roles: [
            {
                id: 'super',
                roleName: '超级管理员'
            },
            {
                id: 'admin',
                roleName: '普通管理员'
            }
        ],
        rules: {
            userName: [
                {
                    required: true,
                    message: '登录名不能为空',
                    trigger: 'blur'
                },
                {
                    min: 1,
                    max: 50,
                    message: '登录名长度在 1 到 50 个字符',
                    trigger: 'blur'
                }
            ],
            type:[
                {
                    required: true,
                    message: '权限不能为空',
                    trigger: 'change'
                },
            ]
        }
      }
    },
    created() {
        this.getlist()
    },
    methods: {
        handleSizeChange (val) {
            this.pageSize = val
            this.getlist()
        },
        handleCurrentChange (val) {
            this.currentPage = val
            this.getlist()
        },
        getlist(){
            var param={
                currentPage: this.currentPage,
                size: this.pageSize,
            }
            getusers(param).then(res=>{
                this.list=res.data
                this.total = res.total  
            })
        },
        editSubmit(){
            var params={
                userName:this.dataForm.userName,
                password:this.dataForm.password,
                type:this.dataForm.type
            }
            console.log(params)
            edituser(params).then(res=>{
                if(res.code==200){
                    this.$message({
                        type:'success',
                        message:'添加成功'
                    })
                    this.dialogVisible=false
                    this.getlist()
                }
            })
        },
        onDialogSubmit(){
            var params={
                userName:this.dataForm.userName,
                userPwd:this.dataForm.password,
                type:this.dataForm.type
            }
            register(params).then(res=>{
                if(res.code==200){
                    this.$message({
                        type:'success',
                        message:'添加成功'
                    })
                    this.dialogVisible=false
                    this.getlist()
                }
            })
        },
        adduser(){
            this.isedit=false
            this.dialogVisible=true;
            this.dataForm={
                userName:'',
                type:'',
                password:''
            }
        },
        goback(){
            this.dialogVisible=false;
            this.dataForm={
                userName:'',
                type:'',
                password:''
            }
        },
         handleUpdate(row){
            this.isedit=true
            getuser({userName:row.userName}).then(res=>{
                this.dataForm=res.data[0];
                console.log(res.data)
                this.dialogVisible=true
            })
        },
        handleDelete(row){
            this.$confirm('是否要删除该用户?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(() => {
            deluser({userName:row.userName}).then(res=>{
                this.$message({
                    type:'success',
                    message:'删除成功'
                })
                this.getlist()
            })
        })   
      },
      getList() {
        this.listLoading = true;
        var param={
          image_name:this.listQuery.image_name,
          position:this.listQuery.position
        }
        getimg(param).then(response => {
          this.listLoading = false;
          this.list = response.data;
          this.count=response.count-1;
        })
      }
    }
  }
</script>
<style scoped>
  .input-width {
    width: 203px;
  }
  .app-container{
    padding-bottom: 20px;
  }
  .el-pagination{
    float: right;
    margin: 3vw 10vw 2vw;
    padding-bottom: 20px;
  }
</style>