<template>
  <div>
    <p>新版</p>
    <YForm v-model="values" labelPosition="top" @submit="onSubmit">
      <YField name="name" label="名称444" component="el-input" required></YField>
      <YFieldList name="list" label="员工列表">
        <template v-slot="{ value, action }" >
          <el-button @click="action.add({name: '', age:''})" >Add</el-button>
          <div v-for="(item, i) in value" :key="i">
            <YField :name="`list.${i}.name`" label="姓名" inline component="el-input" required/>
            <YField :name="`list.${i}.age`" label="年龄" inline component="el-input"/>
            <el-button :disabled='value.length == 1' @click="action.delete(i)">Delete</el-button>
            <el-button icon="el-icon-top" round :disabled="i === 0" @click="action.up(i)"></el-button>
            <el-button icon="el-icon-bottom" round :disabled="(i+1) === value.length" @click="action.down(i)"></el-button>
          </div>
        </template>
      </YFieldList>
      <YButton do="submit">submit</YButton>
    </YForm>
  </div>
</template>

<script>
import {
  ElForm as YForm,
  ElField as YField,
  ElFieldList as YFieldList,
  ElButton as YButton
} from '../../../element-ui/index.js'

export default {
  components: {YForm, YField, YButton, YFieldList},
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
