<template>
  <div>
    <p>新版</p>
    <ElForm v-model="values" labelPosition="top" @submit="onSubmit">
      <ElField name="name" label="名称444" component="el-input" required></ElField>
      <ElFieldList name="list" label="员工列表">
        <template v-slot="{ value, action }" >
          <ElButton @click="action.add({name: '', age:''})" >Add</ElButton>
          <div v-for="(item, i) in value" :key="i">
            <ElField :name="`list.${i}.name`" label="姓名" inline component="el-input" required/>
            <ElField :name="`list.${i}.age`" label="年龄" inline component="el-input"/>
            <ElButton @click="action.delete(i)">Delete</ElButton>
          </div>
        </template>
      </ElFieldList>
      <ElButton do="submit">submit</ElButton>
    </ElForm>
  </div>
</template>

<script>
import {
  ElForm,
  ElField,
  ElFieldList,
  ElButton
} from '../../../element-ui/index.js'
// import ElForm from '../../../YForm/Form.vue'
// import ElField from '../../../YForm/field.vue'
// import { FieldList as ElFieldList } from '../../../YForm/field.vue'
// import ElButton from '../../../YForm/Button.js'



export default {
  components: {ElForm, ElField, ElButton, ElFieldList},
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
