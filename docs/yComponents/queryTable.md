### QueryTable

#### 完整示例1

* 列表column 使用作用域插槽 自定义
* 单项更新 查询列表并保留当前页
* 删除操作 查询列表并更新到第一页
* 点击查询 table的sort状态等 重置
* 点击重置 table的sort状态等 重置 & 表单值恢复初始化
* 支持表单栅格化布局 自动展开收起 ([layout](/yComponents/layout/))

::: demo
```vue
<template>
  <YForm v-model="formValues" colon label-width="100px" @fieldsInput="formEvents" @keyup.enter="formEvents" >
    <YLayout>
      <YCol>
        <YField name="name" label="商品名称" @keyup.enter="keypress" />
      </YCol>
      <YCol :layouts="{xs: {span: 9}, sm: { span: 18 }}">
        <YField name="platform" label="平台" component="el-select" :dataSource="PLATFORMS" />
      </YCol>
      <YCol>
        <YField name="status" label="状态" component="el-select" :dataSource="STATUS"/>
      </YCol>
      <YCol collapse :span="12">
        <YButton do="search" :afterClick="resetTable" />
        <YButton do="reset" :afterClick="resetTable" />
        <YButton do="debug" />
      </YCol>
    </YLayout>
    <el-card>
    <YQueryTable
      ref="YQueryTable"
      :serve="serve"
      :wrappedTableRef="setTableRef"
    >
      <template>
        <el-table-column prop="name" label="商品图片" show-overflow-tooltip>
          <div slot-scope="scope">
            <img :src="scope.row.imgUrl" style="width: 40px;height: 40px" />
          </div>
        </el-table-column>
        <el-table-column prop="name" label="商品名称" show-overflow-tooltip width="200px"></el-table-column>
        <el-table-column prop="price" label="价格" sortable></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            {{ STATUS.get(scope.row.status) }}
          </template>
        </el-table-column>
        <el-table-column label="平台">
          <template slot-scope="scope">
            {{ PLATFORMS.get(scope.row.platform) }}
          </template>
        </el-table-column>
        <el-table-column  prop="stock" label="库存"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-link type="primary" @click="editItem(scope)">编辑</el-link>
            <el-link type="danger" @click="delItem(scope)">删除</el-link>
          </template>
        </el-table-column>
      </template>
    </YQueryTable>
    </el-card>
  </YForm>
</template>
<script>
const PLATFORMS = new Map([
  [1, '淘宝'],
  [2, '京东'],
  [3, '拼多多'],
  [4, '快手'],
])

const STATUS = new Map([
  [0, '已下架'],
  [1, '售卖中'],
  [2, '超卖']
])

export default {
  tableRef: null,
  data() {
    return {
      formValues: {},
      PLATFORMS,
      STATUS,
    }
  },
  methods: {
    async serve({ params, formValues }) {
      const url = 'https://yapi.weierai.com/mock/360/goods/list'
      const res = await this.$axios.get(url, {
        params: {
          ...params,
          ...formValues,
        }
      })
      const { list, total } = res.data.data
      console.log(list)
      return {
        data: list,
        total,
      }
    },
    setTableRef(ref) {
      this.$options.tableRef = ref
    },
    editItem({ row, $index }) {
      console.log(`点击了第${$index}项`, row)
      this.$message.success(`点击了第${$index}项, 2s后更新列表(保留当前页码查询)`)
      setTimeout(() => {
        this.$refs.YQueryTable.runServe()
      }, 2000)
    },
    delItem({ row, $index }) {
      console.log(`点击了第${$index}项`, row)
      this.$message.success(`点击了第${$index}项, 2s后更新列表(从第一页查询)`)
      setTimeout(() => {
        this.$refs.YQueryTable.runServe({ currentPage: 1 })
      }, 2000)
    },
    resetTable() {
      this.$options.tableRef.clearSort()
    },
    formEvents(e, value) {
      console.log(e, value)
    },
    keypress(e) {
      console.log('keypress2222', e)
    }
  }
}
</script>
<style>
.good-detail {
  display: flex;
  align-items: center;
}
.good-detail .name {
  /* flex: 1 */
}
</style>
```
:::

#### 完整示例2

