<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
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
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button size="mini" class="btn-add" @click="handleAdd()">添加图片</el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="homeAdvertiseTable"
        :data="list"
        style="width: 100%;"
        @selection-change="handleSelectionChange"
        v-loading="listLoading" border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column
        type="index"
        width="50">
        </el-table-column>
        <el-table-column label="图片名称" align="center">
          <template slot-scope="scope">{{scope.row.image_name}}</template>
        </el-table-column>
        <el-table-column label="图片位置" width="120" align="center">
          <template slot-scope="scope">{{scope.row.position}}</template>
        </el-table-column>
        <el-table-column label="图片" width="240" align="center">
          <template slot-scope="scope"><img style="height: 80px" :src="scope.row.url"></template>
        </el-table-column>
        
        <el-table-column label="下线/上线" width="120" align="center">
          <template slot-scope="scope">
            <el-switch
              @change="handleUpdateStatus(scope.$index, scope.row)"
              :active-value="1"
              :inactive-value="0"
              v-model="scope.row.image_status">
              
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button size="mini"
              type="text"
              @click="handleUpdate(scope.row)">编辑
            </el-button>
            <el-button size="mini"
              type="text"
              @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
            <el-button v-if="scope.row.sort!='99999' && scope.$index!=0" size="mini"
              type="text"
              @click="up(scope.$index,scope.row)">上移
            </el-button>
            <el-button v-if="scope.row.sort!='99999'&& scope.$index!=count" size="mini"
              type="text"
              @click="down(scope.$index,scope.row)">下移
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="batch-operate-container">
      <el-button size='mini' type='warning'  @click="delChecked">删除选中的商品</el-button>
    </div>
  </div>
</template>
<script>  
  import {getimg,editsort,deleteimg,deleteimgs} from '../api/index'
  const defaultListQuery = {
    pageNum: 1,
    pageSize: 5,
    name: null,
    type: null,
  };
  const defaultTypeOptions = [
    {
      label: '首页轮播',
      value: '首页轮播'
    },
    {
      label: '今日推荐',
      value: '今日推荐'
    },
    {
      label: '练手车',
      value: '练手车'
    },
    {
      label: '流程背景',
      value: '流程背景'
    }
  ];
  export default {
    name: 'homeAdvertiseList',
    data() {
      return {
        count:'',
        listQuery: Object.assign({}, defaultListQuery),
        typeOptions: Object.assign({}, defaultTypeOptions),
        list: null,
        total: null,
        listLoading: false,
        multipleSelection: [],
        operates: [
          {
            label: "删除",
            value: 0
          }
        ],
        operateType: null
      }
    },
    created() {
      this.getList();
    },
    methods: {
      up(index,cur){
        var tep=cur.sort;
        var params={
          image_id1:cur.image_id,
          sort1:this.list[index-1].sort,
          image_id2:this.list[index-1].image_id,
          sort2:tep
        }
        console.log(params)
        editsort(params).then(res=>{
          this.getList()
        })
      },
      down(index,cur){
        var tep=cur.sort;
        var params={
          image_id1:cur.image_id,
          sort1:this.list[index+1].sort,
          image_id2:this.list[index+1].image_id,
          sort2:tep
          }
          console.log(params)
        editsort(params).then(res=>{
          this.getList()
        })
      },
      delChecked () {
        if (this.multipleSelection < 1) {
          this.$message({
            message: '请选择一条记录',
            type: 'warning',
            duration: 1000
          });
          return;
        } else{
          this.$confirm('是否要删除该图片?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
          }).then(() => {
            var multipleSelection=this.multipleSelection;
            deleteimgs({multipleSelection:multipleSelection}).then(res=>{
              if(res.code==200){
                this.getList();
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
              }
            })  
          })
        }
      },
      handleResetSearch() {
        this.listQuery = Object.assign({}, defaultListQuery);
        this.getList();
      },
      handleSearchList() {
        this.getList();
      },
      handleSelectionChange(val){
        this.multipleSelection = val;
      },
      handleUpdateStatus(index,row){
        this.$confirm('是否要修改上线/下线状态?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteimg({image_id:row.image_id,image_status:row.image_status}).then(response=>{
            this.getList();
            this.$message({
              type: 'success',
              message: '修改成功!'
            });
          });
        }).catch(() => {
          this.$message({
            type: 'success',
            message: '已取消操作!'
          });
          this.getList();
        });
      },
      handleDelete(index,row){
        this.deleteHomeAdvertise(row.image_id);
      },
      handleAdd(){
        this.$router.push({path: '/addimage'})
      },
      handleUpdate(row){
        this.$router.push({path: '/addimage', query: {id: row.image_id}})
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
      },
      deleteHomeAdvertise(id){
        this.$confirm('是否要删除该图片?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params={image_id:id,image_status:3};
          deleteimg(params).then(response=>{
            this.getList();
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          });
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
</style>


