<script>
import {
  ElForm,
  ElField,
  ElQueryTable,
  ElButton
} from '../../../element-ui/index.js'
import axios from 'axios'
// import testForm from './testForm'

import Tablelist from './Tablelist'

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
        name: '哈哈',
        sex: 1,
        // times: []
        // likes: [],
        // age1: '2',
        // age: '3'
        startTime: '2020-07-01',
        endTime: '2020-07-03',
      },
      nameRule: ['required', 'whiteSpace'],
      sexy: [],
      tableRef: null,
      formValues1: {
        // nick: 'nick',
        // nick3: 'nick3',
        arr: []
      },
      visible: true
    }
  },
  mounted() {
    this.formValues.name = '666'
    // setTimeout(() => {
    //   this.formValues.name = '张三'
    //   this.formValues.age = '12'
    //   this.sexy = [
    //     { label: '男', value: 1 }
    //   ]
    // }, 2000)
    axios.get('https://yapi.weierai.com/mock/171/api/sardine/riskControl/getShortMessage').then(res => {
      console.log(99)
      const { data } = res.data
      this.formValues1.nick3 = data.acceptDayNum
      this.formValues1.nick2 = data.acceptSmsNum
    })
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
    },
    onSortChange () {
      this.$refs.searchBtn.onClick()
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
          return (
            <div>
              <el-button onClick={() => {
                console.log(`你点击了第${$index}项, name：${row.name}`)
              }}>删除</el-button>
              <el-button onClick={() => {
                this.$refs.searchBtn.onSearch({ toFirstPage: false })
              }}>刷新当前页</el-button>
            </div>
          )
        }
      },
    ]

    const serve = async ({ params, formValues }) => {
      console.log(formValues)
      const params1 = {
        page: params.currentPage,
        pageSize: params.pageSize,
        ...formValues,
      }
      const res = await serveList(params1)
      return {
        data: res.list,
        total: res.total
      }
    }

    return (
      <div class="eeeee">
        {
          this.visible && (
            <div>
          <p>element-ui 示例</p>
          <ElForm v-model={this.formValues} size="medium" colon labelWidth="120px" inline ref="form" formStatus="edit">
            <pre>{JSON.stringify(this.formValues, null, 2)}</pre>
          <ElField name="name" component="el-input" onChange={this.onName} >
              <span slot="label">
                slot label
              </span>
              <span slot="append">元</span>
            </ElField>
            <ElField name="a.e.age" label="年龄"  component="el-input" previewValue={value => <div>{`${value}岁了`}</div>} />
            <ElField name="age1" label="年龄1" component="el-input" />
            <ElField name="sex" label="性别" component="el-select" dataSource={
              this.sexy
              // new Map([
              //   [1, '男'],
              //   [2, '女']
              // ])
              // [1, 3]
              // {
              //   1: '男',
              //   2: '女'
              // }
            } ></ElField>

            <ElField name="startTime,endTime" component="el-date-picker" type="daterange"/>
      
            <ElButton type="primary" do="search" ref="searchBtn">查询一下</ElButton>
            <ElButton do="reset" />
            <ElButton do="debug" />
            <div>
              <div>
                <div></div>
                <div></div>
                <ElQueryTable
                  border
                  serve={serve}
                  columns={columns}
                  pagination={{
                  }}
                  onRowClick={() => {
                    console.log('onRowClick table')
                  }}
                  wrappedTableRef={(e) => {
                    console.log('wrappedTableRef', e)
                    this.tableRef = e
                  }}
                  onSortChange={this.onSortChange}
                >
                </ElQueryTable>
                <div></div>
              </div>
            </div>
            <div>
              <div>
                <div>
                  <div>
                    <div></div>
                    <div></div>
                  </div>
                </div>
                <div></div>
                <div></div>
              </div>
            </div>
            <div>
              <div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>

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

        </div>
          )
        }

        <Tablelist />

        <div>
          <ElForm v-model={this.formValues1} labelWidth="200px" >
            <ElField name="nick" label="姓名" component="el-input" rules={['required', 'email']} key="nick" />
            {
              this.formValues1.nick === '22' && (
                <ElField name="nick2" label="姓名2" component="el-input" rules={['required', 'email']} key="nick2"/>
              )
            }
            <ElField name="nick3" label="姓名3" component="el-input" rules={['required', 'email']} key="nick3"/>
            <ElField name="nick4" label="姓名4" component="el-input" rules={['required', 'email']} />

            {
              (this.formValues1.arr || []).map((item, i) => ((
                <div>
                  <ElField name={`arr.${i}.euyyy`} label={`arr.${i}.euyyy`} component="el-input" />
                  <el-button onClick={() =>{
                    this.formValues1.arr.splice(i, 1)
                  }}>删除{i}</el-button>
                </div>
              )))
            }
            <el-button onClick={() => {
              this.formValues1.arr.push({
                euyyy: ''
              })
            }}>添加</el-button>
            <ElButton do="debug" disabled={this.formValues1.nick === '11'} />
            <pre>{JSON.stringify(this.formValues1, null, 2)}</pre>
          </ElForm>
        </div>
      </div>
    )
  },
}
</script>