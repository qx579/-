<template>
  <div class="app-container">
    <div class="total-layout">
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="total-frame">
            <img :src="img_home_order" class="total-icon">
            <div class="total-title">今日成交总数</div>
            <div class="total-value">{{sucessdata}}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="total-frame">
            <img :src="img_home_today_amount" class="total-icon">
            <div class="total-title">今日新增车辆</div>
            <div class="total-value">{{goodsupdata}}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="total-frame">
            <img :src="img_home_yesterday_amount" class="total-icon">
            <div class="total-title">今日新增人数</div>
            <div class="total-value">{{userupd}}</div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="un-handle-layout">
      <div class="layout-title">待处理事务</div>
      <div class="un-handle-content">
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">待审核车辆</span>
              <span style="float: right" class="color-danger">({{nocheck}})</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">审核通过车辆</span>
              <span style="float: right" class="color-danger">({{checksuccess}})</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="un-handle-item">
              <span class="font-medium">审核未通过车辆</span>
              <span style="float: right" class="color-danger">({{checkfailed}})</span>
            </div>
          </el-col>
        </el-row>  
      </div>
    </div>
    <div class="overview-layout">
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="out-border">
            <div class="layout-title">商品总览</div>
            <div style="padding: 40px">
              <el-row>
                <el-col :span="6" class="color-danger overview-item-value">{{undercarriage}}</el-col>
                <el-col :span="6" class="color-danger overview-item-value">{{checksuccess}}</el-col>
                <el-col :span="6" class="color-danger overview-item-value">{{allsuccess}}</el-col>
                <el-col :span="6" class="color-danger overview-item-value">{{allgoods}}</el-col>
              </el-row>
              <el-row class="font-medium">
                <el-col :span="6" class="overview-item-title">已下架</el-col>
                <el-col :span="6" class="overview-item-title">已上架</el-col>
                <el-col :span="6" class="overview-item-title">总交易</el-col>
                <el-col :span="6" class="overview-item-title">全部商品</el-col>
              </el-row>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="out-border">
            <div class="layout-title">用户总览</div>
            <div style="padding: 40px">
              <el-row>
                <el-col :span="8" class="color-danger overview-item-value">{{userupd}}</el-col>
                <el-col :span="8" class="color-danger overview-item-value">{{userupm}}</el-col>
                <el-col :span="8" class="color-danger overview-item-value">{{alluser}}</el-col>
              </el-row>
              <el-row class="font-medium">
                <el-col :span="8" class="overview-item-title">今日新增</el-col>
                <el-col :span="8" class="overview-item-title">本月新增</el-col>
                <el-col :span="8" class="overview-item-title">总用户</el-col>
              </el-row>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="statistics-layout">
      <div class="layout-title">周统计</div>
      <el-row>
        <el-col :span="20">
          <div style="padding: 10px;border-left:1px solid #DCDFE6"> 
            <div>
              <ve-line
                :data="chartData"
                :legend-visible="false"
                :loading="loading"
                :data-empty="dataEmpty"
                :settings="chartSettings"></ve-line>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  import {str2Date} from './date';
  import img_home_order from '@/assets/images/home_order.png';
  import img_home_today_amount from '@/assets/images/home_today_amount.png';
  import img_home_yesterday_amount from '@/assets/images/home_yesterday_amount.png';
  import {getd,getstatus,allsuccess,allgoods,getusercount,getw} from '../api/index'
  // const 
  export default {
    name: 'home',
    data() {
      return {
        userupd:'',
        userupm:'',
        alluser:'',
        allsuccess:'',
        allgoods:'',
        undercarriage:'',
        nocheck:'',
        checksuccess:'',
        checkfailed:'',
        sucessdata:'',
        goodsupdata:'',
        orderCountDate: '',
        chartSettings: {
          xAxisType: 'time',
          area:true,
          axisSite: { right: ['addgoods']},
        labelMap: {'adduser': '增加人数', 'addgoods': '增加车辆'}},
        chartData: {
          columns: ['date', 'adduser','addgoods'],
          rows: []
        },
        loading: false,
        dataEmpty: false,
        img_home_order,
        img_home_today_amount,
        img_home_yesterday_amount
      }
    },
    created(){
      getd({type:'success'}).then(res=>{
        this.sucessdata=res.data;
      }),
      getd({type:'goodsup'}).then(res=>{
        this.goodsupdata=res.data;
      }),
      getd({type:'userupd'}).then(res=>{
        this.userupd=res.data;
      }),
      getd({type:'userupm'}).then(res=>{
        this.userupm=res.data;
      }),
      getstatus({status:0}).then(res=>{
        this.nocheck=res.data
      }),
      getstatus({status:1}).then(res=>{
        this.checksuccess=res.data
      }),
      getstatus({status:-1}).then(res=>{
        this.checkfailed=res.data
      }),
      getstatus({status:3}).then(res=>{
        this.undercarriage=res.data
      }),
      allsuccess().then(res=>{
        this.allsuccess=res.data
      }),
      allgoods().then(res=>{
        this.allgoods=res.data
      }),
      getusercount().then(res=>{
        this.alluser=res.data
      })
      this.creatData()
     
    },
    methods:{
      async creatData(){ 
        for(var i=6;i>=0;i--){
          var time=new Date()
          time.setTime(time.getTime()-24*60*60*1000*i);
          var m=time.getFullYear() + "-" + (time.getMonth()> 9 ? (time.getMonth() + 1) : "0" + (time.getMonth() + 1))+ "-" +(time.getDate()> 9 ? (time.getDate()) : "0" + (time.getDate()));
           console.log(m)
           var obj={
            date:m,
            adduser:0,
            addgoods:0
          };
          await getw({type:'user',date:m}).then(res=>{
            if(res.code==200){
              console.log(obj,111)
              obj.adduser=res.data
              
            }
          })
         await getw({type:'goods',date:m}).then(res=>{
            if(res.code==200){
              obj.addgoods=res.data
            }
          })
          setTimeout(()=>{
            this.chartData.rows.push(obj)
          },0)
          
        }
      }
    }
  }
