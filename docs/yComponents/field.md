### Field

```
Vue.use(YField, options)
```

#### Field.options (全局注册options)

| 参数        | 	说明        | 类型   | 可选值 | 默认值 |
| ------------- |:-------------:|   -----:| -----:|-----:|
|name         | 标签名称      | String |       | YField |
|defaultComponent | component 默认值    | String| vNode |       | 'input' |
|componentProps | 默认配置component-props  | Object|Fuction(fieldContext) => Object |       | {} |
|name         | 标签名称      | String |       | YField |

#### Field api

| 参数        | 	说明        | 类型   | 可选值 | 默认值 |
| ------------- |:-------------:|   -----:| -----:|-----:|
|name  (required)       | 	字段      | String |       |   |
|label |     | |  |       |  |
|component |   | String/VNode |  |       |  |
|rules         | 同 elment-ui form   |  |       |  |
|fieldStatus         |字段状态，优先级高于Form.formStatus   |String  |    edit/preview/disabled  |edit  |
|previewValue         | 自定义预览ui  | Function(value): vNode | String |       | value |
|colon         | 优先级高于Form.colon   |  |       |  |
|componentProps         |component props   | Object |       |  {}|
|componentStyle         |component 组件样式   | Object |       |  {}|
|componentClass         | component 组件class名  |String/Array  |  | |
wrappedComponentRef |回调函数，返回component组件实例 | Function(value: vNode): void | |  |
|yVisible         | 同v-if，使用该属性可以省去key设置  |  |       |  |
|其他属于 component的自身属性         |    |  |       |  |



##### yVisible

* `yVisible`与`y-if`都可以控制组件渲染，然而`y-if`却做不到`field`字段卸载，要达到这个效果 需要`y-if + key` 组合，`yVisible = y-if + key`

<!-- ::: demo
```vue
<template>
  <YForm v-model="formValues" colon label-width="120px">
    <YField name="type" component="el-radio-group" label="交通方式" :dataSource="TYPES" />
    <YField
      name="calories"
      label="消耗卡路里"
      :yVisible="this.formValues.type === 1"
    />
    <YField
      name="costFee"
      label="乘车费用"
      :yVisible="this.formValues.type === 2"
    >
      <span slot="append">元</span>
    </YField>
  </YForm>
</template>
<script>
const TYPES = new Map([
  [1, '步行'],
  [2, '乘车'],
])

export default {
  data() {
    return {
      formValues: {
        type: 2
      },
      TYPES,
    }
  },
}
</script>
```

::: -->

