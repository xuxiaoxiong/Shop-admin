###  lodash使用
```
在这个项目中用到了lodash工具包。具体在reports模块中。用工具包来合并两个对象
```

### nprogress的使用
```
给自己的网站添加水平加载条。思路是一旦发起ajax请求，就使用nprogress。在request,和reponse添加相关代码。
需要注意的是：使用它，必须同时导入它的js和css
```
### 怎么轻松去掉log信息
```
使用babel-plugin-transform-remove-console移除log。
使用命令：npm install babel-plugin-transform-remove-console --save-dev
然后在相关的地方配置

```
