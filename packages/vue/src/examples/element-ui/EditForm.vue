<script>
import {
  ElForm,
  ElField,
  ElButton
} from '../../../element-ui/index.js'
// import axios from 'axios'

export default {
  data() {
    return {
      values: {
        ageold: 18
      }
    }
  },
  mounted() {
    // this.values.ageold = 15
    this.values = {
      ageold: 13
    }
  },
  methods: {
    onSubmit(values) {
      console.log(values)
    }
  },
  render () {
    const LIKES = new Map([
      [1, '听音乐'],
      [2, '打球'],
      [3, '跑步'],
      [4, '做饭'],
    ])

   return (
     <div>
      <ElForm v-model={this.values} labelWidth="100px" onSubmit={this.onSubmit}>
        <ElField name="names" label="名称" component="el-input" />
        <ElField name="ageold" label="年龄" component="el-input-number" rules={['required', 'integer']} />
        <ElField name="likes" label="爱好" component="el-select" dataSource={LIKES} />
        <ElField name="isOpen" component="el-switch" label="开启动态增加项" />
        {
          this.values.isOpen && (this.values.todos || [ { content: '', time: '' } ]).map((ele, i) => (
            <div>
              <el-row>
                <el-col span={10}>
                  <ElField name={`todos.${i}.time`} label="时间" component="el-input" required />
                </el-col>
                <el-col span={10}>
                  <ElField name={`todos.${i}.content`} label="事项" component="el-input" required />
                </el-col>
                <el-col span={2}>
                  <el-link onClick={() => {
                    this.values.todos.splice(i, 1)
                  }} >删除</el-link>
                </el-col>
              </el-row>
            </div>
          ))
        }
        {
          this.values.isOpen && (
            <el-button type="primary" onClick={() => {
              this.values.todos.push({
                content: '', time: ''
              })
            }}>添加待办</el-button>
          )
        }
        <ElButton></ElButton>
      </ElForm>
      <pre>{JSON.stringify(this.values, null, 2)}</pre>
     </div>
   ) 
  }
}
</script>
