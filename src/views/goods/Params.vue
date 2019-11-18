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
                           <template slot-scope="scope">
                               <el-tag v-for="(item,index) in scope.row.attr_vals" :key="index" @close="deleteAttrTag(scope.row,index)" closable>{{item}}</el-tag>
                               <el-input
                                   class="input-new-tag"
                                   v-if="scope.row.isShowTagAddNewAttr"
                                   v-model="scope.row.inputValue"
                                   ref="saveTagInput"
                                   size="small"
                                   @keyup.enter.native="addTagHandler(scope.row)"
                                   @blur="addTagHandler(scope.row)"
                               >
                               </el-input>
                               <el-button v-else class="button-new-tag" size="small" @click="showAddAttriInput(scope.row)">+ New Tag</el-button>
                           </template>
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
                                <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDlg(scope.row)">编辑</el-button>
                                <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteAttri(scope.row)">删除</el-button>
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
                            <template slot-scope="scope">
                                <el-tag v-for="(item,index) in scope.row.attr_vals" :key="index" @close="deleteAttrTag(scope.row,index)" closable>{{item}}</el-tag>
                                <el-input
                                    class="input-new-tag"
                                    v-if="scope.row.isShowTagAddNewAttr"
                                    v-model="scope.row.inputValue"
                                    ref="saveTagInput"
                                    size="small"
                                    @keyup.enter.native="addTagHandler(scope.row)"
                                    @blur="addTagHandler(scope.row)"
                                >
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showAddAttriInput(scope.row)">+ New Tag</el-button>
                            </template>
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
                                <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDlg(scope.row)">编辑</el-button>
                                <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteAttri(scope.row)">删除</el-button>
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
        <el-dialog
            title="编辑属性"
            :visible.sync="isShowEditAttributeDlg"
            width="30%" @close="resetEditAttriForm">
            <el-form ref="editAttriFormRef" label-width="120px" :model="editAttri" :rules="addAttriRules">
                <el-form-item label="编辑属性名" prop="attr_name">
                    <el-input v-model="editAttri.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
    <el-button @click="isShowEditAttributeDlg = false">取 消</el-button>
    <el-button type="primary" @click="EditAttrFormSubmit">确 定</el-button>
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
                addAttriRules: {
                    attr_name: [
                        {required: true, message: '请输入属性名称', trigger: 'blur'},
                        {min: 3, max: 5, message: '长度在 2 到 10 个字符', trigger: 'blur'}
                    ],
                },
                isShowEditAttributeDlg: false,
                editAttrForm: {
                    attr_name: ''
                },
                editAttri: {},
                addNewAttr: ''

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

                // bug
                if (length !== 3) {
                    this.selectCategoryIDArr = []
                        //bug修复
                    this.danymicAttribute = []
                    this.staticAttribute = []
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

                //  注意这里的写法
                    // 不过这样写是有bug的
                  // 因为“ ”.splite(" ") 也会返回值，需要特别处理一下

                 // 注意for循环共用一个true
                console.log(res.data)
                res.data.forEach(item => {
                   item.attr_vals = item.attr_vals? item.attr_vals.split(",") : [];
                    item.isShowTagAddNewAttr = false;
                    item.inputValue = "";
                });

                if (this.activeName === 'many') {
                    this.danymicAttribute = res.data;
                } else {
                    this.staticAttribute = res.data;
                }

            },
            tabChange() {
                this.getAttribute();
            },
            resetAddAttriForm() {
                this.$refs.addAttriFormRef.resetFields();
                this.editAttri = {}
            },
            addAttrFormSubmit() {
                this.$refs.addAttriFormRef.validate(async valid => {
                    if (!valid) {
                        return this.$message.error('您提交的数据有误')
                    }
                    const {data: res} = await this.$http.post(`categories/${this.selectCategoryID}/attributes`, {
                        attr_name: this.addAttrForm.attr_name,
                        attr_sel: this.activeName
                    });
                    if (res.meta.status !== 201) {
                        return this.$message.error('增加错误');
                    }
                    this.isShowaddAttributeDlg = false
                    this.getAttribute();
                });

            },
             EditAttrFormSubmit(){
                this.$refs.editAttriFormRef.validate(async (valid) => {
                    if(!valid){
                        return this.$message.error('属性名有误')
                    }
                    const {data:res} = await this.$http.put(`categories/${this.selectCategoryID}/attributes/
                    ${this.editAttri.attr_id}`,this.editAttri);
                    if(res.meta.status !== 200){
                       return this.$message.error('修改属性名失败');
                    }
                    this.isShowEditAttributeDlg = false
                    this.getAttribute()

                })
            },
            resetEditAttriForm(){
                this.editAttri = {}
            },
            showEditDlg(select){
                this.editAttri = select;
                console.log(this.editAttri)
                this.isShowEditAttributeDlg = true;
            },
           async deleteAttri(select){
             const confirm =   await this.$confirm('此操作将永久删除该属性, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                });
             if(confirm !== 'confirm'){
                 return ;
             }
             const {data:res} =await this.$http.delete(`categories/${this.selectCategoryID}/attributes/${select.attr_id}`);
             if(res.meta.status !== 200){
                return this.$message.error('删除属性失败');
             }
             this.$message.success('删除属性成功');
             this.getAttribute();
            },
            addTagHandler(select){
                select.isShowTagAddNewAttr = false;
                if(select.inputValue.trim().length === 0){
                    return;
                }
                select.attr_vals.push(select.inputValue);
                //  注意这里清空，不然会添加两次
                select.inputValue = ''
                this.editAttriSubmit(select);

            },
            showAddAttriInput(select){
                select.isShowTagAddNewAttr = true;
                //  当页面发生重新渲染，渲染结束后在调用该方法。
                //   如果不这样写会有错。因为v-if没有渲染这个元素。找不到会报错
                this.$nextTick(_ => {
                    // 让组件获得焦点
                    this.$refs.saveTagInput.$refs.input.focus();
                });

            },
            async editAttriSubmit(select){
                let value ;
                if(this.activeName === 'many'){
                     value = select.attr_vals.join(",");
                }else{
                   value = select.attr_vals.join(" ");
                }

                console.log(value)
                const {data:res} =await this.$http.put(`categories/${this.selectCategoryID}/attributes/${select.attr_id}`,{
                    attr_name: select.attr_name,
                    attr_sel: this.activeName,
                    attr_vals: value
                })
                if(res.meta.status !== 200){
                   return this.$message.error('修改属性错误');
                }
                this.$message.success('修改属性成功')
            },
            deleteAttrTag(select,index){
                select.attr_vals.splice(index,1);
                this.editAttriSubmit(select);
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
.el-tag {
    margin-right: 8px;
}
.el-input{
    width: 120px;
}

</style>
