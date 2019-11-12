<template>
    <div class="login-container">
        <div class="login-box">
            <img src="../../assets/logo.png" alt/>

            <!--一定要用:model,不然表单验证会有问题  -->
            <el-form ref="loginFormRef" label-width="0px" class="form-box" :model="loginForm" :rules="loginRules">
                <el-form-item prop="username">
                    <el-input prefix-icon="iconfont icon-users" v-model="loginForm.username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input prefix-icon="iconfont icon-3702mima" v-model="loginForm.password"
                              show-password></el-input>
                </el-form-item>
                <el-form-item class="btn-box">
                    <el-button type="primary" @click="loginFormSubmit">登录</el-button>
                    <!-- 需要注意这里触发事件竟然不加.native.是不是所有的插件触发方法都不需要加。 -->
                    <el-button type="info" @click="resetLoginForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    import {log} from 'util';

    export default {
        name: "Login",
        data() {
            return {
                loginForm: {
                    // 设置默认值。这样方便调试
                    username: "admin",
                    password: "123456"
                },
                loginRules: {
                    username: [
                        {required: true, message: '请输入用户名', trigger: 'blur'},
                        {min: 3, max: 10, message: '长度在 3 到 5 个字符', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入用户密码', trigger: 'blur'},
                        {min: 5, max: 20, message: '长度在 3 到 5 个字符', trigger: 'blur'}
                    ],
                }
            };
        },
        methods: {
            resetLoginForm() {
                this.$refs.loginFormRef.resetFields();
            },
            loginFormSubmit() {
                // 这个进行表单的验证。
                //  并且这里用到了es6中的异步请求的方法
                this.$refs.loginFormRef.validate(async valid => {
                    if (!valid) return;
                    //注意login前面没有、
                    // await 可以把promise对象转换成对象
                    // 运用对象的解构，并且起别名
                    let {data: res} = await this.$http.post('login', this.loginForm);
                    if (res.meta.status !== 200) return this.$message.error("登录失败")
                    this.$message.success("登录成功");
                    window.sessionStorage.setItem("token", res.data.token);
                    this.$router.push("/home");
                    console.log(res)

                    //  1：成功登录后。把token.保存到客户端的sessionStorge中。
                    //:1.1： 只有登录后的用户才能访问其他接口。
                    // 1.2：  token保存在sessionStorge中。只在本地回话中有效
                    //  2：然后跳转到/home主页
                });
            },
        },
        components: {}
    };
</script>

<style scoped lang="scss">
    .login-container {
        height: 100%;
        background-color: #202340;

        .login-box {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 450px;
            height: 300px;
            background: #ffffff;
            border-radius: 5px;

            img {
                position: absolute;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 130px;
                height: 130px;
                background: #eeeeee;
                border: 10px solid #ffffff;
                box-shadow: 0 0 10px #ddd;
                border-radius: 50%;
                z-index: 5;
            }

            .form-box {
                position: absolute;
                bottom: 0;
                width: 100%;
                padding: 0 20px;
                // 注意这里。不加这里超出。修改盒模型
                box-sizing: border-box;

                .btn-box {
                    display: flex;
                    // 这个属性需要重点掌握
                    justify-content: flex-end;
                }
            }
        }
    }
</style>
