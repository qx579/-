<template>
  <div>
  <!-- 视频元素 -->
    <div class="videoarea">
      <video id="video" class="videoBlock" muted autoplay loop="loop"  poster="">
        <source src="../assets/img/video.mp4"  type="video/mp4">
      </video>
        <div class="mask">
      </div>
    </div>
    <div class="name">二手车后台管理系统</div>
    <div class="log">Login  Here</div>
    <!--登录框-->
    <div class="container">
      <el-form :model="ruleForm"  :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item  prop="user">
          <el-input  v-model="ruleForm.user"  suffix-icon="el-icon-user" placeholder="用户名" ></el-input>
        </el-form-item>
        <el-form-item  prop="pass">
          <el-input type="password" v-model="ruleForm.pass" suffix-icon="el-icon-unlock" placeholder="密码" autocomplete="off"></el-input>
        </el-form-item>

        <div style="margin-left:120px">
          <el-button size="small"  type="warning" @click="submitForm('ruleForm')">提交</el-button>
          <el-button  size="small"  @click="resetForm('ruleForm')" style=" margin-left: 60px;">重置</el-button>
        </div> 
      </el-form>
    </div>
  </div>
</template>
<script>
  import { setStore} from '../utils/storage'
  import {pwdLogin} from '../api/index'
  export default {
    data() {
      return {
        ruleForm: {
          pass: "",
          user: ""
        },
        rules: {
          pass: [
             { required: true, message: '请填写用户名', trigger: 'blur' }
          ],
          user: [
             { required: true, message: '请填写密码', trigger: 'blur' }
          ]
        }
      };
    },
    methods: {
      submitForm(formName) {
         this.$refs[formName].validate((valid) => {
            if (valid) {
              var params={
                userName:this.ruleForm.user,
                password:this.ruleForm.pass
              }
              pwdLogin(params).then(res=>{
                if(res.code==200){
                  setStore('type', res.data[0].type)
                  console.log(res.data[0].type,'1222')
                   this.$router.push({
                    path: '/Cars'
                  })
                }
              })
            } else {
              console.log('error submit!!');
              return false;
            }
          })
      },
    }
 }
</script>
<style lang="less" scoped>
  .name{
    width: 500px;
    color: #ffffff;
    font-size: 45px;
    font-weight: 500;
    margin: 50px auto;
    z-index: 9999999;
    position: relative;
    letter-spacing: 4px;
  }
  .el-form{
    background: none;
  }
  .log{
    color: #ffffff;
    font-size: 23px;
    font-weight: 350;
    margin: 100px auto;
    z-index: 9999999;
    position: relative;
    width: 190px; 
  }
  .container{
    border-block: 2px;
    margin:-80px 340px;
    height: 100%;
    z-index: 99999;
    position: relative;
    
  }
  .el-input{
    border: 1px solid #fff;
    // display:block;
    width: 400px;
    height: 47px;
    margin-top: 5px;
    text-align: center;
    border-radius: 5px;
    text-decoration: none;
    background: none;
    
  }
  .container /deep/ .el-input__inner{
  border:none;
  background: none;
    color: #fff;
  }
  .container /deep/ .el-icon-user,.container /deep/ .el-icon-unlock{
    color: fff;
    font-size: 20px;
    font-weight: 700;
  }
  .el-button{
    font-size: 15px;
    width: 100px;
  margin-left: 50px;
  }

  .videoarea{
    position: absolute;
    width: 100%;
    height: 100%;
    left:0;
    top: 0;
    overflow: hidden;
  }
  .videoBlock{
    z-index: 1;	
    width: 100%;
    display: inline-block; 
    
  }
  .mask{
    z-index: 10;
    background: #000;
    opacity: 0.35;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>