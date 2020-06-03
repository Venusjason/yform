<script>
import {
  ElForm,
  ElField,
  ElButton
} from '../../../element-ui/index.js'

export default {
  data() {
    return {
      formValues: {
        name: '好机会',
        addr: 'addr',
        work: 'work',
        sex: 'sex',
        age: 'age'
      }
    }
  },
  render() {
    return (
      <ElForm v-model={this.formValues}>
        <ElField name="name" label="名称" component="el-input" rules={['money']}/>
        <ElField name="addr" label="地址" component="el-input"/>
        <ElField name="work" label="工作" component="el-input" required/>
        <ElField name="sex" label="性别" component="el-input"/>
        <ElField name="age" label="年龄" component="el-input"/>
        <ElButton do="submit" />
      </ElForm>
    )
  },
}
</script>