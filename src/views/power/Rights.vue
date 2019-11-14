<template>
    <div>
        <el-card class="box-card">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>权限管理</el-breadcrumb-item>
                <el-breadcrumb-item>权限列表</el-breadcrumb-item>
            </el-breadcrumb>
            <el-table :data="rightsList" border stripe>
                <!--        给前面加索引-->
                <el-table-column type="index"></el-table-column>
                <el-table-column label="权限名称" prop="authName"> </el-table-column>
                <el-table-column label="路径" prop="path"></el-table-column>
                <el-table-column label="权限登记" prop="level">
                    <template slot-scope="scope">
<!--                        为什么要加单引号-->
                        <el-tag type="success" v-if="scope.row.level === '1'">等级一</el-tag>
                        <el-tag type="info" v-else-if="scope.row.level === '2'">等级二</el-tag>
                        <el-tag type="warning" v-else>等级三</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "Rights",
        data() {
            return {
                rightsList: [],
            }
        },
        created() {
            this.getRightsList();
        },
        methods: {
            async getRightsList() {
                //自己对接口对不怎么会有。自己看接口等于type=list
                const {data: res} = await this.$http.get('rights/list');
                console.log(res)
                this.rightsList = res.data;
            }
        },
    }
</script>

<style scoped lang="scss">

</style>
