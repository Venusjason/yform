<script>
import Form from '../../YForm/Form.vue'
import Field from '../../YForm/field.vue'


export default {
  data() {
    return {
      values: {}
    }
  },
  mounted() {
    // const data = {
    //   name: '接口尽快尽快看',
    //   likes: '1, 2',
    //   age: 19
    // }
    // // // this.values = data
    // // Object.assign(this.values, data)
    // setTimeout(() => {
    //   Object.assign(this.values, data)
    // }, 3000);
  },
  render() {
    return (
      <div>
        <p>新版</p>
        <Form v-model={this.values} labelPosition="top">
          <Field name="name" label="名称444" component="el-input" rules={[
            { required: true, message: 'requiredrequired' },
            { email: true, message: 'emailemail', trigger: 'blur' }
          ]} ></Field>
          <Field name="age" label="年龄" component="el-input" rules={['required', 'whiteSpace']}></Field>
          <Field name="likes" label="爱好" component="el-select" required></Field>
        </Form>
      </div>
    )
  },
}
</script>