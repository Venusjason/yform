### YForm

* YForm api 设计类似element-ui form, 但是比常见ui库的form功能特性要多

#### 基本使用
::: demo
```vue
<template>
  <YForm
    v-model="formData"
    labelWidth="120px"
    :labelPosition="labelPosition"
    :inline="inline"
    :colon="colon"
    :size="size"
    :hideRequiredAsterisk="hideRequiredAsterisk"
    :formStatus="formStatus"
    :validateOnRuleChange="validateOnRuleChange"
    @submit="onSubmit"
    @validate="onValidate"
  >
    <YField name="isRequired" label="花名是否必须" component="el-switch" />
    <!-- 可继承 element-ui 组件属性 -->
    <YField name="nickName" label="花名" :required="formData.isRequired" clearable />
    <YField name="empNum" label="工号" rules="limit10words" clearable />
    <YField name="regText" label="自定义校验" :rules="regRules" clearable />
    <YField
      name="sendTimeStart,sendTimeEnd"
      label="发送时间"
      component="el-date-picker"
      class="mgr20"
      type="daterange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
    />
    <YButton do="submit" />
  </YForm>
</template>
<script>
export default {
  data() {
    return {
      formData: {
        nickName: '昵称abc'
      },
      inline: false,
      labelPosition: 'left',
      colon: '：',
      size: 'small',
      hideRequiredAsterisk: false,
      formStatus: 'edit',
      validateOnRuleChange: false,
      formValidate: true,
      regRules: {
        validator (rule, value, cb) {
          if (value && value.length > 3) {
            cb(new Error('限制3个字内'))
          } else {
            cb()
          }
        }
      }
    }
  },
  methods: {
    // 表单提交
    onSubmit (form) {
      console.log(form)
    },
    // 表单校验
    onValidate (valid) {
      this.formValidate = valid
    }
  }
}
</script>
```
:::

#### Attributes
::: demo
```vue
<template>
  <YForm v-model="formData">
    <YTable :data="propsData.yformProps" border>
      <template>
        <el-table-column prop="prop" label="参数"></el-table-column>
        <el-table-column prop="desc" label="说明"></el-table-column>
        <el-table-column prop="type" label="类型"></el-table-column>
        <el-table-column prop="options" label="可选值"></el-table-column>
        <el-table-column prop="default" label="默认值"></el-table-column>
      </template>
    </YTable>
  </YForm>
</template>
<script>
export default {
  data() {
    return {
      formData: {}
    }
  }
}
</script>
```
:::
