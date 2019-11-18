<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <el-row>
                <el-col :span="6">
                <!-- 注意下面嵌套写法-->
                    <el-input  placeholder="请输入内容" >
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>

            </el-row>
        </el-card>
        <el-table :data="ordersList" border stripe>
            <!--        给前面加索引-->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="订单编号" prop="order_number"></el-table-column>
            <el-table-column label="订单价格" prop="order_price"></el-table-column>
            <el-table-column label="是否付款" prop="pay_status">
                <template slot-scope="scope">
                    <!--                        为什么要加单引号-->
                    <el-tag type="success" v-if="scope.row.pay_status === '0'">未付款</el-tag>
                    <el-tag type="warning" v-else>已付款</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="是否发货" prop="is_send"></el-table-column>
            <el-table-column label="下单时间" prop="create_time">
                <template slot-scope="scope">
                    {{scope.row.create_time | dateFormat}}
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" type="primary"icon="el-icon-edit" @click="showAlterAddressDlg(scope.row)"></el-button>
                    <el-button size="mini" type="success" icon="el-icon-location" @click="showExpressDlg(scope.row)"></el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="block">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalPage">
            </el-pagination>
        </div>

        <el-dialog
            title="修改地址"
            :visible.sync="isShowModifyAddressDlg"
            width="30%" @close="closeAlterAddressDlg">
            <el-form ref="modifyAddressDlgFormRef" :model="modifyAddressForm" label-width="80px">
                <el-form-item label="省市区/县">
                    <el-cascader
                        v-model="modifyAddressForm.selectCity"
                        :options="cityData"
                        expand-trigger="hover"></el-cascader>
                </el-form-item>
                <el-form-item label="详细地址">
                    <el-input v-model="modifyAddressForm.detailAdd"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
    <el-button @click="isShowModifyAddressDlg = false">取 消</el-button>
    <el-button type="primary" @click="isShowModifyAddressDlg = false">确 定</el-button>
  </span>
        </el-dialog>
        <el-dialog
            title="修改地址"
            :visible.sync="isShowExpressInfoDlg"
            width="30%">
            <el-timeline>
                <el-timeline-item
                    v-for="(activity, index) in expressInfo"
                    :key="index"
                    :timestamp="activity.time">
                    {{activity.context}}
                </el-timeline-item>
            </el-timeline>
        </el-dialog>
    </div>
</template>

<script>
  //注意这样导入的,还是要在data里面指向下

  import citydata from "./citydata";
    export default {
        name: "Orders",
        data() {
            return {
                queryInfo: {
                    query: "",
                    pagenum: 1,
                    pagesize: 10
                },
                totalPage: 0,
                ordersList: [],
                isShowModifyAddressDlg: false,
                modifyAddressForm:{
                    selectCity: '',
                    detailAdd:''
                },
                cityData: citydata,
                isShowExpressInfoDlg: false ,
                expressInfo: [],

            }
        },
        methods: {
              async getOrdersList(){
                  const {data:res} =await this.$http.get('orders',{
                      params:this.queryInfo
                  })
                  if(res.meta.status !== 200){
                     return this.$message.error('获取订单信息错误');
                  }
                  this.ordersList = res.data.goods
                  this.totalPage = res.data.total
                  // console.log(this.ordersList,this.totalPage)
              },
            handleSizeChange(size){
                this.queryInfo.pagesize = size
                this.getOrdersList()
            },
            handleCurrentChange(index){
                this.queryInfo.pagenum = index
                this.getOrdersList()
            },
            showAlterAddressDlg(select){
                this.isShowModifyAddressDlg = true
                console.log(select)
            },
            closeAlterAddressDlg(){
                this.$refs.modifyAddressDlgFormRef.resetFields();
                console.log(this.modifyAddressForm)
            },
            async showExpressDlg(row){
                this.isShowExpressInfoDlg = true;
                  //  这里引入一个问题。如果请求api不对。axios竟然不往下执行。也不报错
                  const {data:res} =await this.$http.get('/kuaidi/804909574412544580');
                  if(res.meta.status !== 200){
                     return this.$message.error('获取物流信息错误');
                  }
                  this.expressInfo = res.data;
            },

        },
        created() {
            this.getOrdersList()
        },
    }
</script>

<style scoped lang="scss">

</style>
