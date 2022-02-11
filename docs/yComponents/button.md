### Button

#### 基本使用

::: demo
```vue
<template>
  <YForm v-model="formData" inline>
    <!-- 可继承 element-ui 组件属性 -->
    <YField name="nickName" label="花名" clearable />
    <!-- 按钮类 -->
    <!-- 查询列表, 需结合 YQueryTable serve 使用 -->
    <YButton do="search" ref="searchBtn" />
    <!-- 表单提交, 需结合 YForm @submit 使用 -->
    <YButton do="submit" ref="submitBtn" :beforeClick="beforeClick" :afterClick="afterClick" />
    <!-- 重置表单内容, 需结合 YForm 使用 -->
    <YButton do="reset" ref="resetBtn" />
    <!-- 取消按钮 仅样式 无实际内置功能 -->
    <YButton do="cancel" ref="cancelBtn" />
    <!-- 打印当前表单绑定值 -->
    <YButton do="debug" ref="debugBtn" />
    <YQueryTable :serve="serve" border>
      <template>
        <el-table-column prop="name" label="标题"></el-table-column>
        <el-table-column prop="price" label="价格"></el-table-column>
      </template>
    </YQueryTable>
  </YForm>
</template>
<script>
export default {
  data() {
    return {
      formData: {}
    }
  },
  methods: {
    // 请求列表接口
    async serve ({ params, formValues }) {
      const res = await Promise.resolve({
        total: 10,
        data: [{ name: '苹果', price: 20 }, { name: '大西瓜', price: 99.9 }]
      })
      console.log('run serve')
      return {
        total: res.total,
        data: res.data
      }
    },
    beforeClick () {
      console.log('beforeClick')
    },
    afterClick () {
      console.log('afterClick')
    }
  }
}
</script>
```
:::
