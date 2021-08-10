<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
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
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="订单id：">
            <el-input
              placeholder="支持车辆id前四位搜索"
              prefix-icon="el-icon-search"
              @keyup.enter.native="search"
              v-model="goods_id">
            </el-input>
          </el-form-item>
          <el-form-item label="审核状态">
            <el-select v-model="status" placeholder="全部">
            <el-option
              label="审核通过"
              value="1">
            </el-option>
            <el-option
              label="审核未通过"
              value="-1">
            </el-option>
          </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
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
          prop="goods_id"
          label="车辆ID"
          >
        </el-table-column>
        <el-table-column
          prop="checktime"
          label="审核日期"
          sortable
          width="160">
          <template slot-scope="scope">
            {{scope.row.checktime.slice(0,10)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
          width="120">
        </el-table-column>
        <el-table-column
          prop="phone"
          label="电话"
          width="180">
        </el-table-column>
        <el-table-column
          prop="brand"
          label="品牌"
          width="140">
        </el-table-column>      
        <el-table-column
          label="状态"
          width="180">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status=='1'"  type='success' size="mini" @click="handleClick(scope.row)">
                通过</el-button>
            <el-button v-else type='warning' size="mini" @click="handleClick(scope.row)">
                未通过</el-button>
          </template>
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
  import{getnogoods} from '../api/index'
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
          status:this.status==''?'12':this.status,
          goods_id:this.goods_id
        }
        getnogoods(param).then(res=>{
          this.tableData=res.data;
          this.total=res.total;
        })
      },
      clear(){
        this.status='';
        this.goods_id=''
      this.search()
      },
      handleClick(row){
        this.$router.push({path: '/Detail', query: {goods_id:row.goods_id}})
      }
    },
    created(){
      this.search()
    },
    data() {
      return {
        currentPage: 1,
        total: 0,
        pageSize: 12,
        tableData: "",
        goods_id:'',
        status:''
      }
    }
  }
</script>
<style lang="less" scoped>
  .el-select{
    margin:0 50px
  }
  .el-select .el-input{
    width:150px !important;
  }
  .carcontent{
      margin: 10px 50px;
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