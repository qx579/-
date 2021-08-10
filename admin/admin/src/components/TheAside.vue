<template>
    <div class="sidebar">
        <el-menu 
            class="sidebar-el-menu"
            :default-active="onRoutes"
            :collapse="collapse"
            background-color="#334256"
            text-color="#ffffff"
            active-text-color="#20a0ff"
            router
            >
            <el-menu-item index="first" >
                    <i class="el-icon-s-home"></i>
                    首页
            </el-menu-item>
            <el-submenu v-for="k in item" :key='k.title'>
                <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>{{k.title}}</span>
                </template>
                <el-menu-item-group v-for="m in k.content" :key='m.index'>
                    <el-menu-item :index="m.index" :key="item.index">
                    <i :class="m.icon"></i>
                    {{m.title}}
                </el-menu-item>
                </el-menu-item-group>
            </el-submenu>
            <template v-if="show">
                <template v-for="item in items">
                    <template>
                        <el-menu-item :index="item.index" :key="item.index">
                            <i :class="item.icon"></i>
                            {{item.title}}
                        </el-menu-item>
                    </template>
                </template>
            </template>
        </el-menu>
    </div>
</template>
<script>
    import bus from "../assets/js/bus";
    import { getStore } from '../utils/storage';
    export default {
        data(){
            return{
                show:true,
                collapse:false,
                item:[
                    {
                        title:'车辆管理',
                        content:[
                            {
                                icon:'el-icon-bell',
                                title:'待审核车辆',
                                index:'Cars'
                            },
                            {
                                icon:'el-icon-s-check',
                                title:'已审核车辆',
                                index:'finish'
                            },
                            {
                                icon:'el-icon-circle-close',
                                title:'下架车辆',
                                index:'deleteCar'
                            },
                        ]
                    },
                ],
                items:[
                    {
                        icon:'el-icon-chat-dot-round',
                        title:'公告管理',
                        index:'Notice'
                    },
                    {
                        icon:'el-icon-picture-outline',
                        title:'首页图片管理',
                        index:'image'
                    },
                    {
                        icon:'el-icon-picture-outline',
                        title:'意见管理',
                        index:'suggest'
                    },
                    {
                        icon:'el-icon-picture-outline',
                        title:'用户管理',
                        index:'user'
                    },
                    
                ]
            }
        },
        computed:{
            onRoutes(){
                return this.$route.path.replace('/','');
            }
        },
        created(){
            //通过bus进行组件间的通信，来折叠侧边栏
            bus.$on('collapse',msg=>{
                this.collapse = msg
            })
            this.show=getStore('type')=='super'?true:false
        }
    }
</script>
<style lang="less" scoped>
    .sidebar{
        height: 100%;
        background-color: #253042;
        width: 100%;
    }
    .sidebar-el-menu:not(.el-menu--collapse){
        width: 100%;
    }
    .sidebar >ul{
        height: 100%;
    }
</style>