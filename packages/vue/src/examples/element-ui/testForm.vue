<template>
  <div>
    <ElForm v-model="formValues1" labelWidth="200px" >
      <ElField name="nicks" label="姓名" component="el-input" :rules="['required', 'email']" key="nicks" fieldStatus="preview"/>
      <ElField name="nicks2" label="姓名2" component="el-input" :rules="['required', 'email']" key="nicks2"/>
      <ElField name="nicks3" label="姓名3" component="el-input" :rules="['required', 'email']" key="nicks3"/>
      <ElField name="nicks4" label="姓名4" component="el-input" :rules="['required', 'email']" />
      <ElButton do="debug" :disabled="dis" />
    </ElForm>
  </div>
</template>
<script>
import {
  ElForm,
  ElField,
  ElButton
} from '../../../element-ui/index.js'

export default {
  components: {
    ElForm,
    ElField,
    ElButton
  },
  data() {
    return {
      formValues1: {
        nicks: '2222'
      }
    }
  },
  computed: {
    dis () {
      return this.formValues1.nicks2 === '2'
    }
  },
}
</script>
