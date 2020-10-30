### Field

```
Vue.use(YField, options)
```

#### 基本使用

::: demo
```vue
<template>
  <YForm class="w500" v-model="formData" labelWidth="120px">
    <!-- 可继承 element-ui 组件属性 例: clearable -->
    <YField name="nickName" label="昵称" :fieldStatus="formData.fieldStatus" clearable />
    <!-- 选项可通过 dataSource 传入 value label/key -->
    <YField name="option" label="选项" component="el-select" :dataSource="options" :fieldStatus="formData.fieldStatus">
      <template slot="preview" slot-scope="x">
        <div>preview slot模式渲染 option 字段值： {{x}}</div>
      </template>
    </YField>
    <!-- 切换预览状态 -->
    <YField name="fieldStatus" label="预览区状态" component="el-radio-group">
      <el-radio-button label="edit"></el-radio-button>
      <el-radio-button label="preview"></el-radio-button>
      <el-radio-button label="disabled"></el-radio-button>
    </YField>
  </YForm>
</template>
<script>
export default {
  data() {
    return {
      formData: {
        nickName: 'lions',
        fieldStatus: 'edit'
      },
      options: [
        { label: '全部', value: null },
        { label: '选项1', value: 'option1' }
      ]
    }
  }
}
</script>
```
:::

#### component为el-select时 选项传入方式

* dataSource 接收格式 object[]

```vue
<!-- 选项可通过 dataSource 传入 value label/key -->
<YField name="option" label="选项" component="el-select" :dataSource="options" />

<script>
export const options = [
  {
    label: '选项1',
    value: 'option1'
  }
]
</script>
```

* dataSource 接收格式 new Map

```vue
<!-- 选项可通过 dataSource 传入 new Map -->
<YField name="option" label="选项" component="el-select" :dataSource="options" />

<script>
export const options = new Map([
  [0, '选项1'],
  [1, '选项2']
])
</script>
```

* dataSource 接收格式 object{ key: value }

```vue
<!-- 选项可通过 dataSource 传入 object{ key: value } -->
<YField name="option" label="选项" component="el-select" :dataSource="options" />

<script>
/* value 可为其他格式 string object array boolean 等 */
export const options = { 'option1': '选项1' }
</script>
```

* slot 传入选项

```vue
<!-- 选项可通过 slot 插槽传入选项 -->
<YField name="option" label="选项" component="el-select">
  <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
</YField>

<script>
export const options = [
  {
    label: '选项1',
    value: 'option1'
  }
]
</script>
```

#### component为自定义组件时, 必须是可通过 `v-model` 绑定

```vue
<!-- 自定义组件 一定要有绑定值 -->
<YField name="customCom" label="自定义组件" :component="customComponent" />
```

#### 自定义预览内容

::: demo
```vue
<template>
  <YForm class="w500" v-model="formData" labelWidth="120px">
    <!-- 切换预览状态 -->
    <YField name="fieldStatus" label="预览区状态" component="el-radio-group">
      <el-radio-button label="edit"></el-radio-button>
      <el-radio-button label="preview"></el-radio-button>
      <el-radio-button label="disabled"></el-radio-button>
    </YField>
    <!-- previewValue -->
    <YField name="preDIY" label="预览自定义" :fieldStatus="formData.fieldStatus" :previewValue="previewValue" />
  </YForm>
</template>
<script>
export default {
  data() {
    return {
      formData: {
        preDIY: 'preDIY',
        fieldStatus: 'preview'
      }
    }
  },
  methods: {
    previewValue () {
      return <el-card header="自定义预览内容">
        <span>当前状态: {this.formData.fieldStatus}</span><br />
        <span>当前绑定值: {this.formData.preDIY}</span><br />
        <span>自定义预览内容区域ABC</span>
      </el-card>
    }
  }
}
</script>
```
:::

#### yVisible / v-if + key(有bug，暂未修复，请使用 v-if + key)

* `yVisible`暂时不可用, 请使用 `v-if + key`
* `yVisible`与`v-if`都可以控制组件渲染，然而`v-if`却做不到`field`字段卸载，要达到这个效果 需要`v-if + key` 组合，`yVisible = v-if + key`

::: demo
```vue
<template>
  <YForm v-model="formValues" colon label-width="120px">
    <YField name="type" component="el-radio-group" label="交通方式" :dataSource="TYPES" />
    <YField
      v-if="this.formValues.type === 1"
      key="calories"
      name="calories"
      label="消耗卡路里"
    />
    <YField
      v-if="this.formValues.type === 2"
      key="costFee"
      name="costFee"
      label="乘车费用"
    >
      <span slot="append">元</span>
    </YField>
  </YForm>
</template>
<script>
const TYPES = new Map([
  [1, '步行'],
  [2, '乘车']
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
:::



### yList 列表式表单
::: demo
```vue
<template>
  <div>
    <YForm v-model="values" labelPosition="top" @submit="onSubmit">
      <YField name="name" label="名称444" component="el-input" required></YField>
      <YField name="list" label="员工列表" required yList>
        <template v-slot="{ value, action }" >
          <el-button @click="action.add({name: '', age:''})" >Add</el-button>
          <div v-for="(item, i) in value" :key="i">
            <YField :name="`list.${i}.name`" label="姓名" inline component="el-input" required/>
            <YField :name="`list.${i}.age`" label="年龄" inline component="el-input"/>
            <el-button @click="action.delete(i)">Delete</el-button>
            <el-button icon="el-icon-top" round :disabled="i === 0" @click="action.up(i)"></el-button>
            <el-button icon="el-icon-bottom" round :disabled="(i+1) === value.length" @click="action.down(i)"></el-button>
          </div>
        </template>
      </YField>
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



#### Field.options (全局注册options)
::: demo
```vue
<template>
  <YForm v-model="formData">
    <YTable :data="propsData.yfieldOptions" border>
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

#### Attributes
::: demo
```vue
<template>
  <YForm v-model="formData">
    <YTable :data="propsData.yfieldProps" border>
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
