<template>
  <div id="app">
    <Form v-model="formValues" ref="form" >
      <div>YForm vue版本</div>
      <Field name="name" label="名称" component="input" y-native required />
      <Field name="age" label="年龄" component="input" y-native :rules="rules.age" />
      <Field name="age" component="input" y-native placeholder="请输入年龄" required />
      <button @click="submit">提交</button>
    </Form>
    <pre>{{JSON.stringify(this.formValues, null, 4)}}</pre>
  </div>
</template>

<script>
import { Form, Field } from './YForm'

export default {
  name: 'App',
  components: {
    Form,
    Field,
  },
  data() {
    return {
      formValues: {
        name: null
      },
      rules: {
        age: [
          {
            validator: (rule, val, callback) => {
              if (/^(([1-9]\d?)|100)$/.test(val)) {
                return callback()
              } else {
                return callback(new Error('输入有误'))
              }
            }
          }
        ]
      }
    }
  },
  mounted() {
    setTimeout(() => {
      this.formValues.name = '张三'
      // Object.assign(this.formValues, {
      //   age: 'nn'
      // })
    }, 1000)
  },
  methods: {
    onFormInput(value) {
      console.log(value)
      // this.formValues = value
      this.$set(this, 'formValues', value)
    },
    async submit(e) {
      e.preventDefault()
      const { formInstance } = this.$refs.form.$options
      console.log(formInstance)
      try {
        const res = await formInstance.validate()
        console.log(res)
      } catch (e) {
        console.log(e)
      }
    }
  },
}
</script>

<style>
</style>
