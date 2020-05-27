<template>
<div id="app">
  <NativeForm v-if="isShow" />
  <ElementForm v-if="!isShow" />
</div>
</template>
<script>
import NativeForm from './examples/nativeForm'
import ElementForm from './examples/element-ui'

export default {
  components: {
    NativeForm,
    ElementForm,
  },
  data () {
    return {
      isShow: false,
    }
  },
  computed: {},
  mounted () {},
  methods: {},
}
</script>
<style>
</style>