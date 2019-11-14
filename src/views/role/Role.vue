<template>
    <div>
        <el-card class="box-card">
            <el-row>
                <el-col>
                    <el-button type="primary">添加角色</el-button>
                </el-col>
            </el-row>
            <el-table :data="rolesList" border stripe>
                <!--        给前面加索引-->
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-row v-for="(item,index) in scope.row.children" :key="item.id" :class="['addborderBottom',
                        index === 0?'addborderTop':'','vertticalMiddle']">
                            <el-col :span="5">
                                <el-tag closable @close="removeRights(scope.row,item.id)">{{item.authName}}</el-tag>
                            </el-col>
                            <el-col :span="19">
                                <!--  如果去底边框不容易获取最后的index,所以灵活变通     -->
                                <el-row v-for="(itemy,indey) in item.children" :key="itemy.id" :class="[
                                indey ===  0? '':'addborderTop','vertticalMiddle']">
                                    <el-col :span="5">
                                        <el-tag type="success" closable @close="removeRights(scope.row,itemy.id)">
                                            {{itemy.authName}}
                                        </el-tag>
                                    </el-col>
                                    <el-col :span="19">
                                        <!--   需要注意v-for循环的位置-->
                                        <el-tag type="warning" v-for="itemz in itemy.children" :key="itemz.id"
                                                closable @close="removeRights(scope.row,itemz.id)">
                                            {{itemz.authName}}
                                        </el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作" prop="mobile">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" icon="el-icon-edit">编辑
                        </el-button>
                        <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteRole(scope.row.id)">
                            删除
                        </el-button>
                        <el-button type="warning" size="mini" icon="el-icon-setting" @click="showEditDialog(scope.row)">分配权限
                        </el-button>
                    </template>
                </el-table-column>

            </el-table>
        </el-card>
        <el-dialog
            title="提示"
            :visible.sync="isShowEditDialog"
            width="30%" @close="closeAssignRightsDialog">
            <!-- 需要注意的是：props。这个属性设置显示label，和那个元素实现嵌套-->
            <!-- node-key=“” 设置选中的值           -->
            <!-- 如果是等于true的话可以简写   -->
            <!-- 最新的权限需要赋值给新的数组-->
            <el-tree show-checkbox :data="rightsList" node-key="id" :props="defaultProps"
                     default-expand-all :default-checked-keys="default_check_node" ref="rightsTreeRef"></el-tree>
            <span slot="footer" class="dialog-footer">
                     <el-button @click="isShowEditDialog = false">取 消</el-button>
                     <el-button type="primary" @click="assignRightsDlgSubmit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "Role",
        data() {
            return {
                rolesList: [],
                isShowEditDialog: false,
                rightsList: [],
                defaultProps: {
                    children: 'children',
                    label: 'authName'
                },
                default_check_node:[],
                role: {},
            }
        },
        methods: {
            async getRolesList() {
                const {data: res} = await this.$http.get('roles');
                if (res.meta.status !== 200) {
                    return this.$message.error('获取用户权限失败');
                }
                this.rolesList = res.data;
            },
            async removeRights(role, rightId) {
                const result = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => err);
                if (result === 'confirm') {
                    const {data: res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`);
                    if (res.meta.status !== 200) {
                        return this.$message.success('删除权限失败')
                    }
                    // 注意这里的role赋值。很牛逼。巧妙极了
                    // 这里返回的的是该角色最新的权限
                    role.children = res.data;
                    this.$message.success('删除权限成功');

                }


            },
            async deleteRole(roleId) {
                const result = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => err);
                if (result === 'confirm') {
                    const {data: res} = await this.$http.delete('roles/' + roleId);
                    if (res.meta.status === 200) {
                        this.getRolesList();
                        return this.$message.success('删除角色成功')
                    }
                    this.$message.error('删除角色失败');

                }
            },
            async showEditDialog(role) {
                this.role = role;
                this.getThreeRights(role,this.default_check_node);
                const {data: res} = await this.$http.get('rights/tree');
                if (res.meta.status !== 200) {
                    return this.$message.error('请求权限列表失败');
                }
                this.rightsList = res.data;
                console.log(this.rightsList);
                this.isShowEditDialog = true;
            },
            getThreeRights(node,arr){
                if(!node.children){
                    arr.push(node.id);
                    return arr;
                }
                node.children.forEach(item => {
                    this.getThreeRights(item,arr);
                })
            },
            closeAssignRightsDialog(){
                // 如果设置数组为空，自己不是很熟练。自己错误的写成""
                this.default_check_node = [];
                this.role = {};
            },
            async assignRightsDlgSubmit(){
                const halfKeys = this.$refs.rightsTreeRef.getHalfCheckedKeys();
                const allKeys = this.$refs.rightsTreeRef.getCheckedKeys();
                const rights = [...halfKeys,...allKeys].join(',');
                const {data:res} = await this.$http.post(`roles/${this.role.id}/rights`,{
                    rids:rights
                });
                this.isShowEditDialog = false;
                if(res.meta.status !== 200){
                   return  this.$message.error('权限赋值失败');
                }
                this.$message.success('权限赋值成功');
                this.getRolesList();

            //    有时候错误。需要多检查几次
            },

        },
        created() {
            this.getRolesList();
        }
    }
</script>

<style scoped lang="scss">
    .el-tag {
        margin: 8px;
    }

    .addborderBottom {
        border-bottom: 1px solid #eee;
    }

    .addborderTop {
        border-top: 1px solid #eee;
    }

    .vertticalMiddle {
        display: flex;
        align-items: center;
    }

    .el-row {
        margin-bottom: 8px;
    }
</style>
