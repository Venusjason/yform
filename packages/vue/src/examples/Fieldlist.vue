<template>
  <div>
    <p>新版</p>
    <Form v-model="values" labelPosition="top" @submit="onSubmit">
      <Field name="name" label="名称444" component="el-input" required></Field>
      <Field name="list" label="员工列表" y-list>
        <template v-slot="{ value, action }" >
          <Button @click="action.add({name: '', age:''})" >Add</Button>
          <div v-for="(item, i) in value" :key="i">
            <Field :name="`list.${i}.name`" label="姓名" inline component="el-input" />
            <Field :name="`list.${i}.age`" label="年龄" inline component="el-input"/>
            <Button @click="action.delete(i)">Delete</Button>
          </div>
        </template>
      </Field>
      <YButton component="el-button" type="submit">submit</YButton>
    </Form>
  </div>
</template>
<script>
import Form from '../../YForm/Form.vue'
import Field from '../../YForm/field.vue'
import YButton from '../../YForm/Button.js'



export default {
  components: {Form, Field, YButton},
  data() {
    return {
      values: {
        name: '',
        list: [
            { name: '', age: '' },
            { name: '', age: '' },
            { name: '', age: '' }
        ],
      },
      inputRef: null
    }
  },
  mounted() {
  },
  methods:{
    onSubmit (form) {
      console.log(form)
    },
  }
}
</script>