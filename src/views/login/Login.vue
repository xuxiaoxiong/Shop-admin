<template>
  <div class="login-container">
    <div class="login-box">
     <img src="../../assets/logo.png" alt />
     
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {};
  },
  methods: {},
  components: {}
};
</script>

<style scoped lang="scss">
.login-container {
  height: 100%;
  background-color: pink;
  .login-box {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 450px;
    height: 450px;
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
  }
}
</style>
