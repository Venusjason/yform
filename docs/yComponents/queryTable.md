
### 完整示例

* 列表column 使用作用域插槽 自定义
* 单项更新 查询列表并保留当前页
* 删除操作 查询列表并更新到第一页
* 点击查询 table的sort状态等 重置
* 点击重置 table的sort状态等 重置 & 表单值恢复初始化

::: demo
```vue
<template>
  <YForm v-model="formValues" inline colon>
    <YField name="name" label="商品名称" />
    <YField name="platform" label="平台" component="el-select" :dataSource="PLATFORMS"/>
    <YField name="status" label="状态" component="el-select" :dataSource="STATUS"/>
    <YButton do="search" :afterClick="resetTable" />
    <YButton do="reset" :afterClick="resetTable" />
    <YButton do="debug" />
    <YQueryTable
      ref="YQueryTable"
      :serve="serve"
      :wrappedTableRef="setTableRef"
    >
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
    </YQueryTable>
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

queryTable 是中后台领域常见 分页列表查询组件，api设计非常简洁

| 参数                             | 说明                                             | 类型                                           | 可选值                                             | 默认值                              |
| -----------------------         |:-------------:                                  |   -----:                                      | -----:                                             | -----:                              |
|serve         | 列表数据获取方法                     | Promise                                     | -                                                 | -                                  |
| columns | table-column 的jsx形式             | Array                                         | -                                              |  []                                            | 
|filterParamInvalidValue | 自动过滤serve中无效入参 | Boolean | - | true |
|pagination |  控制分页， 使用ui库的分页api | Object | - | |
|paginationPosition | pagination 组件对齐方式 | String | `right`, `left`, `center` | `right` |
|showLoading | 展示loading | Boolean | - | true|
|wrappedTableRef | 如果你需要使用ui库的table内置方法，可以用这个方法获取ref  | Function(ref) => void | -| -|

#### option.serve

 serve 是一个Promise， 所以开发者可以灵活处理入参与出参格式，该方法会传入 params(分页参数)、formValues(查询表单字段值), 返回 total、list

```js
const serve = async ({ params, formValues }) => {
  const res = await request({ ...params, ...formValues })
  return {
    total: res.total,
    list: res.list,
  }
}
```

#### columns
 以element-ui 的table为例
```js
[
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
