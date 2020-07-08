<script>
import Form from '../../YForm/Form.vue'
import Field from '../../YForm/field.vue'


export default {
  data() {
    return {
      values: {},
      inputRef: null
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
        <pre>{JSON.stringify(this.values, null, 2)}</pre>
        <Form v-model={this.values} labelPosition="top">
          <Field name="name" label="名称444" component="el-input" rules={[
            { required: true, message: 'requiredrequired' },
            { email: true, message: 'emailemail', trigger: 'blur' }
          ]} wrappedComponentRef={e => {
            console.log(e)
            this.inputRef = e
          }}></Field>
          <Field name="age" label="年龄" component="el-input" rules={['required', 'whiteSpace']}></Field>
          <Field name="likes" label="爱好" component="el-select" required></Field>

          <Field name="s" component="el-switch" />

          {
            this.values.s ? (
              <Field name="a1" label="a1"  component="el-input" />
            ) : (
              <Field name="a2" label="a2"  component="el-input" />
            )
          }

          <Field name="b1" label="b1"  component="el-input" yVisible={this.values.s} />
          <Field name="b2" label="b2"  component="el-input" yVisible={!this.values.s} />
          <button onClick={() => {
            console.log(this.inputRef)
          }}>清除校验</button>

        </Form>
      </div>
    )
  },
}
</script>