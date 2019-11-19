<template>
    <div class="addGoods">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品添加</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <el-alert
                title="添加商品信息"
                type="info" show-icon center :closable="false">
            </el-alert>
            <el-steps :space="4000" :active="tabIndex * 1" finish-status="success" align-center>
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>
            <!--            主要注意form表单的位置，el-tabs子节点只能是tab-pane。所以只能form放外面-->
            <el-form ref="addGoodsFormRef" :model="addGoodsForm" label-width="80px" label-position="top"
                     :rules="addGoodsRules">
                <!--                为什么这样也可以绑定事件-->
                <el-tabs tabPosition="left" v-model="tabIndex" :before-leave="beforeTabLeave" @tab-click="tabClicked">
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="addGoodsForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input v-model="addGoodsForm.goods_price" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input v-model="addGoodsForm.goods_number" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model="addGoodsForm.goods_weight" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类" prop="goods_cat">
                            <el-cascader
                                v-model="addGoodsForm.goods_cat"
                                :options="categoryList"
                                :props="selectProp" clearable @change="selectCategoryChange"></el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name="1">
                        <el-form-item :label="item.attr_name" v-for="(item,index) in manyAttriList" :key="index">
                            <el-checkbox :label="itemy" border size="medium" v-for="itemy in item.attr_vals"
                                         checked></el-checkbox>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">
                        <el-form-item :label="item.attr_name" v-for="item in onlyAttriList" :key="item.attr_id">
                            <el-input :value="item.attr_vals[0]"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">
                        <!--  注意这里的上传方式。用的是饿了么公司自己的ajax  -->
                        <el-upload
                            class="upload-demo"
                            action="http://127.0.0.1:8888/api/private/v1/upload"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            list-type="picture"
                            :headers="setMineHeader" :on-success="uploadSuccess">
                            <el-button size="small" type="primary">点击上传</el-button>
                            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                        </el-upload>

                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">
                        <quill-editor ref="myQuillEditor" style="height: 400px;" v-model="addGoodsForm.goods_introduce">
                        </quill-editor>
                        <el-button type="primary" class="addGoods" @click="addGoodsSubmit">添加商品</el-button>
                    </el-tab-pane>

                </el-tabs>
            </el-form>
        </el-card>
        <!--注意放的位置。-->
        <el-dialog
            title="提示"
            :visible.sync="isShowImgPreviewdlg"
            width="40%"
            @close="closePreviewdlg">
            <img :src="filePath" width="100%"/>
        </el-dialog>
    </div>
</template>

