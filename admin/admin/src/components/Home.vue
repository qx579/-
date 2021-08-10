<template>
    <div style="display:flex">
        <div style=" position: fixed;left: 0;bottom: 0;top: 0px;width: 15%;">
            <the-aside></the-aside>
        </div>
        <div class="content-box" :class="{'content-collapse':collapse}">
            <div>
                <the-header></the-header>
            </div>
            <div style="width:100%;background:white">
                <router-view></router-view>
            </div>   
        </div>
    </div>    
</template>
<script>
    import bus from "../assets/js/bus";
    import TheHeader from './TheHeader';
    import TheAside  from './TheAside';
    export default {
        components:{
            TheHeader,
            TheAside

        },
        data(){
            return {
                collapse:false
            }
        },
        created(){
            //通过bus进行组件间的通信，来折叠侧边栏
            bus.$on('collapse',msg=>{
                this.collapse = msg
            })
        }
    
    }
</script>
<style lang="less" scoped>
    .content-box{
        position: relative;
        left: 15%;
        right: 0;
        // top: 70px;
        bottom: 0;
        width: 85%;
        -webkit-transition: left .3s ease-in-out;
        transition: left .3s ease-in-out;
        background-color: white;
        height: 100vh;
    }
    .content-collapse{
        left: 48px;
        width:96%
    } 
</style>
