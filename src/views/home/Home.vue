<template>

    <el-container class="home-container">
        <!--   头部区域   -->
        <el-header>
            <div class="header-left">
                <img src="~assets/imgs/home/icon.png" alt="">
                <span>电商后台管理系统</span>
            </div>
            <!--      这里为什么没有外裹div-->
            <div>
                <el-button type="info" @click="logout">退出</el-button>
            </div>

        </el-header>
        <el-container>
            <el-aside :width="isCollapse ? '64px':'200px'">
                <div class="toggle_menu" @click="toggle_collapse">|||</div>
                <el-menu
                        background-color="#333744"
                        text-color="#fff"
                        active-text-color="#409eff"
                        unique-opened :collapse="isCollapse"
                        :collapse-transition="false"
                        :router="true"
                        :default-active="activePath">
                   <!-- 取消折叠动画-->
                    <!--  每次只展开一个-->
                    <!--  上面是激活文本颜色-->

                    <!--   注意这里设置key的方式。-->
                    <!--   index 相同那么点击菜单才会展开-->
                    <!--  index值只接受字符串。那么把item.id转换下        -->
                    <el-submenu :index=" '/' + item.path" v-for="item in menus" :key="item.id">
                        <!-- 一级菜单 -->
                        <!--  这个template管菜单文本和图标。  -->
                        <template slot="title">
                            <i :class="menusIcons[item.id]"></i>
                            <span>{{item.authName}}</span>
                        </template>
                        <!-- 子项和父亲的属性在同级  -->
                        <el-menu-item :index="'/' + itemy.path" v-for="itemy in item.children" :key="itemy.id" @click="menuStateSave('/'+itemy.path)">
                            <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>{{itemy.authName}}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <el-container>
                <el-main>
                    <keep-alive><router-view/></keep-alive>
                </el-main>
            </el-container>
        </el-container>
    </el-container>

</template>

<script>
    export default {
        created() {
            this.getMenus();
            this.activePath = window.sessionStorage.getItem("activePath");
        },
        name: "Home",
        data() {
            return {
                menus: [],
                menusIcons: {
                  '125': 'iconfont icon-user',
                  '103': 'iconfont icon-tijikongjian',
                  '101': 'iconfont icon-shangpin',
                  '102': 'iconfont icon-danju',
                  '145': 'iconfont icon-baobiao',
                },
                isCollapse:false,
                activePath: '/users',
            };
        },
        methods: {
            logout() {
                //通过清除sessionStorage实现退出。
                window.sessionStorage.clear();
                this.$router.push("/login");
            },
            async getMenus() {
                const {data: res} = await this.$http.get("menus");
                if (res.meta.status !== 200) return this.$message.error("获取菜单错误");
                this.menus = res.data;
            },
          toggle_collapse(){
              this.isCollapse = !this.isCollapse;
          },
          menuStateSave(path){
              window.sessionStorage.setItem("activePath",path);
              this.activePath = path;
         }

        },
        components: {}
    };
</script>

<style scoped lang="scss">
    /*在el中,组件默认的类型就是 el-名字 */
    .el-header {
        display: flex;
        justify-content: space-between;
        /*下面这个适合单行的子元素对其方式*/
        align-items: center;
        /*align-content适合多行*/
        background-color: #373d41;
        padding-left: 0;

        .header-left {
            display: flex;
            align-items: center;

            span {
                display: inline-block;
                margin-left: 10px;
                font-size: 20px;
                color: #ffffff;
                line-height: 100%;
            }
        }

    }
    .iconfont{
      margin-right: 10px;
    }

    .el-aside {
        background-color: #333744;
      .toggle_menu{
        background-color: #4a5064;
        text-align: center;
        font-size: 10px;
        /*有高度或者有内容。Line-height会撑高盒子*/
        line-height: 24px;
        /*设置字体间距*/
        letter-spacing: 0.2em;
      }
      .el-menu{
        /*去掉对不起的bug*/
        border-right: none;
      /*  如果设置边框为0.最好设置none。不是设置0*/
      }
    }

    .el-main {
        background-color: #eaedf1;
    }

    .home-container {
        height: 100%;
    }
</style>
