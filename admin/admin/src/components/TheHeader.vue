<template>
    <div class="header">
        <!--折叠图标-->
        <div class="collapse-btn" @click="collapseChange">
            <i class="el-icon-menu"> </i>
        </div>
        <div class="logo">二手车后台管理系统</div>
        <div class="header-right">
            <div class="btn-fullscreen" @click="handleFullScreen">
                <el-tooltip :content="fullscreen ? '取消全屏' : '全屏'">
                <i class="el-icon-rank"></i>
                </el-tooltip>
            </div>
            <div class="user-avator">
            <img src="../assets/img/1.jpeg"/>
            </div>
            <el-dropdown class="user-name" trigger="click" @command="handleCommand"> 
                <span class="el-dropdown-link">{{userName}}
                 <i class="el-icon-caret-bottom"></i>
                 </span>
                 <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                 </el-dropdown-menu>
            </el-dropdown>
        </div>   
    </div>
</template>
<script>
import bus from "../assets/js/bus";
    export default {
        data(){
            return{
                collapse:false,
                fullscreen:false
            }
        },
        computed:{
            userName(){
                return localStorage.getItem('userName');
            }
        },
        methods:{
            //侧边栏折叠事件
            collapseChange(){
                this.collapse = !this.collapse;
                bus.$emit('collapse',this.collapse)
            },
            //全屏事件
            handleFullScreen(){
                if(this.fullscreen){
                    if(document.exitFullscreen){
                    document.exitFullscreen();  
                    }else if(document.webkitCancelFullScreen){//safir chrome
                        document.webkitCancelFullScreen();
                    }else if(document.mozCancelFullScreen){ //fire fox
                        document.mozCancelFullScreen();
                    }else if(document.msExitFullScreen){ //ie
                        document.msExitFullScreen();
                    }
                    
                }else{
                    let element = document.documentElement;
                    if(element.requestFullscreen){
                        element.requestFullscreen();
                    }else if(element.webkitRequestFullscreen){
                        element.webkitRequestFullscreen();
                    }else if(element.mozRequestFullscreen){
                        element.mozRequestFullscreen();
                    }else if(element.msRequestFullscreen){
                        element.msRequestFullscreen();

                    }
                }
                this.fullscreen = !this.fullscreen;
            },
            handleCommand(command){
                if(command === "logout"){
                    localStorage.removeItem('userName');
                    this.$router.push("/");
                }
            }
        }
    }
</script>
<style lang="less" scoped>
    .header{
        box-sizing: border-box;
        width: 100%;
        height: 60px;
        font-size: 22px;
        color: black;
        border-bottom:1px solid rgb(236, 240, 245);
        
    }
    .collapse-btn{
        float: left;
        padding: 0 21px;
        cursor: pointer;
        line-height: 60px;

    }
    .header .logo{
        line-height: 60px;
        float: left;
    }
    .header-right{
        float:right;
        padding-right: 10px;
        display: flex;
        height: 60px;
        align-items: center;

    }
    .user-avator{
        margin-left: 20px;

    }
    .user-avator img{
        display: block;
        width: 40px;
        height: 40px;
        border-radius:50% ;
    }
    .user-name{
        margin-left: 10px;

    }
    .btn-fullscreen{
        margin-right: 5px;
        font-size: 24px;
        transform: rotate(45deg);
        }
    .el-dropdown-link{
        color: black;
        cursor: pointer;
    }
</style>