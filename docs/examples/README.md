#### 普通表单

::: demo
```vue
<template>
  <YForm v-model="formValues" label-width="140px" colon scrollToFirstError>
    <YField name="name" label="商品名称" :rules="['required', 'whiteSpace']" />
    <YField name="priceA" label="供货价" :rules="['required', 'positiveInteger']" />
    <YField name="priceB" label="售卖价" component="el-input-number" rules="required" />
    <YField name="addr" label="产地" rules="required" />
    <YField name="sku" label="sku" rules="required" />
    <YField name="startTime,EndTime" label="售卖时间" component="el-date-picker" type="daterange" :rules="['required', 'requiredArray']" />
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

#### 列表式表单

* 使用yform 可以非常便捷实现 table 内的校验
* 请注意 `name` 字段的绑定

::: demo
```vue
<template>
  <YForm v-model="formValues" @submit="submitForm" scrollToFirstError>
    <p>班级学生登记表</p>
    <YButton type="primary" @click="addItem">添加学生</YButton>
    <el-table :data="formValues.list" style="margin: 20px 0">
      <el-table-column label="姓名">
        <template slot-scope="scope" >
          <YField :name="`list.${scope.$index}.name`" placeholder="请输入姓名" rules="required" />
        </template>
      </el-table-column>

      <el-table-column label="年龄">
        <template slot-scope="scope" >
          <YField :name="`list.${scope.$index}.age`" placeholder="请输入年龄" :rules="['required', 'positiveInteger']" />
        </template>
      </el-table-column>

      <el-table-column label="性别">
        <template slot-scope="scope" >
          <YField :name="`list.${scope.$index}.sex`" placeholder="请选择性别" component="el-select" :dataSource="SEXS" rules="required" />
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope" >
          <el-link type="danger" @click="delItem(scope)">删除</el-link>
        </template>
      </el-table-column>
    </el-table>
    <div >
      <YButton do="cancel" />
      <YButton />
      <YButton do="debug" />
    </div>
  </YForm>
</template>
<script>

const SEXS = new Map([
  [0, '女'],
  [1, '男']
])

export default {
  data() {
    return {
      SEXS,
      formValues: {
        list: [
          { name: '', age: '', sex: '' }
        ]
      }
    }
  },
  methods: {
    delItem({ $index }) {
      console.log($index)
      this.formValues.list.splice($index, 1)
    },
    addItem() {
      this.formValues.list.push({
        name: '', age: '', sex: ''
      })
    },
    submitForm(formValues) {
      console.log(formValues)
    }
  },
}
</script>

```
:::

#### 自定义表单组件

* 当第三方ui库的表单组件不满足于需求时，我们通常自实现一个fieldComponent，yfield.component 不能使用vue注册的component，可以直接放到data里绑定
* 自定义表单只需要实现v-model即可接入yfield

```vue
<template>
  <YForm v-model="formValues" label-width="140px" colon>
    <YField name="name" :component="myInput" label="商品名称" :rules="['required', 'whiteSpace']" />
  </YForm>
</template>
<script>
import myInput from 'myInput.vue'

export default {
  data() {
    return {
      myInput,
      formValues: {}
    }
  }
}
</script>
```