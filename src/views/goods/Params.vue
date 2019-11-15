<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>参数列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <el-alert
                title="注意只允许为第三级分类设置相关参数"
                type="warning"
                :closable="false"
                show-icon>
            </el-alert>
            <el-row>
                <el-col>
                    <span>选择商品分类</span>&nbsp;&nbsp;
                    <el-cascader
                        v-model="selectCategoryIDArr"
                        :options="threeLevelList"
                        :props="categoryProps"
                        expand-trigger="hover"
                        clearable
                        @change="selectCatagoryhandleChange"></el-cascader>
                </el-col>
            </el-row>
            <el-tabs v-model="activeName" @tab-click="tabChange">
                <el-tab-pane label="动态参数" name="many">
                    <el-row>
                        <el-row>
                            <el-button type="primary" :disabled="addAttrBtnAble" @click="isShowaddAttributeDlg = true">
                                添加参数
                            </el-button>
                        </el-row>
                    </el-row>
                    <el-table
                        :data="danymicAttribute"
                        style="width: 100%" border stripe>
                        <el-table-column type="expand">

                        </el-table-column>
                        <el-table-column type="index">

                        </el-table-column>
                        <el-table-column
                            prop="attr_name"
                            label="参数名称"
                            width="180">
                        </el-table-column>
                        <el-table-column>
                            <template slot-scope="scope">
                                <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
                                <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
                            </template>
                        </el-table-column>

                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="静态参数" name="only">
                    <el-row>
                        <el-row>
                            <el-button type="primary" :disabled="addAttrBtnAble" @click="isShowaddAttributeDlg = true">
                                添加参数
                            </el-button>
                        </el-row>
                    </el-row>
                    <el-table
                        :data="staticAttribute"
                        style="width: 100%" border stripe>
                        <el-table-column type="expand">

                        </el-table-column>
                        <el-table-column type="index">

                        </el-table-column>
                        <el-table-column
                            prop="attr_name"
                            label="参数名称"
                            width="180">
                        </el-table-column>
                        <el-table-column>
                            <template slot-scope="scope">
                                <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
                                <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
                            </template>
                        </el-table-column>

                    </el-table>
                </el-tab-pane>
            </el-tabs>

        </el-card>


        <el-dialog
            title="添加属性"
            :visible.sync="isShowaddAttributeDlg"
            width="30%" @close="resetAddAttriForm">
            <el-form ref="addAttriFormRef" label-width="120px" :model="addAttrForm" :rules="addAttriRules">
                <el-form-item :label="addAttributeDlgName" prop="attr_name">
                    <el-input v-model="addAttrForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
                <span slot="footer" class="dialog-footer">
    <el-button @click="isShowaddAttributeDlg = false">取 消</el-button>
    <el-button type="primary" @click="addAttrFormSubmit">确 定</el-button>
  </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "Params",
        data() {
            return {
                selectCategory: [],
                threeLevelList: [],
                categoryProps: {
                    value: 'cat_id',
                    label: 'cat_name',
                    children: 'children',
                },
                selectCategoryIDArr: [],
                selectCategory: {},
                activeName: 'many',
                staticAttribute: [],
                danymicAttribute: [],
                isShowaddAttributeDlg: false,
                addAttrForm: {
                    attr_name: '',
                },
                addAttriRules:{
                    attr_name: [
                        { required: true, message: '请输入属性名称', trigger: 'blur' },
                        { min: 3, max: 5, message: '长度在 2 到 10 个字符', trigger: 'blur' }
                    ],
                },
                //    需要注意这个属性
            }
        },
        methods: {
            async getAllCategoryList() {
                const {data: res} = await this.$http.get('categories');
                if (res.meta.status !== 200) {
                    return this.$message.error('获取商品分类失败');
                }
                this.threeLevelList = res.data;
            },
            async selectCatagoryhandleChange() {
                let length = this.selectCategoryIDArr.length;
                if (length !== 3) {
                    this.selectCategoryIDArr = []
                    return this.$message.error('您选择的非法,请重新选择')
                }
                this.getAttribute();
            },
            async getAttribute() {
                const {data: res} = await this.$http.get(`categories/${this.selectCategoryID}/attributes`, {
                    params: {
                        sel: this.activeName
                    }
                })
                if (res.meta.status !== 200) {
                    return this.$message.error('获取信息失败失败');
                }
                if (this.activeName === 'many') {
                    this.danymicAttribute = res.data;
                } else {
                    this.staticAttribute = res.data;
                }

            },
            tabChange() {
                this.getAttribute();
            },
            resetAddAttriForm(){
                this.$refs.addAttriFormRef.resetFields();
            },
            addAttrFormSubmit(){
                this.$refs.addAttriFormRef.validate(async valid => {
                    if(!valid){
                      return this.$message.error('您提交的数据有误')
                    }
                    const {data:res} =await this.$http.post(`categories/${this.selectCategoryID}/attributes`,{
                        attr_name: this.addAttrForm.attr_name,
                        attr_sel: this.activeName
                    });
                    if(res.meta.status !== 201){
                       return this.$message.error('增加错误');
                    }
                    this.isShowaddAttributeDlg = false
                    this.getAttribute();
                });

            },

        },
        created() {
            this.getAllCategoryList();
        },
        computed: {
            addAttrBtnAble() {
                return !(this.selectCategoryIDArr.length > 0)
            },
            selectCategoryID() {
                return this.selectCategoryIDArr[2];
            },
            addAttributeDlgName() {
                return this.activeName === 'many' ? '添加动态属性' : '添加静态属性';
            },
        },
    }
</script>

<style scoped lang="scss">

</style>
