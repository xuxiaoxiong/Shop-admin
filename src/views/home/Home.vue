<template>
  <el-button type="info" @click="logout">退出</el-button>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {};
  },
  methods: {
    logout(){
      //通过清除sessionStorage实现退出。
      window.sessionStorage.clear();
      this.$router.push("/login");
    }
  },
  components: {}
};
</script>

<style scoped lang="scss">
</style>
