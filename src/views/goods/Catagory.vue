<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">

            <el-row>
                <el-col>
                    <el-button type="primary" @click="ShowAddCatagoryDlg">添加分类</el-button>
                </el-col>
            </el-row>
            <tree-table
                ref="table"
                index-text="#"
                :data="catagoryList"
                :columns="columns"
                border
            >
                <template slot-scope="scope" slot="isOK">
                    <!--   自己对这个图标使用不是很熟练-->
                    <!-- 图标自定义颜色-->
                    <i class="el-icon-success" style="color:lightgreen" v-if="scope.row.cat_deleted === false"></i>
                    <i class="el-icon-error" style="color:lightgreen" v-else></i>
                </template>

                <template slot-scope="scope" slot="level">
                    <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
                    <el-tag type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
                    <el-tag type="warning" v-else>三级</el-tag>
                </template>
                <template slot-scope="scope" slot="operate">
                    <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
                    <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
                </template>
            </tree-table>
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[5, 8, 10, 15]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalPage">
            </el-pagination>
        </el-card>

        <el-dialog
            title="添加分类"
            :visible.sync="isShowAddCatagoryDlg"
            @close="addCatagoryDlgClose"
            width="30%">
            <el-form ref="addCatagoryForm" :model="addCategoryForm" label-width="80px" :rules="addCatagoyFormRules">
                <el-form-item label="分类名称" prop="cat_name">
                    <el-input v-model="addCategoryForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类">
                        <el-cascader
                            v-model="selectCategory"
                            :options="twoLevelList"
                            :props="categoryProps"
                            expand-trigger="hover"
                            clearable
                            @change="selectCatagoryhandleChange"
                            change-on-select></el-cascader>

                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
    <el-button @click="isShowAddCatagoryDlg = false">取 消</el-button>
    <el-button type="primary" @click="addCatagoryFormSubmit">确 定</el-button>
  </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "Catagory",
        data() {
            return {
                catagoryList: [],
                queryInfo: {
                    type: 3,
                    pagenum: 1,
                    pagesize: 5
                },
                totalPage: 0,
                columns: [
                    {
                        label: "分类名称",
                        prop: "cat_name"
                    },
                    // 自定义插槽
                    {
                        label: "是否有效",
                        type: 'template',
                        template: 'isOK',
                        width: '100px'
                    },
                    {
                        label: "操作",
                        type: 'template',
                        template: 'operate'
                    },
                    {
                        label: "排序",
                        type: 'template',
                        template: 'level'
                    },
                ],
                isShowAddCatagoryDlg: false,
                addCategoryForm: {
                    cat_name: '',
                    cat_pid: 0,
                    cat_level: 1
                },
                addCatagoyFormRules: {
                    cat_name: [
                        {required: true, message: '请输入活动名称', trigger: 'blur'},
                        {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
                    ],
                },
                twoLevelList: [],
                categoryProps: {
                    value: 'cat_id',
                    label: 'cat_name',
                    children: 'children',
                },
                //必须是数组
                selectCategory: [],
            }
        },
        methods: {
            async getcatagoryList() {
                const {data: res} = await this.$http.get('categories', {
                    params: this.queryInfo
                });
                if (res.meta.status !== 200) {
                    return this.$message.error('获取商品分类列表错误');
                }
                this.totalPage = res.data.total;
                this.catagoryList = res.data.result;
            },
            //很奇怪为什么这里传递参数不,很方法不用写(newSize)
            handleSizeChange(newSize) {
                this.queryInfo.pagesize = newSize;
                this.getcatagoryList();
            },
            handleCurrentChange(newPage) {
                this.queryInfo.pagenum = newPage;
                this.getcatagoryList();
            },
            ShowAddCatagoryDlg() {
                this.isShowAddCatagoryDlg = true
                this.get2LevelCatagory();
            },
            async get2LevelCatagory() {
                const {data: res} = await this.$http.get('categories', {
                    params: {
                        type: 2
                    }
                })
                if (res.meta.status !== 200) {
                    return this.$message.error('获取二级菜单失败');
                }
                this.twoLevelList = res.data;
                console.log(this.twoLevelList)
            },
            selectCatagoryhandleChange() {
                const select = this.selectCategory;
                if (select.length > 0) {
                    this.addCategoryForm.cat_pid = select[select.length - 1];
                    this.addCategoryForm.cat_level = select.length + 1;
                }
                console.log(this.addCategoryForm)

            },
            addCatagoryDlgClose() {
                this.selectCategory = [];
                this.twoLevelList = [];
                this.addCategoryForm.cat_level = 1;
                this.addCategoryForm.cat_pid = 0;
                this.addCategoryForm.cat_name = '';
            },
             addCatagoryFormSubmit() {
                 console.log(this.addCategoryForm)
                 this.$refs.addCatagoryForm.validate(async valid => {
                     if(!valid) return
                     const {data:res} = await this.$http.post('categories',
                        this.addCategoryForm
                     );
                     console.log(res)
                     if(res.meta.status !== 201){
                        return this.$message.error('添加分类失败');
                     }
                     this.$message.success('添加分类成功');
                     this.getcatagoryList();
                     // 注意这句话的位置
                     this.isShowAddCatagoryDlg = false;
                 })

            },
        },
        created() {
            this.getcatagoryList();
        },
    }
</script>

<style scoped lang="scss">
    .el-cascader{
        width: 100%;
    }
</style>
