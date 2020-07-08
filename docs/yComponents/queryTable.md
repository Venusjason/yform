### QueryTable

queryTable 是中后台领域常见 分页列表查询组件，api设计非常简洁

```
// 保留查询条件 刷新列表 并更新到第一页,使用以下两种之一
this.$refs.searchBtn.onSearch()
this.$refs.searchBtn.onClick()

// 查询更新当前页
this.$refs.searchBtn.onSearch({ toFirstPage: false })

// 重置查询条件 并更新列表
this.$refs.resetBtn.onClick()
```

