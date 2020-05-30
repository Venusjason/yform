<script>
import {
  ElForm,
  ElField,
  ElQueryTable,
  ElButton
} from '../../../element-ui/index.js'

console.log(ElForm)

const serveList = (params) => {
  console.log('查询参数', params)
  return new Promise(function(resolve) {
    const delay = Math.ceil(Math.random() * 1000)
    setTimeout(() => {
      const list = []
      for (let i = 0; i < 10; i++) {
        const id = Math.ceil(Math.random() * 100)
        const status = Math.ceil(Math.random() * 2)
        const price = Math.ceil(Math.random() * 999)
        list.push({
          id,
          name: `我是编号${id}`,
          status,
          price,
        })
      }
      resolve({
        total: 92,
        list
      })
    }, delay)
  })
}

export default {
  data() {
    return {
      formValues: {
        name: ''
      },
      nameRule: ['required', 'whiteSpace']
    }
  },
  mounted() {
    // setTimeout(() => {
    //   this.formValues.name = '张三'
    //   this.formValues.age = '12'
    // }, 2000);
    setTimeout(() => {
      this.formValues.name = '张三'
      this.nameRule.push('url')
    }, 2000)
  },
  methods: {
    onName() {
      console.log(this.formValues.name)
      if (this.formValues.name === '22') {
        this.formValues.age = 9
      }
    },
    async validate() {
      await this.$refs.form.validate()
    }
  },
  render() {

    // const list = []
    // for(let i = 0; i < 10; i++) {
    //   list.push({
    //     name: `名称${i}`,
    //     id: i,
    //   })
    // }

    const columns = [
      { type: 'selection' },
      {
        type: 'y-index'
      },
      {
        renderHeader: () => {
          return <div style="color: red">我是自定义表头</div>
        },
        prop: 'name',
      },
      { label: '名称', prop: 'name', sortable: true },
      { label: 'id', prop: 'id' },
      {
        label: '操作',
        render: ({ row, $index }) => {
          return (<el-button onClick={() => {
            console.log(`你点击了第${$index}项, name：${row.name}`)
          }}>删除</el-button>)
        }
      },
    ]

    const serve = async ({ params }) => {
      const params1 = {
        page: params.currentPage,
        pageSize: params.pageSize,
        activityCode: '11111111',
        ...this.params
      }
      const res = await serveList(params1)
      return {
        data: res.list,
        total: res.total
      }
    }

    return (
      <div class="eeeee">
        <p>element-ui 示例</p>
        <ElForm value={this.formValues} onInput={v => this.formValues = v} size="medium" colon labelWidth="120px" inline ref="form" formStatus="edit">
        <ElField name="name" component="el-input" onChange={this.onName} rules={this.nameRule} >
            <span slot="label">
              slot label
            </span>
            <span slot="append">元</span>
          </ElField>
          <ElField name="age" label="年龄"  component="el-input" previewValue={value => <div>{`${value}岁了`}</div>} rules={['required']} />
          <ElButton type="primary" do="search">查询一下</ElButton>
          <ElButton do="debug" />
        </ElForm>

        {
          /**
           * <Table
                border
                data={list}
                columns={columns}
                onSelect={() => {
                  console.log('onSelect')
                }}
                onRowClick={() => {
                  console.log('onRowClick')
                }}
                onSortChange={() => {
                  console.log('onSortChange')
                }}
              /> 
           */
        }

        <ElQueryTable
          border
          columns={columns}
          serve={serve}
          pagination={{
          }}
          onRowClick={() => {
            console.log('onRowClick table')
          }}
        />

      </div>
    )
  },
}
</script>