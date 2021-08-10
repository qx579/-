<template>
    <div class="item">
        <el-dialog
            :show-close=false
            title="关于交易的重要提示"
            :visible.sync="dialogVisible"
            width="40%"
            :before-close="handleClose">
            <div v-for="(item,i) in warningdata" :key=i>
                <p class="text">
                {{i+1}}、{{item.content}}
            </p>
            </div>
            <i class="icon el-icon-close" @click="change"></i>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        data(){
            return{
                visibility:''
            }
        },
        props: ["dialogVisible","warningdata"],

        methods: {
            change(){
                this.$emit('changef')
            }
        },
    };
</script>
<style scoped>
    .item{
        position: relative;
        z-index: 99999999; 
    }
    .item /deep/ .el-dialog__wrapper{
            border-radius: 20px;
        }
    .item   /deep/ .el-dialog__title{
            margin-left:30%;
        }
    .item  /deep/ .el-dialog__header{
            background: rgba(255, 166, 0, 0.671);
    }
    .icon{
        position: absolute;
        bottom: -40px;
        left:50%;
        font-size: 28px;
        color: #fff;
        cursor: pointer;
    }
    .text{
        padding-bottom: 10px;
    }

</style>