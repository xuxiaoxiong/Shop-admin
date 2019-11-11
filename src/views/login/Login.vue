<template>
  <div class="login-container">
    <div class="login-box">
      <img src="../../assets/logo.png" alt />

      <el-form ref="form" label-width="0px" class="form-box" v-model="loginForm" :rules="loginRules">
        <el-form-item prop="username">
          <el-input prefix-icon="iconfont icon-users" v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input prefix-icon="iconfont icon-3702mima" v-model="loginForm.password" show-password></el-input>
        </el-form-item>
        <el-form-item class="btn-box">
          <el-button type="primary">登录</el-button>
          <el-button type="info">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        username: "",
        password: ""
      },
    loginRules: {
        username: [
          { required: true, message: "请输入登录名称", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 5 个字符", trigger: "blur"}
        ],
      }
    };
  },
  methods: {},
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