</script>

<style scoped>
  .app-container {
    margin-top: 40px;
    margin-left: 120px;
    margin-right: 120px;
    background: white;
  }

  .color-danger{
    color: red;
  }
  .color-main {
  color: #409EFF;
  }
  .color-danger {
    color: #F56C6C;
  }
  .font-medium {
    font-size: 16px;
    color: #606266;
  }
  .total-layout {
    margin-top: 20px;
  }

  .total-frame {
    border: 1px solid #DCDFE6;
    padding: 20px;
    height: 100px;
  }

  .total-icon {
    color: #409EFF;
    width: 60px;
    height: 60px;
  }

  .total-title {
    position: relative;
    font-size: 16px;
    color: #909399;
    left: 70px;
    top: -50px;
  }

  .total-value {
    position: relative;
    font-size: 18px;
    color: #606266;
    left: 70px;
    top: -40px;
  }

  .un-handle-layout {
    margin-top: 20px;
    border: 1px solid #DCDFE6;
  }

  .layout-title {
    color: #606266;
    padding: 15px 20px;
    background: #F2F6FC;
    font-weight: bold;
  }

  .un-handle-content {
    padding: 20px 40px;
  }

  .un-handle-item {
    border-bottom: 1px solid #EBEEF5;
    padding: 10px;
  }

  .overview-layout {
    margin-top: 20px;
  }

  .overview-item-value {
    font-size: 24px;
    text-align: center;
  }

  .overview-item-title {
    margin-top: 10px;
    text-align: center;
  }

  .out-border {
    border: 1px solid #DCDFE6;
  }

  .statistics-layout {
    margin-top: 20px;
    border: 1px solid #DCDFE6;
  }
  .mine-layout {
    position: absolute;
    right: 140px;
    top: 107px;
    width: 250px;
    height: 235px;
  }
  .address-content{
    padding: 20px;
    font-size: 18px
  }
  .app-container{
    padding-bottom: 20px;
  }
</style>
