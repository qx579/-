<template> 
  <el-card class="form-container" shadow="never">
    <el-form :model="homeAdvertise"
      :rules="rules"
      ref="homeAdvertiseFrom"
      label-width="150px"
      size="small">
    <el-form-item label="图片名称：" prop="image_name">
      <el-input v-model="homeAdvertise.image_name" class="input-width"></el-input>
    </el-form-item>
    <el-form-item label="图片位置：" prop="position">
      <el-select v-model="homeAdvertise.position">
        <el-option
          v-for="type in typeOptions"
          :key="type.value"
          :label="type.label"
          :value="type.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="上线/下线：">
      <el-radio-group v-model="homeAdvertise.image_status">
        <el-radio :label="0">下线</el-radio>
        <el-radio :label="1">上线</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="图片：" prop="url">
      <el-upload
        class="upload-demo"
        action="#"
        :on-change='upsuccess'
        :on-remove="handleRemove"
        :file-list="fileList"
        :auto-upload="false"
        list-type="picture">
        <div v-if="homeAdvertise.url" class="img">
          <img
            class="el-img"
            :src="homeAdvertise.url" alt=""
          >
          <i @click.stop="delimg" c class="el-icon-close icon"></i>
        </div>
        <el-button size="small" type="primary" :style="{display:!homeAdvertise.url==''?'none':'block'}" :disabled="!files==''">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传一张图片，建议为500×900像素</div>
      </el-upload>
    </el-form-item>
      <el-form-item label="图片备注：">
        <el-input
          class="input-width"
          type="textarea"
          :rows="5"
          placeholder="请输入内容"
          v-model="homeAdvertise.note">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('homeAdvertiseFrom')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('homeAdvertiseFrom')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
  import {addimg,getimgbyid,editimg} from '../api/index'
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
  const defaultHomeAdvertise = {
    image_name: null,
    position:'',
    url: '12',
    image_status: 0,
    note: null,
  };
  export default {
    data() {
      return {
        files:'',
        isEdit:false,
        homeAdvertise: {
          image_name: null,
          position:'',
          url: '',
          image_status: 1,
          note: null,
        },
        rules: {
          image_name: [
            {required: true, message: '请输入图片名称', trigger: 'blur'},
            {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
          ],
          url: [
            {required: true, message: '请选择图片', trigger: 'blur'}
          ],
          position:[
            {required: true, message: '请选择图片位置', trigger: 'change'}
          ]
        },
        typeOptions: Object.assign({}, defaultTypeOptions)
      }
    },
    created(){
      if(this.$route.query.id){
        getimgbyid({image_id:this.$route.query.id}).then(res=>{
          this.isEdit=true;
          this.homeAdvertise = res.data[0];
        })
      }
    },
    methods: {
      upsuccess(file){
        this.files=file.raw;
        this.homeAdvertise.url=file.url;
      },
      handleRemove(){
        this.files=''
      },
      delimg(){
        this.files=''
        this.homeAdvertise.url=''
      },
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm('是否提交数据', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              if (this.isEdit) {
                var params=new FormData()
                params.append('files',this.files)
                for(var m in this.homeAdvertise){
                    params.append(m,this.homeAdvertise[m])
                }
                editimg(params).then(response => {
                  this.$refs[formName].resetFields();
                  this.$message({
                    message: '修改成功',
                    type: 'success',
                    duration:1000
                  });
                  this.$router.back();
                });
              } else {
                var params=new FormData()
                  params.append('files',this.files)
                  for(var m in this.homeAdvertise){
                    params.append(m,this.homeAdvertise[m])
                  }
                addimg(params).then(response => {
                  this.$refs[formName].resetFields();
                  this.homeAdvertise = Object.assign({},defaultHomeAdvertise);
                  this.$message({
                    message: '提交成功',
                    type: 'success',
                    duration:1000
                  });
                  this.$router.push({path:'/image'})
                });
              }
            });
          } else {
            this.$message({
              message: '验证失败',
              type: 'error',
              duration:1000
            });
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.homeAdvertise = Object.assign({},defaultHomeAdvertise);
      }
    }
  }
</script>
<style scoped>
  .input-width {
    width: 400px;
  }
  .form-container {
    width: 720px;
    padding: 15px;
    margin: 20px auto;
    background: white;
  }
  .form-container /deep/ .el-upload-list{
    width:400px;
  }
  .form-container /deep/ .el-upload-list__item{
    overflow: visible;
    border: none; 
    border-radius: 0;
    padding: 0;
  }
  .form-container /deep/ .el-upload-list{
    display: none;
  }
  .img{
    height:150px;
    position: relative;
  }
  .el-img{
    height:150px;
  }
  .icon{
    position: absolute;
    top:0;
    right:0;
    font-size:22px;
  }
</style>


