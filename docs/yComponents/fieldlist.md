### FieldList

- FieldList 组件时 列表式表单的标签时写法，相当于属性 yList 为 true 的 Field 组件
- 除了没有component相关的属性外，其他的属性基本同于field组件。

```
Vue.use(YFieldList, options)
```

#### 基本使用

::: demo
```vue
<template>
  <div>
    <YForm v-model="values" labelPosition="top" @submit="onSubmit">
      <YField name="name" label="名称444" component="el-input" required></YField>
      <YFieldList name="list" label="员工列表" :rules="{ min: 3, max: 5, message: '长度在 3 到 5' }">
        <template v-slot="{ value, action }" >
          <el-button @click="action.add({name: '', age:''})" >Add</el-button>
          <div v-for="(item, i) in value" :key="i">
            <YField :name="`list.${i}.name`" label="姓名" inline component="el-input" required/>
            <YField :name="`list.${i}.age`" label="年龄" inline component="el-input"/>
            <el-button :disabled='value.length == 1' @click="action.delete(i)">Delete</el-button>
            <el-button icon="el-icon-top" round :disabled="i === 0" @click="action.up(i)"></el-button>
            <el-button icon="el-icon-bottom" round :disabled="(i+1) === value.length" @click="action.down(i)"></el-button>
          </div>
        </template>
      </YFieldList> 
      <YButton do="submit"></YButton>
    </YForm>
  </div>
</template>

<script>

export default {
  data() {
    return {
      values: {
        name: '',
        list: [
            { name: '', age: '' },
            { name: '', age: '' },
            { name: '', age: '' }
        ],
      },
    }
  },
  methods:{
    onSubmit (form) {
      console.log(form)
    },
  }
}
</script>
```
:::
