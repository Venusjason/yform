::: demo
```vue
<template>
  <YForm v-model="formValues" label-width="140px" colon>
    <YField name="name" label="商品名称" :rules="['required', 'whiteSpace']" />
    <YField name="priceA" label="供货价" :rules="['required', 'positiveInteger']" />
    <YField name="priceB" label="售卖价" component="el-input-number" rules="required" />
    <YField name="addr" label="产地" rules="required" />
    <YField name="sku" label="sku" rules="required" />
    <YField name="startTime,EndTime" label="售卖时间" component="el-date-picker" type="daterange" rules="required" />
    <div style="padding-left: 140px" >
      <YButton do="cancel" />
      <YButton />
      <YButton do="debug" />
    </div>
  </YForm>
</template>
<script>
export default {
  data() {
    return {
      formValues: {}
    }
  }
}
</script>
```
:::