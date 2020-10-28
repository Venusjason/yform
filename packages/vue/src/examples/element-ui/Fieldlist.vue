<template>
  <div>
     <!-- 支持两种写法 -->
    <YForm v-model="values" labelPosition="top" @submit="onSubmit">
      <YField name="name" label="名称444" component="el-input" required></YField>
      <p>第一种写法：标签式写法</p>
      <YFieldList name="list1" label="员工列表1" :rules="{ validator: this.validateLength, trigger: '' }" yList>
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
      <p>第二种写法：yList属性写法</p>
      <YField name="list2" label="员工列表2" yList required>
        <template v-slot="{ value, action }" >
          <el-button @click="action.add({name: '', age:''})" >Add</el-button>
          <div v-for="(item, i) in value" :key="i">
            <YField :name="`list.${i}.name`" label="姓名" inline component="el-input" required/>
            <YField :name="`list.${i}.age`" label="年龄" inline component="el-input"/>
            <el-button @click="action.delete(i)">Delete</el-button>
            <el-button icon="el-icon-top" round :disabled="i === 0" @click="action.up(i)"></el-button>
            <el-button icon="el-icon-bottom" round :disabled="(i+1) === value.length" @click="action.down(i)"></el-button>
          </div>
        </template>
      </YField>
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
        list1: [
            { name: '', age: '' },
            { name: '', age: '' },
            { name: '', age: '' }
        ],
        list2: [
            { name: '', age: '' },
            { name: '', age: '' },
            { name: '', age: '' }
        ],
        
      },
    }
  },
  mounted() {
  },
  methods:{
    validateLength: (rule, val, callback) => {
      if (val.length < 3) {
        return callback(new Error(`长度不能小于3`))
      }
      if (val.length > 5) {
        return callback(new Error(`长度不能大于5`))
      }
      callback()
    },
    onSubmit (form) {
      console.log(form)
    },
  }
}
</script>
