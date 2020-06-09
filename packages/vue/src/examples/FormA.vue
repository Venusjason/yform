<script>
import Form from '../../YForm/form.vue'
import Field from '../../YForm/field.vue'


export default {
  data() {
    return {
      values: {age: 18}
    }
  },
  mounted() {
    const data = {
      name: '接口尽快尽快看',
      likes: '1, 2',
      age: 19
    }
    // // this.values = data
    // Object.assign(this.values, data)
    setTimeout(() => {
      Object.assign(this.values, data)
    }, 3000);
  },
  render() {
    return (
      <div>
        <p>新版</p>
        <Form v-model={this.values}>
          <Field name="name" label="名称" component="el-input"></Field>
          <Field name="age" label="年龄" component="el-input-number"></Field>
          <Field name="likes" label="爱好" component="el-input"></Field>
        </Form>
      </div>
    )
  },
}
</script>