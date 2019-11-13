<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <!--        设置宽度用el-row。尽量不要设置固定的宽度-->
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" class="input-with-select" v-model="queryInfo.query" clearable
                              @clear="getUsers">
                        <el-button slot="append" icon="el-icon-search" @click="searchUsers"
                                   @keyup.enter.native="searchUsers"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="isShowAddUserDialog = true">添加用户</el-button>
                </el-col>
            </el-row>
            <el-table :data="userList2" border stripe>
                <!--        给前面加索引-->
                <el-table-column type="index"></el-table-column>
                <el-table-column label="姓名" prop="username"></el-table-column>
                <el-table-column label="邮箱" prop="email"></el-table-column>
                <el-table-column label="电话" prop="mobile"></el-table-column>
                <el-table-column label="角色" prop="role_name"></el-table-column>
                <el-table-column label="状态">
                    <!-- 自己对作用域插槽不是很理解-->
                    <!--   这个很关键需要重点理解。       -->
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)">
                        </el-switch>
                    </template>

                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button icon="el-icon-edit" type="primary" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
                        <el-button icon="el-icon-delete" type="danger" size="mini"  @click="showDeleteDialog(scope.row.id)"></el-button>
                        <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
                            <el-button icon="el-icon-setting" type="warning" size="mini"></el-button>
                        </el-tooltip>
                    </template>

                </el-table-column>
            </el-table>
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[1, 2, 4, 10]"
                :page-size="2"
                layout="total, sizes, prev, pager, next, jumper"
                :total="tatolPage">
            </el-pagination>
        </el-card>

        <!--    需要注意的是dialog的位置-->
        <el-dialog
            title="添加用户"
            :visible.sync="isShowAddUserDialog"
            width="30%" @close="addUserDialogClose">
            <el-form ref="userAddform" :model="addUserFormModel" label-width="70px" :rules="addUserFormRules">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addUserFormModel.username" size="big"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addUserFormModel.password" type="password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addUserFormModel.email" type="email"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="addUserFormModel.mobile" type="tel"></el-input>
                </el-form-item>
                <el-form-item>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isShowAddUserDialog = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
              </span>
        </el-dialog>
        <el-dialog
            title="修改用户"
            :visible.sync="isShoweditDialog"
            width="30%" @close="editDialogClose">
            <el-form ref="userEditform" :model="addEditFormModel" label-width="70px" :rules="addUserFormRules">
                <el-form-item label="用户名">
                    <el-input v-model="addEditFormModel.username" size="big" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addEditFormModel.email" type="email"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="addEditFormModel.mobile" type="tel"></el-input>
                </el-form-item>
                <el-form-item>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isShoweditDialog = false">取 消</el-button>
                <el-button type="primary" @click="editUserSubmit">确 定</el-button>
              </span>
        </el-dialog>

    </div>
</template>

<script>
    import Login from "../login/Login";

    export default {
        name: "User",
        created() {
            this.getUsers2();
        },
        data() {
            //表单验证规则竟然写在这里
            const validateEmail = (rule, value, callback) => {
                const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
                if (regEmail.test(value)) {
                    return callback();
                }
                callback(new Error("邮箱不合法不合法"));
            };
            const validateMobile = (rule, value, callback) => {

                const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
                if (regMobile.test(value)) {
                    return callback();
                }
                callback(new Error("手机号不合法"));
            };


            return {
                userList: [],
                userList2: [],
                tatolPage: 0,
                queryInfo: {
                    query: '',
                    pagenum: 1,
                    pagesize: 10
                },
                isShowAddUserDialog: false,
                isShoweditDialog: false,
                //需要注意这里。不需要提前定义属性。直接从数据库中读有什么属性
                addUserFormModel: {
                    username: "",
                    password: "",
                    email: "",
                    mobile: ""
                },
                addEditFormModel: {

                },
                addUserFormRules: {
                    //不能用name作为验证属性。不然验证name会有问题
                    username: [
                        {required: true, message: '请输入用户名', trigger: 'blur'},
                        {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请选择密码', trigger: 'blur'},
                        {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}
                    ],
                    email: [
                        {validator: validateEmail, trigger: 'blur'}
                    ],
                    mobile: [
                        {validator: validateMobile, trigger: 'blur'}
                    ],
                },
            }
        },
        methods: {
            //用这个没有用Promise好。如果给data里面东西赋值。有可能会错误。undefined
            async getUsers() {
                // 自己对axios参数请求不是很熟悉。自己第二个参数会这样写{参数名：参数值}
                const {data: res} = await this.$http.get("users", {params: this.queryInfo});
                if (res.meta.status !== 200) return this.$message.error("获取用户列表错误");
                //
                this.userList2 = res.data.users;
            },
            getUsers2() {
                // 自己对axios参数请求不是很熟悉。自己第二个参数会这样写{参数名：参数值}
                this.$http.get("users", {params: this.queryInfo}).then(res => {
                    this.userList2 = res.data.data.users;
                    this.tatolPage = res.data.data.total;
                });
            },
            handleSizeChange(newSize) {
                this.queryInfo.pagesize = newSize;
                this.getUsers2();
            },
            handleCurrentChange(newPage) {
                this.queryInfo.pagenum = newPage;
                this.getUsers2();
            },
            async userStateChange(userInfo) {
                //这里复习了使用
                const {data: res} = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`);
                if (res.meta.status === 200) {
                    return this.$message.success("更新状态成功");
                }
                //需要注意失败后，界面上的按钮已经变化。所以这里要变回来
                userInfo.mg_state = !userInfo.mg_state;
                this.$message.error("更新状态失败");
            },
            searchUsers() {
                this.getUsers2();
            },
            addUserDialogClose() {
                this.$refs.userAddform.resetFields();

            },
            addUser() {

                this.$refs.userAddform.validate(async valid => {
                    if (valid) {
                        const {data: res} = await this.$http.post('users', this.addUserFormModel);
                        this.isShowAddUserDialog = false;
                        if (res.meta.status === 201) {
                            this.getUsers2();
                            return this.$message.success('添加用户成功');
                        }
                        return this.$message.error('添加用户失败')
                    }
                });
            },
            async showEditDialog(id){
                //尽量从数据库中读取信息，因为客户端很多。需要从数据库中查询到跟真实的数据

                const {data:res} = await this.$http.get('users/'+id);
                if(res.meta.status) this.addEditFormModel = res.data;
                this.isShoweditDialog = true;
            },
            editDialogClose(){
                this.$refs.userEditform.resetFields();
            },
            async editUserSubmit(){
                const {data:res} = await this.$http.put('users/' + this.addEditFormModel.id,{
                    email:this.addEditFormModel.email,
                    mobile:this.addEditFormModel.mobile
                });
                this.isShoweditDialog = false;
                console.log(res)
                if(res.meta.status !== 200){
                   return  this.$message.error('更新用户失败');
                }
                this.getUsers2();
            },
            showDeleteDialog(id){
                this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    const {data:res} = await this.$http.delete('users/'+id);
                    if(res.meta.status !== 200){
                        return this.$message.error('删除失败')
                    }
                    this.$message.success('删除成功');
                    this.getUsers2();
                });


            },

        },

    }
</script>

<style scoped lang="scss">
    .el-table {
        margin-top: 20px;
    }
</style>
