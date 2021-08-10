<template>
  <div class="container" >
    <div class="user">个人信息</div>
    <el-row>
      <el-col :span="12"><div >
        联系人：{{data.name}}
        </div></el-col>
      <el-col :span="12"><div >
        联系电话：{{data.phone}}
        </div></el-col>
    </el-row>
    <el-row>
      <el-col :span="12"><div>
        看车地址：{{data.address}}
        </div></el-col>
      <el-col :span="12"><div >
        是否急售：{{data.urgent}}
      </div></el-col>
    </el-row>
    <div class="cars" style="margin-top:15px">车辆信息</div>
    <el-row>
      <el-col v-if="data.vin" :span="12"><div >
        车辆识别代号：{{data.vin}}
        </div></el-col>
      <el-col :span="12"><div >
        品牌：{{data.brand}}
        </div></el-col>
    </el-row>
    <el-row>
      <el-col :span="12"><div >
        车辆颜色：{{data.color}}
        </div></el-col>
      <el-col :span="12"><div >
        首次上牌时间：{{data.firstTime}}
        </div></el-col>
    </el-row>
    <el-row>
      <el-col :span="12"><div >
        行驶里程：{{data.mile}}万公里
        </div></el-col>
      <el-col :span="12"><div >
        转让价格：{{data.price}}万元
        </div></el-col>
    </el-row>
    <div v-if="data.decrip">
        <div class="topic">车况描述：</div>
        <div class="topic">
          {{data.decrip}}
        </div>
    </div>
    <div class="topic">图片：</div>
    <div class="topic" style="width:90%" v-for="(item,i) in data.goods_picture" :key=i>
      <img style="width:100%" v-lazy="item" :alt="data.brand">
    </div>
    <div class="more" style="margin-top:15px">更多信息</div>
      <el-row>
      <el-col :span="8"><div >
        年检到期：{{data.checkYear}}
        <i v-if="data.checkYear!='未检'">年</i>
        </div></el-col>
      <el-col :span="8"><div >
        交强险到期：{{data.traffic}}
        <i v-if="data.traffic!='过保'">年</i>
        </div></el-col>
      <el-col :span="8"><div >
        商业险到期：{{data.insurance}}
        <i v-if="data.insurance!='无商业险'">年</i>
        </div></el-col>
    </el-row>
    <el-row>
      <el-col v-if="data.times" :span="8"><div >
        过户次数：{{data.times}}次
        </div></el-col>
      <el-col v-if="data.diya" :span="8"><div >
        车辆是否有抵押：{{data.diya}}
        </div></el-col>
      <el-col v-if="data.baoyang" :span="8"><div >
        是否定期4S店保养：{{data.baoyang}}
        </div></el-col>
    </el-row>
    <div v-if="data.hightlight">
      <div class="topic">车辆亮点：</div>
      <div>{{data.hightlight}}</div>
    </div>
    <div class="verify" style="margin-bottom:30px;">
      <i class="el-icon-s-opportunity">审核意见:</i>
    </div>
    <el-form :label-position="labelPosition" :inline="true" label-width="80px" :model="formLabelAlign">
      <el-form-item label="备注：" >
        <el-input v-if="data.status==0" type="textarea" cols="72" v-model="formLabelAlign.reason" rows="3"></el-input>
        <div v-else>{{data.reason?data.reason:'无'}}</div>
      </el-form-item>
      <div>
        <el-button v-if="data.status!=-1" :disabled="data.status==1" type="warning" style="margin-left:150px" @click="check('1')">审核通过</el-button> 
        <el-button v-if="data.status!=1" :disabled="data.status==-1"  style="margin-left:130px;" @click="check('-1')">审核不通过</el-button>
        <el-button v-if="data.status==0" type="warning" @click="print" style="margin-left:150px">打印</el-button>
      </div>
      <div style="padding-bottom:10px"></div>
    </el-form>
    <div style="height:50px"></div>
  </div>
</template>
<script>
  import {getgoodByid,editgoodstatus,email} from '../api/index.js'
  export default {
    data() {
      return {
        idedit:true,
        data:'',
        labelPosition: 'right',
        formLabelAlign: {
          reason:''
        }
      };
    },
    methods: {
      print(){
        const printHtml = document.querySelector('.container').innerHTML; // 需要打印的内容
        window.document.body.innerHTML = printHtml;
        window.print();
        window.location.reload();
      },
      check(i){
        if(i==-1){
          if(!this.formLabelAlign.reason){
            this.$message({
              type:'warning',
              message:'请在备注中填写未通过原因'
            })
            return false;
          }
        }
        var params={
          status:i,
          goods_id:this.data.goods_id,
          reason:this.formLabelAlign.reason,
        }
        var emails={
          userName:this.data.userName,
          status:i,
          type:"check"
        }
        editgoodstatus(params).then(res=>{
          if(res.code==200){
            email(emails).then(res=>{
              if(res.code==200){
                this.$message({
                  type:'success',
                  message:'提交成功'
                })
                 this.$router.push({
                  path:'/Cars'
                })
              }
            })
          }
        })
      }
    },
    created(){
      if(this.$route.query.goods_id){
        var goods_id= this.$route.query.goods_id
        var params={
          goods_id
        }
        if(this.$route.query.isedit=="no"){
          this.isedit=false
        }
        getgoodByid(params).then(res=>{
          if(res.code==200){
            var result=res.data[0]
            result.goods_picture=result.goods_picture.split('#')
            this.data=result
          }
        })
      }
    }
  }
</script>
<style lang="less" scoped>
 .el-row {
    margin:30px;
    
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
  body{
  background:rgb(240, 240, 240);

  }
  .user, .cars,.more, .verify{
    height: 40px;
    border-bottom:1px solid ;
    background-color: #fff;
    margin-bottom: 5px;
    font-size: 22px;
    padding-left:20px;
    padding-top: 8px;
  }
  .container{
      width: 900px;
      margin: 20px auto;
  }
  .topic{
    margin:30px;
  }
</style>