<script>
    import _ from "lodash"
    export default {
        name: "Add",
        data() {
            return {
                tabIndex: '0',
                addGoodsForm: {
                    goods_name: '测试数据',
                    goods_price: 10,
                    goods_weight: 10,
                    goods_number: 10,
                    goods_cat: [],
                    pics: [],
                    goods_introduce: '',
                },
                addGoodsRules: {
                    goods_name: [
                        {required: true, message: '请输入商品名称', trigger: 'blur'},
                        {min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'}
                    ],
                    goods_price: [
                        {required: true, message: '请输入商品价格', trigger: 'blur'},
                        {min: 1, max: 20, message: '价格在1~10000', trigger: 'blur'}
                    ],
                    goods_number: [
                        {required: true, message: '请输入商品数量', trigger: 'blur'},
                        {min: 1, max: 20, message: '价格在1~10000', trigger: 'blur'}
                    ],
                    goods_weight: [
                        {required: true, message: '请输入商品重量', trigger: 'blur'},
                        {min: 1, max: 20, message: '价格在1~100kg', trigger: 'blur'}
                    ],
                    goods_cat: [
                        {required: true, message: '请选择商品分类', trigger: 'blur'},
                    ],
                },
                categoryList: [],
                selectProp: {
                    value: 'cat_id',
                    label: 'cat_name',
                    children: 'children',
                    expandTrigger: 'hover'
                },
                manyAttriList: [],
                onlyAttriList: [],
                setMineHeader: {
                    Authorization: window.sessionStorage.getItem("token")
                },
                filePath: "",
                isShowImgPreviewdlg: false,

            }
        },
        methods: {
            async getCategoryList() {
                const {data: res} = await this.$http.get('categories')
                if (res.meta.status !== 200) {
                    return this.$message.error('获取列表错误');
                }
                this.categoryList = res.data;
            },
            selectCategoryChange() {
                if (this.addGoodsForm.goods_cat.length !== 3) {
                    this.addGoodsForm.goods_cat = []
                    return this.$message.error('只允许选择三级分类')
                }
            },
            beforeTabLeave(newTabName, oldTabName) {
                if (oldTabName === '0' && this.addGoodsForm.goods_cat.length !== 3) {
                    this.$message.error('请选择商品分类')
                    return false
                }
                return true
            },
            async tabClicked() {
                if (this.tabIndex === '1') {
                    const {data: res} = await this.$http.get(`categories/${this.addGoodsForm.goods_cat[2]}/attributes`, {
                        params: {
                            sel: 'many'
                        }
                    });
                    if (res.meta.status !== 200) {
                        return this.$message.error('获取参数列表失败');
                    }
                    res.data.forEach(item => {
                        if (item.attr_vals.length === 0) {
                            item.attr_vals = []
                        } else {
                            item.attr_vals = item.attr_vals.split(',')
                        }

                    })
                    this.manyAttriList = res.data;

                } else if (this.tabIndex === '2') {
                    const {data: res} = await this.$http.get(`categories/${this.addGoodsForm.goods_cat[2]}/attributes`, {
                        params: {
                            sel: 'only'
                        }
                    });
                    if (res.meta.status !== 200) {
                        return this.$message.error('获取参数列表失败');
                    }
                    res.data.forEach(item => {
                        if (item.attr_vals.length === 0) {
                            item.attr_vals = []
                        } else {
                            item.attr_vals = item.attr_vals.split(',')
                        }

                    })
                    this.onlyAttriList = res.data;
                }
            },
            uploadSuccess(response) {
                // 这里不用做逻辑判断，因为饿了么公司已经判断过了
                const picItem = {pic: response.data.tmp_path}
                console.log(picItem)
                this.addGoodsForm.pics.push(picItem)
                console.log(this.addGoodsForm.pics)
            },
            handlePreview(file) {
                this.filePath = file.response.data.url;
                this.isShowImgPreviewdlg = true
            },
            handleRemove(file) {
                const path = file.response.data.tmp_path;
                let picindex = 0
                console.log(path);
                //  查找下标志新方法
                // const index = this.addGoodsForm.pics.findIndex(item => {
                //     console.log(item)
                //     item.pic === path;
                // });
                this.addGoodsForm.pics.forEach((item, index) => {
                    if (item.pic === path) {
                        picindex = index;
                    }
                })
                this.addGoodsForm.pics.splice(picindex, 1);
            },
            closePreviewdlg() {
                this.filePath = ""
            },
            addGoodsSubmit() {
                this.$refs.addGoodsFormRef.validate(async (valid) => {
                    if(!valid){
                        return this.$message.error('您填写的数据有误，请检查数据后再添加商品')
                    }
                   // 注意这里。这样写会有问题。最好用对象的拷贝
                   // this.addGoodsForm.goods_cat =  this.addGoodsForm.goods_cat.join(',')
                    const form = _.cloneDeep(this.addGoodsForm)
                    form.goods_cat =  form.goods_cat.join(',')
                    const {data:res} =await this.$http.post('goods',form)
                    console.log(res)
                    if(res.meta.status !== 201){
                       return this.$message.error('添加商品失败');
                    }
                    this.$message.success('添加商品成功')
                    this.$router.push('/goods')
                })
            },

        },
        created() {
            this.getCategoryList()
        },
    }
</script>

<style scoped lang="scss">

    /*    注意这里的写法。还有用途*/
    .el-step__title {
        font-size: 12px;
    }

    .el-steps {
        margin: 0 15px;
    }

    .el-checkbox {
        margin: 0 10px 10px 0 !important;
    }

    .addGoods {
        margin-top: 50px;
    }
</style>
