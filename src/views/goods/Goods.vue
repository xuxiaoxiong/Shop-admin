<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" @clear="getGoodsList" v-model="queryInfo.query"
                              class="input-with-select" clearable
                    >
                        <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                 <!--   这里引出怎么路由挑战-->
                    <el-button type="primary" @click="routerToAddGoods">添加商品</el-button>
                </el-col>
            </el-row>
            <el-table :data="goodsList" border stripe>
                <!--        给前面加索引-->
                <el-table-column type="index"></el-table-column>
                <el-table-column width="700px" label="商品名称" class="goods-name" prop="goods_name"></el-table-column>
                <el-table-column label="商品价格" prop="goods_price"></el-table-column>
                <el-table-column label="商品重量" prop="goods_weight"></el-table-column>
                <el-table-column label="创建时间" prop="add_time">
                    <template slot-scope="scope">
                        {{scope.row.add_time | dateFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                    <el-button type="primary" size="mini" icon="el-icon-edit"></el-button>
                    <el-button type="danger" size="mini" icon="el-icon-delete"
                               @click="deleteGoods(scope.row)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>

        </el-card>
    </div>
</template>

<script>
    export default {
        name: "Goods",
        data() {
            return {
                queryInfo: {
                    query: "",
                    pagenum: 1,
                    pagesize: 10
                },
                total: 0,
                goodsList: []
            }
        },
        methods: {
            async getGoodsList() {
                const {data: res} = await this.$http.get('goods', {
                    params: this.queryInfo
                })
                if (res.meta.status !== 200) {
                    return this.$message.error('请求商品列表失败');
                }

                this.goodsList = res.data.goods
                this.total = res.data.total
                console.log(this.goodsList)
                console.log(this.total)
            },
            handleSizeChange(size) {
                this.queryInfo.pagesize = size;
                this.getGoodsList();
            },
            handleCurrentChange(page) {
                this.queryInfo.pagenum = page;
                this.getGoodsList();
            },
            async deleteGoods(row) {
                const confirm = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => err)
                // 这里必须加捕获  不然会有错误
                if(confirm !== 'confirm'){
                    console.log(confirm)
                  return  this.$message.success('您取消删除商品的操作')
                }
                const {data:res} =await this.$http.delete('goods/'+ row.goods_id);
                if(res.meta.status !== 200){
                   return this.$message.error('删除商品失败');
                }
                this.$message.success('删除商品成功')
                this.getGoodsList()

            },
            routerToAddGoods(){
                // 这里需要注意点
                this.$router.push('/goods/add');
            },
        },
        created() {
            this.getGoodsList()
        },
    }
</script>

<style scoped lang="scss">
    .el-col {
        margin-left: 15px;
    }

    .el-table {
        margin-left: 14px;
    }

</style>
