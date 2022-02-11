* 自定义列表使用场景在 非table组件渲染
* `createQueryTable` 接受一个 `Table` 和 `PaginationComponent`
* 其他使用和 `YQueryTable` 一致, 实际上 `YQueryTable` 就是基于`createQueryTable` 函数来实现的

```js
import {
  createQueryTable
} from '@yform/vue/lib/YForm/index.umd'
import api31850 from '@/api171/api31850'

const Table = {
  props: ['data'],
  render () {
    return (
      <div>
        {
          this.data.map(ele => (<div>strategyName: {ele.strategyName}</div>))
        }
      </div>
    )
  }
}

const QueryTable = createQueryTable({
  Table,
  PaginationComponent: 'el-pagination'
})


export default {
  data () {
    return {
      formValues: {}
    }
  },
  render () {
    const serve = async () => {
      const res = await api31850()
      return {
        total: 100,
        data: res.data.results
      }
    }

    return (
      <div>
        <YForm v-model={this.formValues} inline >
          <YField name="name" label="昵称" />
          <YButton do="search" />
          <div style="display: flex">
            <div style="flex: 0 0 200px; background: pink">
              <QueryTable
                serve={serve}
                paginationPosition="center"
                pagination={{
                  layout: 'prev, pager, next'
                }}
              />
            </div>
            <div style="flex: 1; background: yellow" >
              我是详情
            </div>
          </div>
        </YForm>
      </div>
    )
  }
}


```