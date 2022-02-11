# Hello @yform

### YForm 常用于筛选查询, 表单数据提交

::: demo
```vue
<template>
  <YForm
    class="w500"
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
    <YField name="nickName" label="花名" :required="formData.isRequired" />
    <YField name="empNum" label="全局校验" rules="limit10words" />
    <YField name="regText" label="自定义校验" :rules="regRules" />
    <YField
      name="sendTimeStart,sendTimeEnd"
      label="发送时间"
      component="el-date-picker"
      type="daterange"
      componentClass="w100p"
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
      console.log(valid)
    }
  }
}
</script>
```
:::