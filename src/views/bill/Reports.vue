<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>数据统计</el-breadcrumb-item>
            <el-breadcrumb-item>数据报表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <div id="main" style="width: 600px;height:400px;"></div>
        </el-card>
    </div>
</template>

<script>
    import echarts from 'echarts'
    import _  from 'lodash'
    export default {
        name: "Reports",
        data() {
            return {
                options: {
                    title: {
                        text: '用户来源'
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: '#E9EEF3'
                            }
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: [
                        {
                            boundaryGap: false
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value'
                        }
                    ]
                }
            }
        },
        methods: {},
        created() {

        },
       async  mounted() {
            //  参照官网5分钟快速入门echarts做的
            var myChart = echarts.init(document.getElementById('main'));

            const {data:res} =await this.$http.get('reports/type/1');
            if(res.meta.status !== 200){
               return this.$message.error('请求失败');
            }
            // 如果不合并这两个对象。那么图标会没有鼠标跟随效果。
            const option =  _.merge(res.data,this.options)
            myChart.setOption(option)
        },git
    }
</script>

<style scoped lang="scss">

</style>
