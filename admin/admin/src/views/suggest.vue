<template>
  <div class="app-container">
    <!-- <el-card class="filter-container" shadow="never">
    <div>
      <i class="el-icon-search"></i>
      <span>筛选搜索</span>
      <el-button
        style="float:right"
        type="primary"
        @click="search()"
        size="small">
        查询搜索
      </el-button>
      <el-button
        style="float:right;margin-right: 15px"
        @click="clear()"
        size="small">
        重置
      </el-button>
    </div>
    <div  class="form" style="margin-top: 15px">
      <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
        <el-form-item label="订单id：">
          <el-input
            placeholder="支持车辆id前四位搜索"
            prefix-icon="el-icon-search"
              @keyup.enter.native="search"
            v-model="goods_id">
          </el-input> 
        </el-form-item>
      </el-form>
    </div>
  </el-card> -->
    <el-card class="operate-container" shadow="never">
    <i class="el-icon-tickets"></i>
    <span>数据列表</span>
  </el-card>
    <div class="table-container">
      <el-table
        border
        :data="tableData"
        :default-sort = "{prop: 'date', order: 'descending'}">
        <el-table-column
          prop="userName"
          label="用户"
        >
        </el-table-column>
        <el-table-column
          prop="time"
          label="日期"
          sortable
          width="160">
          <template slot-scope="scope">
            {{scope.row.time.slice(0,10)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="score"
          label="评分"
          width="120">
        </el-table-column>
        <el-table-column
          prop="suggest"
          label="意见"
          width="180">
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[2, 12, 40, 80]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>
<script>
  import{getsuggest} from '../api/index'
  export default {
    methods: {
      handleSizeChange (val) {
      this.pageSize = val
      this.search()
      },
      handleCurrentChange (val) {
        this.currentPage = val
        this.search()
      },
      search(){
        var param={
          currentPage: this.currentPage,
          size: this.pageSize,
        }
        getsuggest(param).then(res=>{
          this.tableData=res.data;
          this.total = res.total  
        })
      },
      clear(){
        this.search()
      },
    },
    created(){
      this.search()
    },
    data() {
      return {
        orgOptions: {},
        currentPage: 1,
        total: 0,
        pageSize: 12,
        tableData: "",
      }
    }
  }
</script>
<style lang="less" scoped>
  .app-container{
    margin-bottom: 20px;
  }
  .el-icon-view{
      font-size: 20px;
      color: #253042;
  }
  .btn{
    color: red;
  }
  .el-pagination{
    float: right;
    margin: 3vw 10vw 2vw;
    padding-bottom: 20px;
  }
</style>