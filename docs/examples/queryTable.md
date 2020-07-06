::: demo
```vue
<template>
  <YForm v-model="formValues" inline colon>
    <YField name="name" label="商品名称" />
    <YField name="likes" label="爱好" component="el-select" :dataSource="LIKES" />
    <YField name="startTime,EndTime" label="售卖时间" component="el-date-picker" type="daterange" />
    <YButton do="search" />
    <YButton do="reset" />
    <YButton do="debug" />

    <YQueryTable
      :columns="columns"
      :serve="serve"
    />
  </YForm>
</template>
<script>

const LIKES = new Map([
  [1, '🏸'],
  [2, '⚽️'],
  [3, '🏓'],
])

export default {
  data() {
    return {
      formValues: {},
      LIKES,
    }
  },
  computed: {
    columns() {
      return [
        { label: '名称', prop: 'name' },
        { label: '头像', prop: 'avatar' },
        { label: '上架时间', prop: 'name' },
        { label: '爱好', prop: 'likes', render: ({ row }) => LIKES.get(Number(row.likes)) },
        { label: '操作', prop: 'name' },
      ]
    }
  },
  methods: {
    async serve({ params, formValues }) {
      const res = await this.$axios.get('https://yapi.weierai.com/mock/360/goods/statistics/getGoodsList', {
        params: {
          ...params,
          ...formValues,
        }
      })
      console.log(res)
      const { list } = res.data.data
      console.log(list)
      return {
        data: list,
        total: 100,
      }
    }
  }
}
</script>
```
:::