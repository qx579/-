<template>
  <div class="app context">
    <div  v-for="(tag,i) in dynamicTags" :key="i">
      <div for=""> 第{{i+1}}条:</div>
      <div class="content">
        <div style="width:600px; margin-right:20px">
          <el-input
            @blur="edit(tag.content,tag.warning_id)"
            type="textarea"
            :value='tag.content'
            :disable-transitions="false"
            v-model="tag.content"
            >
          </el-input>
        </div>
        <el-button type='danger' style="height:30px;margin-top:10px" size="mini" @click="handleClose(tag,tag.warning_id)">删除</el-button>
      </div>  
    </div>
    <div></div>
    <el-dialog
      title="添加公告提示"
      :visible.sync="inputVisible"
      width="50%"
      >
      <el-input
        type="textarea"
        v-model="inputValue"
        ref="saveTagInput"
        size="small"
      >
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="inputVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleInputConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <el-button v-if="!inputVisible" class="button-new-tag" size="small" @click="showInput">添加公告</el-button>
    <div>
      <el-button type='warning' style="margin-top:20px;"  size="small" @click="change">预览</el-button>
    </div>
    <prompt @changef='changef($event)' :dialogVisible=dialogVisible :warningdata=warningdata></prompt>
  </div>
</template>
<script>
  import {addwarning,getwarning,delwarning,editwarning} from '../api/index'
  import Prompt from '../components/prompt'
  export default {
    data() {
      return {
        warningdata:'',
        dialogVisible:false,
        dynamicTags: [],
        inputVisible: false,
        inputValue: '',
        ruleForm: {
          desc: ''
        },
        rules: {
          desc: [
            { required: true, message: '请填写公告内容', trigger: 'blur' }
          ]
        }
      };
    },
    components: {
      Prompt
    },
    methods: {
      changef(){
        this.dialogVisible=false
        console.log(this.dialogVisible)
      },
      change(){
        this.dialogVisible=true
        getwarning().then(res=>{
          if(res.code==200){
            this.warningdata=res.data
          }
       })
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var params={
              content:this.ruleForm.desc
            }
            addwarning(params).then(res=>{
              if(res.code==200){
                this.$message({
                  type:'success',
                  message:'添加成功'
                })
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      handleClose(tag,warning_id) {
        this.$confirm('是否要删除该公告?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
          }).then(() => {
          this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
          if(warning_id){
            var param={
              warning_id
            }
            delwarning(param).then(res=>{
              this.$message({
                type:'success',
                message:'删除成功'
              })
            })
          }
        })
      },
      showInput() {
        this.inputVisible = true;
      },
      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (!inputValue) {
          this.$message.error('请填写内容');
          return false;
        }
        this.dynamicTags.push({content:inputValue});
        
        var params={
          content:this.inputValue
        }
        addwarning(params).then(res=>{
          if(res.code==200){
            this.$message({
              type:'success',
              message:'添加成功'
            })
            this.getwarn()
          }
        })
        this.inputVisible = false;
        this.inputValue = '';
      },
      edit(content,warning_id){
        if(!content){
          this.$message.error('请填写内容');
          return false;
        }
        var params={
          content,
          warning_id
        }
        editwarning(params)
      },
      getwarn(){
        getwarning().then(res=>{
        if(res.code==200){
          this.dynamicTags=res.data
        }
        
      })
      }
    },
    created(){
      this.getwarn()
    }
  }
</script>
<style lang="less" scoped>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
  el-input{
    width: 700px;
  }
  .context{
    width: 800px;
    margin: 40px auto;
  }
  .content{
    margin-bottom: 10px;
    display: flex;
  }

</style>