::: demo
```vue
<template>
  <YForm v-model="formData"inline labelWidth="50px" labelPosition="left">
    <YField name="empNum" label="工号" clearable />
    <YButton do="search" :beforeClick="beforeClick" :afterClick="resetTable" />
    <YButton type="pain" @click="clearSelection">清空选择</YButton>
    <YButton type="pain" @click="clearSort">清空排序</YButton>
    <YButton type="pain" @click="openLoading">显示/关闭loading</YButton>
    <div class="mgb20"></div>
    <!-- 表格 -->
    <YQueryTable ref="yquerytableRef" border
      :serve="serve"
      :columns="columns"
      :wrappedTableRef="setTableRef"
      :filterParamInvalidValue="filterParamInvalidValue"
      :pagination="{ layout: paginationList.join(',') }"
      :paginationPosition="paginationPosition"
      :showLoading="showLoading"
    >
    </YQueryTable>
  </YForm>
</template>
<script>
export default {
  data() {
    return {
      formData: {},
      filterParamInvalidValue: true,
      paginationList: ['total', 'sizes', 'prev', 'pager', 'next', 'jumper'],
      paginationPosition: 'right',
      showLoading: true,
    }
  },
  computed: {
    columns() {
      return [
        { type: 'selection' },
        { prop: 'name', label: '标题' },
        { prop: 'price', label: '价格', sortable: true, type: 'y-money' },
        {
          align: 'center', label: '操作',
          render: (scope) => {
            return (
              <div>
                <YButton type="primary">编辑</YButton>
                <YButton type="danger">删除</YButton>
              </div>
            )
          }
        },
      ]
    },
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
    // 编辑操作
    editRow (row, index) {
      this.$message.success('编辑成功')
      // 不涉及页数变化 可以继续在当前页更新
      this.$refs.yquerytableRef.runServe()
    },
    // 删除操作
    deleteRow(row, index) {
      this.$message.success('删除成功')
      // 涉及页数变化 重置页数为第一条查询
      this.$refs.yquerytableRef.runServe({ currentPage: 1 })
    },
    // 获取table ref属性
    setTableRef (ref) {
      this.$options.tableRef = ref
    },
    // 查询后的操作
    resetTable () {
      console.log('after-click')
    },
    // 查询前的操作
    beforeClick () {
      console.log('before-click')
    },
    // 清空选择
    clearSelection () {
      this.$options.tableRef.clearSelection()
    },
    // 清空排序
    clearSort () {
      this.$options.tableRef.clearSort()
    },
    // 查看tableRef
    lookTableRef () {
      console.log(this.$options.tableRef)
    },
    // 打开loading蒙层
    openLoading () {
      this.$refs.yquerytableRef.loading = !this.$refs.yquerytableRef.loading
    }
  }
}
</script>
```
:::

#### option.serve

 serve 是一个Promise， 所以开发者可以灵活处理入参与出参格式，该方法会传入 params(分页参数)、formValues(查询表单字段值), 返回 total、data

```js
const serve = async ({ params, formValues }) => {
  /* params -> { currentPage, pageSize } */
  /* formValues -> 表单绑定值 */
  const res = await request({ ...params, ...formValues })
  return {
    total: res.total,
    data: res.data,
  }
}
```

#### columns

 以element-ui 的table为例

```vue
<YForm v-model="formData">
  <YQueryTable :serve="serve" :columns="columns" border></YQueryTable>
</YForm>

<script>
/* 列的属性 */
columns () {
  return [
    { prop: 'name', label: '标题', width: '100px' }
    { prop: 'price', label: '价格', sortable: true },
    {
      label: '操作',
      // 需要使用作用域插槽时，对应的jsx写法
      render: ({ row, $index }) => (
        <div>
          <el-button type="primary" onClick={() => { console.log(row, $index) }} >编辑</el-button>
          <el-button type="danger" >删除</el-button>
        </div>
      )
    }
  ]
}
</script>
```

#### slot

如果你不熟悉jsx写法，也可以使用slot，slot与ui库提供的写法完全一致,两者选其一即可

```vue
<YQueryTable
  border
  ref="YQueryTable"
  :serve="serve"
>
  <el-table-column prop="name" label="标题"></el-table-column>
  <el-table-column prop="price" label="价格" sortable></el-table-column>
  <el-table-column label="操作">
    <template slot-scope="scope">
      <el-button type="primary" @click="handleClick(scope.row, scope.$index)">编辑</el-button>
      <el-button type="danger" >删除</el-button>
    </template>
  </el-table-column>
</YQueryTable>

```

::: tip
常见场景: 操作编辑、删除处理后，一般需要更新列表
:::

* 手动调用列表更新当前页
```js
this.$refs.YQueryTable.runServe()
```

* 手动调用列表更新到第一页

```js
this.$refs.YQueryTable.runServe({ currentPage: 1 })
```

::: tip
常见场景: 操作element-ui table的属性/方法 获取table 的 ref
:::

* 通过在 YQueryTable 中 wrappedTableRef 回调获取

```vue
<YQueryTable border :serve="serve" :wrappedTableRef="setTableRef"></YQueryTable>

<script>
// 获取table ref属性
setTableRef (ref) {
  this.$options.tableRef = ref
}
</script>
```


#### Attributes
::: demo
```vue
<template>
  <YForm v-model="formData">
    <YTable :data="propsData.yquerytableProps" border>
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


### FAQ

* Q : `YQueryTable` 组件被其他组件包裹（如`el-card`）能支持吗?

  A : 已经支持了，但是这个支持在 `0.1.35`之后的版本才实现，所以之前使用`el-card`包裹会报错
